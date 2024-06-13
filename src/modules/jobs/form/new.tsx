import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { JobForm, useJobForm } from "./base";
import type { FormValues } from "./base";
import { rpc } from "@/shared/browser/rpc/client";

export function NewJobForm() {
  const router = useRouter();

  const form = useJobForm();

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const res = await rpc.jobs.$post({
        json: {
          ...values,
          techStack: values.techStack.map((ts) => ts.value).join(","),
          location: values.location.value,
          source: values.source.value,
        },
      });
      const data = await res.json();
      if (data?.error) throw new Error(data.error);
      return data.data;
    },
    onSuccess: (data) => {
      router.invalidate();
      toast.success("Job created");
      form.reset();
      router.navigate({
        to: "/jobs",
        search: () => ({ mode: `view_${data.id}` }),
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <JobForm
      form={form}
      onSubmit={(values) => mutation.mutate(values)}
      status={mutation.status}
    />
  );
}
