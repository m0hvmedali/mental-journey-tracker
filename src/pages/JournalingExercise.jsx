import React, { useState, useEffect } from 'react';
import { ArrowLeft, History, BookOpen, Heart, Edit, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { updateProgress } from '../utils/progress';
import { saveTextToDB } from '@/lib/db';
import { supabase } from '@/supabaseClient';

export default function EmotionJournal() {
  const nav = useNavigate();
  const [feeling, setFeeling] = useState('');
  const [context, setContext] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [logs, setLogs] = useState([]);
  const [showTips, setShowTips] = useState(true);
  const [activeTab, setActiveTab] = useState('entry');

  // Load logs on mount
  useEffect(() => {
    const fetchLogs = async () => {
      const username = localStorage.getItem('username') || 'guest';
      try {
        const local = localStorage.getItem(`emotion_logs_${username}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) setLogs(parsed);
        }
      } catch (err) { /* ignore fallback error */ }

      try {
        const { data, error } = await supabase
          .from('emotion_logs')
          .select('*')
          .eq('user_id', username)
          .order('ts', { ascending: false });
        
        if (!error && Array.isArray(data)) {
          setLogs(data);
          try {
            localStorage.setItem(`emotion_logs_${username}`, JSON.stringify(data));
          } catch (err) { /* ignore fallback error */ }
        }
      } catch (err) {
        console.warn('Notice: Using local emotion logs', err);
      }
    };
    
    fetchLogs();
  }, []);

  const handleSave = async () => {
    if (!feeling) {
      const notification = document.createElement('div');
      notification.textContent = 'اكتب شعورك 😣';
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: #a3e4d7;
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-size: 14px;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      `;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s ease';
        setTimeout(() => notification.remove(), 500);
      }, 2000);
      return;
    }
    
    const newEntry = {
      feeling,
      context,
      intensity,
      date: new Date().toISOString(),
    };
    
    try {
      const savedEntry = await saveTextToDB('emotion_logs', newEntry);
      setLogs(prev => [savedEntry, ...prev]);
      setFeeling('');
      setContext('');
      setIntensity(5);
      
      updateProgress({
        entries: 1,
        timeline: { label: `تم تدوين شعور: ${feeling} ` },
      });
    } catch (err) {
      console.error('❌ Error saving emotion entry:', err);
      alert('حصلت مشكلة أثناء الحفظ 😥');
    }
  };

  const emotionSuggestions = [
    "سعادة 😊", "حزن 😔", "قلق 😰", "غضب 😠", "فرح 😄", "إحباط 😞",
    "حماس 🤩", "ملل 🥱", "ارتباك 😕", "فخر 🤗", "خوف 😨", "امتنان 🙏"
  ];

  return (
    <div className="min-h-screen bg-bg-app px-4 py-6 max-w-2xl mx-auto w-full pb-48 sm:pb-56 space-y-6" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center gap-3 pb-2 mb-2">
        <button 
          onClick={() => nav(-1)} 
          className="size-10 rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover flex items-center justify-center transition-all shrink-0 active:scale-95 cursor-pointer"
          aria-label="رجوع"
        >
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </button>
        <div className="flex-1 flex flex-col items-center text-center">
          <h2 className="text-lg sm:text-xl font-bold text-text-primary">يوميات المشاعر</h2>
          <p className="text-xs text-text-muted mt-0.5">سجل مشاعرك وافهمها بشكل أفضل</p>
        </div>
        <div className="size-10 shrink-0" />
      </header>

      {/* Navigation Tabs */}
      <div className="flex bg-bg-surface p-1.5 rounded-sm border border-border-subtle shadow-2xs gap-1.5">
        <button 
          onClick={() => setActiveTab('entry')}
          className={`flex-1 py-2.5 rounded-xl text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'entry' ? 'bg-accent-primary text-white shadow-xs' : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-hover'
          }`}
        >
          تدوين جديد
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2.5 rounded-xl text-center text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'history' ? 'bg-accent-primary text-white shadow-xs' : 'text-text-muted hover:text-text-primary hover:bg-bg-surface-hover'
          }`}
        >
          السجل ({logs.length})
        </button>
      </div>

      {activeTab === 'entry' ? (
        <div className="space-y-6">
          {/* Tips Banner */}
          {showTips && (
            <div className="bg-bg-surface rounded-sm p-5 border border-accent-primary/30 shadow-2xs relative space-y-2.5">
              <button 
                onClick={() => setShowTips(false)}
                className="absolute top-3 left-3 text-text-muted hover:text-text-primary p-1 rounded-lg hover:bg-bg-surface-hover transition-colors cursor-pointer"
                aria-label="إغلاق"
              >
                <X size={18} />
              </button>
              <h3 className="font-bold text-text-primary text-sm sm:text-base flex items-center gap-2">
                <Heart size={18} className="text-accent-primary dark:text-emerald-400 shrink-0" /> 
                <span>لماذا تدوين المشاعر مهم؟</span>
              </h3>
              <ul className="text-xs sm:text-sm text-text-secondary space-y-1.5 pt-1 pr-1">
                <li className="flex items-center gap-2">• يساعدك على فهم أنماط مشاعرك</li>
                <li className="flex items-center gap-2">• يقلل من حدة المشاعر السلبية</li>
                <li className="flex items-center gap-2">• يحسن من وعيك الذاتي</li>
                <li className="flex items-center gap-2">• يمنحك منظوراً جديداً للتحديات</li>
              </ul>
            </div>
          )}

          {/* Feeling Input */}
          <div className="bg-bg-surface rounded-sm p-5 border border-border-subtle shadow-2xs space-y-4">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <BookOpen size={18} className="text-accent-primary dark:text-emerald-400 shrink-0" />
              <span>ما هو الشعور الذي تشعر به الآن؟</span>
            </h3>
            <textarea
              className="w-full p-3.5 rounded-xl bg-bg-app text-text-primary resize-none border border-border-subtle focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 text-sm leading-relaxed outline-none transition-all"
              placeholder="أشعر الآن بـ..."
              rows={3}
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
            
            <div className="pt-1 space-y-2.5">
              <p className="text-xs font-bold text-text-muted">اقتراحات مشاعر:</p>
              <div className="flex flex-wrap gap-2">
                {emotionSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFeeling(suggestion)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-all cursor-pointer ${
                      feeling === suggestion
                        ? 'bg-accent-primary text-white border-accent-primary shadow-2xs'
                        : 'bg-bg-surface-elevated text-accent-primary dark:text-emerald-400 border-border-subtle hover:bg-accent-primary/10'
                    }`}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context Input */}
          <div className="bg-bg-surface rounded-sm p-5 border border-border-subtle shadow-2xs space-y-3.5">
            <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
              <Edit size={18} className="text-accent-primary dark:text-emerald-400 shrink-0" />
              <span>ما السياق أو الموقف المرتبط بهذا الشعور؟</span>
            </h3>
            <textarea
              className="w-full p-3.5 rounded-xl bg-bg-app text-text-primary resize-none border border-border-subtle focus:border-accent-primary focus:ring-2 focus:ring-accent-primary/20 text-sm leading-relaxed outline-none transition-all"
              placeholder="حدث ذلك عندما..."
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          {/* Intensity Slider */}
          <div className="bg-bg-surface rounded-sm p-5 border border-border-subtle shadow-2xs space-y-3.5">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
                <Star size={18} className="text-accent-primary dark:text-emerald-400 shrink-0" />
                <span>شدة الشعور</span>
              </h3>
              <span className="text-sm font-bold px-3 py-1 bg-accent-primary/10 text-accent-primary dark:text-emerald-400 rounded-full">
                {intensity} من 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full accent-accent-primary cursor-pointer h-2 bg-bg-surface-hover rounded-lg"
            />
            <div className="flex justify-between text-xs font-semibold text-text-muted px-1">
              <span>خفيف (1)</span>
              <span>متوسط (5)</span>
              <span>شديد (10)</span>
            </div>
          </div>

          {/* Save Button Container with clear visibility & padding */}
          <div className="pt-2 pb-10">
            <button
              type="button"
              onClick={handleSave}
              className="w-full py-4 px-6 rounded-sm bg-accent-primary hover:bg-accent-hover text-white font-bold text-base shadow-md hover:shadow-lg transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <span>حفظ الشعور</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-bold text-base sm:text-lg text-text-primary flex items-center gap-2">
              <History size={20} className="text-accent-primary dark:text-emerald-400 shrink-0" /> 
              <span>سجل المشاعر</span>
            </h3>
            <span className="text-xs font-bold px-3 py-1 bg-bg-surface rounded-full border border-border-subtle text-text-muted">
              {logs.length} تدوينات
            </span>
          </div>

          {logs.length === 0 ? (
            <div className="bg-bg-surface rounded-sm p-8 text-center border border-border-subtle shadow-2xs space-y-3">
              <div className="mx-auto bg-accent-primary/10 text-accent-primary size-14 rounded-sm flex items-center justify-center">
                <BookOpen size={28} />
              </div>
              <h4 className="font-bold text-text-primary text-base">لا توجد تدوينات بعد</h4>
              <p className="text-xs sm:text-sm text-text-muted">ابدأ بتدوين مشاعرك الأولى لترى سجلك هنا</p>
              <button 
                onClick={() => setActiveTab('entry')}
                className="px-5 py-2.5 bg-accent-primary hover:bg-accent-hover text-white rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                ابدأ التدوين الآن
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="bg-bg-surface rounded-sm p-5 border border-border-subtle shadow-2xs space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="size-9 rounded-xl bg-accent-primary/10 text-accent-primary flex items-center justify-center shrink-0">
                        <Heart size={18} />
                      </div>
                      <h4 className="font-bold text-base text-text-primary">{log.feeling}</h4>
                    </div>
                    <span className="text-xs font-medium text-text-muted shrink-0">
                      {log.date ? new Date(log.date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  
                  {log.context && (
                    <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-app p-3 rounded-xl border border-border-subtle/50">
                      <span className="font-bold text-text-muted ml-1">السياق:</span> {log.context}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-2 pt-2 border-t border-border-subtle/60">
                    <span className="text-xs font-bold text-text-muted">الشدة:</span>
                    <div className="flex items-center gap-1">
                      {[...Array(10)].map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`size-2.5 rounded-full ${
                            idx < log.intensity ? 'bg-accent-primary dark:bg-emerald-400' : 'bg-bg-surface-hover border border-border-subtle'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-accent-primary dark:text-emerald-400 mr-auto">{log.intensity}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-bg-surface rounded-sm p-5 border border-border-subtle shadow-2xs space-y-2.5">
            <h4 className="font-bold text-text-primary text-sm">فوائد متابعة سجل المشاعر:</h4>
            <ul className="text-xs text-text-secondary space-y-1.5 pr-2">
              <li className="flex items-center gap-2">• تحديد أنماط المشاعر المتكررة</li>
              <li className="flex items-center gap-2">• فهم أفضل لمحفزات المشاعر السلبية</li>
              <li className="flex items-center gap-2">• تتبع تقدمك في إدارة مشاعرك</li>
              <li className="flex items-center gap-2">• زيادة الوعي الذاتي والذكاء العاطفي</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
