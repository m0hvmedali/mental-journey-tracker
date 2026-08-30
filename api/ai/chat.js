/* global process */
import { aiServerService } from './service.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method Not Allowed' });
  }

  // Basic authorization check
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const { message, conversationId, history = [], stream = false } = req.body || {};

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'Message is required' });
    }

    const systemInstruction = `أنت "مساعد الرحلة النفسية" - رفيق ومساعد نفسي داعم ومتعاطف يعتمد على أسس العلاج المعرفي السلوكي (CBT)، علاج القبول والالتزام (ACT)، واليقظة الذهنية (Mindfulness).
هدف الدعم: مساعدة المستخدم على فهم مشاعره، إعادة صياغة الأفكار السلبية، واقتراح تمارين عملية وموجزة.
الأسلوب: دافئ، غير حكمي، محترم، واضح باللغة العربية الفصحى البسيطة.
تحذير: إذا لاحظت مؤشرات على إيذاء النفس أو أزمة طارئة، انصح بلطف بالتواصل مع المختصين وخطوط المساعدة النفسية فوراً.`;

    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    if (stream) {
      // Set Server-Sent Events headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');
      if (res.flushHeaders) res.flushHeaders();

      try {
        const { response, provider } = await aiServerService.chat({
          message,
          history,
          systemInstruction,
          stream: true,
          onToken: (token) => {
            res.write(`data: ${JSON.stringify({ type: 'token', content: token })}\n\n`);
          }
        });

        res.write(`data: ${JSON.stringify({ type: 'done', messageId, conversationId, response, provider })}\n\n`);
        res.end();
      } catch (streamErr) {
        console.error('[API Chat Stream Error]', streamErr);
        res.write(`data: ${JSON.stringify({ type: 'error', error: streamErr.message || 'Streaming failed' })}\n\n`);
        res.end();
      }
    } else {
      const { response, provider } = await aiServerService.chat({
        message,
        history,
        systemInstruction,
        stream: false
      });

      return res.status(200).json({
        success: true,
        data: {
          messageId,
          conversationId,
          response: response || 'عذراً، لم أتمكن من توليد الرد حالياً.',
          provider
        }
      });
    }
  } catch (error) {
    console.error('API Chat Handler Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal Server Error'
    });
  }
}
