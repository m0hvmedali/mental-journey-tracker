// src/components/content/templates/DynamicPageTemplate.jsx
import React from 'react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import ContentBlockRenderer from '@/components/content/ContentBlockRenderer';
import ScopedCss from '@/components/cms/ScopedCss';

export default function DynamicPageTemplate({ content, children }) {
  if (!content) return null;
  const { title, description, markdown_content, content_blocks = [], css } = content;

  return (
    <ScopedCss css={css} as="div" className="w-full max-w-5xl mx-auto py-8 px-4 sm:px-6 text-right font-sans">
      <header className="mb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-3 font-display">
          {title}
        </h1>
        {description && (
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
            {description}
          </p>
        )}
      </header>

      {markdown_content && (
        <section className="mb-8">
          <MarkdownRenderer content={markdown_content} />
        </section>
      )}

      {content_blocks.length > 0 && (
        <section className="mb-8">
          <ContentBlockRenderer blocks={content_blocks} />
        </section>
      )}

      {children}
    </ScopedCss>
  );
}
