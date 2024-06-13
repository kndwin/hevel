import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Actions } from "@/shared/browser/ui/table";
import { rpc } from "@/shared/browser/rpc/client";

export function useApplicationActions(): Actions {
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await rpc.applications[":id"].$delete({ param: { id } });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Application deleted");
      router.invalidate();
    },
  });

  return {
    delete: (id: string) => deleteMutation.mutate(id),
    view: (id: string) => {
      router.navigate({
        to: "/applications",
        search: () => ({ mode: `view_${id}` }),
      });
    },
    edit: (id: string) => {
      router.navigate({
        to: "/applications",
        search: () => ({ mode: `edit_${id}` }),
      });
    },
    add: () => {
      router.navigate({
        to: "/applications",
        search: () => ({ mode: "new" }),
      });
    },
  };
}
