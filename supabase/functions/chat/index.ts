import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'GEMINI_API_KEY is not configured in Edge Functions secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { message, conversationId, history = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(
        JSON.stringify({ success: false, error: 'Message is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `أنت "مساعد الرحلة النفسية" - رفيق ومساعد نفسي داعم ومتعاطف يعتمد على أسس العلاج المعرفي السلوكي (CBT)، علاج القبول والالتزام (ACT)، واليقظة الذهنية (Mindfulness).
هدف الدعم: مساعدة المستخدم على فهم مشاعره، إعادة صياغة الأفكار السلبية، واقتراح تمارين عملية وموجزة.
الأسلوب: دافئ، غير حكمي، محترم، واضح باللغة العربية الفصحى البسيطة.
تحذير: إذا لاحظت مؤشرات على إيذاء النفس أو أزمة طارئة، انصح بلطف بالتواصل مع المختصين وخطوط المساعدة النفسية فوراً.`;

    const contents = [
      ...history.map((h: any) => ({
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

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          messageId: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          conversationId,
          response: replyText
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Edge Function Chat Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
