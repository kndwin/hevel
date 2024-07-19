import { rpc } from "@/shared/browser/rpc/client";
import { useMutation } from "@tanstack/react-query";
import { KanbanEventListeners } from "@/shared/browser/ui/kanban/use-kanban";

type PropOf<TFunction> = Parameters<TFunction>[0];

export function useUpdateStatusMutation() {
  const mutation = useMutation({
    mutationFn: async (
      values: PropOf<KanbanEventListeners["onCardMoveToNewColumn"]>
    ) => {
      const res = await rpc.applications[":id"].$patch({
        param: { id: values.cardId },
        json: { status: values.toColumnId },
      });
      const json = await res.json();
      await rpc.applications["kanban-metadata"][":id"]["move-column"].$patch({
        param: { id: values.cardId },
        json: {
          fromColumnId: values.fromColumnId,
          toColumnId: values.toColumnId,
        },
      });
      return json;
    },
  });
  return mutation;
}

export function useMovePositionMutation() {
  const mutation = useMutation({
    mutationFn: async (
      values: PropOf<
        KanbanEventListeners["onCardMoveToNewColumnAndRespositionCards"]
      >
    ) => {
      await rpc.applications["kanban-metadata"][":id"]["move-position"].$patch({
        param: { id: values.fromCardId },
        json: {
          edge: values.edge,
          columnId: values.toColumnId,
          toCardId: values.toCardId,
        },
      });
    },
  });
  return mutation;
}
