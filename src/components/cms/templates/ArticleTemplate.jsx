import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

export default function ArticleTemplate({ item }) {
  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <header className="mb-12 text-center">
        {item.category && (
          <span className="inline-block py-1 px-3 rounded-full bg-accent-soft text-accent-primary text-sm font-semibold mb-4">
            {item.category}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
          {item.title}
        </h1>
        {item.subtitle && (
          <p className="text-xl text-text-secondary max-w-2xl mx-auto font-serif-display">
            {item.subtitle}
          </p>
        )}
        {item.cover_image && (
          <img 
            src={item.cover_image} 
            alt={item.title}
            className="w-full h-[400px] object-cover rounded-2xl mt-8 shadow-sm"
          />
        )}
      </header>

      <div className="bg-surface p-6 sm:p-10 rounded-3xl shadow-sm border border-border-subtle">
        <MarkdownRenderer content={item.content_markdown} />
      </div>

      {item.author && (
        <div className="mt-12 pt-8 border-t border-border-subtle text-center text-text-muted">
          بقلم: {item.author}
        </div>
      )}
    </article>
  );
}
