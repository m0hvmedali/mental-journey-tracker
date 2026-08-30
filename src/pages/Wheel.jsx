import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Heart, Smile, Meh, Frown, Activity, 
  BookOpen, ChevronDown, ChevronUp, Save, RefreshCw,
  Plus, Minus, Info, Check
} from 'lucide-react';
import MultiRingWheel from '../components/EmotionWheel.jsx';
import { updateProgress } from '../utils/progress';

const FEELINGS_WHEEL = [
  {
    core: 'سعيد',
    color: '#E8A856', // Dawn Light mapped
    desc: 'السعادة طاقة إيجابية تعكس رضا وامتنان وارتباط.',
    coping: ['شارك الامتنان مع الآخرين', 'سجّل اللحظة الجميلة كتابةً', 'مارس نشاطًا ممتعًا لتعزيز الشعور'],
    middle: [
      { name: 'مرح', outer: ['نبيه', 'ثائر'] },
      { name: 'قنوع', outer: ['مبتهج', 'حر'] },
      { name: 'مهتم', outer: ['متسائل', 'فضولي'] },
      { name: 'فخور', outer: ['واثق', 'ناجح'] },
      { name: 'مقبول', outer: ['قيم', 'محترم'] },
      { name: 'قوي', outer: ['ابداعي', 'شجاع'] },
      { name: 'مسالم', outer: ['شاكر', 'محب'] },
      { name: 'واثق', outer: ['ودود', 'حساس'] },
      { name: 'متفائل',outer: ['ملهم', 'متحمس'] },
    ],
  },
  {
    core: 'حزن',
    color: '#1C445C', // Nile Blue mapped
    desc: 'الحزن إشارة لفقد أو احتياج غير مُلبّى يستحق الرعاية.',
    coping: ['امنح نفسك إذنًا بالبكاء', 'اكتب رسالة وداع أو قبول', 'تواصل مع صديق داعم'],
    middle: [
      { name: 'مجروح', outer: ['مخيب', 'منحرج'] },
      { name: 'مكتئب', outer: ['خالي المشاعر', 'متدني'] },
      { name: 'مذنب', outer: ['خجول', 'نادم'] },
      { name: 'بائس', outer: ['حزين', 'عاجز'] },
      { name: 'ضعيف', outer: ['ضحية', 'هش'] },
      { name: 'وحيد', outer: ['مهجور', 'معزول'] },
    ],
  },
  {
    core: 'متفاجئ',
    color: '#B45330', // Nile Clay
    desc: 'المفاجأة رد فعل لحدث غير متوقع يلفت الانتباه للحظة الحاضرة.',
    coping: ['تنفّس بعمق قبل الحكم', 'لاحظ التفاصيل', 'دوّن ما تعلّمته'],
    middle: [
      { name: 'متحمس', outer: ['نشط', 'متلهف'] },
      { name: 'مندهش', outer: ['رهبة', 'مبهر'] },
      { name: 'متشكك', outer: ['متحير', 'خيبة أمل'] },
      { name: 'مذهول', outer: ['مصدوم', 'فزع'] },
    ],
  },
  {
    core: 'غاضب',
    color: '#8A837A', // Neutral muted mapped (avoid pure red)
    desc: 'الغضب طاقة دفاعية تحمي الحدود عند الشعور بالظلم.',
    coping: ['تنفّس 4-7-8 لتهدئة الجسد', 'اكتب ما أغضبك', 'حوّل الطاقة لتمرين بدني'],
    middle: [
      { name: 'خذلان', outer: ['خيانة', 'مستاء'] },
      { name: 'إذلال', outer: ['اضطهاد', 'سخرية'] },
      { name: 'حقد', outer: ['ناقم', 'انتهك'] },
      { name: 'عدواني', outer: ['استفزاز', 'شرس'] },
      { name: 'محبط', outer: ['محبط', 'منزعج'] },
      { name: 'منحرج', outer: ['متشكك', 'رافض'] },
      { name: 'متباعد', outer: ['منسحب', 'فاقد إحساس'] },
    ],
  },
  {
    core: 'مشمئز',
    color: '#2C4C3B', // Deep Palm mapped
    desc: 'الاشمئزاز يدفعك للابتعاد عما تعتبره غير مقبول.',
    coping: ['حافظ على نظافتك وحدودك', 'دوّن ما يثير الشعور', 'استخدم التنفّر لتقييم قيمك'],
    middle: [
      { name: 'نفور', outer: ['هلع', 'متردد'] },
      { name: 'فظيع', outer: ['كريه', 'مشمئز'] },
      { name: 'خائب أمل', outer: ['ثار', 'مروّع'] },
      { name: 'رافض', outer: ['منحرج', 'سريع الحكم'] },
    ],
  },
  {
    core: 'سئ',
    color: '#5A544D', // Text secondary mapped
    desc: 'الشعور بالسوء قد يدل على إرهاق أو توتر مزمن.',
    coping: ['خذ استراحة قصيرة', 'مارس التأمل 5 دقائق', 'تواصل مع شخص داعم'],
    middle: [
      { name: 'مضجر', outer: ['غير مكترث', 'بليد'] },
      { name: 'مشغول', outer: ['مضغوط', 'مستعجل'] },
      { name: 'مضغوط', outer: ['ارتباك', 'خارج السيطرة'] },
      { name: 'متعب', outer: ['نعسان', 'متشتت'] },
    ],
  },
];

const emotionIcons = {
  سعيد: <Smile size={24} />,
  حزن: <Frown size={24} />,
  متفاجئ: <BookOpen size={24} />,
  غاضب: <Activity size={24} />,
  مشمئز: <Meh size={24} />,
  سئ: <Heart size={24} />
};

export default function WheelPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [details, setDetails] = useState({ description: '', context: '' });
  const [showCoping, setShowCoping] = useState(false);
  const [saved, setSaved] = useState(false);
  const wheelRef = useRef(null);

  useEffect(() => {
    const updateSize = () => {
      if (wheelRef.current) {
        const width = Math.min(window.innerWidth * 0.9, 500);
        wheelRef.current.style.width = `${width}px`;
        wheelRef.current.style.height = `${width}px`;
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  const onSave = () => {
    if (!selected) return;
    
    const logs = JSON.parse(localStorage.getItem('feelingsLogs') ?? '[]');
    logs.push({ 
      feeling: selected.name, 
      intensity, 
      ...details, 
      ts: Date.now(),
      color: selected.coreColor
    });
    
    localStorage.setItem('feelingsLogs', JSON.stringify(logs));
    setDetails({ description: '', context: '' });
    setIntensity(5);
    setSaved(true);
    
    updateProgress({
      entries: 1,
      timeline: { label: `اختار شعور: ${selected.name} 🔄` }
    });
    
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSelection = () => {
    setSelected(null);
    setShowCoping(false);
    setDetails({ description: '', context: '' });
    setIntensity(5);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-app transition-colors duration-500 pb-20">
      {/* Header */}
      <header className="flex items-center p-6 justify-between bg-transparent z-10">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center w-10 h-10 rounded-sm border border-border-subtle bg-bg-surface text-text-primary hover:bg-bg-surface-hover"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-2xl font-display font-bold text-text-primary tracking-tight">عجلة المشاعر</h2>
        </div>
        <button 
          onClick={resetSelection}
          className="flex items-center justify-center w-10 h-10 rounded-sm border border-border-subtle bg-bg-surface text-text-primary hover:bg-bg-surface-hover"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Wheel Container: No generic card, floating in negative space */}
      <div className="flex justify-center p-4 my-4 relative z-0">
        <div ref={wheelRef} className="relative transition-all duration-500">
          <MultiRingWheel 
            data={FEELINGS_WHEEL} 
            onSelect={(emotion) => {
              setSelected(emotion);
              setShowCoping(false);
            }}
          />
        </div>
      </div>

      <div className="flex-1 px-4 max-w-2xl mx-auto w-full">
        {!selected ? (
          <div className="text-center space-y-4 pt-4">
            <h3 className="font-display text-lg text-text-primary font-bold">كيف تستخدم العجلة؟</h3>
            <p className="text-text-secondary text-sm leading-relaxed max-w-md mx-auto">
              اضغط على المشاعر الأساسية في المركز (الدوائر الملونة)، ثم تفرّع للطبقات الخارجية لتحديد الشعور الدقيق الذي يصف حالتك الآن.
            </p>
          </div>
        ) : (
          <div className="space-y-8 mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Emotion Path & Header */}
            <div className="text-center space-y-2 border-b border-border-subtle pb-6">
              <div className="flex items-center justify-center font-mono text-xs text-text-muted space-x-2 space-x-reverse mb-4">
                <span>{selected.core}</span>
                <span>/</span>
                {selected.middleName && (
                  <>
                    <span>{selected.middleName}</span>
                    <span>/</span>
                  </>
                )}
                <span className="font-bold text-text-primary">{selected.name}</span>
              </div>
              <h1 className="text-4xl font-display font-bold" style={{ color: selected.coreColor }}>
                {selected.name}
              </h1>
              <p className="text-text-secondary">{selected.desc}</p>
            </div>

            {/* Form Fields: Editorial, Sharp, Minimal */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold font-display text-text-primary">شدة الشعور</label>
                  <span className="font-mono font-bold text-lg" style={{ color: selected.coreColor }}>{intensity}</span>
                </div>
                <input 
                  type="range" min="1" max="10" 
                  value={intensity} 
                  onChange={(e) => setIntensity(parseInt(e.target.value))} 
                  className="w-full h-1 bg-border-subtle appearance-none cursor-pointer"
                  style={{ accentColor: selected.coreColor }}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold font-display text-text-primary">وصف الشعور</label>
                <textarea 
                  className="w-full bg-bg-surface border-b-2 border-transparent border-b-border-medium p-3 text-sm text-text-primary focus:outline-none focus:border-b-accent-primary transition-colors resize-none"
                  placeholder="كيف تشعر بالضبط؟ ماذا يحدث في جسدك؟..."
                  rows="2"
                  value={details.description} 
                  onChange={(e) => setDetails({ ...details, description: e.target.value })} 
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-bold font-display text-text-primary">الموقف المرتبط</label>
                <textarea 
                  className="w-full bg-bg-surface border-b-2 border-transparent border-b-border-medium p-3 text-sm text-text-primary focus:outline-none focus:border-b-accent-primary transition-colors resize-none"
                  placeholder="ما الذي حدث؟"
                  rows="2"
                  value={details.context} 
                  onChange={(e) => setDetails({ ...details, context: e.target.value })} 
                />
              </div>
            </div>

            {/* Coping Strategies - Clean list */}
            <div className="pt-4 border-t border-border-subtle">
              <button 
                className="w-full flex justify-between items-center py-2 text-text-primary font-bold font-display hover:text-accent-primary transition-colors"
                onClick={() => setShowCoping(!showCoping)}
              >
                <span>استراتيجيات التعامل</span>
                {showCoping ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>
              
              {showCoping && (
                <ul className="mt-4 space-y-4">
                  {selected.coping.map((tip, index) => (
                    <li key={index} className="flex items-start text-sm text-text-secondary leading-relaxed">
                      <span className="font-mono font-bold mr-2 ml-3 text-text-muted">{index + 1}.</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button 
              onClick={onSave}
              disabled={saved}
              className="w-full py-4 mt-6 rounded-sm font-bold flex items-center justify-center text-white transition-all active:scale-95"
              style={{ backgroundColor: saved ? '#2C4C3B' : selected.coreColor }}
            >
              {saved ? (
                <><Check size={20} className="mr-2" /> تم الحفظ</>
              ) : (
                <><Save size={20} className="mr-2" /> حفظ التدوينة</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
