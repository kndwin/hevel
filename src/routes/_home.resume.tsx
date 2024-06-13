import { createFileRoute } from "@tanstack/react-router";
import { PreviewResume } from "@/modules/resume/preview";
import { ListResume } from "@/modules/resume/list";
import type { Resume } from "@/modules/resume/list";
import { useState } from "react";
import { ulid } from "ulidx";

export const Route = createFileRoute("/_home/resume")({
  component: () => <Resume />,
});

const resumes: Resume[] = [
  {
    ulid: ulid(),
    updatedAt: new Date(),
    title: "Software Engineer",
    content: "# Kevin Nguyen \n San Francisco, CA \n ## Working Experience",
    type: "base",
  },
  {
    ulid: ulid(),
    updatedAt: new Date(),
    title: "Software Engineer - Netflix",
    content:
      "# Kevin Nguyen - Netflix \n San Francisco, CA \n ## Working Experience",
    type: "tailored",
  },
  {
    ulid: ulid(),
    updatedAt: new Date(),
    title: "Software Engineer - Google",
    content:
      "# Kevin Nguyen - Google \n San Francisco, CA \n ## Working Experience",
    type: "tailored",
  },
  {
    ulid: ulid(),
    updatedAt: new Date(),
    title: "Software Engineer - Facebook",
    content:
      "# Kevin Nguyen - Facebook\n San Francisco, CA \n ## Working Experience",
    type: "tailored",
  },
];

function Resume() {
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  return (
    <main className="flex flex-1">
      <ListResume resumes={resumes} onSelectResume={setSelectedResume} />
      <PreviewResume resumeInMd={selectedResume?.content ?? ""} />
    </main>
  );
}
