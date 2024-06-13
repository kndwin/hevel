import { XIcon, ChevronsUpDownIcon } from "lucide-react";
import clsx from "clsx";
import React from "react";
import type {
  ClearIndicatorProps,
  DropdownIndicatorProps,
  GroupBase,
  MultiValueRemoveProps,
  Props as SelectProps,
} from "react-select";
import { components } from "react-select";
import RSCreatableSelect from "react-select/creatable";

const DropdownIndicator = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: DropdownIndicatorProps<Option, IsMulti, Group>
) => (
  <components.DropdownIndicator {...props}>
    <ChevronsUpDownIcon className="h-4 w-4" />
  </components.DropdownIndicator>
);

const ClearIndicator = <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: ClearIndicatorProps<Option, IsMulti, Group>
) => (
  <components.ClearIndicator {...props}>
    <XIcon className="h-4 w-4" />
  </components.ClearIndicator>
);

const MultiValueRemove = (props: MultiValueRemoveProps) => (
  <components.MultiValueRemove {...props}>
    <XIcon className="h-4 w-4" />
  </components.MultiValueRemove>
);

const controlStyles = {
  base: "flex w-full rounded-md border border-input bg-transparent px-4 py-2 text-sm shadow-sm transition-colors placeholder:text-muted-foreground hover:bg-secondary cursor-pointer",
  focus: "outline-none",
  nonFocus: "border-border",
};
const placeholderStyles = "font-medium text-sm text-muted-foreground";
const selectInputStyles = "text-foreground text-sm";
const valueContainerStyles = "text-foreground text-sm";
const singleValueStyles = "";
const multiValueStyles =
  "bg-background border border-border rounded items-center px-2 mr-1 my-0.5 gap-1.5";
const multiValueLabelStyles = "leading-5 text-xs py-0.5";
const multiValueRemoveStyles =
  "bg-transparent hover:text-destructive opacity-50";
const indicatorsContainerStyles = "gap-1 bg-transparent rounded-lg";
const clearIndicatorStyles =
  "opacity-50 rounded-md hover:text-destructive cursor-pointer";
const indicatorSeparatorStyles = "bg-muted";
const dropdownIndicatorStyles = "opacity-50";
const menuStyles =
  "mt-2 p-1 border border-border bg-background text-sm rounded-lg";
const optionsStyle =
  "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-secondary";
const groupHeadingStyles = "ml-3 mt-2 mb-1 opacity-50 text-sm bg-background";
const noOptionsMessageStyles = "text-muted-foreground bg-background";

function CreatableSelectInner<
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  {
    options,
    value,
    onChange,
    isMulti,
    isDisabled,
    components,
    isLoading,
    placeholder,
    ...props
  }: SelectProps<Option, IsMulti, Group>,
  ref: React.ForwardedRef<
    React.ElementRef<typeof RSCreatableSelect<Option, IsMulti, Group>>
  >
) {
  return (
    <RSCreatableSelect
      ref={ref}
      unstyled
      isClearable
      isSearchable
      value={value}
      isDisabled={isDisabled}
      isMulti={isMulti}
      isLoading={isLoading}
      placeholder={placeholder}
      components={{
        DropdownIndicator,
        ClearIndicator,
        MultiValueRemove,
        ...components,
      }}
      defaultValue={value}
      options={options}
      noOptionsMessage={() => "No options found."}
      onChange={onChange}
      classNames={{
        control: ({ isFocused, isDisabled }) =>
          clsx(
            isDisabled ? "cursor-not-allowed opacity-50" : "",
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        option: () => optionsStyle,
        menu: () => menuStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        groupHeading: () => groupHeadingStyles,
        noOptionsMessage: () => noOptionsMessageStyles,
      }}
      {...props}
    />
  );
}

export const CreatableSelect = React.forwardRef(CreatableSelectInner) as <
  Option,
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>,
>(
  props: SelectProps<Option, IsMulti, Group> & {
    ref?: React.ForwardedRef<
      React.ElementRef<typeof RSCreatableSelect<Option, IsMulti, Group>>
    >;
  }
) => ReturnType<typeof CreatableSelectInner>;
