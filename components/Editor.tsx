'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor as TiptapEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { Image as TiptapImage } from '@tiptap/extension-image';
import { createLowlight } from 'lowlight';

const lowlight = createLowlight();
import { useState, useCallback } from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Quote, 
  Code, 
  Link as LinkIcon, 
  Image, 
  Table as TableIcon,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Heading3,
  Maximize2,
  Minimize2,
  Save,
  Eye
} from 'lucide-react';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  onSave?: () => void;
  onPreview?: () => void;
  readonly?: boolean;
}

const MenuBar = ({ editor, onSave, onPreview, readonly }: { 
  editor: TiptapEditor | null; 
  onSave?: () => void;
  onPreview?: () => void;
  readonly?: boolean;
}) => {
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const addLink = () => {
    if (linkUrl && editor) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };

  const insertTable = () => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  };

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
    if (!isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isFullscreen]);

  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-1 p-3 border-b border-white/10 bg-black/20">
      {/* 撤销/重做 */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo() || readonly}
        className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white"
        title="撤销"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo() || readonly}
        className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white"
        title="重做"
      >
        <Redo className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      {/* 标题 */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        disabled={readonly}
        className={`p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="标题 1"
      >
        <Heading1 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        disabled={readonly}
        className={`p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${editor.isActive('heading', { level: 2 }) ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="标题 2"
      >
        <Heading2 className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        disabled={readonly}
        className={`p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed ${editor.isActive('heading', { level: 3 }) ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="标题 3"
      >
        <Heading3 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      {/* 文本格式 */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bold') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="粗体"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('italic') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="斜体"
      >
        <Italic className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      {/* 列表 */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('bulletList') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="无序列表"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('orderedList') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="有序列表"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      {/* 其他功能 */}
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('blockquote') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="引用"
      >
        <Quote className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('code') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="行内代码"
      >
        <Code className="w-4 h-4" />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={`p-2 rounded hover:bg-white/10 ${editor.isActive('codeBlock') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
        title="代码块"
      >
        <Code className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      {/* 链接 */}
      {showLinkInput ? (
        <div className="flex items-center gap-2 bg-black/30 rounded px-2 py-1">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="输入链接地址..."
            className="bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm w-48"
            onKeyDown={(e) => {
              if (e.key === 'Enter') addLink();
              if (e.key === 'Escape') {
                setShowLinkInput(false);
                setLinkUrl('');
              }
            }}
            autoFocus
          />
          <button
            onClick={addLink}
            className="p-1 text-blue-400 hover:text-blue-300"
          >
            ✓
          </button>
          <button
            onClick={() => {
              setShowLinkInput(false);
              setLinkUrl('');
            }}
            className="p-1 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLinkInput(true)}
          className={`p-2 rounded hover:bg-white/10 ${editor.isActive('link') ? 'bg-blue-600/30 text-blue-400' : 'text-gray-300 hover:text-white'}`}
          title="插入链接"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      )}

      {/* 表格 */}
      <button
        onClick={insertTable}
        className="p-2 rounded hover:bg-white/10 text-gray-300 hover:text-white"
        title="插入表格"
      >
        <TableIcon className="w-4 h-4" />
      </button>

      {/* 图片 */}
      <button
        onClick={() => {
          const url = prompt('输入图片地址:');
          const alt = prompt('输入图片描述 (可选):') || '';
          if (url) {
            editor.chain().focus().setImage({ src: url, alt }).run();
          }
        }}
        disabled={readonly}
        className="p-2 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed text-gray-300 hover:text-white"
        title="插入图片"
      >
        <Image className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-white/10 mx-1"></div>

      {/* 功能按钮 */}
      {onSave && (
        <button
          onClick={onSave}
          className="p-2 rounded hover:bg-green-600/20 text-green-400 hover:text-green-300"
          title="保存"
        >
          <Save className="w-4 h-4" />
        </button>
      )}
      
      {onPreview && (
        <button
          onClick={onPreview}
          className="p-2 rounded hover:bg-blue-600/20 text-blue-400 hover:text-blue-300"
          title="预览"
        >
          <Eye className="w-4 h-4" />
        </button>
      )}

      <button
        onClick={toggleFullscreen}
        className="p-2 rounded hover:bg-purple-600/20 text-purple-400 hover:text-purple-300"
        title={isFullscreen ? "退出全屏" : "全屏编辑"}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default function Editor({ content, onChange, placeholder = '开始写作...', onSave, onPreview, readonly = false }: EditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
      Link.configure({
        openOnClick: false,
        linkOnPaste: true,
      }),
      CodeBlockLowlight.configure({
        lowlight,
        defaultLanguage: 'plaintext',
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      TiptapImage.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
    ],
    content,
    editable: !readonly,
    onUpdate: ({ editor }) => {
      if (!readonly) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
      },
    },
  });

  return (
    <div className={`editor-container ${readonly ? 'opacity-75' : ''}`}>
      <MenuBar 
        editor={editor} 
        onSave={onSave}
        onPreview={onPreview}
        readonly={readonly}
      />
      <EditorContent editor={editor} className="editor-content" />
      
      {/* 编辑器样式 */}
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          padding: 1rem;
          min-height: 400px;
          font-size: 16px;
          line-height: 1.6;
        }

        .ProseMirror p {
          margin: 1em 0;
        }

        .ProseMirror h1,
        .ProseMirror h2,
        .ProseMirror h3,
        .ProseMirror h4,
        .ProseMirror h5,
        .ProseMirror h6 {
          line-height: 1.2;
          margin-top: 1.5em;
          margin-bottom: 0.5em;
          font-weight: 600;
        }

        .ProseMirror h1 { font-size: 2em; }
        .ProseMirror h2 { font-size: 1.5em; }
        .ProseMirror h3 { font-size: 1.25em; }

        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1em 0;
        }

        .ProseMirror li {
          margin: 0.25em 0;
        }

        .ProseMirror blockquote {
          border-left: 4px solid #4b5563;
          margin: 1em 0;
          padding-left: 1rem;
          color: #9ca3af;
          font-style: italic;
        }

        .ProseMirror code {
          background-color: #374151;
          color: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          font-size: 0.875em;
        }

        .ProseMirror pre {
          background-color: #1f2937;
          color: #f3f4f6;
          border-radius: 0.5rem;
          padding: 1rem;
          overflow-x: auto;
          margin: 1em 0;
        }

        .ProseMirror pre code {
          background-color: transparent;
          padding: 0;
          color: inherit;
        }

        .ProseMirror a {
          color: #60a5fa;
          text-decoration: underline;
        }

        .ProseMirror table {
          border-collapse: collapse;
          margin: 1em 0;
          width: 100%;
        }

        .ProseMirror th,
        .ProseMirror td {
          border: 1px solid #4b5563;
          padding: 0.5rem;
        }

        .ProseMirror th {
          background-color: #374151;
          font-weight: 600;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }

        .ProseMirror .ProseMirror-selectednode {
          outline: 2px solid #60a5fa;
          outline-offset: 2px;
        }

        /* 占位符样式 */
        .ProseMirror.is-editor-empty:before {
          content: attr(data-placeholder);
          float: left;
          color: #6b7280;
          pointer-events: none;
          height: 0;
        }

        /* 焦点状态 */
        .ProseMirror-focused {
          outline: none;
        }
      `}</style>
    </div>
  );
}