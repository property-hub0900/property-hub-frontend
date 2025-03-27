/* eslint-disable no-unused-vars */
// src/components/simple-multi-select.tsx

import { cva } from "class-variance-authority";
import { Check, ChevronDown, Trash2, XIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

// MultiSelect variants for styling
const multiSelectVariants = cva("m-1", {
  variants: {
    variant: {
      default: "border-foreground/10 text-foreground bg-card hover:bg-card/80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface SimpleMultiSelectProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  onValueChange: (value: string[]) => void;
  defaultValue?: string[];
  placeholder?: string;
}

export const SimpleMultiSelect = React.forwardRef<
  HTMLButtonElement,
  SimpleMultiSelectProps
>(
  (
    {
      options,
      onValueChange,
      defaultValue = [],
      placeholder = "Select options",
      className,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] =
      React.useState<string[]>(defaultValue);
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [searchQuery, setSearchQuery] = React.useState("");

    const filteredOptions = React.useMemo(() => {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchQuery.toLowerCase())
      );
      return filtered;
    }, [options, searchQuery]);

    const toggleOption = (option: string) => {
      console.log("toggleOption", option);

      if (selectedValues.includes(option)) {
        const newSelectedValues = selectedValues.filter(
          (value) => value !== option
        );
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      } else {
        const newSelectedValues = [...selectedValues, option];
        setSelectedValues(newSelectedValues);
        onValueChange(newSelectedValues);
      }
    };

    const handleClear = () => {
      setSelectedValues([]);
      onValueChange([]);
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            // onClick={() => setIsPopoverOpen((prev) => !prev)}
            className={cn(
              "flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-inherit",
              className
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center">
                  {selectedValues.map((value) => {
                    const option = options.find(
                      (o) => o.value.toString() === value.toString()
                    );
                    const IconComponent = option?.icon;
                    return (
                      <Badge
                        key={value.toString()}
                        className={cn(
                          "shadow-none",
                          multiSelectVariants({ variant: "default" })
                        )}
                      >
                        {IconComponent && (
                          <IconComponent className="h-4 w-4 me-2" />
                        )}
                        {option?.label}
                        <Trash2
                          className="ms-2 size-3.5 cursor-pointer text-destructive !pointer-events-auto"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleOption(value.toString());
                          }}
                        />
                      </Badge>
                    );
                  })}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="h-4 mx-2 cursor-pointer text-muted-foreground !pointer-events-auto"
                    onClick={(event) => {
                      event.stopPropagation();
                      handleClear();
                    }}
                  />
                  <Separator
                    orientation="vertical"
                    className="flex min-h-6 h-full"
                  />
                  <ChevronDown className="h-4 mx-2 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className="text-sm text-muted-foreground mx-3">
                  {placeholder}
                </span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground mx-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList onWheel={(e) => e.stopPropagation()}>
              {filteredOptions.length === 0 && (
                <p className="p-3 text-center text-grayDark">
                  No Search Results Found
                </p>
              )}
              {filteredOptions.map((option) => {
                const isSelected = selectedValues.includes(
                  option.value.toString()
                );
                return (
                  <CommandItem
                    key={option.value}
                    value={option.value.toString()}
                    onSelect={() => toggleOption(option.value.toString())}
                    className="cursor-pointer flex items-center"
                  >
                    {option.icon && (
                      <option.icon className="me-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="flex-1">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-muted-foreground" />
                    )}
                  </CommandItem>
                );
              })}
              <CommandSeparator />
              <CommandItem
                onSelect={handleClear}
                className="flex-1 justify-center cursor-pointer"
              >
                Clear
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

SimpleMultiSelect.displayName = "SimpleMultiSelect";
