// src/components/content/templates/ScientificPageTemplate.jsx
import React from 'react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import ContentBlockRenderer from '@/components/content/ContentBlockRenderer';
import ScopedCss from '@/components/cms/ScopedCss';
import { BookOpen, Clock, Tag, Award, ExternalLink } from 'lucide-react';

export default function ScientificPageTemplate({ content, children }) {
  if (!content) return null;

  const {
    title,
    description,
    markdown_content,
    content_blocks = [],
    scientific_references = [],
    tags = [],
    metadata = {},
    featured_image,
    css
  } = content;

  return (
    <ScopedCss css={css} as="article" className="w-full max-w-4xl mx-auto py-8 px-4 sm:px-6 text-right font-sans">
      {/* Header Banner */}
      <header className="mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        {/* Meta badges */}
        <div className="flex flex-wrap items-center justify-start gap-2 mb-4">
          {metadata?.framework && (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              {metadata.framework}
            </span>
          )}
          {metadata?.reading_time_minutes && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {metadata.reading_time_minutes} دقائق قراءة
            </span>
          )}
          {tags.map((tag) => (
            <span
              key={tag.id || tag.slug}
              className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-neutral-100 dark:bg-neutral-800/80 text-neutral-500 flex items-center gap-1"
            >
              <Tag className="w-3 h-3" />
              {tag.name}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight mb-4 font-display">
          {title}
        </h1>

        {/* Description */}
        {description && (
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans">
            {description}
          </p>
        )}

        {/* Featured Image */}
        {featured_image && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm max-h-80">
            <img
              src={featured_image}
              alt={title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}
      </header>

      {/* Main Markdown Body */}
      {markdown_content && (
        <section className="mb-8">
          <MarkdownRenderer content={markdown_content} />
        </section>
      )}

      {/* Content Blocks (Interactive / Images / Quotes / Tables / Codes) */}
      {content_blocks.length > 0 && (
        <section className="mb-10">
          <ContentBlockRenderer blocks={content_blocks} />
        </section>
      )}

      {/* Custom Child Injections (e.g. Existing Error Cards) */}
      {children && (
        <section className="my-8">
          {children}
        </section>
      )}

      {/* Scientific References Section */}
      {scientific_references.length > 0 && (
        <footer className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-2 mb-4 text-neutral-900 dark:text-neutral-100">
            <BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            <h3 className="text-lg font-bold font-display">المراجع العلمية المعتمدة</h3>
          </div>
          <div className="space-y-3">
            {scientific_references.map((ref, idx) => (
              <div
                key={ref.id || idx}
                className="p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs text-neutral-700 dark:text-neutral-300 flex items-start justify-between gap-4"
              >
                <div>
                  <div className="font-bold text-neutral-900 dark:text-neutral-200">
                    {ref.title} {ref.year ? `(${ref.year})` : ''}
                  </div>
                  {ref.authors && (
                    <div className="text-neutral-500 mt-0.5">{ref.authors}</div>
                  )}
                  {ref.publication && (
                    <div className="text-neutral-400 mt-0.5">{ref.publication}</div>
                  )}
                  {ref.citation_note && (
                    <div className="text-teal-600 dark:text-teal-400 mt-1 font-medium">
                      {ref.citation_note}
                    </div>
                  )}
                </div>
                {ref.url && (
                  <a
                    href={ref.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-teal-600 hover:text-teal-700 dark:text-teal-400 p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </footer>
      )}
    </ScopedCss>
  );
}
