// src/pages/CalmingExercises.jsx
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
 ArrowLeft, Wind, Waves, BrainCog, Heart, Play, X, Feather, 
 Music, Leaf, Coffee, Activity, ChevronRight, Clock, User, Target
} from 'lucide-react';
import { updateProgress } from '../utils/progress';

export default function CalmingExercises() {
 const nav = useNavigate();
 const [playerOpen, setPlayerOpen] = useState(false);
 const [activeExercise, setActiveExercise] = useState(null);
 const [modalOpen, setModalOpen] = useState(false);
 const [selectedCategory, setSelectedCategory] = useState('all');

 const exercises = {
 breathing: {
 label: 'تنفس 4-4-4',
 category: 'التهدئة',
 duration: '2-5 دقائق',
 icon: <Wind size={24} className="text-emerald-600" />,
 description: 'استنشق 4 ثواني، احبس النفس 4 ثواني، أخرج الزفير 4 ثواني لتقليل التوتر بسرعة.',
 steps: [
 'استنشق الهواء عبر أنفك لمدة 4 ثوانٍ.',
 'احبس النفس لمدة 4 ثوانٍ.',
 'أخرج الزفير ببطء عبر الفم لمدة 4 ثوانٍ.',
 'كرر الدورة 6 إلى 8 مرات.'
 ]
 },
 safePlace: {
 label: 'مكانك الآمن',
 category: 'التخيل',
 duration: '3-5 دقائق',
 icon: <Waves size={24} className="text-emerald-600" />,
 description: 'تخيل مكاناً تشعر فيه بالأمان مع التركيز على التفاصيل الحسية.',
 steps: [
 'اجلس أو استلقِ في مكان مريح.',
 'اغمض عينيك وتخيل مكاناً تشعر فيه بالأمان.',
 'ركّز على التفاصيل الحسية: ما تراه، تسمعه، تشمه.',
 'اقضِ 3-5 دقائق في هذا التمرين.'
 ]
 },
 cognitive: {
 label: 'إعادة الهيكلة المعرفية',
 category: 'التفكير',
 duration: '5-10 دقائق',
 icon: <BrainCog size={24} className="text-emerald-600" />,
 description: 'دوّن فكرة سلبية وأسأل: هل هناك دليل؟ ما البديل؟ لتغيير النظرة.',
 steps: [
 'اكتب الفكرة السلبية في ورقة.',
 'اسأل نفسك: ما الأدلة التي تدعم هذه الفكرة؟',
 'ما الأدلة المعاكسة؟',
 'صغ فكرة بديلة أكثر توازناً.'
 ]
 },
 pmr: {
 label: 'الاسترخاء التدريجي',
 category: 'التهدئة',
 duration: '7-10 دقائق',
 icon: <Feather size={24} className="text-emerald-600" />,
 description: 'شد عضلة لبضع ثوانٍ ثم أرخيها، وانتقل عبر مجموعات الجسم.',
 steps: [
 'اختر مجموعة عضلية (مثل اليد أو الكتف).',
 'اشدها ببطء لمدة 5 ثوانٍ.',
 'ارخِها فجأة وركز على الشعور بالاسترخاء.',
 'انتقل للمجموعة التالية حتى الجسم بأكمله.'
 ]
 },
 imagery: {
 label: 'التخيل الموجَّه',
 category: 'التخيل',
 duration: '3-5 دقائق',
 icon: <Music size={24} className="text-emerald-600" />,
 description: 'استمع لوصف صوتي أو صمم مشهداً هادئاً ذهنياً مع تفاصيل حسية.',
 steps: [
 'اختر مشهداً طبيعياً هادئاً أو مكاناً مفضلاً.',
 'اغمض عينيك وتصور التفاصيل: الألوان، الأصوات، الروائح.',
 'اقضِ 3-5 دقائق في هذا المشهد الذهني.'
 ]
 },
 grounding: {
 label: 'الحواس الخمسة',
 category: 'التركيز',
 duration: '1-2 دقائق',
 icon: <Leaf size={24} className="text-emerald-600" />,
 description: 'اذكر 5 تراها، 4 تشمها، 3 تسمعها، 2 تلمسها، 1 تتذوقها.',
 steps: [
 'اذكر 5 أشياء تراها حولك.',
 'اذكر 4 أشياء تشمها.',
 'اذكر 3 أشياء تسمعها.',
 'اذكر 2 تلمسهما.',
 'اذكر 1 شيء تتذوقه.'
 ]
 },
 selfCompassion: {
 label: 'التحادث الذاتي الرحيم',
 category: 'التفكير',
 duration: '2-3 دقائق',
 icon: <Heart size={24} className="text-emerald-600" />,
 description: 'كرر عبارات داعمة مثل: أنا أستحق الحب والاهتمام.',
 steps: [
 'اختر عبارة داعمة مثل:"أنا أستحق الحنو والاهتمام".',
 'كررها بصوت منخفض أو بصمت.',
 'تخيل أنك تتحدث إلى صديق مقرب.'
 ]
 },
 energize: {
 label: 'الحركة التنشيطية',
 category: 'النشاط',
 duration: '2-3 دقائق',
 icon: <Activity size={24} className="text-emerald-600" />,
 description: 'قم بتمارين تمدد بسيطة أو امشِ في المكان لرفع الطاقة إيجابياً.',
 steps: [
 'قم بتمارين تمدد بسيطة (ذراعين، رقبة، ظهرك).',
 'امشِ في المكان لمدة دقيقتين.',
 'تنفّس بعمق أثناء الحركة.'
 ]
 }
 };

 const categories = [
 { id: 'all', label: 'الكل', icon: <Target size={16} /> },
 { id: 'التهدئة', label: 'التهدئة', icon: <Leaf size={16} /> },
 { id: 'التخيل', label: 'التخيل', icon: <BrainCog size={16} /> },
 { id: 'التفكير', label: 'التفكير', icon: <User size={16} /> },
 { id: 'التركيز', label: 'التركيز', icon: <Clock size={16} /> },
 { id: 'النشاط', label: 'النشاط', icon: <Activity size={16} /> }
 ];

 const startExercise = (id) => {
 const ex = exercises[id];
 updateProgress({ timeline: { label: `بدأ تمرين ${ex.label}` }, entries: 1 });
 setActiveExercise(id);
 setModalOpen(true);
 if (id === 'breathing') setPlayerOpen(true);
 };

 const BreathingPlayer = () => {
 const CYCLE = [
 { phase: 'شهيق', secs: 4 },
 { phase: 'حَبْس', secs: 4 },
 { phase: 'زفير', secs: 4 }
 ];
 const [idx, setIdx] = useState(0);
 const [time, setTime] = useState(CYCLE[0].secs);

 useEffect(() => {
 const int = setInterval(() => {
 setTime(t => { 
 if (t > 1) return t - 1; 
 const next = (idx + 1) % CYCLE.length; 
 setIdx(next); 
 return CYCLE[next].secs; 
 });
 }, 1000);
 return () => clearInterval(int);
 }, [idx]);

 const current = CYCLE[idx];
 const progress = (100 * (current.secs - time)) / current.secs;

 return (
 <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
 <div className="bg-bg-surface rounded-2xl p-6 w-full max-w-sm flex flex-col items-center relative">
 <button onClick={() => setPlayerOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
 <X size={24} />
 </button>
 
 <div className="w-48 h-48 relative mb-6">
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-full h-full rounded-full bg-bg-surface-hover flex items-center justify-center">
 <div 
 className="absolute w-full h-full rounded-full border-8 border-emerald-600"
 style={{
 clipPath: `inset(0 ${100 - progress}% 0 0)`
 }}
 ></div>
 </div>
 </div>
 <div className="absolute inset-0 flex flex-col items-center justify-center">
 <h2 className="text-2xl font-bold text-text-primary">{current.phase}</h2>
 <p className="text-4xl font-semibold text-emerald-600 mt-2">{time}</p>
 </div>
 </div>
 
 <div className="flex items-center justify-center space-x-2 w-full">
 {CYCLE.map((phase, i) => (
 <div 
 key={i} 
 className={`flex-1 py-2 rounded-lg text-center ${
 idx === i ? 'bg-emerald-600 text-white' : 'bg-bg-surface-hover text-emerald-600'
 }`}
 >
 <span className="block text-sm font-medium">{phase.phase}</span>
 <span className="block text-xs">{phase.secs} ثانية</span>
 </div>
 ))}
 </div>
 
 <p className="mt-6 text-sm text-text-muted text-center">
 تنفس بعمق وهدوء... هذا التمرين يساعد على تنظيم الجهاز العصبي
 </p>
 </div>
 </div>
 );
 };

 const Modal = () => {
 if (!modalOpen || !activeExercise) return null;
 const ex = exercises[activeExercise];
 return (
 <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
 <div className="bg-bg-surface rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
 <div className="bg-emerald-600 p-4 text-white">
 <div className="flex justify-between items-start">
 <div>
 <h2 className="text-2xl font-bold">{ex.label}</h2>
 <div className="flex items-center mt-1 space-x-3">
 <span className="flex items-center text-sm bg-bg-surface/20 px-2 py-1 rounded-full">
 <Clock size={14} className="mr-1" /> {ex.duration}
 </span>
 <span className="flex items-center text-sm bg-bg-surface/20 px-2 py-1 rounded-full">
 {ex.category}
 </span>
 </div>
 </div>
 <button 
 onClick={() => { setModalOpen(false); setPlayerOpen(false); }} 
 className="text-white hover:text-gray-200"
 >
 <X size={24} />
 </button>
 </div>
 </div>
 
 <div className="p-5">
 <p className="text-text-secondary mb-4">{ex.description}</p>
 
 <h3 className="font-bold text-lg text-text-primary mb-3">خطوات التمرين:</h3>
 <ol className="space-y-3">
 {ex.steps.map((step, i) => (
 <li key={i} className="flex items-start">
 <div className="flex-shrink-0 w-8 h-8 rounded-full bg-bg-surface-hover text-emerald-600 flex items-center justify-center mr-3 mt-0.5">
 {i + 1}
 </div>
 <p className="text-text-secondary">{step}</p>
 </li>
 ))}
 </ol>
 
 {activeExercise === 'breathing' && (
 <div className="mt-5 p-3 bg-bg-surface-hover rounded-lg border border-border-medium">
 <p className="text-sm text-text-muted">
 يمكنك استخدام الأداة التفاعلية لمتابعة العد والتوجيه أثناء التمرين.
 </p>
 </div>
 )}
 
 <button 
 onClick={() => {
 if (activeExercise === 'breathing') setPlayerOpen(true);
 setModalOpen(false);
 }}
 className="w-full mt-6 py-3 bg-emerald-600 hover:bg-[#3e8668] text-white rounded-xl font-bold flex items-center justify-center"
 >
 <Play size={20} className="ml-2" /> ابدأ التمرين الآن
 </button>
 </div>
 </div>
 </div>
 );
 };

 const filteredExercises = Object.entries(exercises)
 .filter(([key, ex]) => selectedCategory === 'all' || ex.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-bg-app text-text-primary p-4 sm:p-6 pb-44 sm:pb-52 space-y-6 max-w-3xl mx-auto w-full" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center gap-3 mb-2">
        <button 
          onClick={() => nav(-1)} 
          className="size-10 rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover flex items-center justify-center transition-all shrink-0 active:scale-95"
          aria-label="رجوع"
        >
          <ArrowLeft size={20} className="rtl:rotate-180" />
        </button>
        <h2 className="flex-1 text-center text-lg sm:text-xl font-bold text-text-primary">تمارين التهدئة وإدارة المشاعر</h2>
        <div className="size-10 shrink-0" />
      </header>
 
      {/* Introduction */}
      <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-4">
        <p className="text-text-secondary text-center text-sm font-medium">
          اختر التمرين المناسب لحالتك الحالية. هذه التمارين تساعدك على:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle/50">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Leaf size={16} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-text-secondary">تقليل التوتر والقلق</span>
          </div>
          <div className="flex items-center gap-2.5 bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle/50">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <BrainCog size={16} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-text-secondary">تحسين التركيز</span>
          </div>
          <div className="flex items-center gap-2.5 bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle/50">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Heart size={16} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-text-secondary">تنظيم المشاعر</span>
          </div>
          <div className="flex items-center gap-2.5 bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle/50">
            <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0">
              <Activity size={16} />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-text-secondary">زيادة الطاقة</span>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="space-y-2.5">
        <h3 className="font-bold text-sm text-text-primary">التصنيفات:</h3>
        <div className="flex overflow-x-auto pb-2 gap-2.5 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl whitespace-nowrap text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedCategory === cat.id 
                  ? 'bg-emerald-600 text-white shadow-2xs' 
                  : 'bg-bg-surface text-text-secondary border border-border-subtle hover:bg-bg-surface-hover'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>
      
      {/* Exercises List */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-text-primary">التمارين المتاحة:</h3>
        
        <div className="space-y-4">
          {filteredExercises.map(([key, ex]) => (
            <div 
              key={key} 
              className="bg-bg-surface rounded-2xl p-4 sm:p-5 flex gap-3.5 sm:gap-4 items-start border border-border-subtle shadow-2xs hover:shadow-md transition-all cursor-pointer active:scale-99"
              onClick={() => startExercise(key)}
            >
              <div className="shrink-0 size-12 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                {ex.icon}
              </div>
              <div className="flex-1 space-y-2.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-text-primary truncate">{ex.label}</h3>
                  <div className="flex items-center gap-1 text-xs text-text-muted bg-bg-surface-elevated px-2.5 py-1 rounded-full shrink-0 font-medium">
                    <Clock size={12} className="shrink-0" />
                    <span>{ex.duration}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  {ex.description}
                </p>
                <div className="flex items-center justify-between pt-2.5 border-t border-border-subtle/60 gap-2">
                  <span className="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-bold rounded-full">
                    {ex.category}
                  </span>
                  <button className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    <span>ابدأ الآن</span>
                    <ChevronRight size={16} className="rtl:rotate-180" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Breathing Player */}
      {playerOpen && <BreathingPlayer />}
      
      {/* Exercise Details Modal */}
      {modalOpen && <Modal />}
      
      {/* Footer Tips */}
      <div className="bg-bg-surface rounded-2xl p-5 border border-emerald-500/30 shadow-2xs space-y-3.5 mt-2 mb-8">
        <div className="flex items-center gap-2.5">
          <div className="size-7 rounded-xl bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold shrink-0 text-sm">
            💡
          </div>
          <h3 className="font-bold text-base text-text-primary">نصائح للاستفادة القصوى:</h3>
        </div>
        <ul className="space-y-3 text-xs sm:text-sm text-text-secondary leading-relaxed">
          <li className="flex items-start gap-2.5">
            <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <span>اختر مكاناً هادئاً ومريحاً لممارسة التمارين.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <span>مارس التمارين بانتظام للحصول على أفضل النتائج وتهدئة الجهاز العصبي.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <span className="size-5 rounded-full bg-emerald-500/10 text-emerald-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">✓</span>
            <span>لا تتردد في تعديل التمارين لتناسب احتياجاتك وحدودك الشخصية.</span>
          </li>
        </ul>
      </div>
 </div>
 );
}