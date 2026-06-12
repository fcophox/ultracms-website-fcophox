"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { 
  Bold, 
  Italic, 
  Strikethrough, 
  Heading1, 
  Heading2, 
  Heading3, 
  List, 
  ListOrdered, 
  Quote, 
  Image as ImageIcon 
} from "lucide-react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ content, onChange, placeholder = "Escribe algo increíble..." }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-content max-w-none focus:outline-none w-full h-full min-h-[400px]',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('URL de la imagen');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="flex-1 rounded-xl border border-border bg-surface flex flex-col min-h-[500px]">
      {/* Toolbar */}
      <div className="h-14 border-b border-border flex items-center px-4 gap-1 overflow-x-auto shrink-0">
        <div className="flex items-center gap-1 pr-4 border-r border-border">
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('bold') ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Bold className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('italic') ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Italic className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('strike') ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Strikethrough className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
        </div>
        
        <div className="flex items-center gap-1 pl-4 pr-4 border-r border-border">
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('heading', { level: 1 }) ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Heading1 className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('heading', { level: 2 }) ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Heading2 className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('heading', { level: 3 }) ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Heading3 className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center gap-1 pl-4 pr-4 border-r border-border">
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('bulletList') ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <List className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('orderedList') ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <ListOrdered className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
          <button 
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${editor.isActive('blockquote') ? 'text-foreground bg-muted/20' : 'text-muted hover:text-foreground hover:bg-muted/10'}`}
          >
            <Quote className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex items-center gap-1 pl-4">
          <button 
            type="button"
            onClick={addImage}
            className="w-8 h-8 flex items-center justify-center rounded text-muted hover:text-foreground hover:bg-muted/10 transition-colors"
          >
            <ImageIcon className="w-[15px] h-[15px]" strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
