// src/components/content/templates/ReferenceTemplate.jsx
import React from 'react';
import { BookOpen, ExternalLink } from 'lucide-react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import ScopedCss from '@/components/cms/ScopedCss';

export default function ReferenceTemplate({ content, children }) {
  if (!content) return null;
  const { title, description, markdown_content, scientific_references = [], css } = content;

  return (
    <ScopedCss css={css} as="div" className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 text-right font-sans">
      <div className="flex items-center gap-2 text-teal-600 mb-2 font-bold text-sm">
        <BookOpen className="w-5 h-5" />
        <span>ببليوغرافيا وتوثيق علمي</span>
      </div>
      <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-4 font-display">
        {title}
      </h1>
      {description && <p className="text-neutral-600 dark:text-neutral-300 mb-6">{description}</p>}
      {markdown_content && <MarkdownRenderer content={markdown_content} />}

      {scientific_references.length > 0 && (
        <div className="mt-8 space-y-3">
          {scientific_references.map((ref, idx) => (
            <div key={ref.id || idx} className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 text-sm mb-1">{ref.title}</div>
              <div className="text-neutral-500">{ref.authors} ({ref.year})</div>
              {ref.publication && <div className="text-neutral-400 mt-0.5">{ref.publication}</div>}
              {ref.url && (
                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-teal-600 hover:underline mt-2">
                  <span>فتح الرابط الأصلي</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}
      {children}
    </ScopedCss>
  );
}
