// src/components/content/templates/ArticleTemplate.jsx
import React from 'react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import ContentBlockRenderer from '@/components/content/ContentBlockRenderer';
import ScopedCss from '@/components/cms/ScopedCss';
import { Calendar, Tag, User } from 'lucide-react';

export default function ArticleTemplate({ content, children }) {
  if (!content) return null;

  const {
    title,
    description,
    markdown_content,
    content_blocks = [],
    tags = [],
    metadata = {},
    featured_image,
    published_at,
    css
  } = content;

  return (
    <ScopedCss css={css} as="article" className="w-full max-w-3xl mx-auto py-8 px-4 sm:px-6 text-right font-sans">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight mb-4 font-display">
          {title}
        </h1>

        {description && (
          <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-4 leading-relaxed">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-500 py-3 border-y border-neutral-200 dark:border-neutral-800">
          {metadata?.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {metadata.author}
            </span>
          )}
          {published_at && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(published_at).toLocaleDateString('ar-EG')}
            </span>
          )}
        </div>

        {featured_image && (
          <img
            src={featured_image}
            alt={title}
            className="w-full rounded-2xl my-6 max-h-96 object-cover shadow-sm"
            referrerPolicy="no-referrer"
          />
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
