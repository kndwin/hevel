import { MiddlewareHandler } from "hono";
import { createMiddleware } from "hono/factory";
import { env } from "hono/adapter";
import type { KVNamespace } from "@cloudflare/workers-types";
import cloudflareKVHTTPDriver from "unstorage/drivers/cloudflare-kv-http";
import cloudflareKVBindingDriver from "unstorage/drivers/cloudflare-kv-binding";
import { Storage, createStorage } from "unstorage";

export const withCKV: MiddlewareHandler<{
  Bindings: {
    ["hevel-kv"]: KVNamespace;
  };
  Variables: {
    kv: Storage;
  };
}> = createMiddleware(async (c, next) => {
  const ckv = env(c)["hevel-kv"];
  const storage = createStorage({
    driver: cloudflareKVBindingDriver({ binding: ckv }),
  });
  c.set("kv", storage);
  await next();
});

export const withUKV: MiddlewareHandler<{
  Variables: {
    kv: Storage;
  };
}> = createMiddleware(async (c, next) => {
  const storage = createStorage({
    driver: cloudflareKVHTTPDriver({
      accountId: "my-account-id",
      namespaceId: "b8ee941a800941c1835ccdae1a00ab99",
      apiToken: "supersecret-api-token",
    }),
  });
  c.set("kv", storage);
  await next();
});

export const withKV = withCKV;
// export const withKV = withUKV;
