/* global process */
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Basic authorization check
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing in environment variables.');
      return res.status(500).json({ error: 'AI provider is not configured properly.' });
    }

    const { rawText, instructions } = req.body;

    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `أنت مساعد ذكي مهمتك تنسيق النصوص وتحويلها إلى Markdown منظم وجذاب لمدونة للصحة النفسية.
قم باستخدام العناوين (H2, H3)، القوائم النقطية، والـ Bold للمصطلحات الهامة.
يمكنك أيضاً استخدام Callouts عبر الـ syntax التالي:
:::note
عنوان الملاحظة (اختياري)
محتوى الملاحظة
:::
الأنواع المتاحة: note, warning, success, danger.

${instructions ? `تعليمات إضافية من المستخدم: ${instructions}` : ''}

قم بإرجاع النص المنسق فقط بالـ Markdown بدون أي مقدمات أو خاتمة.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `الرجاء تنسيق هذا النص:\n\n${rawText}`,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    return res.status(200).json({ markdown: response.text || '' });
  } catch (error) {
    console.error('Vercel API Format Markdown Error:', error);
    return res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
}
