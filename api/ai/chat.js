/* global process */
import { GoogleGenAI } from '@google/genai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Basic authorization check to prevent completely open access if authorization header is provided
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing in environment variables.');
      return res.status(500).json({ success: false, error: 'AI provider is not configured properly.' });
    }

    const { message, conversationId, history = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `أنت "مساعد الرحلة النفسية" - رفيق ومساعد نفسي داعم ومتعاطف يعتمد على أسس العلاج المعرفي السلوكي (CBT)، علاج القبول والالتزام (ACT)، واليقظة الذهنية (Mindfulness).
هدف الدعم: مساعدة المستخدم على فهم مشاعره، إعادة صياغة الأفكار السلبية، واقتراح تمارين عملية وموجزة.
الأسلوب: دافئ، غير حكمي، محترم، واضح باللغة العربية الفصحى البسيطة.
تحذير: إذا لاحظت مؤشرات على إيذاء النفس أو أزمة طارئة، انصح بلطف بالتواصل مع المختصين وخطوط المساعدة النفسية فوراً.`;

    const contents = [
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      }
    });

    const replyText = response.text || 'عذراً، لم أتمكن من توليد الرد حالياً.';

    return res.status(200).json({
      success: true,
      data: {
        messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        conversationId,
        response: replyText
      }
    });
  } catch (error) {
    console.error('Vercel API Chat Error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Internal Server Error' });
  }
}
