import {
  EntityRecord,
  AttributeRecord,
  RelationshipRecord,
  DocumentRecord,
  FactRecord,
  ConversationRecord,
  MessageRecord,
  SearchAuditLogRecord
} from './types';
import { normalizeArabicText } from '../processing/arabicNormalizer';

export class MemoryStore {
  private entities: Map<string, EntityRecord> = new Map();
  private attributes: Map<string, AttributeRecord> = new Map();
  private relationships: Map<string, RelationshipRecord> = new Map();
  private documents: Map<string, DocumentRecord> = new Map();
  private facts: Map<string, FactRecord> = new Map();
  private conversations: Map<string, ConversationRecord> = new Map();
  private messages: Map<string, MessageRecord[]> = new Map(); // conversationId -> messages
  private auditLogs: SearchAuditLogRecord[] = [];

  // Indices for sub-millisecond retrieval
  private entityNameIndex: Map<string, string> = new Map(); // normalizedName/alias -> entityId
  private entityAttributesIndex: Map<string, string[]> = new Map(); // entityId -> attributeId[]
  private attributeKeyIndex: Map<string, string[]> = new Map(); // normalizedKey/alias -> attributeId[]
  private categoryIndex: Map<string, string[]> = new Map(); // category -> entityId[]

  constructor() {
    this.rebuildIndices();
  }

  // --- ENTITY METHODS ---
  public addEntity(entity: Omit<EntityRecord, 'createdAt' | 'updatedAt' | 'normalizedName' | 'normalizedAliases'> & { id?: string }): EntityRecord {
    const id = entity.id || `ent_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const normalizedName = normalizeArabicText(entity.name);
    const normalizedAliases = (entity.aliases || []).map(a => normalizeArabicText(a));

    const record: EntityRecord = {
      id,
      name: entity.name,
      normalizedName,
      type: entity.type || 'entity',
      aliases: entity.aliases || [],
      normalizedAliases,
      category: entity.category,
      description: entity.description,
      tags: entity.tags || [],
      metadata: entity.metadata || {},
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    this.entities.set(id, record);
    this.indexEntity(record);
    return record;
  }

  public getEntity(id: string): EntityRecord | undefined {
    return this.entities.get(id);
  }

  public getAllEntities(): EntityRecord[] {
    return Array.from(this.entities.values());
  }

  public findEntityByNameOrAlias(name: string): EntityRecord | undefined {
    const norm = normalizeArabicText(name);
    const id = this.entityNameIndex.get(norm);
    if (id) return this.entities.get(id);

    return undefined;
  }

  public deleteEntity(id: string): boolean {
    const deleted = this.entities.delete(id);
    if (deleted) {
      // Cascade delete attributes
      const attrIds = this.entityAttributesIndex.get(id) || [];
      for (const attrId of attrIds) {
        this.attributes.delete(attrId);
      }
      this.entityAttributesIndex.delete(id);
      this.rebuildIndices();
    }
    return deleted;
  }

  // --- ATTRIBUTE METHODS ---
  public addAttribute(attr: Omit<AttributeRecord, 'id' | 'normalizedKey' | 'normalizedAliases'> & { id?: string }): AttributeRecord {
    const id = attr.id || `attr_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const normalizedKey = normalizeArabicText(attr.key);
    const normalizedAliases = (attr.aliases || []).map(a => normalizeArabicText(a));

    const record: AttributeRecord = {
      id,
      entityId: attr.entityId,
      key: attr.key,
      normalizedKey,
      value: attr.value,
      valueType: attr.valueType || 'string',
      unit: attr.unit,
      aliases: attr.aliases || [],
      normalizedAliases,
      metadata: attr.metadata || {}
    };

    this.attributes.set(id, record);

    // Update entity-attribute index
    const existing = this.entityAttributesIndex.get(attr.entityId) || [];
    if (!existing.includes(id)) {
      existing.push(id);
      this.entityAttributesIndex.set(attr.entityId, existing);
    }

    return record;
  }

  public getAttributesForEntity(entityId: string): AttributeRecord[] {
    const attrIds = this.entityAttributesIndex.get(entityId) || [];
    return attrIds.map(id => this.attributes.get(id)!).filter(Boolean);
  }

  public getAllAttributes(): AttributeRecord[] {
    return Array.from(this.attributes.values());
  }

  // --- RELATIONSHIP METHODS ---
  public addRelationship(rel: Omit<RelationshipRecord, 'id'> & { id?: string }): RelationshipRecord {
    const id = rel.id || `rel_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record: RelationshipRecord = {
      id,
      sourceEntityId: rel.sourceEntityId,
      targetEntityId: rel.targetEntityId,
      relationType: rel.relationType,
      metadata: rel.metadata || {}
    };
    this.relationships.set(id, record);
    return record;
  }

  public getRelationshipsForEntity(entityId: string): RelationshipRecord[] {
    return Array.from(this.relationships.values()).filter(
      r => r.sourceEntityId === entityId || r.targetEntityId === entityId
    );
  }

  public getAllRelationships(): RelationshipRecord[] {
    return Array.from(this.relationships.values());
  }

  // --- DOCUMENT METHODS ---
  public addDocument(doc: Omit<DocumentRecord, 'id' | 'createdAt' | 'normalizedTitle' | 'normalizedContent'> & { id?: string }): DocumentRecord {
    const id = doc.id || `doc_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const normalizedTitle = normalizeArabicText(doc.title);
    const normalizedContent = normalizeArabicText(doc.content);

    const record: DocumentRecord = {
      id,
      title: doc.title,
      normalizedTitle,
      content: doc.content,
      normalizedContent,
      summary: doc.summary,
      category: doc.category,
      tags: doc.tags || [],
      chunks: doc.chunks || [doc.content],
      metadata: doc.metadata || {},
      createdAt: Date.now()
    };

    this.documents.set(id, record);
    return record;
  }

  public getDocument(id: string): DocumentRecord | undefined {
    return this.documents.get(id);
  }

  public getAllDocuments(): DocumentRecord[] {
    return Array.from(this.documents.values());
  }

  public deleteDocument(id: string): boolean {
    return this.documents.delete(id);
  }

  // --- FACT METHODS ---
  public addFact(fact: Omit<FactRecord, 'id' | 'normalizedSubject' | 'normalizedPredicate' | 'normalizedRawText'> & { id?: string }): FactRecord {
    const id = fact.id || `fact_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record: FactRecord = {
      id,
      subject: fact.subject,
      normalizedSubject: normalizeArabicText(fact.subject),
      predicate: fact.predicate,
      normalizedPredicate: normalizeArabicText(fact.predicate),
      object: fact.object,
      rawText: fact.rawText,
      normalizedRawText: normalizeArabicText(fact.rawText),
      category: fact.category,
      metadata: fact.metadata || {}
    };
    this.facts.set(id, record);
    return record;
  }

  public getAllFacts(): FactRecord[] {
    return Array.from(this.facts.values());
  }

  // --- CONVERSATION & MESSAGE METHODS ---
  public getOrCreateConversation(id?: string): ConversationRecord {
    const convId = id || `conv_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    let conv = this.conversations.get(convId);
    if (!conv) {
      conv = {
        id: convId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        activeEntityIds: [],
        previousEntityIds: [],
        state: {},
        messageCount: 0
      };
      this.conversations.set(convId, conv);
      this.messages.set(convId, []);
    }
    return conv;
  }

  public getConversation(id: string): ConversationRecord | undefined {
    return this.conversations.get(id);
  }

  public updateConversation(id: string, updates: Partial<ConversationRecord>): ConversationRecord {
    const conv = this.getOrCreateConversation(id);
    const updated = {
      ...conv,
      ...updates,
      updatedAt: Date.now()
    };
    this.conversations.set(id, updated);
    return updated;
  }

  public addMessage(msg: Omit<MessageRecord, 'id' | 'timestamp'> & { id?: string }): MessageRecord {
    const id = msg.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const record: MessageRecord = {
      id,
      conversationId: msg.conversationId,
      role: msg.role,
      content: msg.content,
      timestamp: Date.now(),
      metadata: msg.metadata || {}
    };

    const convMessages = this.messages.get(msg.conversationId) || [];
    convMessages.push(record);
    this.messages.set(msg.conversationId, convMessages);

    // Update conversation message count
    const conv = this.getConversation(msg.conversationId);
    if (conv) {
      conv.messageCount = convMessages.length;
      conv.updatedAt = Date.now();
    }

    return record;
  }

  public getMessages(conversationId: string, limit?: number): MessageRecord[] {
    const all = this.messages.get(conversationId) || [];
    if (limit && limit > 0) {
      return all.slice(-limit);
    }
    return all;
  }

  // --- AUDIT LOGS ---
  public logSearchAudit(audit: Omit<SearchAuditLogRecord, 'id' | 'timestamp'>): SearchAuditLogRecord {
    const record: SearchAuditLogRecord = {
      id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      timestamp: Date.now(),
      ...audit
    };
    this.auditLogs.unshift(record);
    if (this.auditLogs.length > 500) {
      this.auditLogs.pop();
    }
    return record;
  }

  public getAuditLogs(limit: number = 50): SearchAuditLogRecord[] {
    return this.auditLogs.slice(0, limit);
  }

  // --- STATS & UTILS ---
  public clearAll(): void {
    this.entities.clear();
    this.attributes.clear();
    this.relationships.clear();
    this.documents.clear();
    this.facts.clear();
    this.conversations.clear();
    this.messages.clear();
    this.auditLogs = [];
    this.entityNameIndex.clear();
    this.entityAttributesIndex.clear();
    this.attributeKeyIndex.clear();
    this.categoryIndex.clear();
  }

  public getStats() {
    return {
      entitiesCount: this.entities.size,
      attributesCount: this.attributes.size,
      relationshipsCount: this.relationships.size,
      documentsCount: this.documents.size,
      factsCount: this.facts.size,
      conversationsCount: this.conversations.size,
      auditLogsCount: this.auditLogs.length
    };
  }

  private indexEntity(entity: EntityRecord): void {
    this.entityNameIndex.set(entity.normalizedName, entity.id);
    for (const alias of entity.normalizedAliases) {
      this.entityNameIndex.set(alias, entity.id);
    }
    if (entity.category) {
      const catList = this.categoryIndex.get(entity.category) || [];
      if (!catList.includes(entity.id)) catList.push(entity.id);
      this.categoryIndex.set(entity.category, catList);
    }
  }

  private rebuildIndices(): void {
    this.entityNameIndex.clear();
    this.entityAttributesIndex.clear();
    this.attributeKeyIndex.clear();
    this.categoryIndex.clear();

    for (const entity of this.entities.values()) {
      this.indexEntity(entity);
    }

    for (const attr of this.attributes.values()) {
      const existing = this.entityAttributesIndex.get(attr.entityId) || [];
      if (!existing.includes(attr.id)) {
        existing.push(attr.id);
        this.entityAttributesIndex.set(attr.entityId, existing);
      }
    }
  }
}

// Global Singleton Database Instance
export const db = new MemoryStore();
