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

/* 🔐 util لتحويل الـBlob إلى Base64 */

export default function DiaryEntry() {
  const nav = useNavigate();
  const [audioBlob, setAudioBlob] = useState(null)

  /* UI states */
  const [text, setText] = useState('');
  const [intensity, setIntensity] = useState(5);
  const [selectedEmotions, setSelectedEmotions] = useState([]);
  const [showEmotionPicker, setShowEmotionPicker] = useState(false);
  const [thoughtChallenge, setThoughtChallenge] = useState('');

  /* audio */
  const [recording, setRecording] = useState(false);
  const [audioURL, setAudioURL] = useState('');
  const mediaRef = useRef(null);
  const chunks = useRef([]);

  /* file upload */
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  /* logs */
  const [logs, setLogs] = useState([]);
  const [expandedLog, setExpandedLog] = useState(null);
  const toggleLogExpand = (id) => {
    setExpandedLog(prev => (prev === id ? null : id));
  };
  
  /* قائمة المشاعر المتاحة */
  const emotions = [
    { id: 'happy', label: 'سعادة', icon: <Smile size={16} />, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'sad', label: 'حزن', icon: <Frown size={16} />, color: 'bg-blue-100 text-blue-800' },
    { id: 'angry', label: 'غضب', icon: <Activity size={16} />, color: 'bg-red-100 text-red-800' },
    { id: 'neutral', label: 'حياد', icon: <Meh size={16} />, color: 'bg-gray-100 text-gray-800' },
    { id: 'love', label: 'حب', icon: <Heart size={16} />, color: 'bg-pink-100 text-pink-800' },
    { id: 'anxious', label: 'قلق', icon: <BookOpen size={16} />, color: 'bg-purple-100 text-purple-800' }
  ];
useEffect(() => {
  const fetchLogs = async () => {
    const username = localStorage.getItem('username')
    if (!username) return

    const { data, error } = await supabase
      .from('diary_logs')
      .select('*')
      .eq('user_id', username)
      .order('ts', { ascending: false })

    if (!error) setLogs(data)
    else console.error('Error loading diary logs:', error)
  }

  fetchLogs()
}, [])





const startRec = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const rec = new MediaRecorder(stream);
  rec.ondataavailable = (e) => chunks.current.push(e.data);
  rec.onstop = async () => {
    const blob = new Blob(chunks.current, { type: 'audio/webm' });
    chunks.current = [];
    setAudioBlob(blob);
    setRecording(false);
  };
  mediaRef.current = rec;
  rec.start();
  setRecording(true);
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


  /* --- Emotion handlers --- */
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
  
    const payload = {
      text,
      intensity,
      emotions: selectedEmotions,
      thought_challenge: thoughtChallenge,
    }
  
    try {
      if (audioBlob) {
        const audioUrl = await uploadMediaToStorage(audioBlob, 'audio', 'diary');
        payload.audio_url = audioUrl;
      }
  
      if (file) {
        const fileUrl = await uploadMediaToStorage(file, 'file', 'diary');
        payload.file_url = fileUrl;
        payload.file_name = file.name;
      }
  
      const newEntry = await saveTextToDB('diary_logs', payload);
      setLogs([newEntry, ...logs]);
  
      updateProgress({
        entries: 1,
        timeline: { label: 'تم تسجيل تدوينة مشاعر 🎙️✍️' }
      });
  
      // Reset
      setText('');
      setAudioBlob(null);
      setFile(null);
      setIntensity(5);
      setSelectedEmotions([]);
      setThoughtChallenge('');
    } catch (err) {
      console.error('Error saving diary entry:', err)
      alert('حصلت مشكلة أثناء الحفظ 😥');
    }
  }
  

  const deleteEntry = async (id) => {
    const { error } = await supabase
      .from('diary_logs')
      .delete()
      .eq('id', id)
  
    if (!error) {
      setLogs(logs.filter((entry) => entry.id !== id))
      if (expandedLog?.id === id) setExpandedLog(null)
    } else {
      console.error('Error deleting entry:', error)
    }
  }
  

  

  // مؤشر تسجيل صوتي متحرك
  const RecordingIndicator = () => (
    <div className="flex items-center gap-1 text-red-600 animate-pulse">
      <div className="w-3 h-3 rounded-full bg-red-600"></div>
      <div className="text-sm">جارٍ التسجيل...</div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f0f9f5] to-[#e0f0e9]" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center p-4 pb-2 bg-white shadow-sm">
        <button onClick={() => nav(-1)} className="text-[#0e1b15]">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#0e1b15]">يوميات مشاعرك</h2>
          <p className="text-xs text-[#5a8c76]">سجل مشاعرك وتحدى أفكارك السلبية</p>
        </div>
      </header>

      {/* Input area */}
      <div className="px-4 py-4 space-y-4">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="ماذا تشعر اليوم؟ اكتب مشاعرك هنا..."
            className="w-full bg-[#f9fbfa] p-3 rounded-lg min-h-[120px] focus:outline-none text-sm text-[#0e1b15] border border-[#e0e8e4]"
          />
          
          {/* Emotion selection */}
          <div className="mt-3">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm text-[#0e1b15] font-medium">المشاعر</label>
              <button 
                onClick={() => setShowEmotionPicker(!showEmotionPicker)}
                className="text-[#4e9778] text-xs flex items-center"
              >
                {showEmotionPicker ? 'إخفاء المشاعر' : 'اختيار المشاعر'}
                {showEmotionPicker ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            {showEmotionPicker && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {emotions.map(emotion => (
                  <button
                    key={emotion.id}
                    onClick={() => toggleEmotion(emotion.id)}
                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs ${
                      selectedEmotions.includes(emotion.id) 
                        ? `${emotion.color} border border-[#4e9778]`
                        : 'bg-[#f5fbf8] text-[#5a8c76]'
                    }`}
                  >
                    {emotion.icon}
                    <span className="mt-1">{emotion.label}</span>
                  </button>
                ))}
              </div>
            )}
            
            {/* Selected emotions */}
            {selectedEmotions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedEmotions.map(emotionId => {
                  const emotion = emotions.find(e => e.id === emotionId);
                  return (
                    <div 
                      key={emotionId} 
                      className={`flex items-center px-3 py-1 rounded-full text-xs ${emotion.color}`}
                    >
                      {emotion.icon}
                      <span className="mr-1">{emotion.label}</span>
                      <button 
                        onClick={() => toggleEmotion(emotionId)}
                        className="text-[#5a8c76] ml-1"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* Thought challenging */}
          <div className="mt-4">
            <label className="text-sm text-[#0e1b15] font-medium mb-2 block">
              تحدى أفكارك السلبية
            </label>
            <textarea
              value={thoughtChallenge}
              onChange={(e) => setThoughtChallenge(e.target.value)}
              placeholder="ما هي الفكرة السلبية التي ترغب في تحديها؟ وكيف يمكنك تحديها؟"
              className="w-full bg-[#f9fbfa] p-3 rounded-lg min-h-[80px] focus:outline-none text-sm text-[#0e1b15] border border-[#e0e8e4]"
            />
          </div>
        </div>

        {/* Intensity and attachments */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm text-[#0e1b15] font-medium">شدة المشاعر: {intensity}/10</label>
            <input 
              type="range" 
              min="1" 
              max="10" 
              value={intensity} 
              onChange={(e) => setIntensity(e.target.value)} 
              className="flex-1 ml-2 accent-[#30e898]" 
            />
          </div>

          {/* Audio + file buttons */}
          <div className="flex flex-wrap gap-3">
            {recording ? (
              <button 
                onClick={stopRec} 
                className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg"
              >
                <StopCircle size={20}/> إيقاف التسجيل
                <RecordingIndicator />
              </button>
            ) : (
              <button 
                onClick={startRec} 
                className="flex items-center gap-1 px-3 py-2 bg-[#e7f3ee] text-[#0e1b15] rounded-lg"
              >
                <Mic size={20}/> تسجيل صوتي
              </button>
            )}

            <button 
              onClick={() => fileInputRef.current.click()} 
              className="flex items-center gap-1 px-3 py-2 bg-[#e7f3ee] text-[#0e1b15] rounded-lg"
            >
              <Upload size={20}/> رفع ملف
            </button>
            <input type="file" hidden ref={fileInputRef} onChange={handleFile}/>
          </div>

          {/* previews */}
          {audioURL && (
            <div className="mt-3">
              <audio src={audioURL} controls className="w-full" />
            </div>
          )}
          
          {file && (
            <div className="mt-3 flex justify-between items-center bg-[#e9f1ee] p-3 rounded-lg">
              <div className="text-sm text-[#101915]">
                مرفق: {file.name}
              </div>
              <button 
                onClick={() => setFile(null)}
                className="text-[#5a8c76]"
              >
                <X size={18} />
              </button>
            </div>
          )}
        </div>

        <button 
          onClick={saveEntry} 
          className="w-full bg-gradient-to-r from-[#30e898] to-[#2bc48a] text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all"
        >
          حفظ التدوينة
        </button>
      </div>

      {/* Previous logs */}
      <div className="px-4 pb-10">
        <h3 className="text-[#0e1b15] font-bold text-lg mb-3">تدويناتك السابقة</h3>
        
        {logs.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center shadow-sm">
            <div className="flex justify-center mb-3">
              <BookOpen size={36} className="text-[#4e9778]" />
            </div>
            <p className="text-[#5a8c76]">لا يوجد أي تدوين بعد.</p>
            <p className="text-[#5a8c76] text-sm mt-1">ابدأ بتسجيل مشاعرك اليوم!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={`bg-white border border-[#e0e8e4] rounded-xl overflow-hidden transition-all ${
                  expandedLog === log.id ? 'shadow-md' : ''
                }`}
              >
                <div 
                  className="p-4 flex items-start cursor-pointer"
                  onClick={() => toggleLogExpand(log.id)}
                  >
                  <div className="flex-1">
                    <p className="text-xs text-[#5a8c76] mb-1">
                      {new Date(log.ts).toLocaleString('ar-EG', { 
                        dateStyle: 'medium', 
                        timeStyle: 'short' 
                      })}
                    </p>
                    
                    {log.text && (
                      <p className="text-[#0e1b15] text-sm mb-2 line-clamp-2">
                        {log.text}
                      </p>
                    )}
                    
                    {log.emotions && log.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {log.emotions.map(emotionId => {
                          const emotion = emotions.find(e => e.id === emotionId);
                          return (
                            <div 
                              key={emotionId} 
                              className={`flex items-center px-2 py-1 rounded-full text-xs ${emotion.color}`}
                            >
                              {emotion.icon}
                              <span className="mr-1">{emotion.label}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    <div className="flex items-center text-xs">
                      <span className="bg-[#e7f3ee] px-2 py-1 rounded-md text-[#0e1b15]">
                        شدة: {log.intensity}/10
                      </span>
                    </div>
                  </div>
                  
                  <div className="ml-2 flex flex-col items-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteEntry(log.id);
                      }} 
                      className="text-[#c0392b] mb-2"
                    >

                      <Trash2 size={18} />
                    </button>
                    {expandedLog === log.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
                
                {expandedLog === log.id && (
                  <div className="px-4 pb-4 border-t border-[#e0e8e4] pt-2">
                    {log.thoughtChallenge && (
                      <div className="mb-3">
                        <p className="text-xs text-[#5a8c76] font-medium mb-1">تحدي الأفكار:</p>
                        <p className="text-sm text-[#0e1b15] bg-[#f9fbfa] p-2 rounded-lg">
                          {log.thoughtChallenge}
                        </p>
                      </div>
                    )}
                    
                    {log.audio_url && (
                      <div className="mb-3">
                        <p className="text-xs text-[#5a8c76] font-medium mb-1">التسجيل الصوتي:</p>
                        <audio src={log.audio_url} controls className="w-full" />
                      </div>
                    )}
                    
                    {log.file_url && (
                      <div>
                        <p className="text-xs text-[#5a8c76] font-medium mb-1">الملف المرفق:</p>
                        <a 
                          href={log.file_url.data} 
                          download={log.file_url} 
                          className="inline-flex items-center gap-1 text-[#4e9778] text-sm bg-[#f0f9f4] px-3 py-1 rounded-lg"
                        >
                          <Upload size={14} />
                          {log.file_name || "تحميل الملف"}                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}