import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ErrorComponent } from "@/shared/browser/ui/error-component";
import { DataTable } from "@/modules/applications/data-table";
import { columns } from "@/modules/applications/data-table/columns";
import { NewJobForm } from "@/modules/applications/form/new";
import { useApplicationActions } from "@/modules/applications/actions";
import { Route as ApplicationRoute } from "./_home.applications";

const searchSchema = z.object({
  mode: z.string().optional(),
});

export const Route = createFileRoute("/_home/applications/table")({
  component: () => <ApplicationsRoute />,
  validateSearch: (search) => searchSchema.parse(search),
  errorComponent: (error) => <ErrorComponent error={error} />,
  loaderDeps: ({ search }) => ({ search }),
});

function ApplicationsRoute() {
  const { applications } = ApplicationRoute.useLoaderData();
  const searchParams = Route.useSearch();
  const actions = useApplicationActions();

  return (
    <div className="flex flex-col-reverse 2xl:flex-row flex-1 items-start gap-4">
      <DataTable data={applications} columns={columns} actions={actions} />
      {searchParams.mode === "new-job" && <NewJobForm />}
    </div>
  );
}
