'use client';

import { useEffect, useRef } from 'react';

export default function PlateEditor({ initialValue, onChange, readOnly = false }) {
  const editorRef = useRef(null);

  useEffect(() => {
    // Placeholder for Plate.js initialization
    // In a real implementation, this would initialize the Plate editor
    // with the necessary plugins and configuration
    console.log('PlateEditor initialized', { initialValue, readOnly });
  }, [initialValue, readOnly]);

  const handleChange = (e) => {
    if (!readOnly && onChange) {
      onChange(e.target.value);
    }
  };

  // Simplified editor for now - replace with actual Plate.js implementation
  // when integrating the @udecode/plate packages
  if (readOnly) {
    return (
      <div className="prose max-w-none p-6 bg-white rounded-lg border border-gray-200">
        <div
          ref={editorRef}
          className="min-h-[200px]"
          dangerouslySetInnerHTML={{
            __html: typeof initialValue === 'string'
              ? initialValue
              : JSON.stringify(initialValue, null, 2),
          }}
        />
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
        defaultValue={
          typeof initialValue === 'string'
            ? initialValue
            : JSON.stringify(initialValue, null, 2)
        }
        onChange={handleChange}
        placeholder="Start writing your chapter content..."
      />
    </div>
  );
}
