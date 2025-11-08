'use client';

import { useCallback, useState, useEffect } from 'react';
import { Plate, PlateContent, usePlateEditor } from '@udecode/plate-core/react';

// Small toolbar button helper
function ToolbarButton({ onClick, children, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className="px-2 py-1 bg-white border border-gray-200 rounded hover:bg-gray-50 text-sm"
    >
      {children}
    </button>
  );
}

function applyCommand(command, value, editor) {
  try {
    // Use the browser's execCommand as a pragmatic fallback to apply formatting
    // to the contenteditable area used by the Plate/Slate editor.
    document.execCommand(command, false, value);
    // restore focus to the editor if possible
    if (editor?.selection) {
      const el = document.querySelector('.slate-editor [contenteditable="true"], .slate-editor');
      if (el) el.focus();
    }
  } catch (e) {
    // no-op
    console.error('Formatting command failed', e);
  }
}

export default function PlateEditor({ initialValue, onChange, readOnly = false }) {
  const [value, setValue] = useState(null);
  
  // Create editor instance
  const editor = usePlateEditor({
    value: value || [{ type: 'p', children: [{ text: '' }] }],
  });

  // Initialize value on client side
  useEffect(() => {
    if (!initialValue) {
      setValue([{ type: 'p', children: [{ text: '' }] }]);
      return;
    }

    if (typeof initialValue === 'string') {
      try {
        const parsed = JSON.parse(initialValue);
        setValue(parsed.content || parsed || [{ type: 'p', children: [{ text: '' }] }]);
      } catch {
        setValue([{ type: 'p', children: [{ text: initialValue }] }]);
      }
    } else if (Array.isArray(initialValue)) {
      setValue(initialValue);
    } else if (typeof initialValue === 'object' && initialValue.content) {
      setValue(initialValue.content);
    } else {
      setValue(initialValue || [{ type: 'p', children: [{ text: '' }] }]);
    }
  }, [initialValue]);

  const handleChange = useCallback(
    ({ value: newValue }) => {
      setValue(newValue);
      if (!readOnly && onChange) {
        onChange(newValue);
      }
    },
    [readOnly, onChange]
  );

  // Don't render until value is initialized
  if (value === null) {
    return <div className="min-h-[400px] bg-gray-50 animate-pulse rounded-lg" />;
  }

  if (readOnly) {
    return (
      <div className="prose max-w-none p-6 bg-white rounded-lg border border-gray-200">
        <Plate editor={editor} value={value} readOnly>
          <PlateContent className="min-h-[200px]" readOnly />
        </Plate>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-2 flex gap-2">
        <ToolbarButton
          title="Bold"
          onClick={() => applyCommand('bold', null, editor)}
        >
          <strong>B</strong>
        </ToolbarButton>

        <ToolbarButton
          title="Italic"
          onClick={() => applyCommand('italic', null, editor)}
        >
          <em>I</em>
        </ToolbarButton>

        <ToolbarButton
          title="Underline"
          onClick={() => applyCommand('underline', null, editor)}
        >
          <span className="underline">U</span>
        </ToolbarButton>

        <div className="mx-1 border-l" />

        <ToolbarButton
          title="H1"
          onClick={() => applyCommand('formatBlock', 'H1', editor)}
        >
          H1
        </ToolbarButton>

        <ToolbarButton
          title="H2"
          onClick={() => applyCommand('formatBlock', 'H2', editor)}
        >
          H2
        </ToolbarButton>

        <ToolbarButton
          title="H3"
          onClick={() => applyCommand('formatBlock', 'H3', editor)}
        >
          H3
        </ToolbarButton>

        <div className="mx-1 border-l" />

        <ToolbarButton
          title="Blockquote"
          onClick={() => applyCommand('formatBlock', 'BLOCKQUOTE', editor)}
        >
          ❝
        </ToolbarButton>
      </div>

      <Plate editor={editor} value={value} onChange={handleChange}>
        <PlateContent 
          className="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Start typing your chapter content..."
        />
      </Plate>
    </div>
  );
}
