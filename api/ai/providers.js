/* global process */
import { GoogleGenAI } from '@google/genai';
import { Ollama } from 'ollama';

/**
 * Base AI Provider Interface
 */
export class BaseAIProvider {
  async chat({ message, history = [], systemInstruction, stream = false, onToken }) {
    throw new Error('chat method not implemented');
  }

  async formatMarkdown({ rawText, instructions }) {
    throw new Error('formatMarkdown method not implemented');
  }
}

/**
 * Gemini Provider implementation using @google/genai SDK
 */
export class GeminiProvider extends BaseAIProvider {
  constructor(apiKey) {
    super();
    this.name = 'gemini';
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.model = process.env.GEMINI_MODEL || 'gemini-3.5-flash';
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  _getAIInstance() {
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables.');
    }
    return new GoogleGenAI({ apiKey: this.apiKey });
  }

  _buildContents(message, history) {
    return [
      ...history.map((h) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content || '' }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];
  }

  async chat({ message, history = [], systemInstruction, stream = false, onToken }) {
    const ai = this._getAIInstance();
    const contents = this._buildContents(message, history);

    const config = {
      systemInstruction,
      temperature: 0.7,
    };

    if (stream && typeof onToken === 'function') {
      const responseStream = await ai.models.generateContentStream({
        model: this.model,
        contents,
        config
      });

      let fullText = '';
      for await (const chunk of responseStream) {
        const textToken = chunk.text || '';
        if (textToken) {
          fullText += textToken;
          onToken(textToken);
        }
      }
      return fullText;
    } else {
      const response = await ai.models.generateContent({
        model: this.model,
        contents,
        config
      });
      return response.text || '';
    }
  }

  async formatMarkdown({ rawText, instructions }) {
    const ai = this._getAIInstance();
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
      model: this.model,
      contents: `الرجاء تنسيق هذا النص:\n\n${rawText}`,
      config: {
        systemInstruction,
        temperature: 0.3,
      }
    });

    return response.text || '';
  }
}

/**
 * Ollama Cloud / Server Provider implementation using official `ollama` package
 */
export class OllamaProvider extends BaseAIProvider {
  constructor(apiKey, host, model) {
    super();
    this.name = 'ollama';
    this.apiKey = apiKey || process.env.OLLAMA_API_KEY;
    this.host = host || process.env.OLLAMA_HOST || 'https://ollama.com';
    this.model = model || process.env.OLLAMA_MODEL || 'gpt-oss:120b';
    this._client = null;
  }

  isConfigured() {
    return Boolean(this.apiKey);
  }

  _getOllamaClient() {
    if (!this.apiKey) {
      throw new Error('OLLAMA_API_KEY is not configured in environment variables.');
    }
    if (!this._client) {
      this._client = new Ollama({
        host: this.host,
        headers: {
          Authorization: 'Bearer ' + this.apiKey,
        },
      });
    }
    return this._client;
  }

  _buildMessages(message, history = [], systemInstruction = '') {
    const messages = [];

    if (systemInstruction) {
      messages.push({
        role: 'system',
        content: systemInstruction
      });
    }

    for (const h of history) {
      messages.push({
        role: h.role === 'assistant' ? 'assistant' : 'user',
        content: h.content || ''
      });
    }

    messages.push({
      role: 'user',
      content: message
    });

    return messages;
  }

  async chat({ message, history = [], systemInstruction, stream = false, onToken }) {
    const client = this._getOllamaClient();
    const messages = this._buildMessages(message, history, systemInstruction);

    try {
      if (stream && typeof onToken === 'function') {
        const response = await client.chat({
          model: this.model,
          messages,
          stream: true,
        });

        let fullText = '';
        for await (const part of response) {
          const token = part.message?.content || '';
          if (token) {
            fullText += token;
            onToken(token);
          }
        }
        return fullText;
      } else {
        const response = await client.chat({
          model: this.model,
          messages,
          stream: false,
        });

        return response.message?.content || '';
      }
    } catch (err) {
      throw new Error(`Ollama Provider Error: ${err.message || err}`);
    }
  }

  async formatMarkdown({ rawText, instructions }) {
    const client = this._getOllamaClient();
    const systemInstruction = `أنت مساعد ذكي مهمتك تنسيق النصوص وتحويلها إلى Markdown منظم وجذاب لمدونة للصحة النفسية.
قم باستخدام العناوين (H2, H3)، القوائم النقطية، والـ Bold للمصطلحات الهامة.
${instructions ? `تعليمات إضافية: ${instructions}` : ''}
قم بإرجاع النص المنسق فقط بالـ Markdown بدون أي مقدمات أو خاتمة.`;

    const messages = [
      { role: 'system', content: systemInstruction },
      { role: 'user', content: `الرجاء تنسيق هذا النص:\n\n${rawText}` }
    ];

    try {
      const response = await client.chat({
        model: this.model,
        messages,
        stream: false,
      });

      return response.message?.content || rawText;
    } catch (err) {
      throw new Error(`Ollama Format Error: ${err.message || err}`);
    }
  }
}
