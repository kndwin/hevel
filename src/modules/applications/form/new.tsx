import { useRouter } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { XIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/browser/ui/card";

import { JobForm, useJobForm } from "./base";
import type { FormValues } from "./base";
import { rpc } from "@/shared/browser/rpc/client";

export function NewJobForm() {
  const router = useRouter();

  const form = useJobForm();

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log({ values });
      const res = await rpc.jobs.$post({
        json: {
          ...values,
          techStack: values.techStack.join(","),
          heardFrom: values.heardFrom?.value,
        },
      });
      const data = await res.json();
      return data;
    },
    onSuccess: () => {
      router.invalidate();
      toast.success("Job created");
      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Card className="flex-1 w-full min-w-0">
      <CardHeader className="relative">
        <CardTitle>New Job</CardTitle>
        <CardDescription>Add new job</CardDescription>
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
