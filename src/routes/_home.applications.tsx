import { Outlet, createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  KanbanIcon,
  TableIcon,
  CalendarIcon,
  IterationCcw,
} from "lucide-react";
import { subMonths } from "date-fns";
import { format } from "date-fns";

import { ErrorComponent } from "@/shared/browser/ui/error-component";
import { Calendar } from "@/shared/browser/ui/calendar";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/shared/browser/ui/navigation-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/browser/ui/popover";
import { Button } from "@/shared/browser/ui/button";
import { rpc } from "@/shared/browser/rpc/client";
import { cn } from "@/shared/browser/ui/utils";
import { useNavigate } from "@tanstack/react-router";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/browser/ui/tooltip";
import { useState } from "react";
import { DateRange } from "react-day-picker";

const searchSchema = z.object({
  mode: z.string().optional(),
  dateRangeEnd: z.string().datetime().catch(new Date().toISOString()),
  dateRangeStart: z
    .string()
    .datetime()
    .catch(subMonths(new Date(), 2).toISOString()),
});

export const Route = createFileRoute("/_home/applications")({
  component: () => <ApplicationsRoute />,
  validateSearch: (search) => searchSchema.parse(search),
  errorComponent: (error) => <ErrorComponent error={error} />,
  loaderDeps: ({ search: { dateRangeEnd, dateRangeStart, mode } }) => ({
    dateRangeEnd,
    dateRangeStart,
    mode,
  }),
  loader: async ({ deps }) => {
    const res = await rpc.applications.$get({
      query: {
        dateRangeEnd: deps.dateRangeEnd,
        dateRangeStart: deps.dateRangeStart,
      },
    });
    const json = await res.json();
    const applications = json.data;
    const selectedApplication = applications.find(({ id }) => id === deps.mode);

    return { applications, selectedApplication };
  },
});

function ApplicationsRoute() {
  const navigate = useNavigate({ from: Route.fullPath });
  const searchParams = Route.useSearch();
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <header className="w-full flex justify-between items-center">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <Link
                search={{
                  dateRangeStart: searchParams.dateRangeStart,
                  dateRangeEnd: searchParams.dateRangeEnd,
                }}
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
                search={{
                  dateRangeStart: searchParams.dateRangeStart,
                  dateRangeEnd: searchParams.dateRangeEnd,
                }}
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
        <div className="flex gap-3">
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <Button
                onClick={() => {
                  navigate({
                    search: {
                      dateRangeEnd: new Date().toISOString(),
                      dateRangeStart: subMonths(new Date(), 2).toISOString(),
                    },
                  });
                }}
                variant="outline"
                size="icon"
              >
                <IterationCcw className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Reset to last 2 months
            </TooltipContent>
          </Tooltip>
          <PopoverApplicationCalendar />
          <Button>Add new application</Button>
        </div>
      </header>
      <Outlet />
    </main>
  );
}

function PopoverApplicationCalendar() {
  const searchParams = Route.useSearch();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(searchParams.dateRangeStart),
    to: new Date(searchParams.dateRangeEnd),
  });
  const navigate = useNavigate({ from: Route.fullPath });
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from ? (
            date.to ? (
              <>
                {format(date.from, "LLL dd, y")} -{" "}
                {format(date.to, "LLL dd, y")}
              </>
            ) : (
              format(date.from, "LLL dd, y")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={date}
          onSelect={(range) => {
            if (!range || !range.from || !range.to) {
              setDate(range);
              return;
            }
            setDate(range);
            const dateRangeStart = range.from.toISOString();
            const dateRangeEnd = range.to.toISOString();
            navigate({ search: { dateRangeStart, dateRangeEnd } });
          }}
          numberOfMonths={3}
        />
      </PopoverContent>
    </Popover>
  );
}
