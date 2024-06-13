import { ChevronsUpDownIcon, CheckIcon } from "lucide-react";

import {
  ControllerRenderProps,
  useForm,
  FieldValues,
  Path,
  PathValue,
} from "react-hook-form";

import { Button } from "@/shared/browser/ui/button";
import { FormControl } from "@/shared/browser/ui/form";
import {
  Command,
  CommandItem,
  CommandInput,
  CommandList,
  CommandGroup,
} from "@/shared/browser/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/browser/ui/popover";
import { cn } from "@/shared/browser/ui/utils";

export function FormCombobox<
  TFV extends FieldValues,
  TName extends Path<TFV>,
>(props: {
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
      <PopoverContent
        style={{ width: "var(--radix-popover-trigger-width)" }}
        className="p-0"
      >
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
