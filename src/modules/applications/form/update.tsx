import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/browser/ui/card";

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
      heardFrom: {
        label: props.job.heardFrom,
        value: props.job.heardFrom,
      },
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log({ values });
      const res = await rpc.jobs[":id"].$put({
        json: {
          ...values,
          techStack: values.techStack.map((t) => t.value).join(","),
          heardFrom: values.heardFrom?.value,
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
    <Card className="flex-1 w-full min-w-0">
      <CardHeader className="relative">
        <CardTitle>Update Job</CardTitle>
        <button
          onClick={() => router.navigate({ search: {} })}
          className="absolute top-4 right-4"
        >
          <XIcon />
        </button>
      </CardHeader>
      <CardContent>
        <JobForm
          form={form}
          onSubmit={(values) => mutation.mutate(values)}
          status={mutation.status}
        />
      </CardContent>
    </Card>
  );
}
