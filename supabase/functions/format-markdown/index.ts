import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenAI } from "npm:@google/genai";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY is not configured in Edge Functions secrets.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { rawText, instructions } = await req.json();

    if (!rawText) {
      return new Response(
        JSON.stringify({ error: 'rawText is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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

    return new Response(
      JSON.stringify({ markdown: response.text || '' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Edge Function Format Markdown Error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Internal Server Error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
