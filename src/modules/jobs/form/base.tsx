import { UseFormProps, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorBoundary } from "react-error-boundary";
import { zodSchema } from "@/shared/server/db/schema";

import { Button } from "@/shared/browser/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/browser/ui/form";
import { CreatableSelect } from "@/shared/browser/ui/createable-select";
import { Input } from "@/shared/browser/ui/input";

import { UseMutationResult } from "@tanstack/react-query";
import { Editor } from "@/shared/browser/ui/editor";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/browser/ui/collapsible";

type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

const formZodSchema = zodSchema.Jobs.insert
  .merge(
    z.object({
      salary: z.coerce.number(),
      techStack: z.array(z.object({ label: z.string(), value: z.string() })),
      location: z.object({ label: z.string(), value: z.string() }),
      source: z.object({ label: z.string(), value: z.string() }),
    })
  )
  .omit({ updatedAt: true, createdAt: true });

export type FormValues = RequiredNotNull<z.infer<typeof formZodSchema>>;

export function useJobForm(props?: UseFormProps<FormValues>) {
  return useForm<FormValues>({
    resolver: zodResolver(formZodSchema),
    defaultValues: {},
    ...props,
  });
}

export function JobForm(props: {
  form: ReturnType<typeof useForm<FormValues>>;
  onSubmit: (values: FormValues) => void;
  status: UseMutationResult["status"];
}) {
  const { form } = props;

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(props.onSubmit)}
          className="space-y-4 pt-4"
        >
          <div className="flex flex-col sm:grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="source"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      options={DEFAULT_SOURCES}
                      placeholder="Select source"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Sources where you heard about the job listing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Source URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>The URL of the job listing.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="React Native Engineer" {...field} />
                  </FormControl>
                  <FormDescription>
                    The job title displayed in the job description.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="salary"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Salary</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="100000"
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.valueAsNumber)
                      }
                    />
                  </FormControl>
                  <FormDescription>Expected salary</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Netflix" {...field} />
                  </FormControl>
                  <FormDescription>
                    The company name that is hiring.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tech Stack</FormLabel>
                  <CreatableSelect
                    isMulti
                    options={DEFAULT_TECH_STACK}
                    placeholder="Select tech stack"
                    {...field}
                  />
                  <FormDescription>
                    The tech stack required for the job listing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <CreatableSelect
                      options={DEFAULT_LOCATIONS}
                      placeholder="Select Location"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    The location of the job listing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="descriptionInHTML"
            render={({ field }) => (
              <Collapsible defaultOpen>
                <FormItem>
                  <FormLabel className="gap-x-4 items-center">
                    {`Description `}
                    <CollapsibleTrigger className="group">
                      <span className="group-data-[state=open]:hidden">{`(Expand)`}</span>
                      <span className="group-data-[state=closed]:hidden">{`(Collapse)`}</span>
                    </CollapsibleTrigger>
                  </FormLabel>
                  <FormControl>
                    <CollapsibleContent
                      forceMount
                      className="data-[state=closed]:max-h-[100px] data-[state=closed]:overflow-hidden data-[state=closed]:bg-muted data-[state=closed]:pointer-events-none data-[state=open]:min-h-fit"
                    >
                      <Editor
                        initialHtml={field.value}
                        onChange={(html) => field.onChange(html)}
                      />
                    </CollapsibleContent>
                  </FormControl>
                  <FormDescription>
                    Description of the job listing.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              </Collapsible>
            )}
          />

          <div className="flex justify-end gap-4">
            <Button
              disabled={props.status === "pending"}
              onClick={() => form.reset()}
              type="reset"
              variant="outline"
            >
              Reset
            </Button>
            {(() => {
              if (props.status === "pending") {
                return <Button disabled={true}>Saving...</Button>;
              }
              return <Button type="submit">Submit</Button>;
            })()}
          </div>
        </form>
      </Form>
    </ErrorBoundary>
  );
}

const DEFAULT_LOCATIONS = [
  { label: "Sydney, Australia", value: "Sydney, Australia" },
  { label: "Melbourne, Australia", value: "Melbourne, Australia" },
  { label: "Perth, Australia", value: "Perth, Australia" },
  { label: "Adelaide, Australia", value: "Adelaide, Australia" },
  { label: "Brisbane, Australia", value: "Brisbane, Australia" },
  { label: "Canberra, Australia", value: "Canberra, Australia" },
];

const DEFAULT_TECH_STACK = [
  {
    label: "Front-end",
    options: [
      { label: "Angular", value: "Angular" },
      { label: "Backbone.js", value: "Backbone.js" },
      { label: "Ember.js", value: "Ember.js" },
      { label: "Flutter", value: "Flutter" },
      { label: "Gatsby", value: "Gatsby" },
      { label: "HTML/CSS", value: "HTML/CSS" },
      { label: "JavaScript", value: "JavaScript" },
      { label: "Less", value: "Less" },
      { label: "Meteor", value: "Meteor" },
      { label: "Next.js", value: "Next.js" },
      { label: "React", value: "React" },
      { label: "React Native", value: "React Native" },
      { label: "Redux", value: "Redux" },
      { label: "Sass", value: "Sass" },
      { label: "TypeScript", value: "TypeScript" },
      { label: "Vue.js", value: "Vue.js" },
      { label: "Webpack", value: "Webpack" },
    ],
  },
  {
    label: "Back-end",
    options: [
      { label: "C#", value: "C#" },
      { label: "Clojure", value: "Clojure" },
      { label: "Dart", value: "Dart" },
      { label: "Express.js", value: "Express.js" },
      { label: "Go", value: "Go" },
      { label: "Groovy", value: "Groovy" },
      { label: "Haskell", value: "Haskell" },
      { label: "Java", value: "Java" },
      { label: "Julia", value: "Julia" },
      { label: "Kotlin", value: "Kotlin" },
      { label: "Lua", value: "Lua" },
      { label: "Node.js", value: "Node.js" },
      { label: "Objective-C", value: "Objective-C" },
      { label: "Perl", value: "Perl" },
      { label: "PHP", value: "PHP" },
      { label: "Python", value: "Python" },
      { label: "R", value: "R" },
      { label: "Ruby", value: "Ruby" },
      { label: "Ruby on Rails", value: "Ruby on Rails" },
      { label: "Rust", value: "Rust" },
      { label: "Scala", value: "Scala" },
      { label: "Scheme", value: "Scheme" },
      { label: "Solidity", value: "Solidity" },
      { label: "Spring", value: "Spring" },
      { label: "Swift", value: "Swift" },
      { label: "Symfony", value: "Symfony" },
      { label: "Visual Basic", value: "Visual Basic" },
    ],
  },
  {
    label: "Databases",
    options: [
      { label: "MongoDB", value: "MongoDB" },
      { label: "MySQL", value: "MySQL" },
      { label: "PostgreSQL", value: "PostgreSQL" },
      { label: "Redis", value: "Redis" },
      { label: "SQLite", value: "SQLite" },
    ],
  },
  {
    label: "DevOps",
    options: [
      { label: "Ansible", value: "Ansible" },
      { label: "Apache Kafka", value: "Apache Kafka" },
      { label: "AWS", value: "AWS" },
      { label: "Azure", value: "Azure" },
      { label: "Bash", value: "Bash" },
      { label: "Chef", value: "Chef" },
      { label: "CircleCI", value: "CircleCI" },
      { label: "Docker", value: "Docker" },
      { label: "Elasticsearch", value: "Elasticsearch" },
      { label: "Firebase", value: "Firebase" },
      { label: "Git", value: "Git" },
      { label: "GitLab", value: "GitLab" },
      { label: "Google Cloud Platform", value: "Google Cloud Platform" },
      { label: "Gradle", value: "Gradle" },
      { label: "Grunt", value: "Grunt" },
      { label: "Gulp", value: "Gulp" },
      { label: "Hive", value: "Hive" },
      { label: "Jenkins", value: "Jenkins" },
      { label: "Jira", value: "Jira" },
      { label: "Kubernetes", value: "Kubernetes" },
      { label: "Maven", value: "Maven" },
      { label: "Nginx", value: "Nginx" },
      { label: "OpenStack", value: "OpenStack" },
      { label: "Puppet", value: "Puppet" },
      { label: "RabbitMQ", value: "RabbitMQ" },
      { label: "Shell", value: "Shell" },
      { label: "Subversion", value: "Subversion" },
      { label: "Terraform", value: "Terraform" },
      { label: "Travis CI", value: "Travis CI" },
      { label: "Vagrant", value: "Vagrant" },
      { label: "Vim", value: "Vim" },
      { label: "Yarn", value: "Yarn" },
      { label: "Zsh", value: "Zsh" },
    ],
  },
];

const DEFAULT_SOURCES = [
  { label: "AngelList", value: "AngelList" },
  { label: "CareerBuilder", value: "CareerBuilder" },
  { label: "Dice", value: "Dice" },
  { label: "Glassdoor", value: "Glassdoor" },
  { label: "Indeed", value: "Indeed" },
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Monster", value: "Monster" },
  { label: "SimplyHired", value: "SimplyHired" },
];
