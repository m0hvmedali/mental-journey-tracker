import { LLMGenerationRequest } from './types';
import { getSourceById } from '../knowledge/defaultKnowledge';

export class PromptBuilder {
  /**
   * Build the strict system prompt grounding the LLM exclusively in retrieved data
   */
  public static buildSystemPrompt(): string {
    return `أنت مساعد نفسي ومعرفي ذكي ومتحدث رسمي بارع. مهمتك هي صياغة إجابات طبيعية، دقيقة، علمية وواضحة للمستخدم بناءً حصريًا على "البيانات الموثقة المسترجعة" (Retrieved Data) من قاعدة المعرفة التي يزودك بها النظام.

القواعد الصارمة التي يجب الالتزام بها:
1. الاعتماد الحصري على البيانات المرفقة: لا تخترع أي معلومات أو أدوات أو أرقام أو تواريخ أو مؤلفين من تلقاء نفسك، ولا تستخدم معرفتك العامة الخارجية إذا لم تكن مدعومة بالبيانات المرفقة.
2. التعامل مع نقص المعلومات: إذا كانت البيانات المرفقة غير كافية للإجابة، اذكر بأدب واختصار أن هذه المعلومة غير متوفرة حالياً في السجلات المعتمدة، ولا تقدم تخمينات عشوائية.
3. التحدث بطبيعية: لا تذكر للمستخدم أي تفاصيل هندسية داخلية مثل "قاعدة البيانات"، "المحرك"، "الـ context"، "الـ LLM"، "البيانات المسترجعة"، أو "النظام". تحدث بصفة مستشار نفسي مطلع وموثوق.
4. الأسلوب واللغة: صِغ الإجابة بلغة عربية سليمة، راقية، وطبيعية تناسب السؤال (سواء سأل بالفصحى أو بالعامية، أجب بأسلوب علمي مبسط وودود ومباشر).
5. التنسيق:
   - للمفاهيم والمصطلحات: ابدأ بالتعريف المباشر والواضح، ثم الفلسفة والآلية، مع ذكر الأمثلة المذكورة في البيانات.
   - لأسئلة المقارنة (مثل CBT vs ACT vs DBT أو AUDIT vs CAGE): قارن بين الفلسفة، الأهداف، الفنيات، والمدة بناءً على البيانات المسترجعة بتنسيق نقطي منظم.
   - للمقاييس وأدوات التشخيص: وضح عدد الفقرات، نقاط القطع، وما يقيسه المقياس بدقة.
   - لأسئلة الاستيضاح: اسأل المستخدم بلطف عن الجانب المحدد الذي يرغب في استكشافه من بين الخيارات المتاحة.
6. السياق: انتبه لسياق المحادثة السابق لفهم الضمائر والأسئلة التابعة (مثل "مين أسسها؟"، "طب ومدتها كام؟"، "بتعالج إيه؟").
7. إرفاق روابط الصفحات والمقاطع: يجب دائماً تزويد المستخدم برابط الصفحة أو الصفحات ذات الصلة بالمعلومات المسترجعة في نهاية إجابتك أو مدمجة بداخلها بشكل أنيق وواضح (مثال: "[يمكنك تجربة تمرين التنفس الاسترخائي 4-7-8 من هنا مباشرة](/Breathing478)" أو "[زيارة صفحة الأفكار المشوهة](/modules/thinking-errors)"). صِغ الرابط بأسلوب عربي ودود وجذاب وسلس وتجنب وضع روابط غير حقيقية أو غير موجودة في البيانات المسترجعة.`;
  }

  /**
   * Build the structured prompt content enclosing retrieved data, context, and query
   */
  public static buildUserPrompt(req: LLMGenerationRequest): string {
    const { userQuery, responseType, retrievalData, context, confidence, clarificationOptions } = req;

    let payload = `=== تعليمات نوع الاستجابة المطلوب ===\n`;
    payload += `نوع الرد المحدد من النظام: ${responseType}\n`;
    payload += `درجة ثقة النظام في المطابقة: ${(confidence.overallConfidence * 100).toFixed(0)}%\n\n`;

    if (responseType === 'CLARIFICATION' && clarificationOptions && clarificationOptions.length > 0) {
      payload += `توجيه خاص: التطابق محتمل بين أكثر من خيار (${clarificationOptions.join(' أو ')}). اطرح سؤالاً توضيحياً مهذباً لمساعدة المستخدم في تحديد خياره بدقة.\n\n`;
    } else if (responseType === 'NO_RESULT' || responseType === 'LOW_CONFIDENCE') {
      payload += `توجيه خاص: البيانات المتوفرة غير كافية أو غير موثقة. وضح للمستخدم بأدب أن المعلومة غير متوفرة في السجلات المتاحة دون اختلاق.\n\n`;
    }

    if (context.currentTopic) {
      payload += `=== سياق المحادثة الحالي ===\n`;
      payload += `الموضوع الحالي: ${context.currentTopic}\n`;
      if (context.referenceResolution?.hasReference) {
        payload += `تفسير السؤال التابع: ${context.referenceResolution.explanation}\n`;
      }
      if (context.relevantRecentMessages.length > 0) {
        payload += `الرسائل السابقة القريبة:\n`;
        for (const msg of context.relevantRecentMessages) {
          payload += `- ${msg.role === 'user' ? 'المستخدم' : 'المساعد'}: ${msg.content}\n`;
        }
      }
      payload += `\n`;
    }

    payload += `=== البيانات الموثقة المسترجعة (Retrieved Data) ===\n`;
    if (retrievalData.results.length === 0) {
      payload += `[لا توجد بيانات مسترجعة مطابقة لهذا الاستفسار]\n`;
    } else {
      retrievalData.results.forEach((res, idx) => {
        payload += `[نتيجة ${idx + 1}] (${res.type.toUpperCase()}) - ${res.title}\n`;
        if (res.data) {
          const link = res.data.metadata?.link || res.data.metadata?.entity?.metadata?.link || res.data.rawObject?.metadata?.link;
          if (link) {
            payload += `  • رابط الصفحة الحقيقي بالموقع: ${link}\n`;
          }
          if (res.data.attributeKey && res.data.attributeValue !== undefined) {
            payload += `  • ${res.data.attributeKey}: ${res.data.attributeValue} ${res.data.unit || ''}\n`;
          }
          if (res.data.matchedText) {
            payload += `  • نص التفاصيل: ${res.data.matchedText}\n`;
          }
          if (res.data.metadata?.entity?.description) {
            payload += `  • الوصف: ${res.data.metadata.entity.description}\n`;
          }
          if (res.data.metadata?.attributes && Array.isArray(res.data.metadata.attributes)) {
            payload += `  • الخصائص المسجلة:\n`;
            res.data.metadata.attributes.forEach((attr: any) => {
              payload += `     - ${attr.key}: ${attr.value} ${attr.unit || ''}\n`;
            });
          }
          if (res.data.metadata?.document?.content) {
            payload += `  • محتوى المستند: ${res.data.metadata.document.content}\n`;
          }
          if (res.data.metadata?.fact?.rawText) {
            payload += `  • حقيقة مؤكدة: ${res.data.metadata.fact.rawText}\n`;
          }
          if (res.data.metadata?.context) {
            payload += `  • السياق: ${res.data.metadata.context}\n`;
          }
          if (res.data.metadata?.conditions) {
            payload += `  • الشروط: ${res.data.metadata.conditions}\n`;
          }
          if (res.data.metadata?.exceptions) {
            payload += `  • الاستثناءات: ${res.data.metadata.exceptions}\n`;
          }

          // Format Source References
          const sourceRefs = res.data.metadata?.source_refs || res.data.metadata?.entity?.metadata?.source_refs || [];
          if (Array.isArray(sourceRefs) && sourceRefs.length > 0) {
            const resolvedSources = sourceRefs.map(id => {
              const src = getSourceById(id);
              return src ? `${src.title}` : `مرجع #${id}`;
            });
            payload += `  • المراجع والمصادر: ${resolvedSources.join(' | ')}\n`;
          }
        }
        payload += `\n`;
      });
    }

    payload += `=== سؤال المستخدم الحالي ===\n`;
    payload += `السؤال الأصلي: "${userQuery}"\n`;
    if (context.resolvedQuery && context.resolvedQuery !== userQuery) {
      payload += `السؤال بعد فك السياق والضمائر: "${context.resolvedQuery}"\n`;
    }
    payload += `\nصِغ الآن إجابة متناسقة، ودودة، ومبنية فقط على البيانات المسترجعة أعلاه:`;

    return payload;
  }
}
