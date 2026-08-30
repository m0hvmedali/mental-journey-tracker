import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Mic, StopCircle, Trash2, Upload,
  Smile, Frown, Meh, Heart, Activity, BookOpen, 
  ChevronDown, ChevronUp, X
} from 'lucide-react';
import { updateProgress } from '../utils/progress';
import { supabase } from '@/supabaseClient';
import { saveTextToDB, uploadMediaToStorage } from '@/lib/db';
import NotesJournalSpace from '../components/wellness/NotesJournalSpace';

export default function DiaryEntry() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState('notes'); 
  const [audioBlob, setAudioBlob] = useState(null);

  const [text, setText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [thoughtChallenge, setThoughtChallenge] = useState('');

  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRef = useRef(null);
  const chunks = useRef([]);

  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [logs, setLogs] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);
  const toggleLogExpand = (id) => setExpandedLog(prev => (prev === id ? null : id));
  
  const emotions = [
    { id: 'happy', label: 'سعادة', icon: <Smile size={16} />, color: 'bg-accent-dawn text-white' },
    { id: 'sad', label: 'حزن', icon: <Frown size={16} />, color: 'bg-accent-primary text-white' },
    { id: 'angry', label: 'غضب', icon: <Activity size={16} />, color: 'bg-border-medium text-text-primary' },
    { id: 'neutral', label: 'حياد', icon: <Meh size={16} />, color: 'bg-bg-surface text-text-primary border border-border-medium' },
    { id: 'love', label: 'حب', icon: <Heart size={16} />, color: 'bg-accent-clay text-white' },
    { id: 'anxious', label: 'قلق', icon: <BookOpen size={16} />, color: 'bg-accent-palm text-white' }
  ];

  useEffect(() => {
    const fetchLogs = async () => {
      const username = localStorage.getItem('username') || 'guest';
      try {
        const local = localStorage.getItem(`diary_logs_${username}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) setLogs(parsed);
        }
      } catch (e) { /* ignore */ }

      try {
        const { data, error } = await supabase
          .from('diary_logs')
          .select('*')
          .eq('user_id', username)
          .order('ts', { ascending: false });

        if (!error && Array.isArray(data)) {
          setLogs(data);
          try {
            localStorage.setItem(`diary_logs_${username}`, JSON.stringify(data));
          } catch (err) { /* ignore */ }
        }
      } catch (err) { /* ignore */ }
    };
    fetchLogs();
  }, []);

  const startRec = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => chunks.current.push(e.data);
      rec.onstop = async () => {
        const blob = new Blob(chunks.current, { type: 'audio/webm' });
        chunks.current = [];
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setRecording(false);
      };
      mediaRef.current = rec;
      rec.start();
      setRecording(true);
    } catch (err) { /* ignore */ }
  };

  const stopRec = () => {
    if (mediaRef.current && mediaRef.current.state !== 'inactive') {
      mediaRef.current.stop();
    }
  };

  const handleFile = async (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
  };

  const toggleEmotion = (emotionId) => {
    if (selectedEmotions.includes(emotionId)) {
      setSelectedEmotions(selectedEmotions.filter(id => id !== emotionId));
    } else {
      setSelectedEmotions([...selectedEmotions, emotionId]);
    }
  };

  const saveEntry = async () => {
    if (!text.trim() && !audioBlob && !file && thoughtChallenge === '') {
      return alert('اكتب أو سجّل حاجة الأول 🎤✍️');
    }
    
    const payload = { text, intensity, emotions: selectedEmotions, thought_challenge: thoughtChallenge };
    
    try {
      if (audioBlob) {
        payload.audio_url = await uploadMediaToStorage(audioBlob, 'diary');
      }
      if (file) {
        payload.file_url = await uploadMediaToStorage(file, 'diary');
        payload.file_name = file.name;
      }
      
      const newEntry = await saveTextToDB('diary_logs', payload);
      setLogs([newEntry, ...logs]);
      
      updateProgress({ entries: 1, timeline: { label: 'تم تسجيل تدوينة مشاعر 🎙️✍️' } });
      
      setText(''); setAudioBlob(null); setAudioURL(''); setFile(null);
      setIntensity(5); setSelectedEmotions([]); setThoughtChallenge('');
    } catch (err) {
      alert('حصلت مشكلة أثناء الحفظ 😥');
    }
  };

  const deleteEntry = async (id) => {
    const username = localStorage.getItem('username') || 'guest';
    const updated = logs.filter((entry) => entry.id !== id);
    setLogs(updated);
    if (expandedLog?.id === id) setExpandedLog(null);

    try { localStorage.setItem(`diary_logs_${username}`, JSON.stringify(updated)); } catch (err) { /* ignore */ }
    try { await supabase.from('diary_logs').delete().eq('id', id); } catch (err) { /* ignore */ }
  };

  const RecordingIndicator = () => (
    <div className="flex items-center gap-1 text-accent-clay animate-pulse">
      <div className="w-3 h-3 rounded-full bg-accent-clay"></div>
      <div className="text-sm font-mono">جارٍ التسجيل...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-bg-app text-text-primary transition-colors pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 border-b-2 border-border-medium bg-bg-app sticky top-0 z-30">
        <button onClick={() => nav(-1)} className="flex items-center justify-center size-10 rounded-sm border border-border-subtle bg-bg-surface text-text-primary hover:bg-bg-surface-hover">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 text-center">
          <h2 className="text-2xl font-display font-bold text-text-primary tracking-tight">اليوميات</h2>
        </div>
        <div className="size-10" />
      </header>

      {/* Tabs - Notebook style */}
      <div className="px-4 sm:px-8 pt-8 max-w-4xl mx-auto w-full">
        <div className="flex border-b-2 border-border-medium">
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 py-3 px-4 font-display font-bold text-sm sm:text-base border-t-2 border-l-2 border-r-2 ${
              activeTab === 'notes'
                ? 'bg-bg-surface border-border-medium text-accent-primary relative top-[2px]'
                : 'bg-bg-surface-elevated border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            الملاحظات الحرة
          </button>
          <button
            onClick={() => setActiveTab('emotions')}
            className={`flex-1 py-3 px-4 font-display font-bold text-sm sm:text-base border-t-2 border-l-2 border-r-2 ${
              activeTab === 'emotions'
                ? 'bg-bg-surface border-border-medium text-accent-primary relative top-[2px]'
                : 'bg-bg-surface-elevated border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            تتبع المشاعر
          </button>
        </div>
      </div>

      {activeTab === 'notes' ? (
        <main className="flex-1 px-4 sm:px-8 max-w-4xl mx-auto w-full">
          <NotesJournalSpace />
        </main>
      ) : (
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 py-8 space-y-8">
          
          {/* Entry Form: Tactile Journaling */}
          <div className="bg-bg-surface border border-border-medium p-6 sm:p-8 space-y-6 relative shadow-[4px_4px_0_0_var(--color-border-subtle)]">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="اكتب مشاعرك اليوم بحرية..."
              className="w-full bg-transparent min-h-[160px] focus:outline-none text-base sm:text-lg text-text-primary border-none resize-none leading-loose font-serif-display placeholder-text-muted"
              style={{
                backgroundImage: 'repeating-linear-gradient(transparent, transparent 31px, var(--color-border-subtle) 31px, var(--color-border-subtle) 32px)',
                lineHeight: '32px',
                paddingTop: '6px'
              }}
            />
            
            {/* Emotion Selection */}
            <div className="pt-6 border-t border-border-subtle">
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-bold font-display text-text-primary">حدد المشاعر (اختياري)</label>
                <button 
                  onClick={() => setShowEmotionPicker(!showEmotionPicker)}
                  className="text-text-secondary text-sm flex items-center gap-1 font-bold hover:text-accent-primary"
                >
                  {showEmotionPicker ? 'إخفاء' : 'إظهار'}
                  {showEmotionPicker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              
              {showEmotionPicker && (
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-4">
                  {emotions.map(emotion => (
                    <button
                      key={emotion.id}
                      onClick={() => toggleEmotion(emotion.id)}
                      className={`flex flex-col items-center justify-center p-3 text-xs font-bold transition-all border-2 ${
                        selectedEmotions.includes(emotion.id) 
                          ? `${emotion.color} border-transparent`
                          : 'bg-transparent text-text-secondary hover:text-text-primary border-border-subtle'
                      }`}
                    >
                      {emotion.icon}
                      <span className="mt-2">{emotion.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Thought Challenge */}
            <div className="pt-4 border-t border-border-subtle">
              <label className="text-sm font-bold font-display text-text-primary mb-3 block">
                تحدى الفكرة السلبية
              </label>
              <textarea
                value={thoughtChallenge}
                onChange={(e) => setThoughtChallenge(e.target.value)}
                placeholder="كيف يمكنك إعادة صياغة هذه الأفكار بمنظور أكثر واقعية ورحمة؟"
                className="w-full bg-bg-app border border-border-medium p-4 text-sm text-text-primary focus:outline-none focus:border-accent-primary leading-relaxed font-sans"
                rows={3}
              />
            </div>

            {/* Intensity & Media */}
            <div className="pt-4 border-t border-border-subtle flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
              <div className="w-full sm:w-1/3 space-y-2">
                <label className="text-sm font-bold font-display text-text-primary flex justify-between">
                  <span>شدة الشعور</span>
                  <span className="font-mono">{intensity}/10</span>
                </label>
                <input 
                  type="range" min="1" max="10" 
                  value={intensity} 
                  onChange={(e) => setIntensity(e.target.value)} 
                  className="w-full h-1 bg-border-subtle appearance-none cursor-pointer" 
                />
              </div>

              <div className="flex flex-wrap gap-3">
                {recording ? (
                  <button onClick={stopRec} className="flex items-center gap-2 px-4 py-2 border border-accent-clay text-accent-clay font-bold text-sm bg-transparent hover:bg-accent-clay/10 transition-colors">
                    <StopCircle size={16}/> إيقاف
                    <RecordingIndicator />
                  </button>
                ) : (
                  <button onClick={startRec} className="flex items-center gap-2 px-4 py-2 border border-border-medium text-text-primary font-bold text-sm hover:border-accent-primary hover:text-accent-primary transition-colors">
                    <Mic size={16}/> تسجيل صوتي
                  </button>
                )}
                <button onClick={() => fileInputRef.current.click()} className="flex items-center gap-2 px-4 py-2 border border-border-medium text-text-primary font-bold text-sm hover:border-accent-primary hover:text-accent-primary transition-colors">
                  <Upload size={16}/> مرفق
                </button>
                <input type="file" hidden ref={fileInputRef} onChange={handleFile}/>
              </div>
            </div>

            {(audioURL || file) && (
              <div className="p-4 bg-bg-app border border-border-medium space-y-3">
                {audioURL && <audio src={audioURL} controls className="w-full h-10" />}
                {file && (
                  <div className="flex justify-between items-center text-sm font-bold text-text-primary">
                    <span>{file.name}</span>
                    <button onClick={() => setFile(null)} className="p-1 hover:text-accent-clay"><X size={16} /></button>
                  </div>
                )}
              </div>
            )}

            <button 
              onClick={saveEntry} 
              className="w-full bg-text-primary text-bg-surface hover:bg-accent-primary py-4 font-display font-bold text-base transition-colors"
            >
              حفظ وتوثيق
            </button>
          </div>

          {/* Logs */}
          <div className="space-y-6 pt-8">
            <h3 className="font-display font-bold text-xl text-text-primary border-b-2 border-border-medium pb-2">السجل السابق</h3>
            
            {logs.length === 0 ? (
              <div className="p-8 text-center border border-border-dashed border-border-medium bg-bg-surface-elevated">
                <BookOpen size={32} className="mx-auto text-text-muted mb-3" />
                <p className="font-display font-bold text-text-primary text-lg">لا توجد إدخالات بعد</p>
                <p className="text-text-secondary mt-2 text-sm">الصفحات بانتظار أفكارك.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="border border-border-medium bg-bg-surface p-5 relative shadow-[2px_2px_0_0_var(--color-border-subtle)]">
                    <div className="flex justify-between items-start mb-3 cursor-pointer" onClick={() => toggleLogExpand(log.id)}>
                      <div className="space-y-1">
                        <span className="font-mono text-xs text-text-muted font-bold block">
                          {new Date(log.ts).toLocaleString('ar-EG', { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        {log.text && <p className="font-serif-display text-base text-text-primary line-clamp-2 leading-relaxed">{log.text}</p>}
                      </div>
                      <div className="flex gap-3 text-text-muted">
                        <span className="font-mono text-xs font-bold bg-bg-surface-elevated px-2 py-1">الشدة: {log.intensity}</span>
                        <button onClick={(e) => { e.stopPropagation(); deleteEntry(log.id); }} className="hover:text-accent-clay"><Trash2 size={16} /></button>
                      </div>
                    </div>
                    
                    {expandedLog === log.id && (
                      <div className="pt-4 border-t border-border-subtle space-y-4 mt-2">
                        {log.thought_challenge && (
                          <div>
                            <span className="block text-xs font-bold text-text-secondary mb-1">تحدي الأفكار</span>
                            <p className="text-sm text-text-primary bg-bg-app p-3 border border-border-subtle">{log.thought_challenge}</p>
                          </div>
                        )}
                        {log.audio_url && <audio src={log.audio_url} controls className="w-full h-10" />}
                        {log.file_url && (
                          <a href={log.file_url} download={log.file_name || 'file'} className="inline-flex items-center gap-2 text-sm font-bold text-accent-primary hover:underline">
                            <Upload size={14} /> {log.file_name || 'تنزيل المرفق'}
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
