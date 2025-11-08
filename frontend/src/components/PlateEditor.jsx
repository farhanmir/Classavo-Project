'use client';

import { useCallback, useState, useEffect } from 'react';
import { Plate, PlateContent, usePlateEditor } from '@udecode/plate-core/react';

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
      <Plate editor={editor} value={value} onChange={handleChange}>
        <PlateContent 
          className="min-h-[400px] p-4 focus:outline-none focus:ring-2 focus:ring-blue-500" 
          placeholder="Start typing your chapter content..."
        />
      </Plate>
    </div>
  );
}
