// src/components/wellness/FloatingAIChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Send, 
  X, 
  MessageSquare, 
  History, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Sparkles, 
  Settings,
  AlertCircle
} from 'lucide-react';
import Markdown from 'react-markdown';
import { useTheme } from '../../contexts/ThemeContext';
import { conversationService } from '../../services/conversationService';
import { aiService } from '../../services/aiService';
import { getPageSummaryByPath } from '../../data/pagesKnowledge';

export default function FloatingAIChat({ onClose }) {
  const [view, setView] = useState('chat'); // 'chat' | 'history' | 'settings'
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [typing, setTyping] = useState(false);

  const location = useLocation();
  const [currentPageInfo, setCurrentPageInfo] = useState(null);
  const [showSummarizeBtn, setShowSummarizeBtn] = useState(false);

  const { theme, setTheme, resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const username = localStorage.getItem('username') || 'guest';

  // Fetch current page info and pre-written summary
  useEffect(() => {
    const pageData = getPageSummaryByPath(location.pathname);
    if (pageData) {
      setCurrentPageInfo(pageData);
      setShowSummarizeBtn(true);
    } else {
      setShowSummarizeBtn(false);
      setCurrentPageInfo(null);
    }
  }, [location.pathname]);

  // Load conversations list on initial mount only
  useEffect(() => {
    initChat();
  }, []);

  // When switching to history view, refresh the list
  useEffect(() => {
    if (view === 'history') {
      refreshConversationsList();
    }
  }, [view]);

  // Handle auto-scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages, typing]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const refreshConversationsList = async () => {
    setHistoryLoading(true);
    try {
      const list = await conversationService.getConversations();
      setConversations(list || []);
    } catch (err) {
      console.warn('Failed to refresh conversations:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const initChat = async () => {
    setHistoryLoading(true);
    try {
      const conversationsData = await conversationService.getConversations();
      setConversations(conversationsData || []);
      
      if (conversationsData && conversationsData.length > 0) {
        const first = conversationsData[0];
        const details = await conversationService.getConversationDetails(first.id);
        if (details?.conversation) {
          setCurrentConversation(details.conversation);
          setMessages(details.messages || []);
        } else {
          setCurrentConversation(first);
          setMessages([]);
        }
      } else {
        const newConv = await conversationService.createConversation('محادثة جديدة');
        if (newConv) {
          setCurrentConversation(newConv);
          setMessages([]);
          setConversations([newConv]);
        }
      }
    } catch (err) {
      console.error('Failed to init chat conversations:', err);
      const fallbackConv = {
        id: `conv_${Date.now()}`,
        title: 'محادثة جديدة',
        messageCount: 0,
        created_at: new Date().toISOString()
      };
      setCurrentConversation(fallbackConv);
      setConversations([fallbackConv]);
      setMessages([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  const selectConversation = async (convId) => {
    if (!convId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await conversationService.getConversationDetails(convId);
      if (result) {
        setCurrentConversation(result.conversation);
        setMessages(result.messages || []);
        setView('chat');
      }
    } catch (err) {
      setError('تعذر تحميل هذه المحادثة.');
      console.error('Failed to select conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNewConversation = async () => {
    setLoading(true);
    setError(null);
    try {
      const newConv = await conversationService.createConversation('محادثة جديدة');
      if (newConv) {
        setCurrentConversation(newConv);
        setMessages([]);
        setConversations(prev => [newConv, ...prev.filter(c => c.id !== newConv.id)]);
        setView('chat');
      }
    } catch (err) {
      setError('تعذر إنشاء محادثة جديدة.');
      console.error('Failed to create conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteConversation = async (e, convId) => {
    e.stopPropagation();
    if (!window.confirm('هل أنت متأكد من حذف هذه المحادثة بالكامل؟')) return;

    try {
      await conversationService.deleteConversation(convId);
      const remaining = conversations.filter(c => c.id !== convId);
      setConversations(remaining);

      if (currentConversation?.id === convId) {
        if (remaining.length > 0) {
          selectConversation(remaining[0].id);
        } else {
          const fresh = await conversationService.createConversation('محادثة جديدة');
          setCurrentConversation(fresh);
          setMessages([]);
          setConversations([fresh]);
        }
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  };

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading || typing) return;

    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    let convId = currentConversation?.id;
    if (!convId) {
      const fresh = await conversationService.createConversation('محادثة جديدة');
      setCurrentConversation(fresh);
      setConversations(prev => [fresh, ...prev]);
      convId = fresh.id;
    }

    const tempUserMsg = {
      id: `user_${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    conversationService.saveMessage(convId, tempUserMsg).catch(() => {});
    setTyping(true);
    setError(null);

    try {
      let assistantMsgId = `ai_${Date.now()}`;
      let hasChunk = false;

      const result = await aiService.sendMessage({
        message: text,
        conversationId: convId,
        history: messages.slice(-10),
        userId: username,
        stream: true,
        onChunk: (token, fullText) => {
          if (!hasChunk) {
            hasChunk = true;
            setTyping(false);
            setMessages(prev => [
              ...prev,
              {
                id: assistantMsgId,
                conversationId: convId,
                role: 'assistant',
                content: fullText,
                timestamp: Date.now()
              }
            ]);
          } else {
            setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m));
          }
        }
      });

      if (result && (result.success || result.response || result.data?.response)) {
        const replyText = result.data?.response || result.response || 'شكراً لتواصلك معي.';
        const finalMsgId = result.data?.messageId || assistantMsgId;
        const assistantMsg = {
          id: finalMsgId,
          conversationId: convId,
          role: 'assistant',
          content: replyText,
          timestamp: Date.now()
        };

        if (hasChunk) {
          setMessages(prev => prev.map(m => m.id === assistantMsgId ? assistantMsg : m));
        } else {
          setMessages(prev => [...prev, assistantMsg]);
        }
        conversationService.saveMessage(convId, assistantMsg).catch(() => {});

        if (!currentConversation?.title || currentConversation?.title === 'محادثة جديدة') {
          const updatedTitle = text.length > 25 ? text.substring(0, 22) + '...' : text;
          setCurrentConversation(prev => prev ? { ...prev, title: updatedTitle } : null);
          setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: updatedTitle } : c));
        }
      } else {
        setError(result?.error || 'عذرًا، حدث خطأ أثناء معالجة رسالتك.');
      }
    } catch (err) {
      setError('تعذر إرسال الرسالة، يرجى التحقق من اتصالك بالإنترنت.');
      console.error('Chat error:', err);
    } finally {
      setTyping(false);
    }
  };

  const handleSummarizePageDirectly = async (pageTitle) => {
    if (loading || typing) return;

    let convId = currentConversation?.id;
    if (!convId) {
      const fresh = await conversationService.createConversation(`تلخيص ${pageTitle}`);
      setCurrentConversation(fresh);
      setConversations(prev => [fresh, ...prev]);
      convId = fresh.id;
    }

    const text = `لخص لي صفحة: ${pageTitle}`;

    const tempUserMsg = {
      id: `user_${Date.now()}`,
      conversationId: convId,
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, tempUserMsg]);
    conversationService.saveMessage(convId, tempUserMsg).catch(() => {});
    setTyping(true);
    setError(null);

    try {
      let assistantMsgId = `ai_${Date.now()}`;
      let hasChunk = false;

      const result = await aiService.sendMessage({
        message: text,
        conversationId: convId,
        history: messages.slice(-10),
        userId: username,
        stream: true,
        onChunk: (token, fullText) => {
          if (!hasChunk) {
            hasChunk = true;
            setTyping(false);
            setMessages(prev => [
              ...prev,
              {
                id: assistantMsgId,
                conversationId: convId,
                role: 'assistant',
                content: fullText,
                timestamp: Date.now()
              }
            ]);
          } else {
            setMessages(prev => prev.map(m => m.id === assistantMsgId ? { ...m, content: fullText } : m));
          }
        }
      });

      if (result && (result.success || result.response || result.data?.response)) {
        const replyText = result.data?.response || result.response || 'إليك تلخيص الصفحة المطلوبة.';
        const finalMsgId = result.data?.messageId || assistantMsgId;
        const assistantMsg = {
          id: finalMsgId,
          conversationId: convId,
          role: 'assistant',
          content: replyText,
          timestamp: Date.now()
        };

        if (hasChunk) {
          setMessages(prev => prev.map(m => m.id === assistantMsgId ? assistantMsg : m));
        } else {
          setMessages(prev => [...prev, assistantMsg]);
        }
        conversationService.saveMessage(convId, assistantMsg).catch(() => {});

        if (!currentConversation?.title || currentConversation?.title === 'محادثة جديدة') {
          const updatedTitle = `تلخيص ${pageTitle}`;
          setCurrentConversation(prev => prev ? { ...prev, title: updatedTitle } : null);
          setConversations(prev => prev.map(c => c.id === convId ? { ...c, title: updatedTitle } : c));
        }
      } else {
        setError(result?.error || 'عذرًا، حدث خطأ أثناء تلخيص الصفحة.');
      }
    } catch (err) {
      setError('تعذر الحصول على الملخص، يرجى التحقق من اتصالك بالإنترنت.');
      console.error('Summarize error:', err);
    } finally {
      setTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div dir="rtl" className="premium-chat-panel-container">
      {/* SCOPED DESIGN TOKENS — pulled from the app's Nile & Clay system.
          CTA/accent uses the Deep Palm variant, never Nile Clay (that stays
          reserved for rare small accents elsewhere in the app). */}
      <style>{`
        .premium-chat-panel {
          --font-display: 'Alexandria', 'Tajawal', sans-serif;
          --font-body: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif;
          --font-mono: 'Space Mono', monospace;

          --chat-bg: ${isDark ? 'rgba(26, 23, 20, 0.95)' : 'rgba(250, 247, 242, 0.97)'};
          --chat-surface: ${isDark ? 'rgba(219, 203, 182, 0.06)' : 'rgba(219, 203, 182, 0.28)'};
          --chat-text: ${isDark ? '#FAF7F2' : '#2A2724'};
          --chat-muted: ${isDark ? '#A89E92' : '#6B6259'};
          --chat-border: ${isDark ? 'rgba(250, 247, 242, 0.08)' : 'rgba(42, 39, 36, 0.10)'};
          --chat-accent: ${isDark ? '#4A8F6B' : '#2C4C3B'};
          --chat-accent-hover: ${isDark ? '#5CA37D' : '#3E7A5A'};
          --chat-error: ${isDark ? '#C4574A' : '#A13D2E'};
          --chat-error-bg: ${isDark ? 'rgba(196, 87, 74, 0.12)' : 'rgba(161, 61, 46, 0.08)'};
          --chat-shadow: ${isDark ? '0 25px 50px -12px rgba(15, 12, 10, 0.6)' : '0 20px 40px -15px rgba(42, 39, 36, 0.14)'};
          --chat-input-bg: ${isDark ? 'rgba(36, 32, 28, 0.9)' : 'rgba(255, 253, 250, 0.9)'};

          background-color: var(--chat-bg);
          color: var(--chat-text);
          box-shadow: var(--chat-shadow);
          font-family: var(--font-body);
        }

        .premium-chat-panel h3,
        .premium-chat-panel h4 {
          font-family: var(--font-display);
        }

        .premium-chat-panel time,
        .premium-chat-panel .chat-meta-numeral {
          font-family: var(--font-mono);
        }
        
        .premium-chat-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .premium-chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .premium-chat-scrollbar::-webkit-scrollbar-thumb {
          background: ${isDark ? 'rgba(250, 247, 242, 0.10)' : 'rgba(42, 39, 36, 0.12)'};
          border-radius: 9999px;
        }
        .premium-chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'rgba(250, 247, 242, 0.18)' : 'rgba(42, 39, 36, 0.20)'};
        }

        /* Links inside AI responses — Deep Palm, not emerald */
        .markdown-body a {
          color: var(--chat-accent);
          background-color: ${isDark ? 'rgba(74, 143, 107, 0.12)' : 'rgba(44, 76, 59, 0.08)'};
          padding: 2px 8px;
          border-radius: 6px;
          font-weight: 700;
          text-decoration: underline;
          text-underline-offset: 3px;
          border: 1px solid ${isDark ? 'rgba(74, 143, 107, 0.2)' : 'rgba(44, 76, 59, 0.15)'};
          transition: background-color 0.2s ease, border-color 0.2s ease;
          display: inline-block;
          margin: 1px 2px;
        }
        .markdown-body a:hover {
          background-color: ${isDark ? 'rgba(74, 143, 107, 0.2)' : 'rgba(44, 76, 59, 0.14)'};
          border-color: var(--chat-accent);
        }
      `}</style>

      {/* CHAT MAIN SHELL — no ambient glow orbs, no gradient logo box.
          Motion is limited to the panel's single entrance and the typing
          indicator; everything else is static. */}
      <div 
        className="premium-chat-panel fixed inset-0 sm:absolute sm:inset-auto sm:bottom-0 sm:left-0 sm:w-[440px] sm:h-[620px] rounded-none sm:rounded-[20px] overflow-hidden flex flex-col border border-[var(--chat-border)] z-50 select-none animate-in fade-in slide-in-from-bottom-2 duration-200"
      >
        {/* 1. HEADER */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--chat-border)] shrink-0">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--chat-accent)] shrink-0" />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-semibold tracking-tight text-[var(--chat-text)]">مستشارك الذكي</h4>
              </div>
              <p className="text-[9px] text-[var(--chat-muted)] truncate max-w-[170px] mt-0.5">
                {view === 'chat' ? (currentConversation?.title || 'محادثة ذكية') : view === 'history' ? 'سجل المحادثات' : 'مظهر الواجهة'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-0.5 shrink-0">
            {/* New Chat Button */}
            <button
              onClick={handleNewConversation}
              className="size-8 rounded-full hover:bg-[var(--chat-surface)] text-[var(--chat-muted)] hover:text-[var(--chat-text)] flex items-center justify-center transition-colors cursor-pointer"
              title="محادثة جديدة"
            >
              <Plus size={16} />
            </button>

            {/* History Button */}
            <button
              onClick={() => setView(view === 'history' ? 'chat' : 'history')}
              className={`size-8 rounded-full hover:bg-[var(--chat-surface)] flex items-center justify-center transition-colors cursor-pointer ${
                view === 'history' ? 'text-[var(--chat-accent)] bg-[var(--chat-surface)]' : 'text-[var(--chat-muted)] hover:text-[var(--chat-text)]'
              }`}
              title="سجل المحادثات"
            >
              <History size={15} />
            </button>

            {/* Settings Button */}
            <button
              onClick={() => setView(view === 'settings' ? 'chat' : 'settings')}
              className={`size-8 rounded-full hover:bg-[var(--chat-surface)] flex items-center justify-center transition-colors cursor-pointer ${
                view === 'settings' ? 'text-[var(--chat-accent)] bg-[var(--chat-surface)]' : 'text-[var(--chat-muted)] hover:text-[var(--chat-text)]'
              }`}
              title="المظهر"
            >
              <Settings size={15} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="size-8 rounded-full hover:bg-[var(--chat-surface)] text-[var(--chat-muted)] hover:text-[var(--chat-error)] flex items-center justify-center transition-colors cursor-pointer"
              title="إغلاق"
            >
              <X size={15} />
            </button>
          </div>
        </div>

        {/* 2. CHAT SCROLLVIEW */}
        {view === 'chat' && (
          <React.Fragment>
            <div className="flex-1 p-5 overflow-y-auto space-y-5 premium-chat-scrollbar">
              {messages.length === 0 && !loading && (
                /* EMPTY STATE */
                <div className="h-full flex flex-col items-center justify-center text-center px-6 py-8 space-y-6 flex-1 select-none">
                  <div className="size-12 rounded-[14px] bg-[var(--chat-accent)] flex items-center justify-center overflow-hidden">
                    <img 
                      src="/ChatGPT_Image_Jul_19_2025_06_34_59_PM.svg" 
                      alt="شعار المساعد الذكي" 
                      className="w-8 h-8 object-contain"
                      referrerPolicy="no-referrer" 
                    />
                  </div>

                  <div className="space-y-2 max-w-xs">
                    <h3 className="text-base font-bold tracking-tight text-[var(--chat-text)]">
                      مرحباً بك، لنبدأ المحادثة
                    </h3>
                    <p className="text-[11px] text-[var(--chat-muted)] leading-relaxed max-w-[240px] mx-auto">
                      أنا مساعدك النفسي الذكي. كيف يمكنني مساندتك اليوم في رحلة السكينة والتعافي؟
                    </p>
                  </div>

                  {/* Suggestion tags list */}
                  <div className="w-full max-w-sm pt-4 space-y-2.5">
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { title: "عجلة المشاعر", query: "عجلة المشاعر" },
                        { title: "تنفس 4-7-8", query: "تمرين التنفس المهدئ (4-7-8)" },
                        { title: "سجل CBT", query: "سجل الأفكار المعرفي والتحليل (CBT)" },
                        { title: "نافذة التحمل", query: "نافذة التحمل العصبي" }
                      ].map((item) => (
                        <button
                          key={item.title}
                          type="button"
                          onClick={() => handleSummarizePageDirectly(item.query)}
                          className="px-3 py-2 text-center rounded-full bg-[var(--chat-surface)] hover:bg-[var(--chat-border)] border border-[var(--chat-border)] text-[11px] font-medium text-[var(--chat-text)] hover:text-[var(--chat-accent)] transition-colors cursor-pointer truncate"
                        >
                          {item.title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Array */}
              {messages.length > 0 && (
                <div className="space-y-5">
                  {messages.map((m, idx) => {
                    const isUser = m.role === 'user';
                    return (
                      <div 
                        key={m.id || idx}
                        className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} gap-1.5`}
                      >
                        <div 
                          className={`max-w-[85%] rounded-[18px] px-4 py-3 text-[13px] leading-relaxed ${
                            isUser 
                              ? 'bg-[var(--chat-accent)] text-white rounded-br-sm font-medium' 
                              : 'bg-[var(--chat-surface)] border border-[var(--chat-border)] text-[var(--chat-text)] rounded-bl-sm'
                          }`}
                        >
                          {isUser ? (
                            <p className="whitespace-pre-wrap">{m.content}</p>
                          ) : (
                            <div className="markdown-body select-text">
                              <Markdown>{m.content}</Markdown>
                            </div>
                          )}
                        </div>
                        <time className="text-[9px] text-[var(--chat-muted)] px-1 select-none">
                          {new Date(m.timestamp || Date.now()).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })}
                        </time>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Typing Animation — the one earned, functional animation on this screen */}
              {typing && (
                <div className="flex items-start gap-1.5">
                  <div className="bg-[var(--chat-surface)] border border-[var(--chat-border)] rounded-[18px] rounded-bl-sm px-4 py-3.5 flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-[var(--chat-accent)] animate-bounce [animation-delay:-0.3s]" />
                    <span className="size-1.5 rounded-full bg-[var(--chat-accent)] animate-bounce [animation-delay:-0.15s]" />
                    <span className="size-1.5 rounded-full bg-[var(--chat-accent)] animate-bounce" />
                  </div>
                </div>
              )}

              {/* Errors Container */}
              {error && (
                <div className="p-3.5 rounded-[14px] bg-[var(--chat-error-bg)] border border-[var(--chat-error)]/25 flex items-start gap-2.5 text-[var(--chat-error)]">
                  <AlertCircle size={15} className="shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-normal">{error}</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* 3. INPUT PANEL */}
            <div className="p-4 shrink-0">
              {/* Quick page-summary suggestion */}
              {showSummarizeBtn && currentPageInfo && (
                <div className="flex items-center justify-between gap-2 px-2 pb-2.5">
                  <button
                    type="button"
                    onClick={() => handleSummarizePageDirectly(currentPageInfo.title)}
                    disabled={loading || typing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--chat-surface)] hover:bg-[var(--chat-border)] text-[var(--chat-accent)] border border-[var(--chat-border)] transition-colors text-[11px] font-semibold cursor-pointer disabled:opacity-40"
                    title={`عرض ملخص مسبق لصفحة ${currentPageInfo.title}`}
                  >
                    <Sparkles size={11} className="text-[var(--chat-accent)] shrink-0" />
                    <span>لخص لي هذه الصفحة: {currentPageInfo.title}</span>
                  </button>
                  <span className="text-[9px] text-[var(--chat-muted)] font-medium">ملخص ذكي متوفر</span>
                </div>
              )}

              {/* Input bar */}
              <div className="relative flex items-center bg-[var(--chat-input-bg)] border border-[var(--chat-border)] rounded-full p-1.5 focus-within:border-[var(--chat-accent)]/40 transition-colors">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="اسأل مستشارك النفسي..."
                  rows={1}
                  className="flex-1 bg-transparent border-0 outline-none focus:ring-0 text-xs sm:text-[13px] text-[var(--chat-text)] placeholder-[var(--chat-muted)] resize-none max-h-24 px-4 py-2 leading-relaxed rounded-full"
                />
                
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || typing || loading}
                  className="size-8 rounded-full bg-[var(--chat-accent)] hover:bg-[var(--chat-accent-hover)] text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Send size={13} className="shrink-0 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </React.Fragment>
        )}

        {/* 4. CONVERSATION HISTORY VIEW */}
        {view === 'history' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 shrink-0 border-b border-[var(--chat-border)]">
              <button
                onClick={handleNewConversation}
                className="w-full py-2.5 bg-[var(--chat-accent)] hover:bg-[var(--chat-accent-hover)] text-white font-bold text-xs rounded-full flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus size={14} />
                <span>بدء محادثة جديدة</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-2.5 premium-chat-scrollbar">
              {historyLoading ? (
                <div className="space-y-2 p-1">
                  {[1, 2, 3].map((n) => (
                    <div key={n} className="h-14 bg-[var(--chat-surface)] rounded-[14px] border border-[var(--chat-border)] animate-pulse" />
                  ))}
                </div>
              ) : conversations.length === 0 ? (
                <p className="text-xs text-[var(--chat-muted)] text-center py-10 select-none">لا توجد محادثات سابقة بعد.</p>
              ) : (
                conversations.map((c) => {
                  const isActive = currentConversation?.id === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => selectConversation(c.id)}
                      className={`group p-3.5 rounded-[14px] border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                        isActive 
                          ? 'bg-[var(--chat-surface)] border-[var(--chat-accent)] text-[var(--chat-accent)]' 
                          : 'bg-transparent hover:bg-[var(--chat-surface)] border-[var(--chat-border)] text-[var(--chat-text)]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <MessageSquare size={14} className="shrink-0 text-[var(--chat-accent)]" />
                        <div className="min-w-0 text-right">
                          <h4 className="text-xs font-semibold truncate max-w-[180px] text-[var(--chat-text)]">
                            {c.title || 'محادثة سياقية'}
                          </h4>
                          <p className="text-[9px] text-[var(--chat-muted)] mt-0.5">
                            <span className="chat-meta-numeral">{c.messageCount || 0}</span> رسائل • {new Date(c.updated_at || c.updatedAt || c.created_at || c.createdAt || Date.now()).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={(e) => handleDeleteConversation(e, c.id)}
                          className="size-7 rounded-full hover:bg-[var(--chat-border)] text-[var(--chat-muted)] hover:text-[var(--chat-error)] flex items-center justify-center transition-colors cursor-pointer"
                          title="حذف المحادثة"
                        >
                          <Trash2 size={12} />
                        </button>
                        <ChevronRight size={14} className="text-[var(--chat-muted)] ltr:rotate-180" />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 5. SETTINGS VIEW */}
        {view === 'settings' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-6 premium-chat-scrollbar">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[var(--chat-text)]">إعدادات مظهر المحادثة</h3>
              <p className="text-[11px] text-[var(--chat-muted)] leading-relaxed">تغيير السمة اللونية للدردشة والموقع بالكامل</p>
            </div>

            <div className="space-y-2.5">
              {[
                { id: 'dark', name: 'الوضع الداكن (Dark)', desc: 'ألوان داكنة دافئة مريحة للعين ليلاً' },
                { id: 'light', name: 'الوضع المضيء (Light)', desc: 'خلفية ورقية فاتحة ونصوص عالية التباين' },
                { id: 'system', name: 'تلقائي مع النظام (System)', desc: 'مزامنة السمة تلقائياً حسب تفضيلات نظام جهازك' }
              ].map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={`w-full p-3.5 rounded-[14px] border text-right transition-colors cursor-pointer flex flex-col gap-1 ${
                      isSelected 
                        ? 'bg-[var(--chat-surface)] border-[var(--chat-accent)] text-[var(--chat-text)]' 
                        : 'bg-transparent border-[var(--chat-border)] text-[var(--chat-muted)] hover:bg-[var(--chat-surface)]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-[var(--chat-accent)]' : 'text-[var(--chat-text)]'}`}>
                        {t.name}
                      </span>
                      {isSelected && <span className="size-1.5 rounded-full bg-[var(--chat-accent)]" />}
                    </div>
                    <span className="text-[10px] text-[var(--chat-muted)] leading-normal mt-0.5">{t.desc}</span>
                  </button>
                );
              })}
            </div>
            
            <div className="pt-4">
              <button
                onClick={() => setView('chat')}
                className="w-full py-2.5 rounded-full bg-[var(--chat-accent)] hover:bg-[var(--chat-accent-hover)] text-white text-xs font-bold transition-colors cursor-pointer text-center"
              >
                العودة للدردشة
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}