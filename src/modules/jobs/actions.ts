import { useRouter } from "@tanstack/react-router";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { Actions } from "@/shared/browser/ui/table";
import { rpc } from "@/shared/browser/rpc/client";

export function useJobActions(): Actions {
  const router = useRouter();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await rpc.jobs[":id"].$delete({ param: { id } });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      toast.success("Job deleted");
      router.invalidate();
    },
  });

  return {
    delete: (id: string) => deleteMutation.mutate(id),
    view: (id: string) => {
      console.log("view: ", id);
      router.navigate({
        to: "/jobs",
        search: () => ({ mode: `view_${id}` }),
      });
    },
    edit: (id: string) => {
      console.log("update: ", id);
      router.navigate({
        to: "/jobs",
        search: () => ({ mode: `edit_${id}` }),
      });
    },
    add: () => {
      router.navigate({ to: "/jobs", search: () => ({ mode: "new" }) });
    },
  };
}
