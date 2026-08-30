// src/components/content/ContentBlockRenderer.jsx
import React from 'react';
import MarkdownRenderer from '@/components/cms/MarkdownRenderer';
import { RenderInteractiveComponent } from '@/components/interactive/InteractiveRegistry';
import { Quote, AlertCircle, Info, CheckCircle2, AlertTriangle, Code2, Table, Dumbbell, PlayCircle, Music } from 'lucide-react';

/**
 * Universal Content Block Renderer
 * Renders structured content blocks with graceful fallbacks and strict type safety.
 */
export default function ContentBlockRenderer({ blocks = [] }) {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null;

  // Sort blocks safely by position
  const sortedBlocks = [...blocks].sort((a, b) => (Number(a?.position) || 0) - (Number(b?.position) || 0));

  return (
    <div className="reading-surface space-y-6 my-6 text-right">
      {sortedBlocks.map((block, idx) => {
        if (!block) return null;
        const blockType = block.block_type || 'markdown';
        const payload = block.payload || {};
        const metadata = block.metadata || {};
        const key = block.id || `block-${idx}`;

        try {
          switch (blockType) {
            case 'markdown':
              return (
                <div key={key} className="content-block-markdown">
                  <MarkdownRenderer content={payload.content || payload.text || payload.markdown || ''} />
                </div>
              );

            case 'interactive_component':
              return (
                <div key={key} className="content-block-interactive">
                  <RenderInteractiveComponent
                    componentKey={payload.component || payload.key}
                    props={payload.props || {}}
                    metadata={metadata}
                  />
                </div>
              );

            case 'image':
              return (
                <figure key={key} className="my-6 text-center">
                  <img
                    src={payload.url || payload.src || '/article-by3DYy7JylaR.webp'}
                    alt={payload.alt || metadata.title || ''}
                    className="rounded-2xl max-h-96 w-full object-cover shadow-sm mx-auto border border-border-subtle"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                  {(payload.caption || metadata.caption) && (
                    <figcaption className="text-xs text-text-muted mt-2">
                      {payload.caption || metadata.caption}
                    </figcaption>
                  )}
                </figure>
              );

            case 'quote': {
              const quoteText = payload.text || payload.quote || '';
              const author = payload.author || metadata.author || '';
              return (
                <blockquote
                  key={key}
                  className="my-6 p-4 rounded-xl border-r-4 border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-neutral-800 dark:text-neutral-200 text-sm leading-relaxed"
                >
                  <div className="flex items-start gap-2.5">
                    <Quote className="w-4 h-4 text-teal-600 shrink-0 mt-1 rotate-180" />
                    <div>
                      <p className="font-semibold">{quoteText}</p>
                      {author && (
                        <cite className="block text-xs text-neutral-500 mt-1.5 not-italic">
                          — {author}
                        </cite>
                      )}
                    </div>
                  </div>
                </blockquote>
              );
            }

            case 'callout': {
              const calloutType = payload.type || 'info';
              const title = payload.title || metadata.title || '';
              const text = payload.text || payload.message || payload.content || '';

              const styles = {
                warning: 'border-amber-300 bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200',
                danger: 'border-rose-300 bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200',
                success: 'border-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200',
                info: 'border-teal-300 bg-teal-50/70 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200',
                note: 'border-teal-300 bg-teal-50/70 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200'
              };

              const Icons = {
                warning: AlertTriangle,
                danger: AlertCircle,
                success: CheckCircle2,
                info: Info,
                note: Info
              };

              const Icon = Icons[calloutType] || Info;

              return (
                <div
                  key={key}
                  className={`my-6 p-4 rounded-xl border text-sm leading-relaxed flex items-start gap-3 ${styles[calloutType] || styles.info}`}
                >
                  <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    {title && <div className="font-bold mb-1 font-display">{title}</div>}
                    <div>{text}</div>
                  </div>
                </div>
              );
            }

            case 'code':
              return (
                <div key={key} className="my-6 rounded-xl border border-border-subtle bg-surface-elevated overflow-hidden text-left" dir="ltr">
                  <div className="bg-surface px-4 py-2 border-b border-border-subtle flex items-center justify-between text-xs text-text-muted">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Code2 className="w-3.5 h-3.5" />
                      {payload.language || 'text'}
                    </span>
                    {payload.caption && <span className="text-[11px]">{payload.caption}</span>}
                  </div>
                  <pre className="p-4 text-xs font-mono text-text-primary overflow-x-auto">
                    <code>{payload.code || ''}</code>
                  </pre>
                </div>
              );

            case 'table': {
              const headers = payload.headers || [];
              const rows = payload.rows || [];
              return (
                <div key={key} className="my-6 overflow-x-auto rounded-xl border border-border-subtle bg-surface">
                  <table className="w-full text-xs text-right border-collapse">
                    {headers.length > 0 && (
                      <thead>
                        <tr className="border-b border-border-subtle bg-surface-elevated/60">
                          {headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-3 font-bold text-text-primary">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {rows.map((row, rIdx) => (
                        <tr key={rIdx} className="border-b border-border-subtle/50 hover:bg-surface-hover transition-colors">
                          {Array.isArray(row) ? row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-3 text-text-secondary">
                              {cell}
                            </td>
                          )) : (
                            <td className="p-3 text-text-secondary">{String(row)}</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {payload.caption && (
                    <div className="p-2 text-center text-xs text-text-muted border-t border-border-subtle">
                      {payload.caption}
                    </div>
                  )}
                </div>
              );
            }

            case 'exercise': {
              const prompt = payload.prompt || payload.instructions || '';
              const steps = payload.steps || [];
              const tips = payload.tips || [];
              return (
                <div key={key} className="my-6 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/30 dark:bg-emerald-950/10 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <Dumbbell className="w-4 h-4" />
                    <span>{payload.title || metadata.title || 'تمرين إكلينيكي موجه'}</span>
                  </div>
                  {prompt && <p className="text-xs sm:text-sm text-text-primary leading-relaxed">{prompt}</p>}
                  {steps.length > 0 && (
                    <ol className="list-decimal list-inside text-xs text-text-secondary space-y-1.5 pr-2">
                      {steps.map((step, sIdx) => (
                        <li key={sIdx}>{step}</li>
                      ))}
                    </ol>
                  )}
                  {tips.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-emerald-500/20 text-xs text-text-muted">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">نصيحة تطبيقية: </span>
                      {tips.join(' • ')}
                    </div>
                  )}
                </div>
              );
            }

            case 'video':
            case 'audio':
              return (
                <div key={key} className="my-6 p-4 rounded-xl border border-border-subtle bg-surface flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {blockType === 'video' ? <PlayCircle className="w-6 h-6 text-teal-600" /> : <Music className="w-6 h-6 text-teal-600" />}
                    <div>
                      <div className="text-xs font-bold text-text-primary">{payload.title || metadata.title || 'ملف وسائط'}</div>
                      {payload.caption && <div className="text-[11px] text-text-muted">{payload.caption}</div>}
                    </div>
                  </div>
                  {payload.url && (
                    <a
                      href={payload.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                    >
                      فتح الوسائط
                    </a>
                  )}
                </div>
              );

            default:
              console.warn(`[ContentBlockRenderer] Unhandled block type: "${blockType}"`);
              return (
                <div key={key} className="p-3 rounded-lg border border-border-subtle bg-surface text-xs text-text-muted">
                  كتلة محتوى: {blockType}
                </div>
              );
          }
        } catch (err) {
          console.error(`[ContentBlockRenderer] Error rendering block #${idx}:`, err);
          return null;
        }
      })}
    </div>
  );
}
