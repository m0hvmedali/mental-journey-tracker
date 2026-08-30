import React from 'react';
import MarkdownRenderer from '../MarkdownRenderer';

export default function ModuleTemplate({ item }) {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 flex flex-col md:flex-row gap-12">
      <div className="md:w-1/3">
        <div className="sticky top-24 bg-surface-elevated p-6 rounded-2xl border border-border-subtle">
          <h2 className="text-2xl font-display font-bold text-accent-primary mb-4">
            {item.title}
          </h2>
          {item.excerpt && (
            <p className="text-text-secondary leading-relaxed mb-6">
              {item.excerpt}
            </p>
          )}
          {item.category && (
            <div className="text-sm font-semibold text-accent-palm bg-accent-palm/10 inline-block px-3 py-1 rounded-full">
              {item.category}
            </div>
          )}
        </div>
      </div>
      
      <div className="md:w-2/3">
        <div className="bg-surface p-8 sm:p-12 rounded-3xl shadow-sm border border-border-subtle">
          <MarkdownRenderer content={item.content_markdown} />
        </div>
      </div>
    </div>
  );
}
