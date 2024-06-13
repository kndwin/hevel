import { rpc } from "@/shared/browser/rpc/client";
import { Badge } from "@/shared/browser/ui/badge";
import { Button } from "@/shared/browser/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_debug/healthcheck")({
  component: () => <HealthCheck />,
});

function HealthCheck() {
  return (
    <div className="flex flex-col min-h-[100dvh]">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <h1 className="font-semibold text-xl">Health Check</h1>
      </header>
      <main className="flex-1">
        <ApiCheck />
      </main>
    </div>
  );
}

function ApiCheck() {
  const echoMutation = useMutation({
    mutationFn: async () => {
      const res = await rpc.echo.$get();
      const json = await res.json();
      return json;
    },
  });
  return (
    <div className="p-6 rounded border">
      <h1 className="font-semibold text-xl">API</h1>
      <div className="py-4">
        <div className="p-4 rounded border">
          <Button
            className="mb-4"
            size="sm"
            onMouseDown={() => echoMutation.mutate()}
          >
            GET /echo
          </Button>
          <pre className="items-center flex gap-2">
            Status:
            <Badge>{echoMutation.status}</Badge>
          </pre>
          <pre>Data: {JSON.stringify(echoMutation.data, null, 2)}</pre>
          <pre>Error: {JSON.stringify(echoMutation.error, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}
