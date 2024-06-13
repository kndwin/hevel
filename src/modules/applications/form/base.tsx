import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";
import {
  ControllerRenderProps,
  UseFormProps,
  useForm,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Command,
  CommandItem,
  CommandInput,
  CommandList,
  CommandGroup,
} from "@/shared/browser/ui/command";
import { CreatableSelect } from "@/shared/browser/ui/createable-select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/browser/ui/popover";
import { Input } from "@/shared/browser/ui/input";
import { cn } from "@/shared/browser/ui/utils";

import { statuses, sentiments } from "../data-table/toolbar";
import { UseMutationResult } from "@tanstack/react-query";

type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

const formZodSchema = zodSchema.Jobs.insert
  .merge(
    z.object({
      salary: z.coerce.number(),
      techStack: z.array(z.object({ label: z.string(), value: z.string() })),
      heardFrom: z.object({ label: z.string(), value: z.string() }),
    })
  )
  .omit({ lastUpdated: true });

export type FormValues = RequiredNotNull<z.infer<typeof formZodSchema>>;

export function useJobForm(props?: UseFormProps<FormValues>) {
  return useForm<FormValues>({
    resolver: zodResolver(formZodSchema),
    defaultValues: {
      sentiment: "low",
      status: "not-started",
    },
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>The URL of the job listing.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:grid grid-cols-2 gap-4">
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
            name="heardFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source</FormLabel>
                <FormControl>
                  <CreatableSelect
                    options={DEFAULT_HEARD_FROM}
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
        </div>

        <div className="flex flex-col sm:grid grid-cols-2 gap-4">
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
        </div>
        <div className="flex flex-col sm:grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Status</FormLabel>
                <FormCombobox
                  name="status"
                  field={field}
                  form={form}
                  options={statuses}
                  placeholder="Select status"
                />
                <FormDescription>
                  The application status of the job listing.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="sentiment"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Sentiment</FormLabel>
                <FormCombobox
                  name="sentiment"
                  field={field}
                  form={form}
                  options={sentiments}
                  placeholder="Select sentiment"
                />
                <FormDescription>
                  The application sentiment of the job listing.
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
        </div>
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
  );
}

function FormCombobox<TFV extends FieldValues, TName extends Path<TFV>>(props: {
  name: TName;
  form: ReturnType<typeof useForm<TFV>>;
  field: ControllerRenderProps<TFV, TName>;
  options: { label: string; value: string }[];
  placeholder: string;
}) {
  const { field, form, options, placeholder, name } = props;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {(() => {
              const option = options?.find(
                ({ value }) => value === field?.value
              );
              if (!option) return placeholder;
              return option?.label;
            })()}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." className="h-9" />
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  value={option.label}
                  key={option.value}
                  onSelect={() =>
                    form.setValue(name, option.value as PathValue<TFV, TName>)
                  }
                >
                  {option.label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      option.value === field.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const DEFAULT_HEARD_FROM = [
  { label: "AngelList", value: "AngelList" },
  { label: "CareerBuilder", value: "CareerBuilder" },
  { label: "Dice", value: "Dice" },
  { label: "Glassdoor", value: "Glassdoor" },
  { label: "Indeed", value: "Indeed" },
  { label: "LinkedIn", value: "LinkedIn" },
  { label: "Monster", value: "Monster" },
  { label: "SimplyHired", value: "SimplyHired" },
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
