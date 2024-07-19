import { XIcon } from "lucide-react";
import { useRouter } from "@tanstack/react-router";

import { rpc } from "@/shared/browser/rpc/client";
import type { InferResponseType } from "@/shared/browser/rpc/client";

import {
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/browser/ui/card";
import { ScrollArea } from "@/shared/browser/ui/scroll-area";

import { UpdateJobForm } from "./update";
import { NewJobForm } from "./new";
import { ViewJobContent } from "./view";

export function CardJobForm(props: {
  job?: InferResponseType<(typeof rpc)["jobs"]["$get"]>["data"][0];
  mode?: "new-job" | string;
}) {
  const router = useRouter();

  if (props.mode === "new") {
    return (
      <>
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
          <NewJobForm />
        </CardContent>
      </>
    );
  }

  if (props.mode?.includes("view") && props.job) {
    return (
      <>
        <CardHeader className="relative">
          <CardTitle>{props.job.title}</CardTitle>
          <CardDescription>{props.job.company}</CardDescription>
          <button
            onClick={() => router.navigate({ search: {} })}
            className="absolute top-4 right-4"
          >
            <XIcon />
          </button>
        </CardHeader>
        <ScrollArea
          viewportProps={{ style: { height: "calc(100vh - 210px)" } }}
        >
          <CardContent>
            <ViewJobContent job={props.job} />
          </CardContent>
        </ScrollArea>
      </>
    );
  }

  if (props.mode?.includes("edit") && props.job) {
    return (
      <>
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
          <UpdateJobForm key={`${props.job?.updatedAt}`} job={props.job} />
        </CardContent>
      </>
    );
  }

  return null;
}
