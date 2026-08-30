// src/components/cms/MarkdownRenderer.jsx
import React from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkDirective from 'remark-directive';
import { visit } from 'unist-util-visit';
import { Info, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper to sanitize link URLs and prevent javascript: / data: execution vectors
function isSafeUrl(url) {
  if (!url || typeof url !== 'string') return false;
  const clean = url.trim().toLowerCase();
  if (clean.startsWith('javascript:') || clean.startsWith('vbscript:') || clean.startsWith('data:text/html')) {
    return false;
  }
  return true;
}

// Plugin to handle directives (:::note, :::warning, etc.)
function remarkDirectiveRehype() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        const data = node.data || (node.data = {});
        const hast = h(node.name, node.attributes);
        data.hName = hast.tagName;
        data.hProperties = hast.properties;
      }
    });
  };
}

// Simple h function for unist
function h(name, attributes) {
  return { tagName: name, properties: attributes || {} };
}

// Custom Callout Component
const Callout = ({ type, title, children }) => {
  const types = {
    note: { icon: Info, cls: 'bg-blue-50/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-100' },
    warning: { icon: AlertTriangle, cls: 'bg-yellow-50/50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-900 dark:text-yellow-100' },
    success: { icon: CheckCircle, cls: 'bg-green-50/50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-900 dark:text-green-100' },
    danger: { icon: AlertCircle, cls: 'bg-red-50/50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-900 dark:text-red-100' },
  };

  const current = types[type] || types.note;
  const Icon = current.icon;

  return (
    <div className={cn('my-6 p-4 rounded-xl border flex gap-3', current.cls)}>
      <Icon className="w-6 h-6 shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && <h4 className="font-bold mb-1 font-display">{title}</h4>}
        <div className="text-sm/relaxed opacity-90">{children}</div>
      </div>
    </div>
  );
};

export default function MarkdownRenderer({ content, className }) {
  if (!content || typeof content !== 'string') return null;

  return (
    <div className={cn("reading-surface markdown-body prose dark:prose-invert max-w-none font-sans text-right", className)}>
      <Markdown
        remarkPlugins={[remarkGfm, remarkDirective, remarkDirectiveRehype]}
        components={{
          // Directives
          note: ({ children, title }) => <Callout type="note" title={title}>{children}</Callout>,
          warning: ({ children, title }) => <Callout type="warning" title={title}>{children}</Callout>,
          success: ({ children, title }) => <Callout type="success" title={title}>{children}</Callout>,
          danger: ({ children, title }) => <Callout type="danger" title={title}>{children}</Callout>,

          // Standard elements styling override
          h1: ({node, ...props}) => <h1 className="text-3xl md:text-4xl font-display font-bold text-accent-primary mb-6" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-2xl md:text-3xl font-display font-bold text-accent-primary mt-10 mb-4" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-xl md:text-2xl font-display font-bold text-accent-primary mt-8 mb-3" {...props} />,
          p: ({node, ...props}) => <p className="leading-relaxed mb-4 text-text-secondary" {...props} />,
          ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-2 text-text-secondary pr-2" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-2 text-text-secondary pr-2" {...props} />,
          li: ({node, ...props}) => <li className="pr-1" {...props} />,
          a: ({node, href, ...props}) => {
            const safeHref = isSafeUrl(href) ? href : '#';
            return (
              <a
                href={safeHref}
                target={safeHref.startsWith('http') ? '_blank' : undefined}
                rel={safeHref.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="text-teal-600 dark:text-teal-400 hover:underline transition-colors font-medium"
                {...props}
              />
            );
          },
          blockquote: ({node, ...props}) => (
            <blockquote className="border-r-4 border-accent-primary pr-4 py-1 my-6 bg-surface-elevated rounded-l-lg opacity-90 italic text-text-secondary" {...props} />
          ),
          img: ({node, src, ...props}) => {
            const safeSrc = isSafeUrl(src) ? src : '';
            if (!safeSrc) return null;
            return (
              <img
                src={safeSrc}
                className="rounded-xl mx-auto my-8 shadow-md max-w-full border border-border-subtle"
                referrerPolicy="no-referrer"
                loading="lazy"
                {...props}
              />
            );
          }
        }}
      >
        {content}
      </Markdown>
    </div>
  );
}
