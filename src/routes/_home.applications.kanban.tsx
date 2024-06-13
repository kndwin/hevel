import { createFileRoute } from "@tanstack/react-router";
import { ErrorComponent } from "@/shared/browser/ui/error-component";

import {
  KanbanBoard,
  KanbanCard,
  KanbanColumn,
  useKanban,
} from "@/shared/browser/ui/kanban";
import { rpc } from "@/shared/browser/rpc/client";
import { initalColumns } from "@/modules/applications/kanban";

export const Route = createFileRoute("/_home/applications/kanban")({
  component: () => <ApplicationsKanbanRoute />,
  errorComponent: (error) => <ErrorComponent error={error} />,
  loader: async () => {
    const res = await rpc.applications.$get();
    const json = await res.json();
    return json.data;
  },
});

function ApplicationsKanbanRoute() {
  const data = Route.useLoaderData();
  const kanban = useKanban({
    columns: initalColumns,
    data: data,
    dataAccessorKey: "status",
  });

  return (
    <div className="flex flex-row flex-1 items-start gap-4">
      <KanbanBoard kanban={kanban}>
        {kanban.columns.map((column) => (
          <KanbanColumn key={column.id} id={column.id} className="min-w-60">
            <h1 className="capitalize font-semibold text-lg">
              {column.id.split("-").join(" ")}
            </h1>
            {column.cards.map((card, index) => (
              <KanbanCard
                key={`${index}_${card.id}_${column.id}`}
                id={card.id}
                index={index}
                columnId={column.id}
                className="p-4"
              >
                <p className="font-medium">{card.data.job.title}</p>
                <p className="text-muted-foreground">{card.data.job.company}</p>
              </KanbanCard>
            ))}
          </KanbanColumn>
        ))}
      </KanbanBoard>
    </div>
  );
}
