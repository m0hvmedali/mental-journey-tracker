// src/components/content/templates/MinimalTemplate.jsx
import React from 'react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import ContentBlockRenderer from '@/components/content/ContentBlockRenderer';
import ScopedCss from '@/components/cms/ScopedCss';

export default function MinimalTemplate({ content, children }) {
  if (!content) return null;
  const { title, description, markdown_content, content_blocks = [], css } = content;

  return (
    <ScopedCss css={css} as="div" className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 text-right font-sans">
      <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4 font-display">
        {title}
      </h1>
      {description && (
        <p className="text-sm text-neutral-500 mb-6">{description}</p>
      )}
      {markdown_content && <MarkdownRenderer content={markdown_content} />}
      {content_blocks.length > 0 && <ContentBlockRenderer blocks={content_blocks} />}
      {children}
    </ScopedCss>
  );
}
