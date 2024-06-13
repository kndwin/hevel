import { format } from "date-fns";
import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/browser/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/browser/ui/tabs";
import { Separator } from "@/shared/browser/ui/separator";
import { Input } from "@/shared/browser/ui/input";

export type Resume = {
  ulid: string;
  updatedAt: Date;
  title: string;
  content: string;
  type: "base" | "tailored";
};

export function ListResume(props: {
  resumes: Array<Resume>;
  onSelectResume: (resume: Resume) => void;
}) {
  return (
    <Tabs defaultValue="base" className="flex-1 border-r">
      <div className="flex items-center px-4 py-2">
        <h1 className="text-xl font-bold">Resumes</h1>
        <TabsList className="ml-auto">
          <TabsTrigger
            value="base"
            className="text-zinc-600 dark:text-zinc-200"
          >
            Base
          </TabsTrigger>
          <TabsTrigger
            value="tailored"
            className="text-zinc-600 dark:text-zinc-200"
          >
            Tailored
          </TabsTrigger>
        </TabsList>
      </div>
      <Separator />
      <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <form>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search" className="pl-8" />
          </div>
        </form>
      </div>
      <TabsContent value="base" className="m-0 px-4 gap-2 flex flex-col">
        {props.resumes
          .filter((r) => r.type === "base")
          .map((resume) => (
            <Link
              to={`/resume/$id`}
              params={{ id: resume.ulid }}
              className="flex flex-col px-4 py-2 border rounded hover:bg-muted"
            >
              <div className="flex items-center justify-between w-full">
                <p className="font-bold">{resume.title}</p>
                <p className="text-muted-foreground text-xs">
                  {format(resume.updatedAt, "MMM d, yyyy")}
                </p>
              </div>
              <div>{resume.content.slice(0, 100)}</div>
            </Link>
          ))}
      </TabsContent>
      <TabsContent value="tailored" className="m-0 px-4 gap-2 flex flex-col">
        {props.resumes
          .filter((r) => r.type === "tailored")
          .map((resume) => (
            <Card
              className="hover:bg-muted cursor-pointer"
              onClick={() => props.onSelectResume(resume)}
            >
              <CardHeader>
                <CardTitle>{resume.title}</CardTitle>
                <CardDescription>
                  {format(resume.updatedAt, "MMM d, yyyy")}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
      </TabsContent>
    </Tabs>
  );
}
