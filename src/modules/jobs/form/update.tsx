import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import { rpc } from "@/shared/browser/rpc/client";
import type { InferResponseType } from "@/shared/browser/rpc/client";

import { JobForm, useJobForm } from "./base";
import type { FormValues } from "./base";

export function UpdateJobForm(props: {
  job: InferResponseType<(typeof rpc)["jobs"]["$get"]>["data"][0];
}) {
  const router = useRouter();

  const form = useJobForm({
    defaultValues: {
      ...props.job,
      techStack:
        props.job?.techStack?.split(",").map((t) => ({
          label: t,
          value: t,
        })) ?? [],
      location: {
        label: props.job.location,
        value: props.job.location,
      },
      source: {
        label: props.job.source,
        value: props.job.source,
      },
      sourceUrl: props.job.sourceUrl ?? undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log({ values });
      const res = await rpc.jobs[":id"].$put({
        json: {
          ...values,
          techStack: values.techStack.map((t) => t.value).join(","),
          location: values.location.value,
          source: values.source.value,
          id: undefined,
        },
        param: { id: props.job.id },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      form.reset();
      router.invalidate();
      toast.success("Job updated");
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
