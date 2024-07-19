import { createFileRoute } from "@tanstack/react-router";
import { ErrorComponent } from "@/shared/browser/ui/error-component";

import {
  ColumnDef,
  Kanban,
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  useKanban,
} from "@/shared/browser/ui/kanban";
import {
  useMovePositionMutation,
  useUpdateStatusMutation,
} from "@/modules/applications/kanban";
import { Route as ApplicationRoute } from "./_home.applications";
import { format } from "date-fns";
import { Badge } from "@/shared/browser/ui/badge";
import { AUD } from "@/shared/utils/currency";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuTrigger,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuGroup,
  DropdownMenuSeparator,
} from "@/shared/browser/ui/dropdown-menu";

import { Button } from "@/shared/browser/ui/button";
import { MoreHorizontalIcon } from "lucide-react";
import { Applications } from "@/modules/applications/data-table/row-actions";
import { rpc } from "@/shared/browser/rpc/client";
import { ColumnDefInit } from "@/shared/browser/ui/kanban/use-kanban";
import { useCollapseSideNav } from "./_home";

export const Route = createFileRoute("/_home/applications/kanban")({
  component: () => <ApplicationsKanbanRoute />,
  errorComponent: (error) => <ErrorComponent error={error} />,
  loader: async () => {
    const response = await rpc.applications["kanban-metadata"].$get();
    const result = await response.json();
    const columns: ColumnDefInit = result.data.map((r) => ({
      id: r.columnId,
      cardIds: r.positionIds,
    }));
    return { columns };
  },
});

function ApplicationsKanbanRoute() {
  const [collapsed] = useCollapseSideNav();
  const { applications } = ApplicationRoute.useLoaderData();
  const { columns } = Route.useLoaderData();
  const mutations = {
    updateStatus: useUpdateStatusMutation(),
    movePosition: useMovePositionMutation(),
  };

  const kanban = useKanban({
    columns: columns,
    data: applications,
    eventListeners: {
      onCardMoveToNewColumn: (values) => {
        mutations.updateStatus.mutate(values);
      },
      onCardMoveToNewColumnAndRespositionCards: async (values) => {
        await mutations.updateStatus.mutateAsync({
          cardId: values.fromCardId,
          toColumnId: values.toColumnId,
          fromColumnId: values.fromColumnId,
        });
        await mutations.movePosition.mutateAsync(values);
      },
    },
  });

  return (
    <div className="flex flex-row flex-1 items-start gap-4">
      <KanbanBoard
        maxHeight={"calc(100vh - 175px)"}
        maxWidth={`calc(100vw - ${collapsed ? 75 + 48 : 200 + 48}px)`}
        Headers={<ApplicationsKanbanBoardHeader kanban={kanban} />}
        kanban={kanban}
      >
        {kanban.columns.map((column) => (
          <KanbanColumn
            key={column.id}
            id={column.id}
            className="min-w-[250px] bg-accent/30 border-t-0 rounded-t-none"
          >
            {column.cards.map((card, index) => (
              <KanbanCard
                key={`${index}_${card.id}_${column.id}_${card.data.updatedAt}`}
                id={card.id}
                index={index}
                columnId={column.id}
                className="p-4 group hover:bg-accent/20"
              >
                <ApplicationCardContent
                  Actions={
                    <ApplicationKanbanCardActionDropdown
                      column={column}
                      kanban={kanban}
                    />
                  }
                  application={card.data}
                />
              </KanbanCard>
            ))}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </div>
  );
}

function ApplicationsKanbanBoardHeader<TData extends { id: string }>(props: {
  kanban: Kanban<TData>;
}) {
  return (
    <div className="flex gap-6">
      {props.kanban.columns.map((column) => (
        <div
          key={`header-${column.id}`}
          className="min-w-[250px] px-5 py-3 bg-accent/50 rounded-t border-t border-x peer-[data-[state=dragged-over]]:bg-muted"
        >
          <h1 className="capitalize font-semibold text-lg">
            {column.id.split("-").join(" ")}
          </h1>
        </div>
      ))}
    </div>
  );
}

function ApplicationKanbanCardActionDropdown<
  TData extends { id: string },
>(props: { kanban: Kanban<TData>; column: ColumnDef<TData> }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" variant="ghost">
          <MoreHorizontalIcon className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Move to</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {props.kanban.columns
                .filter((col) => col.id !== props.column.id)
                .map((item) => (
                  <DropdownMenuItem key={item.id} className="capitalize">
                    {item.id.split("-").join(" ")}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>View</DropdownMenuItem>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ApplicationCardContent(props: {
  application: Applications;
  Actions: React.ReactNode;
}) {
  const { application, Actions } = props;
  return (
    <>
      <div className="flex justify-between items-start">
        <p className="font-semibold w-full text-sm line-clamp-2">
          {application.job.title}
        </p>
        {Actions}
      </div>
      <p className="text-primary/80 text-sm truncate">
        {application.job.company}
      </p>
      {application.job.techStack
        .split(",")
        .slice(0, 2)
        .map((tech) => (
          <Badge
            key={`${props.application.id}-${tech}`}
            className="mr-2 py-0"
            variant="outline"
          >
            <span className="text-[10px] leading-1">{tech}</span>
          </Badge>
        ))}
      <div className="flex items-center mt-2">
        {application.job.salary && (
          <p className="text-sm">{AUD.format(application.job.salary)}</p>
        )}
        {application.appliedAt && (
          <p className="text-xs text-muted-foreground ml-auto w-fit">
            {format(new Date(application.appliedAt), "dd MMM yyyy")}
          </p>
        )}
      </div>
    </>
  );
}
