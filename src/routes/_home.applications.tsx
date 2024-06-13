import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { ErrorComponent } from "@/shared/browser/ui/error-component";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shared/browser/ui/navigation-menu";
import { KanbanIcon, TableIcon } from "lucide-react";

const searchSchema = z.object({
  mode: z.string().optional(),
});

export const Route = createFileRoute("/_home/applications")({
  component: () => <ApplicationsRoute />,
  validateSearch: (search) => searchSchema.parse(search),
  errorComponent: (error) => <ErrorComponent error={error} />,
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ context, deps }) => {
    const res = await context.rpc.applications.$get();
    const json = await res.json();
    const applications = json.data;
    const selectedApplication = applications.find(
      ({ id }) => id === deps.search.mode
    );

    return { applications, selectedApplication };
  },
});

function ApplicationsRoute() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link
              className={navigationMenuTriggerStyle({
                className: "gap-x-3 text-sm px-4 py-3",
              })}
              activeProps={{ className: "bg-muted" }}
              to="/applications/kanban"
            >
              <KanbanIcon className="w-4 h-4" />
              Kanban
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <Link
              className={navigationMenuTriggerStyle({
                className: "gap-x-3 text-sm px-4 py-3",
              })}
              activeProps={{ className: "bg-muted" }}
              to="/applications/table"
            >
              <TableIcon className="w-4 h-4" />
              Table
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      <Outlet />
    </main>
  );
}
