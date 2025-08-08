import { useEffect, useState } from 'react';
import { ArrowLeft, History, BookOpen, Heart, Edit, ChevronRight, Star, X } from 'lucide-react';
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
    <div className="min-h-screen bg-[#f5fbf8] px-4 py-6" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center pb-2 mb-6">
        <button 
          onClick={() => nav(-1)} 
          className="flex items-center justify-center "
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#0e1b15]">يوميات المشاعر</h2>
          <p className="text-xs text-[#5a8c76]">سجل مشاعرك وفهمها بشكل أفضل</p>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex mb-6 bg-[#e0f0e9] p-1 rounded-xl">
        <button 
          onClick={() => setActiveTab('entry')}
          className={`flex-1 py-2 rounded-xl text-center ${
            activeTab === 'entry' ? 'bg-white text-[#0e8a5f] font-medium shadow-sm' : 'text-[#5a8c76]'
          }`}
        >
          تدوين جديد
        </button>
        <button 
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-2 rounded-xl text-center ${
            activeTab === 'history' ? 'bg-white text-[#0e8a5f] font-medium shadow-sm' : 'text-[#5a8c76]'
          }`}
        >
          السجل
        </button>
      </div>

      {activeTab === 'entry' ? (
        <div className="space-y-6">
          {/* Tips Banner */}
          {showTips && (
            <div className="bg-[#e7f3ee] rounded-2xl p-4 relative">
              <button 
                onClick={() => setShowTips(false)}
                className="absolute top-2 left-2 text-[#5a8c76]"
              >
                <X size={18} />
              </button>
              <h3 className="font-bold text-[#0e1b15] mb-2 flex items-center">
                <Heart size={18} className="mr-2 text-[#4e9778]" /> لماذا تدوين المشاعر مهم؟
              </h3>
              <ul className="text-xs text-[#374151] space-y-1 pl-2">
                <li>• يساعدك على فهم أنماط مشاعرك</li>
                <li>• يقلل من حدة المشاعر السلبية</li>
                <li>• يحسن من وعيك الذاتي</li>
                <li>• يمنحك منظوراً جديداً للتحديات</li>
              </ul>
            </div>
          )}

          {/* Feeling Input */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-medium text-[#0e1b15] mb-3 flex items-center">
              <BookOpen size={18} className="mr-2 text-[#4e9778]" /> ما هو الشعور الذي تشعر به الآن؟
            </h3>
            <textarea
              className="w-full p-3 rounded-lg bg-[#f9fbfa] text-[#101915] resize-none border border-[#e0eae5] focus:outline-none focus:ring-2 focus:ring-[#4e9778]/30"
              placeholder="أشعر الآن بـ..."
              rows="2"
              value={feeling}
              onChange={(e) => setFeeling(e.target.value)}
            />
            
            <div className="mt-3">
              <p className="text-xs text-[#5a8c76] mb-2">اقتراحات مشاعر:</p>
              <div className="flex flex-wrap gap-2">
                {emotionSuggestions.map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setFeeling(suggestion)}
                    className="px-3 py-1 text-xs bg-[#e7f3ee] text-[#0e8a5f] rounded-full hover:bg-[#d4e9de]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context Input */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-medium text-[#0e1b15] mb-3 flex items-center">
              <Edit size={18} className="mr-2 text-[#4e9778]" /> ما السياق أو الموقف المرتبط بهذا الشعور؟
            </h3>
            <textarea
              className="w-full p-3 rounded-lg bg-[#f9fbfa] text-[#101915] resize-none border border-[#e0eae5] focus:outline-none focus:ring-2 focus:ring-[#4e9778]/30"
              placeholder="حدث ذلك عندما..."
              rows="3"
              value={context}
              onChange={(e) => setContext(e.target.value)}
            />
          </div>

          {/* Intensity Slider */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <h3 className="font-medium text-[#0e1b15] mb-4 flex items-center">
              <Star size={18} className="mr-2 text-[#4e9778]" /> شدة الشعور: <span className="text-[#0e8a5f] font-bold mx-1">{intensity}</span> من 10
            </h3>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="w-full mb-2 accent-[#0e8a5f]"
            />
            <div className="flex justify-between text-xs text-[#5a8c76]">
              <span>خفيف</span>
              <span>متوسط</span>
              <span>شديد</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-2xl bg-[#0e8a5f] text-white font-bold text-lg shadow-lg hover:bg-[#0c7a52] transition-colors"
          >
            حفظ الشعور
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-[#0e1b15] flex items-center">
              <History size={20} className="mr-2 text-[#4e9778]" /> سجل المشاعر
            </h3>
            <span className="text-sm text-[#5a8c76]">{logs.length} تدوينة</span>
          </div>

          {logs.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
              <div className="mx-auto bg-[#e7f3ee] w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <BookOpen size={28} className="text-[#4e9778]" />
              </div>
              <h4 className="font-medium text-[#0e1b15] mb-2">لا توجد تدوينات بعد</h4>
              <p className="text-sm text-[#5a8c76] mb-4">ابدأ بتدوين مشاعرك الأولى لترى سجلك هنا</p>
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
                <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-[#e0eae5]">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
                        <Heart size={16} className="text-[#4e9778]" />
                      </div>
                      <h4 className="font-bold text-[#0e1b15]">{log.feeling}</h4>
                    </div>
                    <span className="text-xs text-[#9ca3af]">{log.date}</span>
                  </div>
                  
                  {log.context && (
                    <p className="text-sm text-[#374151] mb-3">
                      <span className="font-medium text-[#5a8c76]">السياق:</span> {log.context}
                    </p>
                  )}
                  
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-[#5a8c76]">الشدة:</span>
                    <div className="ml-2 flex">
                      {[...Array(10)].map((_, idx) => (
                        <div 
                          key={idx} 
                          className={`w-3 h-3 rounded-full mx-0.5 ${
                            idx < log.intensity ? 'bg-[#0e8a5f]' : 'bg-[#e0eae5]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-[#0e8a5f] ml-2">{log.intensity}/10</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bg-[#e7f3ee] rounded-2xl p-4">
            <h4 className="font-bold text-[#0e1b15] mb-2">فوائد متابعة سجل المشاعر:</h4>
            <ul className="text-xs text-[#374151] space-y-1 pl-2">
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