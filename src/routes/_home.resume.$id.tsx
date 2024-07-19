import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_home/resume/$id")({
  component: () => <div>Hello /_home/resume/$id!</div>,
});
