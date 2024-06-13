import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import { rpc } from "@/shared/rpc/client";

export const Route = createRootRouteWithContext<{
  rpc: typeof rpc;
}>()({
  component: () => <Outlet />,
});
