// src/components/content/templates/LessonTemplate.jsx
import React from 'react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import ContentBlockRenderer from '@/components/content/ContentBlockRenderer';
import ScopedCss from '@/components/cms/ScopedCss';
import { Compass } from 'lucide-react';

export default function LessonTemplate({ content, children }) {
  if (!content) return null;
  const { title, description, markdown_content, content_blocks = [], metadata = {}, css } = content;

  return (
    <ScopedCss css={css} as="div" className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 text-right font-sans">
      <div className="mb-6 flex items-center gap-2 text-xs font-bold text-teal-600 dark:text-teal-400">
        <Compass className="w-4 h-4" />
        <span>مسار التعلم النفسي {metadata?.module_title ? `• ${metadata.module_title}` : ''}</span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 mb-3 font-display">
        {title}
      </h1>

      {description && (
        <p className="text-base text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
          {description}
        </p>
      )}

      {markdown_content && (
        <div className="mb-8">
          <MarkdownRenderer content={markdown_content} />
        </div>
      )}

      {content_blocks.length > 0 && (
        <div className="mb-8">
          <ContentBlockRenderer blocks={content_blocks} />
        </div>
      )}

      {children}
    </ScopedCss>
  );
}
