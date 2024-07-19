import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ErrorComponent } from "@/shared/browser/ui/error-component";

import { DataTable } from "@/modules/jobs/data-table";
import { columns } from "@/modules/jobs/data-table/columns";
import { CardJobForm } from "@/modules/jobs/form";
import { useJobActions } from "@/modules/jobs/actions";
import { ScrollArea } from "@/shared/browser/ui/scroll-area";
import { Card } from "@/shared/browser/ui/card";
import { rpc } from "@/shared/browser/rpc/client";

const searchSchema = z.object({
  mode: z.string().optional(),
  pageNumber: z.number().catch(0),
  pageSize: z.number().catch(10),
});

export const Route = createFileRoute("/_home/jobs/")({
  component: () => <Jobs />,
  validateSearch: (search) => searchSchema.parse(search),
  errorComponent: (error) => <ErrorComponent error={error} />,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const pagedJobsRes = await rpc.jobs.$get({
      query: {
        pageNumber: deps.search.pageNumber.toString(),
        pageSize: deps.search.pageSize.toString(),
      },
    });
    const pagedJobs = await pagedJobsRes.json();

    if (
      deps.search.mode?.startsWith("view_") ||
      deps.search.mode?.startsWith("edit_")
    ) {
      const jobId = deps.search.mode?.slice(5) as string;
      const selectedJobRes = await rpc.jobs[":id"].$get({
        param: { id: jobId },
      });
      const selectedJob = (await selectedJobRes.json()).data;
      return { jobs: pagedJobs.data, selectedJob };
    }

    return { jobs: pagedJobs.data, selectedJob: null };
  },
});

function Jobs() {
  const { jobs, selectedJob } = Route.useLoaderData();
  const { mode } = Route.useSearch();
  const actions = useJobActions();

  return (
    <main className="flex flex-1 flex-col gap-4 ">
      <div className="flex flex-col-reverse 2xl:flex-row flex-1 items-start gap-4">
        <div className="p-4 lg:gap-6 lg:p-6 w-full flex-1">
          <DataTable data={jobs} columns={columns} actions={actions} />
        </div>

        <div
          key={mode}
          className={
            mode
              ? "pl-4 2xl:pl-0 p-4 lg:gap-6 lg:p-6 flex-1 w-full max-w-none 2xl:max-w-2xl"
              : "hidden"
          }
        >
          <Card>
            <ScrollArea
              viewportProps={{ style: { height: "calc(100vh - 110px)" } }}
            >
              <CardJobForm job={selectedJob} mode={mode} />
            </ScrollArea>
          </Card>
        </div>
      </div>
    </main>
  );
}
