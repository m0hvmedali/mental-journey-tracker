import { db } from '../database/memoryStore';
import { normalizeArabicText } from '../processing/arabicNormalizer';
import { tokenize, stringSimilarity } from '../processing/tokenizer';

export interface DetectedEntityResult {
  entityId: string;
  name: string;
  matchedText: string;
  confidence: number;
  isDirectMatch: boolean;
}

export class EntityDetector {
  /**
   * Detect all entities mentioned in user query
   */
  public static detectEntities(query: string): DetectedEntityResult[] {
    const detected: DetectedEntityResult[] = [];
    const norm = normalizeArabicText(query);
    if (!norm) return detected;

    // Sort entities so longer (more specific) entities match first (e.g. iPhone 15 Pro before iPhone 15)
    const allEntities = [...db.getAllEntities()].sort((a, b) => b.normalizedName.length - a.normalizedName.length);

    for (const entity of allEntities) {
      // 1. Exact or Substring match on canonical name
      if (norm === entity.normalizedName) {
        detected.push({
          entityId: entity.id,
          name: entity.name,
          matchedText: entity.name,
          confidence: 1.0,
          isDirectMatch: true
        });
        continue;
      }

      // 2. Exact or Substring match on aliases (sorted by length descending)
      const sortedAliases = [...entity.normalizedAliases].sort((a, b) => b.length - a.length);
      let matchedAlias: string | null = null;
      for (const alias of sortedAliases) {
        if (norm === alias || norm.includes(alias)) {
          matchedAlias = alias;
          break;
        }
      }

      if (matchedAlias) {
        detected.push({
          entityId: entity.id,
          name: entity.name,
          matchedText: matchedAlias,
          confidence: 0.96,
          isDirectMatch: true
        });
        continue;
      }

      if (norm.includes(entity.normalizedName)) {
        detected.push({
          entityId: entity.id,
          name: entity.name,
          matchedText: entity.name,
          confidence: 0.95,
          isDirectMatch: true
        });
        continue;
      }

      // 3. Fuzzy match for typos
      const sim = stringSimilarity(norm, entity.normalizedName);
      if (sim >= 0.78) {
        detected.push({
          entityId: entity.id,
          name: entity.name,
          matchedText: entity.name,
          confidence: Number((sim * 0.85).toFixed(2)),
          isDirectMatch: false
        });
      }
    }

    // Deduplicate: If both specific (e.g. iPhone 15 Pro) and generic (iPhone 15) matched, keep the most specific unless separate in query
    const filtered: DetectedEntityResult[] = [];
    for (const d of detected) {
      const isSubsumed = detected.some(other =>
        other.entityId !== d.entityId &&
        other.name.length > d.name.length &&
        other.name.toLowerCase().includes(d.name.toLowerCase())
      );
      if (!isSubsumed) {
        filtered.push(d);
      }
    }

    // Sort descending by confidence
    return filtered.sort((a, b) => b.confidence - a.confidence);
  }
}
