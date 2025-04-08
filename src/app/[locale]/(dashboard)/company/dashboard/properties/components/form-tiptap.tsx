"use client";
import { useRef } from "react";
import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { TiptapEditor, type TiptapEditorRef } from "@/components/tiptap-editor";

interface FormTiptapProps {
  name: string;
  label?: string;
  description?: string;
}

export function FormTiptap({ name, label, description }: FormTiptapProps) {
  const { control } = useFormContext();
  const editorRef = useRef<TiptapEditorRef>(null);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <TiptapEditor
              ref={editorRef}
              content={field.value}
              onChange={field.onChange}
              className="w-full"
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
