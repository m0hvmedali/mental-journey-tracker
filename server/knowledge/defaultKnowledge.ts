// server/knowledge/defaultKnowledge.ts

import { db } from '../database/memoryStore';
import { PAGES_CORPUS } from './pagesKnowledge';

export interface SourceReference {
  id: string | number;
  title: string;
  type?: string;
  url_details?: string;
}

// Global registry of all source references
const allSourcesMap = new Map<string, SourceReference>();

export function registerSources(sources: any[]): void {
  if (!sources || !Array.isArray(sources)) return;
  for (const s of sources) {
    if (s && s.id !== undefined) {
      allSourcesMap.set(String(s.id), {
        id: s.id,
        title: s.title || '',
        type: s.type,
        url_details: s.url_details
      });
    }
  }
}

export function getSourceById(id: string | number): SourceReference | undefined {
  return allSourcesMap.get(String(id));
}

export function getAllSources(): SourceReference[] {
  return Array.from(allSourcesMap.values());
}

/**
 * Seed the MemoryStore with the comprehensive Pages Corpus from our website.
 */
export function seedDefaultKnowledge(): void {
  // 1. Register pages as source references
  const sources = PAGES_CORPUS.map(page => ({
    id: page.id,
    title: page.title,
    type: "صفحة_موقع",
    url_details: page.link
  }));
  registerSources(sources);

  // 2. Ingest all pages into the MemoryStore
  for (const page of PAGES_CORPUS) {
    // Add page as an Entity
    db.addEntity({
      id: page.id,
      name: page.title,
      type: 'Page',
      aliases: page.aliases,
      category: page.category,
      description: page.description,
      metadata: {
        link: page.link,
        summary: page.summary,
        source_refs: [page.id]
      }
    });

    // Add page as an Attribute for exact key lookup (e.g. searching "ملخص صفحة X")
    db.addAttribute({
      entityId: page.id,
      key: "ملخص_الصفحة",
      value: page.summary,
      valueType: "string",
      aliases: ["ملخص", "تلخيص", "الموجز", "summary", "summarize"],
      metadata: {
        source_refs: [page.id]
      }
    });

    // Add page as a Document for BM25 and exact text searches
    db.addDocument({
      id: page.id,
      title: page.title,
      content: `${page.title} - ${page.category}. ${page.description} الملخص: ${page.summary}`,
      category: page.category,
      tags: page.aliases,
      metadata: {
        link: page.link,
        summary: page.summary,
        source_refs: [page.id]
      }
    });
  }

  console.log(`[KnowledgeBase] Successfully indexed ${PAGES_CORPUS.length} website pages into memory store.`);
}
