'use client';

import { useCallback, useMemo } from 'react';
import { Plate, PlateContent } from '@udecode/plate/react';
import { BoldPlugin } from '@udecode/plate-bold/react';
import { ItalicPlugin } from '@udecode/plate-italic/react';
import { UnderlinePlugin } from '@udecode/plate-underline/react';
import { HeadingPlugin } from '@udecode/plate-heading/react';
import { ParagraphPlugin } from '@udecode/plate-paragraph/react';
import { ListPlugin } from '@udecode/plate-list/react';
import { BlockquotePlugin } from '@udecode/plate-block-quote/react';

export default function PlateEditor({ initialValue, onChange, readOnly = false }) {
  // Initialize Plate with core plugins
  const plugins = useMemo(
    () => [
      ParagraphPlugin(),
      HeadingPlugin(),
      BoldPlugin(),
      ItalicPlugin(),
      UnderlinePlugin(),
      ListPlugin(),
      BlockquotePlugin(),
    ],
    []
  );

  // Handle value changes from the editor
  const handleValueChange = useCallback(
    (value) => {
      if (!readOnly && onChange) {
        // Ensure value is a proper JSON structure for JSONField
        const contentObj = Array.isArray(value) ? { type: 'doc', content: value } : value;
        onChange(contentObj);
      }
    },
    [readOnly, onChange]
  );

  // Normalize initial value
  const initialContent = useMemo(() => {
    if (!initialValue) {
      return [{ type: 'p', children: [{ text: '' }] }];
    }

    if (typeof initialValue === 'string') {
      try {
        const parsed = JSON.parse(initialValue);
        return parsed.content || [{ type: 'p', children: [{ text: '' }] }];
      } catch {
        return [{ type: 'p', children: [{ text: initialValue }] }];
      }
    }

    if (Array.isArray(initialValue)) {
      return initialValue;
    }

    return initialValue.content || [{ type: 'p', children: [{ text: '' }] }];
  }, [initialValue]);

  if (readOnly) {
    return (
      <div className="prose max-w-none p-6 bg-white rounded-lg border border-gray-200">
        <Plate plugins={plugins} initialValue={initialContent} readOnly>
          <PlateContent className="min-h-[200px]" />
        </Plate>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <Plate plugins={plugins} initialValue={initialContent} onChange={handleValueChange}>
        <PlateContent className="min-h-[400px] p-4 prose-none prose-p:m-0 prose-p:mb-2 prose-h1:text-2xl prose-h1:font-bold prose-h2:text-xl prose-h2:font-bold prose-h3:text-lg prose-h3:font-bold focus:outline-none" />
      </Plate>
    </div>
  );
}
