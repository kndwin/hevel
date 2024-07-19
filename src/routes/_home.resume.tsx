import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { ListResume } from "@/modules/resume/list";
import { rpc } from "@/shared/browser/rpc/client";

const searchSchema = z.object({
  baseResume: z.string().optional(),
  pageNumber: z.number().catch(0),
  pageSize: z.number().catch(10),
});
export const Route = createFileRoute("/_home/resume")({
  component: () => <Resume />,
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ search }),
  loader: async ({ deps }) => {
    const baseResumePromise = rpc.resumes.base.$get({
      query: {
        pageNumber: deps.search.pageNumber.toString(),
        pageSize: deps.search.pageSize.toString(),
      },
    });

    const tailoredResumePromise = rpc.resumes.tailored.$get({
      query: {
        pageNumber: deps.search.pageNumber.toString(),
        pageSize: deps.search.pageSize.toString(),
      },
    });

    const [baseResumeRes, tailoredResumeRes] = await Promise.all([
      baseResumePromise,
      tailoredResumePromise,
    ]);

    const baseResumes = (await baseResumeRes.json()).data;
    const tailoredResumes = (await tailoredResumeRes.json()).data;
    return {
      resumes: {
        base: baseResumes,
        tailored: tailoredResumes,
      },
    };
  },
});

function Resume() {
  const { resumes } = Route.useLoaderData();
  return (
    <main className="flex flex-1">
      <ListResume resumes={resumes} />
    </main>
  );
}
