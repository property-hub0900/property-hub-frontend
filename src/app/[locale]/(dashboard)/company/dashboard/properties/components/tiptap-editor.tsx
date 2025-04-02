"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Undo,
  Redo,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef, useImperativeHandle } from "react";

export interface TiptapEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  className?: string;
}

export interface TiptapEditorRef {
  getContent: () => string | undefined;
  setContent: (content: string) => void;
}

const TiptapEditor = forwardRef<TiptapEditorRef, TiptapEditorProps>(
  ({ content = "", onChange, className }, ref) => {
    const editor = useEditor({
      extensions: [StarterKit],
      content,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
    });

    useImperativeHandle(ref, () => ({
      getContent: () => editor?.getHTML(),
      setContent: (content: string) => {
        editor?.commands.setContent(content);
      },
    }));

    if (!editor) {
      return null;
    }

    return (
      <div className={cn("border rounded-md", className)}>
        <div className="flex flex-wrap gap-1 p-2 border-b bg-muted/50">
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "bg-muted" : ""}
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "bg-muted" : ""}
          >
            <Italic className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={
              editor.isActive("heading", { level: 1 }) ? "bg-muted" : ""
            }
          >
            <Heading1 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={
              editor.isActive("heading", { level: 2 }) ? "bg-muted" : ""
            }
          >
            <Heading2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={editor.isActive("bulletList") ? "bg-muted" : ""}
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={editor.isActive("orderedList") ? "bg-muted" : ""}
          >
            <ListOrdered className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>
        <EditorContent
          editor={editor}
          className="p-3 min-h-[150px] prose prose-sm max-w-none [&>.ProseMirror]:min-h-[150px] [&>.ProseMirror]:outline-none"
        />
      </div>
    );
  }
);

TiptapEditor.displayName = "TiptapEditor";

export { TiptapEditor };
