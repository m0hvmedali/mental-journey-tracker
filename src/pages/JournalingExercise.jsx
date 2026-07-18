// src/pages/JournalingExercise.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X, Heart, Star, BookOpen, Edit, History } from 'lucide-react';
import { supabase } from '@/supabaseClient';
import { saveTextToDB } from '@/lib/db';
import { updateProgress } from '../utils/progress';

export default function JournalingExercise() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState('entry');
  const [feeling, setFeeling] = useState('');
  const [context, setContext] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [showTips, setShowTips] = useState(true);
  const [logs, setLogs] = useState([]);

  // Load logs on mount
  useEffect(() => {
    const fetchLogs = async () => {
      const username = localStorage.getItem('username');
      if (!username) return;
  
      const { data, error } = await supabase
        .from('emotion_logs')
        .select('*')
        .eq('user_id', username)
        .order('ts', { ascending: false });
  
      if (error) {
        console.error('❌ Error fetching logs:', error);
      } else {
        setLogs(data);
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
      console.error('❌ Error saving to Supabase:', err);
      alert('حصلت مشكلة أثناء الحفظ 😥');
    }
  };
  

  const emotionSuggestions = [
    "سعادة 😊", "حزن 😔", "قلق 😰", "غضب 😠", "فرح 😄", "إحباط 😞", 
    "حماس 🤩", "ملل 🥱", "ارتباك 😕", "فخر 🤗", "خوف 😨", "امتنان 🙏"
  ];

  return (
    <div className="min-h-screen themed-bg px-4 py-6 font-sans">
      {/* Header */}
      <header className="flex items-center pb-2 mb-6">
        <button 
          onClick={() => nav(-1)} 
          className="flex items-center justify-center themed-text"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-bold themed-text">يوميات المشاعر</h2>
          <p className="text-xs themed-text-muted">سجل مشاعرك وفهمها بشكل أفضل</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex mb-6 themed-bg-subtle border themed-border p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('entry')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'entry' 
              ? 'themed-bg-card text-[#0e8a5f] font-medium shadow-sm' 
              : 'themed-text-muted hover:bg-white/50 dark:hover:bg-black/20'
          }`}
        >
          تدوين جديد
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 text-center rounded-lg transition-all ${
            activeTab === 'history' 
              ? 'themed-bg-card text-[#0e8a5f] font-medium shadow-sm' 
              : 'themed-text-muted hover:bg-white/50 dark:hover:bg-black/20'
          }`}
        >
          السجل
        </button>
      </div>

      {activeTab === 'entry' ? (
        <div className="space-y-6">
          {/* Tips Banner */}
          {showTips && (
            <div className="themed-bg-card border themed-border rounded-2xl p-4 relative">
              <button 
                onClick={() => setShowTips(false)}
                className="absolute top-2 left-2 text-[#5a8c76] dark:text-gray-400"
              >
                <X size={18} />
              </button>
              <h3 className="font-bold themed-text mb-2 flex items-center">
                <Heart size={18} className="mr-2 text-[#4e9778]" /> لماذا تدوين المشاعر مهم؟
              </h3>
              <ul className="text-xs themed-text-muted space-y-1 pl-2">
                <li>• يساعدك على فهم أنماط مشاعرك</li>
                <li>• يقلل من حدة المشاعر السلبية</li>
                <li>• يحسن من وعيك الذاتي</li>
                <li>• يمنحك منظوراً جديداً للتحديات</li>
              </ul>
            </div>
          )}

          {/* Feeling Input */}
          <div className="themed-bg-card rounded-2xl p-4 shadow-sm themed-border border">
            <h3 className="font-medium themed-text mb-3 flex items-center">
              <BookOpen size={18} className="mr-2 text-[#4e9778]" /> ما هو الشعور الذي تشعر به الآن؟
            </h3>
            <textarea
              className="w-full p-3 rounded-lg themed-bg-input themed-text resize-none border themed-border focus:outline-none focus:ring-2 focus:ring-[#4e9778]/30"
              placeholder="أشعر الآن بـ..."
              rows="2"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
            
            <div className="mt-3">
              <p className="text-xs themed-text-muted mb-2">اقتراحات مشاعر:</p>
              <div className="flex flex-wrap gap-2">
                {emotionSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setFeeling(suggestion)}
                    className="px-3 py-1 text-xs themed-bg-subtle themed-text rounded-full hover:opacity-85"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context Input */}
          <div className="themed-bg-card rounded-2xl p-4 shadow-sm themed-border border">
            <h3 className="font-medium themed-text mb-3 flex items-center">
              <Edit size={18} className="mr-2 text-[#4e9778]" /> ما السياق أو الموقف المرتبط بهذا الشعور؟
            </h3>
            <textarea
              className="w-full p-3 rounded-lg themed-bg-input themed-text resize-none border themed-border focus:outline-none focus:ring-2 focus:ring-[#4e9778]/30"
              placeholder="حدث ذلك عندما..."
              rows="3"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          {/* Intensity Slider */}
          <div className="themed-bg-card rounded-2xl p-4 shadow-sm themed-border border">
            <h3 className="font-medium themed-text mb-4 flex items-center">
              <Star size={18} className="mr-2 text-[#4e9778]" /> شدة الشعور: <span className="text-[#0e8a5f] dark:text-[#5ec68e] font-bold mx-1">{intensity}</span> من 10
            </h3>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full mb-2 accent-[#0e8a5f] dark:accent-[#5ec68e]"
            />
            <div className="flex justify-between text-xs themed-text-muted">
              <span>خفيف</span>
              <span>متوسط</span>
              <span>شديد</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-[#0e8a5f] text-white font-bold text-lg shadow-lg hover:opacity-90 transition-opacity"
          >
            حفظ الشعور
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg themed-text flex items-center">
              <History size={20} className="mr-2 text-[#4e9778]" /> سجل المشاعر
            </h3>
            <span className="text-sm themed-text-muted">{logs.length} تدوينة</span>
          </div>

          {logs.length === 0 ? (
            <div className="themed-bg-card rounded-2xl p-8 text-center shadow-sm themed-border border">
              <div className="mx-auto themed-bg-subtle w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-[#4e9778]" />
              </div>
              <h4 className="font-medium themed-text mb-2">لا توجد تدوينات بعد</h4>
              <p className="text-sm themed-text-muted mb-4">ابدأ بتدوين مشاعرك الأولى لترى سجلك هنا</p>
              <button 
                onClick={() => setActiveTab('entry')}
                className="px-4 py-2 bg-[#0e8a5f] text-white rounded-lg font-medium"
              >
                ابدأ التدوين الآن
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log, i) => (
                <div key={i} className="themed-bg-card rounded-2xl p-5 shadow-sm border themed-border">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full themed-bg-subtle flex items-center justify-center mr-2">
                        <Heart size={16} className="text-[#4e9778]" />
                      </div>
                      <h4 className="font-bold themed-text">{log.feeling}</h4>
                    </div>
                    <span className="text-xs text-[#9ca3af]">{log.date}</span>
                  </div>
                  
                  {log.context && (
                    <p className="text-sm themed-text mb-3">
                      <span className="font-medium themed-text-secondary">السياق:</span> {log.context}
                    </p>
                  )}
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium themed-text-muted">الشدة:</span>
                    <div className="ml-2 flex">
                      {[...Array(10)].map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-3 h-3 rounded-full mx-0.5 ${
                            idx < log.intensity ? 'bg-[#0e8a5f]' : 'themed-bg-subtle'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#0e8a5f] dark:text-[#5ec68e] ml-2">{log.intensity}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="themed-bg-card border themed-border rounded-2xl p-4">
            <h4 className="font-bold themed-text mb-2">فوائد متابعة سجل المشاعر:</h4>
            <ul className="text-xs themed-text-muted space-y-1 pl-2">
              <li>• تحديد أنماط المشاعر المتكررة</li>
              <li>• فهم أفضل لمحفزات المشاعر السلبية</li>
              <li>• تتبع تقدمك في إدارة مشاعرك</li>
              <li>• زيادة الوعي الذاتي والذكاء العاطفي</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}