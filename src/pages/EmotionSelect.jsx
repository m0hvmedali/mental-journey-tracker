/* ------------------------------------------------------------------
 src/pages/EmotionSelect.jsx
 - Grid بطاقات (إيجابي 🟢 / سلبي 🔴)
 - بحث فوري
 - Modal يفتح بكل التفاصيل من JSON
------------------------------------------------------------------- */
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, X, HeartPulse, BookOpen, Video, Globe, Users, Headphones, Smartphone, Brain, FileText,GraduationCap } from 'lucide-react';
import { contentService } from '@/services/contentService';
import Footer from '@/components/Footer';

/* تصنيف سريع */
const isPositive = (e) => /إيجاب/.test(e.family || '');

export default function EmotionSelect() {
 const nav = useNavigate();
 const [query, setQuery] = useState('');
 const [selected, setSelected] = useState(null);
 const [emotionsList, setEmotionsList] = useState([]);

 /* Load emotions from content service */
 useEffect(() => {
   contentService.getEmotionsEncyclopedia()
     .then(data => {
       if (Array.isArray(data)) {
         const formatted = data.map(item => {
           if (item.name && item.family) {
             return item;
           }
           const metadata = item.metadata || {};
           return {
             name: item.arabic_name || '',
             english_name: metadata.english_name || item.emotion_key || '',
             family: item.category || 'عام',
             type: metadata.type || 'ثانوي',
             definition: item.definition || '',
             triggers: Array.isArray(item.triggers) ? item.triggers : [],
             bodily_expression: {
               origin: metadata.origin_body_part || '',
               effects_on_body: Array.isArray(item.body_sensations) ? item.body_sensations : []
             },
             expressions: Array.isArray(item.healthy_expressions) ? item.healthy_expressions : []
           };
         });
         setEmotionsList(formatted);
       }
     })
     .catch(err => {
       console.warn('Could not load emotions encyclopedia:', err);
     });
 }, []);

 /* فلتر البحث */
 const filtered = useMemo(
 () => (emotionsList || []).filter(
 (e) => {
 const q = (query || '').toLowerCase();
 const nameStr = e?.name || '';
 const engStr = e?.english_name || '';
 return nameStr.includes(query || '') || engStr.toLowerCase().includes(q);
 }
 ),
 [emotionsList, query]
 );

 const positives = filtered.filter(isPositive);
 const negatives = filtered.filter((e) => !isPositive(e));

 /* -------- مكوّن البطاقة -------- */
 const Card = ({ e }) => (
 <button
 onClick={() => setSelected(e)}
 className={`p-3 rounded-xl shadow-sm text-right hover:shadow-md transition
 ${isPositive(e) ? 'bg-[#e6f7f0]' : 'bg-[#fff1f1]'}`}
 >
 <p className="font-bold text-sm text-text-primary leading-snug">{e.name}</p>
 <p className="text-xs text-text-muted">{e.english_name}</p>
 </button>
 );

 const emotionSources = [
 // كتب أساسية
 { 
 label:"الذكاء العاطفي - دانييل جولمان", 
 url:"https://www.goodreads.com/book/show/26329.Emotional_Intelligence", 
 icon: <BookOpen size={14} /> 
 },
 { 
 label:"فن إدارة المشاعر - د. إبراهيم الفقي", 
 url:"https://www.neelwafurat.com/itempage.aspx?id=lbb224327-301614&search=books", 
 icon: <BookOpen size={14} /> 
 },
 
 // فيديوهات تعليمية
 { 
 label:"قناة د. أحمد عمارة (إدارة المشاعر)", 
 url:"https://www.youtube.com/@ahmedammarapsychology", 
 icon: <Video size={14} /> 
 },
 { 
 label:"سلسلة فهم المشاعر - TED Talks", 
 url:"https://www.ted.com/topics/emotions", 
 icon: <Video size={14} /> 
 },
 
 // مواقع وتطبيقات
 { 
 label:"منصة recovery للصحة النفسية", 
 url:"https://hayatipsych.com", 
 icon: <Globe size={14} /> 
 },
 { 
 label:"تطبيق MoodKit (إدارة المشاعر)", 
 url:"https://moodkitapp.com", 
 icon: <Smartphone size={14} /> 
 },
 { 
 label:"دليل المشاعر من جمعية علم النفس الأمريكية", 
 url:"https://www.apa.org/topics/emotions", 
 icon: <Globe size={14} /> 
 },
 
 // تمارين عملية
 { 
 label:"أوراق عمل تنظيم المشاعر (Therapist Aid)", 
 url:"https://www.therapistaid.com/therapy-worksheets/emotions", 
 icon: <FileText size={14} /> 
 },
 { 
 label:"تمارين اليقظة لإدارة المشاعر", 
 url:"https://www.mindful.org/category/meditation/mindfulness-of-emotions/", 
 icon: <Brain size={14} /> 
 },
 
 // دعم مجتمعي
 { 
 label:"مجموعات الدعم العاطفي (7cups)", 
 url:"https://www.7cups.com", 
 icon: <Users size={14} /> 
 },
 { 
 label:"منصة شيزلونج للاستشارات النفسية", 
 url:"https://www.shezlong.com", 
 icon: <Users size={14} /> 
 },
 
 // بودكاست
 { 
 label:"بودكاست عقول مع د. عبدالله السبيعي", 
 url:"https://soundcloud.com/aqwal", 
 icon: <Headphones size={14} /> 
 },
 { 
 label:"The Happiness Lab - د. لوري سانتوس", 
 url:"https://www.happinesslab.fm", 
 icon: <Headphones size={14} /> 
 },
 
 // مراجع علمية
 { 
 label:"مركز جامعة بيركلي لعلوم المشاعر", 
 url:"https://greatergood.berkeley.edu", 
 icon: <GraduationCap size={14} /> 
 },
 { 
 label:"دليل المشاعر الأساسية (باول إيكمان)", 
 url:"https://www.paulekman.com/universal-emotions/", 
 icon: <BookOpen size={14} /> 
 }
 ];

 return (
 <div className="min-h-screen bg-bg-app px-4 py-6 font-sans">
 {/* Header */}
 <header className="flex items-center mb-6">
 <button onClick={() => nav(-1)} className="p-2 mr-2 text-text-primary">
 <ArrowLeft size={24} />
 </button>
 <h1 className="flex-1 text-center pr-8 text-lg font-bold text-text-primary">
 تحديد المشاعر
 </h1>
 </header>

 {/* Search */}

 {/* <input */}
 
 <div className="relative w-full max-w-md">
 <span className="absolute right-3 top-[9px] flex items-center text-gray-400">
 <Search className="w-4 h-4" />
 </span>
 <input 
 type="text"
 placeholder="search"
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 className="w-full mb-6 h-10 rounded-xl bg-bg-surface px-4 border border-border-medium focus:ring-0 focus:outline-none text-sm"
 /> 
</div>
 

 {/* Sections */}
 <Section title="مشاعر إيجابيّة" items={positives} Card={Card} />
 <Section title="مشاعر سلبية / حياديّة" items={negatives} Card={Card} />

 {/* Modal */}
 {selected && (
 <Modal onClose={() => setSelected(null)}>
 <EmotionDetails e={selected} />
 </Modal>
 )}


 {/* Footer */}
 <Footer sources={emotionSources} />
 </div>
 );
}

/* -------- مكوّن القسم GRID -------- */
function Section({ title, items, Card }) {
 if (!items.length) return null;
 return (
 <div className="mb-10">
 <h2 className="mb-3 text-lg font-bold text-text-primary">
 {title}{' '}
 <span className="text-sm text-text-muted">({items.length})</span>
 </h2>
 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
 {items.map((e) => (
 <Card key={e.name} e={e} />
 ))}
 </div>
 </div>
 );
}

/* -------- Modal عام -------- */
function Modal({ children, onClose }) {
 return (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
 <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-bg-surface rounded-xl p-5">
 <button
 onClick={onClose}
 className="absolute top-3 left-3 text-text-muted hover:text-text-primary"
 >
 <X size={20} />
 </button>
 {children}
 </div>
 </div>
 );
}

/* -------- تفاصيل الشعور داخل المودال -------- */
function EmotionDetails({ e }) {
 const label = {
 definition: 'التعريف',
 type: 'النوع',
 family: 'العائلة',
 triggers: 'المحفزات',
 components: 'المكونات',
 bodily_expression: 'تعبير جسدي / دماغي',
 cognitive_effects: 'التأثيرات المعرفية',
 psychological_effects: 'التأثيرات النفسية',
 social_effects: 'التأثيرات الاجتماعية',
 expressions: 'جمل تعبيرية',
 expression: 'جمل تعبيرية',
 };

 /* ترتيب الحقول كما نحب عرضها */
 const order = [
 'definition',
 'type',
 'family',
 'triggers',
 'components',
 'bodily_expression',
 'cognitive_effects',
 'psychological_effects',
 'social_effects',
 'expressions',
 'expression',
 ];

 return (
 <>
 <h2 className="text-xl font-bold text-text-primary mb-4">{e.name}</h2>
 {order.map((k) => {
 if (!(k in e)) return null;
 const v = e[k];
 return (
 <section key={k} className="mb-4">
 <h3 className="font-semibold text-text-primary mb-1">{label[k]}</h3>

 {Array.isArray(v) ? (
 <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
 {v.map((x, i) => (
 <li key={i}>{x}</li>
 ))}
 </ul>
 ) : typeof v === 'object' ? (
 /* لو الكائن داخله arrays */
 Object.entries(v).map(([subKey, subVal]) => (
 <div key={subKey} className="mb-2">
 <p className="font-medium text-text-muted text-sm mb-1">
 {subKey.replace(/_/g, ' ')}
 </p>
 {Array.isArray(subVal) ? (
 <ul className="list-disc list-inside space-y-1 text-sm text-text-secondary">
 {subVal.map((x, i) => (
 <li key={i}>{x}</li>
 ))}
 </ul>
 ) : (
 <p className="text-sm text-text-secondary whitespace-pre-wrap">
 {subVal}
 </p>
 )}
 </div>
 ))
 ) : (
 <p className="text-sm text-text-secondary whitespace-pre-wrap">{v}</p>
 )}
 </section>
 );
 })}
 </>
 );
}
