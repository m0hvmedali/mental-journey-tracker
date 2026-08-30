// src/components/wellness/StickyNoteOverlay.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
 X, 
 Check, 
 MapPin, 
 Trash2, 
 Plus, 
 ExternalLink
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { saveNote, deleteNote, getNotes } from '../../services/notesService';

// Color themes for notes
const COLOR_THEMES = [
 { id: 'emerald', bg: 'bg-emerald-50 border-emerald-300 text-emerald-950 ', accent: 'bg-emerald-500' },
 { id: 'lavender', bg: 'bg-purple-50 dark:bg-[#201828] border-purple-300 dark:border-[#382640] text-purple-950 ', accent: 'bg-purple-500' },
 { id: 'amber', bg: 'bg-amber-50 dark:bg-[#282118] border-amber-300 dark:border-[#403326] text-amber-950 ', accent: 'bg-amber-500' },
 { id: 'sky', bg: 'bg-sky-50 dark:bg-[#182328] border-sky-300 dark:border-[#263840] text-sky-950 ', accent: 'bg-sky-500' },
 { id: 'cream', bg: 'bg-stone-50 dark:bg-[#202020] border-stone-300 dark:border-[#333333] text-stone-950 ', accent: 'bg-stone-500' },
];

// Helper to deduce a clean human title from the path
function getHumanPageTitle(pathname) {
 if (pathname === '/home') return 'الرئيسية';
 if (pathname === '/diary') return 'يوميات المشاعر والملاحظات';
 if (pathname === '/progress') return 'صفحة التقدم والحديقة';
 if (pathname === '/community') return 'مجتمع الامتنان';
 if (pathname === '/wheel') return 'عجلة الحياة والمشاعر';
 if (pathname === '/modules') return 'وحدات التأمل والتعلم';
 if (pathname.includes('/modules/anxiety')) return 'فهم القلق والتعامل معه';
 if (pathname.includes('/modules/thinking-errors')) return 'أخطاء التفكير الشائعة';
 if (pathname.includes('/modules/defense-mechanisms')) return 'حيل الدفاع النفسي';
 if (pathname.includes('/modules/emotional-regulation')) return 'التنظيم العاطفي';
 if (pathname.includes('/modules/relationship-dynamics')) return 'ديناميكيات العلاقات';
 if (pathname.includes('/modules/self-compassion')) return 'شفقة الذات والرفق بها';
 if (pathname.includes('/Breathing478')) return 'تمرين التنفس 4-7-8';
 if (pathname.includes('/DBTTipp')) return 'مهارات DBT TIP';
 if (pathname.includes('/ACTSkills')) return 'مهارات القبول والالتزام ACT';
 if (pathname.includes('/SFBTSkills')) return 'العلاج الموجه بالحلول SFBT';
 if (pathname.includes('/PsychodynamicSkills')) return 'مفاهيم الديناميكية النفسية';
 if (pathname.includes('/CognitiveReappraisal')) return 'إعادة التقييم المعرفي';
 
 return document.title || pathname;
}

export default function StickyNoteOverlay({ onClose }) {
 const location = useLocation();
 const nav = useNavigate();
 const currentPath = location.pathname;
 const pageTitle = getHumanPageTitle(currentPath);

 const [notes, setNotes] = useState([]);
 const [activeNoteId, setActiveNoteId] = useState(null);
 const [content, setContent] = useState('');
 const [color, setColor] = useState('emerald');
 const [saveState, setSaveState] = useState('idle'); // 'idle' | 'saving' | 'saved'
 const saveTimeoutRef = useRef(null);

 // Load existing notes
 const loadUserNotes = async () => {
 const list = await getNotes();
 setNotes(list);

 // If there's a note for current path, select it, otherwise start new
 const currentNote = list.find(n => n.source_path === currentPath);
 if (currentNote) {
 setActiveNoteId(currentNote.id);
 setContent(currentNote.content);
 setColor(currentNote.color || 'emerald');
 } else if (list.length > 0) {
 // Start a new blank note for current path
 startNewNote();
 } else {
 startNewNote();
 }
 };

 useEffect(() => {
 loadUserNotes();
 }, [currentPath]);

 const startNewNote = () => {
 setActiveNoteId(null);
 setContent('');
 setColor('emerald');
 setSaveState('idle');
 };

 // Debounced auto-save effect
 useEffect(() => {
 if (!content.trim() && !activeNoteId) return;

 if (saveTimeoutRef.current) {
 clearTimeout(saveTimeoutRef.current);
 }

 setSaveState('saving');

 saveTimeoutRef.current = setTimeout(async () => {
 if (content.trim()) {
 const saved = await saveNote({
 id: activeNoteId,
 content,
 color,
 source_path: currentPath,
 source_title: pageTitle,
 });

 if (!activeNoteId && saved?.id) {
 setActiveNoteId(saved.id);
 }

 setSaveState('saved');
 const updatedList = await getNotes();
 setNotes(updatedList);

 setTimeout(() => setSaveState('idle'), 2500);
 } else {
 setSaveState('idle');
 }
 }, 600);

 return () => {
 if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
 };
 }, [content, color, currentPath, pageTitle, activeNoteId]);

 const handleDelete = async (idToDelete) => {
 await deleteNote(idToDelete);
 if (activeNoteId === idToDelete) {
 startNewNote();
 }
 const updated = await getNotes();
 setNotes(updated);
 };

 const selectExistingNote = (note) => {
 setActiveNoteId(note.id);
 setContent(note.content);
 setColor(note.color || 'emerald');
 };

 const currentTheme = COLOR_THEMES.find(t => t.id === color) || COLOR_THEMES[0];

 return (
 <div 
 dir="rtl"
 className="w-[330px] sm:w-[370px] bg-bg-surface text-text-primary rounded-3xl border border-border-medium shadow-md p-4 sm:p-5 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-200"
 >
 {/* Header */}
 <div className="flex items-center justify-between border-b border-border-subtle pb-3">
 <div className="flex items-center gap-2">
 <div className="size-8 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 flex items-center justify-center font-bold text-sm shrink-0">
 📝
 </div>
 <div>
 <h4 className="text-xs font-semibold text-slate-500 ">الملاحظة الذكية الحية</h4>
 <div className="flex items-center gap-1 text-xs font-bold text-text-primary">
 <MapPin size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
 <span className="truncate max-w-[170px]">{pageTitle}</span>
 </div>
 </div>
 </div>

 <div className="flex items-center gap-1.5">
 <button
 onClick={startNewNote}
 className="p-1.5 rounded-xl bg-bg-surface-hover hover:bg-bg-surface-hover dark:hover:bg-bg-surface-hover text-text-secondary transition-colors shrink-0"
 title="ملاحظة جديدة"
 aria-label="ملاحظة جديدة"
 >
 <Plus size={16} className="shrink-0" />
 </button>
 <button
 onClick={onClose}
 className="p-1.5 rounded-xl bg-bg-surface-hover hover:bg-bg-surface-hover dark:hover:bg-bg-surface-hover text-slate-500 hover:text-text-primary dark:hover:text-slate-200 transition-colors shrink-0"
 aria-label="إغلاق الملاحظة"
 >
 <X size={16} className="shrink-0" />
 </button>
 </div>
 </div>

 {/* Note Color Picker */}
 <div className="flex items-center justify-between gap-2 bg-bg-surface-elevated p-2 rounded-2xl border border-border-subtle">
 <span className="text-[11px] font-semibold text-slate-500 ">لون الورقة:</span>
 <div className="flex items-center gap-1.5">
 {COLOR_THEMES.map((theme) => (
 <button
 key={theme.id}
 onClick={() => setColor(theme.id)}
 className={`size-5 rounded-full transition-all ${theme.accent} ${
 color === theme.id ? 'ring-2 ring-slate-900 dark:ring-white ring-offset-1 scale-110' : 'opacity-70 hover:opacity-100'
 }`}
 title={theme.id}
 />
 ))}
 </div>
 </div>

 {/* Text Area Sticky Paper */}
 <div className={`p-3.5 rounded-2xl border ${currentTheme.bg} shadow-2xs space-y-2 transition-all`}>
 <textarea
 value={content}
 onChange={(e) => setContent(e.target.value)}
 placeholder="اكتب خاطرتك أو ملاحظتك هنا... وسيتم حفظها تلقائياً مع رابط الصفحة..."
 rows={4}
 className="w-full bg-transparent text-xs sm:text-sm font-medium focus:outline-none resize-none leading-relaxed placeholder-slate-400 dark:placeholder-slate-500"
 />

 {/* Footer Status inside Note Paper */}
 <div className="flex items-center justify-between border-t border-slate-900/10 dark:border-white/10 pt-2 text-[10px] font-semibold">
 <div className="flex items-center gap-1 text-text-muted ">
 {saveState === 'saving' && (
 <span className="flex items-center gap-1 text-amber-700 dark:text-amber-400 animate-pulse">
 <span>جاري الحفظ...</span>
 </span>
 )}
 {saveState === 'saved' && (
 <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
 <Check size={12} className="shrink-0" />
 <span>تم الحفظ تلقائياً ✓</span>
 </span>
 )}
 {saveState === 'idle' && (
 <span className="opacity-70">محفوظة محلياً وفي قاعدة البيانات</span>
 )}
 </div>

 {activeNoteId && (
 <button
 onClick={() => handleDelete(activeNoteId)}
 className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 p-1 hover:bg-rose-100/50 rounded-lg transition-colors"
 title="حذف هذه الملاحظة"
 >
 <Trash2 size={13} className="shrink-0" />
 </button>
 )}
 </div>
 </div>

 {/* Previous Notes Drawer / Quick Switcher */}
 {notes.length > 0 && (
 <div className="space-y-2">
 <div className="flex items-center justify-between">
 <span className="text-[11px] font-bold text-slate-500 ">ملاحظاتك السابقة ({notes.length}):</span>
 <button
 onClick={() => nav('/diary')}
 className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
 >
 <span>فتح سجل الملاحظات اليومية</span>
 <ExternalLink size={12} className="shrink-0" />
 </button>
 </div>

 <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1 text-xs">
 {notes.map((n) => (
 <div
 key={n.id}
 onClick={() => selectExistingNote(n)}
 className={`p-2 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
 activeNoteId === n.id
 ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-950 '
 : 'bg-bg-surface-elevated border-border-medium text-text-secondary hover:bg-bg-surface-hover dark:hover:bg-[#1f382f]'
 }`}
 >
 <div className="truncate max-w-[200px]">
 <p className="truncate font-medium">{n.content || 'ملاحظة فارغة'}</p>
 <p className="text-[9px] text-slate-400 font-normal">
 {n.source_title} • {new Date(n.created_at).toLocaleDateString('ar-EG')}
 </p>
 </div>
 {n.source_path !== currentPath && (
 <button
 onClick={(e) => {
 e.stopPropagation();
 nav(n.source_path);
 }}
 className="text-[10px] px-2 py-0.5 rounded-lg bg-bg-surface border border-border-medium hover:bg-bg-surface-hover dark:hover:bg-emerald-900 text-text-muted font-bold shrink-0"
 title="الذهاب للموقع الأصلي"
 >
 الانتقال
 </button>
 )}
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
}
