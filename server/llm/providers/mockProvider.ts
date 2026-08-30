import { LLMProvider, LLMGenerationRequest, LLMGenerationResponse } from '../types';
import { getConfig } from '../../config/chatbot.config';

export class MockProvider implements LLMProvider {
  name = 'mock';

  public isAvailable(): boolean {
    return true; // Always available
  }

  public async generateResponse(request: LLMGenerationRequest): Promise<LLMGenerationResponse> {
    const startTime = Date.now();
    const { responseType, retrievalData, context, clarificationOptions, userQuery } = request;
    const config = getConfig().response;

    let naturalText = '';

    switch (responseType) {
      case 'GREETING': {
        naturalText = 'أهلاً وسهلاً بك! كيف يمكنني مساعدتك اليوم؟ يمكنك سؤالي عن المنتجات، المواصفات، الأسعار، أو أي تفاصيل مسجلة في قاعدة المعرفة.';
        break;
      }

      case 'NO_RESULT':
      case 'LOW_CONFIDENCE': {
        naturalText = config.fallbackMessageAr || 'عذرًا، لم أتمكن من العثور على معلومات مؤكدة للإجابة على هذا الاستفسار في السجلات المتاحة.';
        break;
      }

      case 'CLARIFICATION': {
        if (clarificationOptions && clarificationOptions.length >= 2) {
          naturalText = `هل تقصد ${clarificationOptions[0]} أم ${clarificationOptions[1]}؟ يرجى التحديد لأتمكن من إفادتك بدقة.`;
        } else {
          naturalText = 'هل يمكنك توضيح استفسارك بمزيد من التفاصيل؟';
        }
        break;
      }

      case 'COMPARISON': {
        const entities = retrievalData.results.filter(r => r.type === 'entity' || r.data.entityName);
        if (entities.length >= 2) {
          naturalText = `إليك مقارنة مبنية على البيانات المسجلة بين ${entities[0].title} و ${entities[1].title}:\n\n`;
          for (const ent of entities) {
            naturalText += `📌 **${ent.title}**:\n`;
            if (ent.data?.metadata?.attributes) {
              for (const attr of ent.data.metadata.attributes) {
                naturalText += `- ${attr.key}: ${attr.value} ${attr.unit || ''}\n`;
              }
            } else if (ent.data?.matchedText) {
              naturalText += `- ${ent.data.matchedText}\n`;
            }
            naturalText += `\n`;
          }
        } else {
          naturalText = 'المقارنة تتطلب تحديد كيانين مسجلين على الأقل في قاعدة البيانات.';
        }
        break;
      }

      case 'CONTEXTUAL_ANSWER':
      case 'DIRECT_ANSWER':
      default: {
        if (retrievalData.results.length === 0) {
          naturalText = config.fallbackMessageAr;
          break;
        }

        const topResult = retrievalData.results[0];

        // Specific Attribute match (e.g. price, foundation_date)
        if (topResult.type === 'attribute' || (topResult.data?.attributeKey && topResult.data?.attributeValue !== undefined)) {
          const entName = topResult.data.entityName || (context.activeEntities[0]?.name) || '';
          const attrKey = topResult.data.attributeKey;
          const val = topResult.data.attributeValue;
          const unit = topResult.data.unit ? ` ${topResult.data.unit}` : '';

          if (attrKey === 'price') {
            const formattedPrice = typeof val === 'number' ? Number(val).toLocaleString('ar-EG') : val;
            naturalText = `${entName ? `سعر ${entName} هو ` : 'السعر هو '}${formattedPrice}${unit}.`;
          } else if (attrKey === 'foundation_date') {
            naturalText = `${entName ? `تأسست ${entName} في ` : 'تاريخ التأسيس هو '}${val}.`;
          } else if (attrKey === 'founder') {
            naturalText = `${entName ? `مؤسس ${entName} هو ` : 'المؤسس هو '}${val}.`;
          } else if (attrKey === 'location') {
            naturalText = `${entName ? `مقر ${entName} يقع في: ` : 'المقر يقع في: '}${val}.`;
          } else if (attrKey === 'release_date') {
            naturalText = `${entName ? `تاريخ إصدار ${entName} هو ` : 'تم الإصدار في '}${val}.`;
          } else {
            naturalText = `${entName ? `بالنسبة لـ ${entName}، ` : ''}${attrKey}: ${val}${unit}.`;
          }

          // If there are other rich attributes or description, mention them concisely
          if (topResult.data?.metadata?.entity?.description) {
            naturalText += `\n\n${topResult.data.metadata.entity.description}`;
          }
        } else if (topResult.type === 'entity') {
          const ent = topResult.data?.metadata?.entity;
          const attrs = topResult.data?.metadata?.attributes || [];

          naturalText = `**${topResult.title}**:\n${ent?.description || topResult.data?.matchedText || ''}\n\n`;
          if (attrs.length > 0) {
            naturalText += `أهم التفاصيل المتاحة:\n`;
            for (const a of attrs.slice(0, 5)) {
              naturalText += `• ${a.key}: ${a.value} ${a.unit || ''}\n`;
            }
          }
        } else if (topResult.type === 'document') {
          naturalText = `وفقاً للمستند (${topResult.title}):\n${topResult.data?.metadata?.document?.content || topResult.data?.matchedText}`;
        } else if (topResult.type === 'fact') {
          naturalText = topResult.data?.matchedText || topResult.title;
        } else {
          naturalText = topResult.data?.matchedText || topResult.title;
        }
        break;
      }
    }

    const latencyMs = Date.now() - startTime;
    return {
      content: naturalText.trim(),
      provider: 'mock-synthesizer',
      model: 'local-rule-synthesizer',
      latencyMs,
      isFallback: true
    };
  }
}
