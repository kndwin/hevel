import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ErrorComponent } from "@/shared/browser/ui/error-component";

import { DataTable } from "@/modules/jobs/data-table";
import { columns } from "@/modules/jobs/data-table/columns";
import { CardJobForm } from "@/modules/jobs/form";
import { useJobActions } from "@/modules/jobs/actions";
import { ScrollArea } from "@/shared/browser/ui/scroll-area";
import { Card } from "@/shared/browser/ui/card";

const searchSchema = z.object({
  mode: z.string().optional(),
});

export const Route = createFileRoute("/_home/jobs/")({
  component: () => <Jobs />,
  validateSearch: (search) => searchSchema.parse(search),
  errorComponent: (error) => <ErrorComponent error={error} />,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const res = await context.rpc.jobs.$get();
    const json = await res.json();
    const jobs = json.data;
    const selectedJob = jobs.find((job) => deps.search.mode?.includes(job.id));

    return { jobs, selectedJob };
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
            mode ? "pl-4 2xl:pl-0 p-4 lg:gap-6 lg:p-6 flex-1 w-full" : "hidden"
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
