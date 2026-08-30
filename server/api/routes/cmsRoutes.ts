import { Router } from 'express';
import { supabase } from '../../database/supabaseClient';
import { LLMRouter } from '../../llm/llmRouter';

const router = Router();

// GET all content items (optionally filtered by type/status)
router.get('/items', async (req, res) => {
  try {
    const { status, type } = req.query;
    let query = supabase.from('content_items').select('id, slug, title, content_type, status, created_at, category');
    
    if (status) query = query.eq('status', status);
    if (type) query = query.eq('content_type', type);
    
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    if (error) throw error;
    
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET a specific item by slug
router.get('/items/:slug', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .select('*, content_templates(name, configuration)')
      .eq('slug', req.params.slug)
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST a new content item
router.post('/items', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .insert([req.body])
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT (update) a content item
router.put('/items/:id', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('content_items')
      .update({ ...req.body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();
      
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE a content item
router.delete('/items/:id', async (req, res) => {
  try {
    const { error } = await supabase
      .from('content_items')
      .delete()
      .eq('id', req.params.id);
      
    if (error) throw error;
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET all templates
router.get('/templates', async (req, res) => {
  try {
    const { data, error } = await supabase.from('content_templates').select('*');
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST to format raw text to Markdown using AI
router.post('/format-markdown', async (req, res) => {
  try {
    const { rawText, instructions } = req.body;
    
    if (!rawText) {
      return res.status(400).json({ error: 'rawText is required' });
    }

    const systemPrompt = `أنت مساعد ذكي مهمتك تنسيق النصوص وتحويلها إلى Markdown منظم وجذاب لمدونة للصحة النفسية.
قم باستخدام العناوين (H2, H3)، القوائم النقطية، والـ Bold للمصطلحات الهامة.
يمكنك أيضاً استخدام Callouts عبر الـ syntax التالي:
:::note
عنوان الملاحظة (اختياري)
محتوى الملاحظة
:::
الأنواع المتاحة: note, warning, success, danger.

${instructions ? `تعليمات إضافية من المستخدم: ${instructions}` : ''}

قم بإرجاع النص المنسق فقط بالـ Markdown بدون أي مقدمات.`;

    const llmResponse = await LLMRouter.generate({
      systemPrompt,
      userMessage: `الرجاء تنسيق هذا النص:\n\n${rawText}`,
      provider: 'gemini'
    });
    
    res.json({ markdown: llmResponse.content });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
