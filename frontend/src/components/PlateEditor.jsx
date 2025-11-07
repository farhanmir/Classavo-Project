'use client';

import { useEffect, useRef, useState } from 'react';

export default function PlateEditor({ initialValue, onChange, readOnly = false }) {
  const editorRef = useRef(null);
  const [editorContent, setEditorContent] = useState(() => {
    // Parse initial value if it's a string
    if (typeof initialValue === 'string') {
      try {
        return JSON.parse(initialValue);
      } catch {
        return { type: 'doc', content: [{ type: 'paragraph', content: initialValue }] };
      }
    }
    return initialValue || { type: 'doc', content: [{ type: 'paragraph', content: '' }] };
  });

  useEffect(() => {
    if (typeof initialValue === 'string') {
      try {
        setEditorContent(JSON.parse(initialValue));
      } catch {
        setEditorContent({ type: 'doc', content: [{ type: 'paragraph', content: initialValue }] });
      }
    } else if (initialValue) {
      setEditorContent(initialValue);
    }
  }, [initialValue]);

  const handleChange = (e) => {
    if (!readOnly && onChange) {
      const newContent = e.target.value;
      // Store content as structured object for JSONField
      const contentObj = {
        type: 'doc',
        content: [{ type: 'paragraph', content: newContent }]
      };
      setEditorContent(contentObj);
      onChange(contentObj);
    }
  };

  const getDisplayValue = () => {
    if (typeof editorContent === 'string') return editorContent;
    if (editorContent?.content && Array.isArray(editorContent.content)) {
      return editorContent.content.map(c => c.content || '').join('\n');
    }
    return JSON.stringify(editorContent, null, 2);
  };

  // TODO: Replace with actual Plate.js implementation
  // Currently using simplified textarea editor
  if (readOnly) {
    return (
      <div className="prose max-w-none p-6 bg-white rounded-lg border border-gray-200">
        <div
          ref={editorRef}
          className="min-h-[200px] whitespace-pre-wrap"
        >
          {getDisplayValue()}
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar placeholder */}
      <div className="bg-gray-100 border-b border-gray-300 p-2 flex space-x-2">
        <button
          type="button"
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Underline"
        >
          <u>U</u>
        </button>
        <div className="border-l border-gray-300 mx-2"></div>
        <button
          type="button"
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Heading"
        >
          H
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Bullet List"
        >
          •
        </button>
        <button
          type="button"
          className="px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-50"
          title="Link"
        >
          🔗
        </button>
      </div>

      {/* Editor area */}
      <textarea
        ref={editorRef}
        className="w-full p-4 min-h-[400px] focus:outline-none resize-y"
        value={getDisplayValue()}
        onChange={handleChange}
        placeholder="Start writing your chapter content..."
      />
    </div>
  );
}
