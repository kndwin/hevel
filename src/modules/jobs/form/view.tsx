import type { InferResponseType } from "@/shared/browser/rpc/client";
import { rpc } from "@/shared/browser/rpc/client";
import { Badge } from "@/shared/browser/ui/badge";
import { AUD } from "@/shared/utils/currency";

export function ViewJobContent({
  job,
}: {
  job: InferResponseType<(typeof rpc)["jobs"]["$get"]>["data"][0];
}) {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="inline-flex gap-x-2">
        <p>{AUD.format(job.salary)}</p>
        {job.techStack
          ?.split(",")
          .map((ts) => <Badge variant="secondary">{ts}</Badge>)}
      </div>
      <div
        className="prose prose-sm"
        dangerouslySetInnerHTML={{ __html: job.descriptionInHTML }}
      />
    </div>
  );
}
