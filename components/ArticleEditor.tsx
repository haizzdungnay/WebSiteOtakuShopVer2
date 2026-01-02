'use client';

import { useState } from 'react';
import { Bold, Italic, Heading2, List, Link2, Code } from 'lucide-react';

interface ArticleEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export default function ArticleEditor({
  value,
  onChange,
  placeholder = 'Nhập nội dung chi tiết của tin tức...',
  minHeight = '300px',
}: ArticleEditorProps) {
  const [preview, setPreview] = useState(false);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('article-content') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'text';
    const newContent = value.substring(0, start) + before + selectedText + after + value.substring(end);

    onChange(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  const renderMarkdown = (markdown: string) => {
    const html = markdown
      .replace(/^### (.*?)$/gm, '<h3 style="font-size: 1.25rem; font-weight: bold; margin: 1rem 0; color: #1f2937;">$1</h3>')
      .replace(/^## (.*?)$/gm, '<h2 style="font-size: 1.5rem; font-weight: bold; margin: 1rem 0; color: #1f2937;">$1</h2>')
      .replace(/^# (.*?)$/gm, '<h1 style="font-size: 1.875rem; font-weight: bold; margin: 1rem 0; color: #1f2937;">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight: bold;">$1</strong>')
      .replace(/__(.*?)__/g, '<strong style="font-weight: bold;">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em style="font-style: italic;">$1</em>')
      .replace(/_(.*?)_/g, '<em style="font-style: italic;">$1</em>')
      .replace(/`([^`]+)`/g, '<code style="background: #f3f4f6; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-family: monospace; color: #dc2626;">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #2563eb; text-decoration: underline;">$1</a>')
      .replace(/^- (.*?)$/gm, '<li style="margin-left: 1.5rem;">$1</li>')
      .replace(/(<li.*?<\/li>)/s, '<ul style="list-style-type: disc;">$1</ul>')
      .replace(/^(\d+)\. (.*?)$/gm, '<li style="margin-left: 1.5rem;">$2</li>')
      .replace(/(<li.*?<\/li>)/s, '<ol style="list-style-type: decimal;">$1</ol>')
      .replace(/^> (.*?)$/gm, '<blockquote style="border-left: 4px solid #cbd5e1; padding-left: 1rem; color: #64748b; font-style: italic;">$1</blockquote>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br />');

    return `<p>${html}</p>`;
  };

  return (
    <div className="space-y-3">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-3 bg-slate-50 border border-slate-200 rounded-t-xl">
        <button
          type="button"
          onClick={() => insertMarkdown('**', '**')}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="In đậm"
        >
          <Bold size={18} className="text-slate-600" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('_', '_')}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Nghiêng"
        >
          <Italic size={18} className="text-slate-600" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('## ', '')}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Tiêu đề"
        >
          <Heading2 size={18} className="text-slate-600" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('- ')}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Danh sách"
        >
          <List size={18} className="text-slate-600" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('[', '](url)')}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Liên kết"
        >
          <Link2 size={18} className="text-slate-600" />
        </button>
        <button
          type="button"
          onClick={() => insertMarkdown('`', '`')}
          className="p-2 hover:bg-white rounded-lg transition-colors"
          title="Code"
        >
          <Code size={18} className="text-slate-600" />
        </button>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => setPreview(!preview)}
          className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
            preview
              ? 'bg-indigo-100 text-indigo-700'
              : 'bg-white text-slate-600 hover:bg-slate-100'
          }`}
        >
          {preview ? '📝 Chỉnh sửa' : '👁️ Xem trước'}
        </button>
      </div>

      {/* Editor / Preview */}
      {!preview ? (
        <textarea
          id="article-content"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 border border-slate-200 rounded-b-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono text-sm"
          style={{ minHeight }}
        />
      ) : (
        <div
          className="w-full px-4 py-3 border border-slate-200 rounded-b-xl bg-white prose prose-sm max-w-none"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) || '<p style="color: #cbd5e1;">Chưa có nội dung</p>' }}
        />
      )}

      {/* Guide */}
      <div className="text-xs text-slate-500 space-y-1">
        <p className="font-semibold text-slate-600">💡 Hướng dẫn Markdown:</p>
        <ul className="grid grid-cols-2 gap-2 ml-2">
          <li>**bold** → <strong>bold</strong></li>
          <li>_italic_ → <em>italic</em></li>
          <li>## Heading → Tiêu đề</li>
          <li>- List → Danh sách</li>
          <li>[link](url) → Liên kết</li>
          <li>`code` → Code</li>
        </ul>
      </div>
    </div>
  );
}
