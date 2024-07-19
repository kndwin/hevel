import { format } from "date-fns";
import { Search } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/browser/ui/card";
import { Separator } from "@/shared/browser/ui/separator";
import { Input } from "@/shared/browser/ui/input";
import { Button } from "@/shared/browser/ui/button";
import { InferResponseType } from "hono";
import { rpc } from "@/shared/browser/rpc/client";
import { ScrollArea } from "@/shared/browser/ui/scroll-area";

export function ListResume(props: {
  resumes: {
    base: InferResponseType<typeof rpc.resumes.base.$get>["data"];
    tailored: InferResponseType<typeof rpc.resumes.tailored.$get>["data"];
  };
}) {
  return (
    <div className="flex-1 border-r grid grid-cols-2">
      <div className="m-0 px-4 gap-2 flex flex-col">
        <div className="pt-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">Base</h1>
          <Button size="sm">Add new base</Button>
        </div>
        <ScrollArea
          viewportProps={{ style: { height: "calc(100vh - 132px)" } }}
        >
          <div className="gap-2 flex flex-col">
            {props.resumes.base.map((resume) => (
              <Card>
                <CardHeader>
                  <CardTitle className="font-bold">{resume.title}</CardTitle>
                  <CardDescription>
                    {format(resume.createdAt, "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="m-0 pr-4 gap-2 flex flex-col">
        <div className="pt-2 flex items-center justify-between">
          <h1 className="text-xl font-bold">Tailored</h1>
          <Button size="sm">Add new tailored</Button>
        </div>
        <ScrollArea
          viewportProps={{ style: { height: "calc(100vh - 132px)" } }}
        >
          <div className="gap-2 flex flex-col">
            {props.resumes.tailored.map((resume) => (
              <Card className="hover:bg-muted cursor-pointer">
                <CardHeader>
                  <CardTitle>{resume.title}</CardTitle>
                  <CardDescription>
                    {format(resume.createdAt, "MMM d, yyyy")}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
