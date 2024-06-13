import { hc } from "hono/client";
import type { AppType } from "../../../../functions/api/[[route]]";
export type { InferResponseType } from "hono/client";

// export const rpc = hc<AppType>("/api");
export const rpc = hc<AppType>(`${window.location.origin}/api`);
