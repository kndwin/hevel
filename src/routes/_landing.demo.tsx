import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_landing/demo")({
  component: () => <div>Demo!</div>,
});

