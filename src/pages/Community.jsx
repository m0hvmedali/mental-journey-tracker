// src/pages/Community.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, RefreshCw, Database, Copy, Check } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { getUserProfile } from '../utils/progress';

export default function Community() {
  const nav = useNavigate();
  const profile = getUserProfile();
  const [senderName, setSenderName] = useState(profile?.name || 'ملاحق الذات');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Database messages state
  const [allMessages, setAllMessages] = useState([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);

  // Enji mode & preview state
  const [isEnjiMode, setIsEnjiMode] = useState(false);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  // SQL Script to create community_messages table in Supabase
  const sqlScript = `-- 1. إنشاء جدول community_messages في Supabase
CREATE TABLE IF NOT EXISTS public.community_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL,
  user_id TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ts BIGINT
);

-- 2. تفعيل الحماية والأمان RLS
ALTER TABLE public.community_messages ENABLE ROW LEVEL SECURITY;

-- 3. السماح للجميع بقراءة وإضافة الرسائل
CREATE POLICY "Allow public read access" ON public.community_messages FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.community_messages FOR INSERT WITH CHECK (true);`;

  // Detect if logged in user is Enji / Engi / إنجي / انجى / admin
  useEffect(() => {
    const username = localStorage.getItem('username') || profile?.name || '';
    const nameLower = username.trim().toLowerCase();
    const isEnjiName =
      nameLower.includes('enji') ||
      nameLower.includes('engi') ||
      nameLower.includes('إنجي') ||
      nameLower.includes('انجى') ||
      nameLower.includes('admin') ||
      nameLower.includes('أدمن');

    setIsEnjiMode(isEnjiName);
  }, [senderName, profile?.name]);

  // Load messages from Supabase + localStorage
  const fetchMessages = async () => {
    setIsLoadingMessages(true);
    let loadedList = [];

    // 1. Try fetching from Supabase
    try {
      const { data, error } = await supabase
        .from('community_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        loadedList = data;
      }
    } catch (err) {
      console.warn('Supabase fetch failed or table missing, using local storage:', err);
    }

    // 2. Load from localStorage as fallback/addition
    try {
      const localRaw = localStorage.getItem('community_messages');
      const localList = localRaw ? JSON.parse(localRaw) : [];

      // Merge unique messages by fingerprint & id
      const mergedMap = new Map();
      const seenFingerprints = new Set();

      [...loadedList, ...localList].forEach(item => {
        if (!item || !item.message) return;

        const idKey = item.id ? String(item.id) : null;
        const usernameStr = (item.username || '').trim().toLowerCase();
        const msgStr = (item.message || '').trim();
        const timeRef = item.ts || (item.created_at ? new Date(item.created_at).getTime() : 0);
        // Time window bucket of 15 seconds to group identical submits
        const timeBucket = Math.floor(timeRef / 15000);
        const contentFingerprint = `${usernameStr}___${msgStr}___${timeBucket}`;

        if (idKey && mergedMap.has(idKey)) {
          return;
        }

        if (seenFingerprints.has(contentFingerprint)) {
          return;
        }

        const primaryKey = idKey || contentFingerprint;
        mergedMap.set(primaryKey, item);
        seenFingerprints.add(contentFingerprint);
        if (idKey) {
          mergedMap.set(idKey, item);
        }
      });

      const finalMerged = Array.from(new Set(mergedMap.values())).sort((a, b) => {
        const timeA = new Date(a.created_at || a.ts || 0).getTime();
        const timeB = new Date(b.created_at || b.ts || 0).getTime();
        return timeB - timeA;
      });

      // Update localStorage with clean deduplicated list
      try {
        localStorage.setItem('community_messages', JSON.stringify(finalMerged));
      } catch { /* ignore fallback error */ }

      setAllMessages(finalMerged);
    } catch {
      setAllMessages(loadedList);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Submit new message to DB
  const handleSubmitMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSubmitting) return;

    setIsSubmitting(true);

    const now = Date.now();
    const msgId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `msg_${now}_${Math.random().toString(36).substring(2, 7)}`;

    const payload = {
      id: msgId,
      username: senderName.trim() || 'فاعل خير',
      user_id: profile?.username || senderName.trim() || 'anon',
      message: message.trim(),
      ts: now,
      created_at: new Date(now).toISOString()
    };

    // 1. Save locally to localStorage first for instant reliability
    try {
      const localRaw = localStorage.getItem('community_messages');
      const currentLocal = localRaw ? JSON.parse(localRaw) : [];

      // Filter out any duplicate that matches exact same message and username within 15s
      const filteredLocal = currentLocal.filter(item => {
        const sameUser = (item.username || '').trim() === payload.username;
        const sameMsg = (item.message || '').trim() === payload.message;
        const itemTime = item.ts || (item.created_at ? new Date(item.created_at).getTime() : 0);
        const sameTime = Math.abs(itemTime - payload.ts) < 15000;
        return !(sameUser && sameMsg && sameTime);
      });

      const updatedLocal = [payload, ...filteredLocal];
      localStorage.setItem('community_messages', JSON.stringify(updatedLocal));
    } catch (err) {
      console.error('Error saving message locally:', err);
    }

    // 2. Save to Supabase community_messages table
    try {
      const { error } = await supabase
        .from('community_messages')
        .insert([payload]);

      if (error) {
        console.warn('Supabase insert warning (make sure table is created):', error.message);
      }
    } catch (err) {
      console.warn('Supabase offline or table missing:', err);
    }

    setIsSubmitting(false);
    setSubmittedSuccess(true);
    setMessage('');

    // Refresh messages list cleanly
    await fetchMessages();

    setTimeout(() => {
      setSubmittedSuccess(false);
    }, 4000);
  };

  const copySqlCode = () => {
    navigator.clipboard.writeText(sqlScript);
    setSqlCopied(true);
    setTimeout(() => setSqlCopied(false), 2000);
  };

  return (
    <div
      dir="rtl"
      className="gratitude-notebook relative flex min-h-screen flex-col bg-bg-app text-text-primary overflow-x-hidden pb-28 sm:pb-32 transition-colors"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Ruled-paper texture, shared by the writing card and each stored note.
          One neutral rule-line tone that reads fine in both themes, so this
          doesn't need its own light/dark branching. */}
      <style>{`
        .gratitude-notebook {
          --font-display: 'Alexandria', 'Tajawal', sans-serif;
          --font-body: 'IBM Plex Sans Arabic', 'Tajawal', sans-serif;
          --font-mono: 'Space Mono', monospace;
          --rule-line: rgba(120, 113, 105, 0.16);
        }
        .gratitude-notebook h1,
        .gratitude-notebook h2,
        .gratitude-notebook h3 {
          font-family: var(--font-display);
        }
        .gratitude-notebook time,
        .gratitude-notebook .notebook-numeral {
          font-family: var(--font-mono);
        }
        .ruled-paper {
          background-image: repeating-linear-gradient(
            to bottom,
            transparent,
            transparent 27px,
            var(--rule-line) 28px
          );
        }
      `}</style>

      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-bg-app/90 backdrop-blur-md border-b border-border-subtle gap-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="flex size-10 items-center justify-center rounded-lg bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover transition-colors shrink-0 cursor-pointer"
          aria-label="الرجوع"
        >
          <ArrowRight size={20} className="shrink-0" />
        </button>

        <div className="flex-1 min-w-0 text-center px-1">
          <h2 className="text-sm sm:text-base font-bold text-text-primary truncate" style={{ fontFamily: 'var(--font-display)' }}>
            رسالة امتنان
          </h2>
        </div>

        <div className="size-10 shrink-0" />
      </header>

      {/* Main Content Body */}
      <main className="flex-1 px-4 sm:px-6 py-6 max-w-3xl mx-auto w-full space-y-6">

        {/* Identity Toolbar */}
        <div className="p-4 rounded-lg bg-bg-surface border border-border-subtle">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full">
            <span className="text-xs font-bold text-text-muted shrink-0">اسم المرسل الحالي:</span>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="اكتب اسمك..."
              className="text-xs sm:text-sm font-bold text-text-primary bg-bg-app border border-border-subtle rounded-lg px-3 py-2 focus:outline-none focus:border-deep-palm transition-colors w-full"
            />
          </div>
        </div>

        {/* Primary Message Box — the notebook page itself */}
        <section className="relative mt-[26px] bg-bg-surface text-text-primary rounded-sm border-s-2 border-nile-clay/40 border-t border-b border-e border-border-medium ps-5 pe-4 sm:pe-6 py-5 sm:py-6 space-y-4">

          <h1 className="text-base sm:text-lg font-bold text-text-primary leading-relaxed text-center sm:text-right">
            "رسالة لشخص لم يستطع تغيير العالم ولكن استطاع تغيير عالمك"
          </h1>

          <form onSubmit={handleSubmitMessage} className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              placeholder="اكتب هنا..."
              required
              className="ruled-paper w-full p-4 bg-transparent border border-border-subtle rounded-sm text-text-primary text-sm placeholder-text-muted focus:outline-none focus:border-deep-palm transition-colors resize-none leading-[28px]"
            />

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-deep-palm hover:bg-deep-palm/90 text-white font-bold text-sm transition-colors disabled:opacity-50 shrink-0 cursor-pointer"
              >
                {isSubmitting ? 'جاري الحفظ...' : 'إرسال الرسالة'}
              </button>
            </div>
          </form>

          {/* Success Banner */}
          {submittedSuccess && (
            <div className="p-3.5 rounded-sm bg-dawn-light/15 border border-dawn-light/40 text-deep-palm dark:text-dawn-light text-xs sm:text-sm font-bold animate-in fade-in duration-200 text-center sm:text-right">
              تم إرسال رسالتك بنجاح
            </div>
          )}
        </section>

        {/* Section for Enji: Display All Sent Messages */}
        {isEnjiMode && (
          <section className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 rounded-lg bg-bg-surface border border-border-medium text-text-primary">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-text-primary">
                  صندوق جميع الرسائل الواردة لـ Enji
                </h3>
                <p className="text-xs text-text-muted">
                  خاص بالمرشدة - يعرض جميع الرسائل المرسلة
                </p>
              </div>

              <button
                type="button"
                onClick={fetchMessages}
                className="p-2 rounded-lg bg-bg-surface-hover text-text-primary hover:bg-deep-palm hover:text-white transition-colors shrink-0 cursor-pointer border border-border-subtle"
                title="تحديث الرسائل"
              >
                <RefreshCw size={16} className={`shrink-0 ${isLoadingMessages ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* List of Sent Messages — each note is a ruled-paper page,
                separated by a dashed tear line instead of stacked cards. */}
            <div className="divide-y divide-dashed divide-border-medium">
              {allMessages.length > 0 ? (
                allMessages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className="ruled-paper border-s-2 border-nile-clay/30 ps-4 pe-3 py-4 space-y-2"
                  >
                    <div className="flex items-center justify-between border-b border-border-subtle pb-2 text-xs">
                      <h4 className="font-bold text-text-primary">
                        المرسل: <span className="text-deep-palm dark:text-dawn-light">{msg.username || 'مستخدم'}</span>
                      </h4>

                      <time className="text-[11px] text-text-muted notebook-numeral">
                        {new Date(msg.created_at || msg.ts || Date.now()).toLocaleDateString('ar-EG', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>

                    <p className="text-xs sm:text-sm text-text-primary leading-[26px] font-medium whitespace-pre-wrap">
                      "{msg.message}"
                    </p>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center bg-bg-surface rounded-sm border border-dashed border-border-medium text-text-muted text-xs font-medium">
                  لا توجد رسائل مسجلة بعد.
                </div>
              )}
            </div>
          </section>
        )}

      </main>

      {/* SQL Script View Modal — internal/admin utility, kept as a code editor
          rather than notebook-styled, but retinted off the old emerald set. */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl bg-bg-surface rounded-lg border border-border-medium shadow-lg p-6 space-y-4 text-text-primary max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <div className="flex items-center gap-2">
                <Database size={20} className="text-deep-palm dark:text-dawn-light shrink-0" />
                <h3 className="text-base font-bold text-text-primary">
                  كود إنشـاء الجدول في Supabase SQL Editor
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="p-1 rounded-lg text-text-muted hover:text-text-primary cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-text-muted leading-relaxed">
              قم بنسخ الكود التالي ولصقه في قسم <strong>SQL Editor</strong> داخل مشروعك على Supabase لإنشاء جدول <code>community_messages</code>:
            </p>

            <div className="relative bg-ink text-dawn-light p-4 rounded-lg font-mono text-xs overflow-x-auto leading-relaxed border border-ink/60 dir-ltr text-left" style={{ fontFamily: 'var(--font-mono)' }}>
              <pre>{sqlScript}</pre>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={copySqlCode}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-deep-palm hover:bg-deep-palm/90 text-white font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                {sqlCopied ? <Check size={16} className="shrink-0" /> : <Copy size={16} className="shrink-0" />}
                <span>{sqlCopied ? 'تم نسخ الكود!' : 'نسخ كود SQL'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-lg bg-bg-surface-hover text-text-secondary font-bold text-xs transition-colors shrink-0 cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}