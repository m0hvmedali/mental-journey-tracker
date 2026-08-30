import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

export default function MinimalTemplate({ item }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-display font-bold text-text-primary mb-2">
        {item.title}
      </h1>
      {item.subtitle && (
        <p className="text-lg text-text-secondary mb-8">
          {item.subtitle}
        </p>
      )}
      <div className="mt-8">
        <MarkdownRenderer content={item.content_markdown} />
      </div>
    </div>
  );
}
