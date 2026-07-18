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
    color: '#FFDD57',
    desc: 'السعادة طاقة إيجابية تعكس رضا وامتنان وارتباط.',
    coping: ['شارك الامتنان مع الآخرين', 'سجّل اللحظة الجميلة كتابةً', 'مارس نشاطًا ممتعًا لتعزيز الشعور'],
    middle: [
      { name: 'مرح',   outer: ['نبيه', 'ثائر'] },
      { name: 'قنوع',  outer: ['مبتهج', 'حر'] },
      { name: 'مهتم',  outer: ['متسائل', 'فضولي'] },
      { name: 'فخور',  outer: ['واثق', 'ناجح'] },
      { name: 'مقبول', outer: ['قيم', 'محترم'] },
      { name: 'قوي',   outer: ['ابداعي', 'شجاع'] },
      { name: 'مسالم', outer: ['شاكر', 'محب'] },
      { name: 'واثق',  outer: ['ودود', 'حساس'] },
      { name: 'متفائل',outer: ['ملهم', 'متحمس'] },
    ],
  },
  {
    core: 'حزن',
    color: '#8CB4FF',
    desc: 'الحزن إشارة لفقد أو احتياج غير مُلبّى يستحق الرعاية.',
    coping: ['امنح نفسك إذنًا بالبكاء', 'اكتب رسالة وداع أو قبول', 'تواصل مع صديق داعم'],
    middle: [
      { name: 'مجروح', outer: ['مخيب', 'منحرج'] },
      { name: 'مكتئب', outer: ['خالي المشاعر', 'متدني'] },
      { name: 'مذنب',  outer: ['خجول', 'نادم'] },
      { name: 'بائس',  outer: ['حزين', 'عاجز'] },
      { name: 'ضعيف',  outer: ['ضحية', 'هش'] },
      { name: 'وحيد',  outer: ['مهجور', 'معزول'] },
    ],
  },
  {
    core: 'متفاجئ',
    color: '#F97316',
    desc: 'المفاجأة رد فعل لحدث غير متوقع يلفت الانتباه للحظة الحاضرة.',
    coping: ['تنفّس بعمق قبل الحكم', 'لاحظ التفاصيل', 'دوّن ما تعلّمته'],
    middle: [
      { name: 'متحمس',  outer: ['نشط', 'متلهف'] },
      { name: 'مندهش',  outer: ['رهبة', 'مبهر'] },
      { name: 'متشكك',  outer: ['متحير', 'خيبة أمل'] },
      { name: 'مذهول',  outer: ['مصدوم', 'فزع'] },
    ],
  },
  {
    core: 'غاضب',
    color: '#EF4444',
    desc: 'الغضب طاقة دفاعية تحمي الحدود عند الشعور بالظلم.',
    coping: ['تنفّس 4-7-8 لتهدئة الجسد', 'اكتب ما أغضبك', 'حوّل الطاقة لتمرين بدني'],
    middle: [
      { name: 'خذلان',  outer: ['خيانة', 'مستاء'] },
      { name: 'إذلال',  outer: ['اضطهاد', 'سخرية'] },
      { name: 'حقد',    outer: ['ناقم', 'انتهك'] },
      { name: 'عدواني', outer: ['استفزاز', 'شرس'] },
      { name: 'محبط',   outer: ['محبط', 'منزعج'] },
      { name: 'منحرج',  outer: ['متشكك', 'رافض'] },
      { name: 'متباعد', outer: ['منسحب', 'فاقد إحساس'] },
    ],
  },
  {
    core: 'مشمئز',
    color: '#34D399',
    desc: 'الاشمئزاز يدفعك للابتعاد عما تعتبره غير مقبول.',
    coping: ['حافظ على نظافتك وحدودك', 'دوّن ما يثير الشعور', 'استخدم التنفّر لتقييم قيمك'],
    middle: [
      { name: 'نفور',     outer: ['هلع', 'متردد'] },
      { name: 'فظيع',     outer: ['كريه', 'مشمئز'] },
      { name: 'خائب أمل', outer: ['ثار', 'مروّع'] },
      { name: 'رافض',     outer: ['منحرج', 'سريع الحكم'] },
    ],
  },
  {
    core: 'سئ',
    color: '#A78BFA',
    desc: 'الشعور بالسوء قد يدل على إرهاق أو توتر مزمن.',
    coping: ['خذ استراحة قصيرة', 'مارس التأمل 5 دقائق', 'تواصل مع شخص داعم'],
    middle: [
      { name: 'مضجر',  outer: ['غير مكترث', 'بليد'] },
      { name: 'مشغول', outer: ['مضغوط', 'مستعجل'] },
      { name: 'مضغوط', outer: ['ارتباك', 'خارج السيطرة'] },
      { name: 'متعب',  outer: ['نعسان', 'متشتت'] },
    ],
  },
];

// الأيقونات لكل شعور أساسي
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

  // تحجيم العجلة بناءً على حجم الشاشة
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
    
    // ✅ تسجيل التقدّم
    updateProgress({
      entries: 1,
      timeline: { label: `اختار شعور: ${selected.name} 🔄` }
    });
    
    // إعادة تعيين الحالة بعد 2 ثانية
    setTimeout(() => setSaved(false), 2000);
  };

  const resetSelection = () => {
    setSelected(null);
    setShowCoping(false);
    setDetails({ description: '', context: '' });
    setIntensity(5);
  };

  const increaseIntensity = () => {
    if (intensity < 10) setIntensity(intensity + 1);
  };

  const decreaseIntensity = () => {
    if (intensity > 1) setIntensity(intensity - 1);
  };

  // الحصول على لون الخلفية بناءً على المشاعر الأساسية
  const getBgColor = () => {
    if (!selected) return 'bg-gradient-to-br from-[#f0f9f5] to-[#e0f0e9]';
    
    const colorMap = {
      سعيد: 'bg-gradient-to-br from-yellow-50 to-yellow-100',
      حزن: 'bg-gradient-to-br from-blue-50 to-blue-100',
      متفاجئ: 'bg-gradient-to-br from-orange-50 to-orange-100',
      غاضب: 'bg-gradient-to-br from-red-50 to-red-100',
      مشمئز: 'bg-gradient-to-br from-green-50 to-green-100',
      سئ: 'bg-gradient-to-br from-purple-50 to-purple-100'
    };
    
    return colorMap[selected.core] || 'bg-gradient-to-br from-[#f0f9f5] to-[#e0f0e9]';
  };

  return (
    <div className={`flex flex-col min-h-screen transition-colors duration-500 ${getBgColor()}`} style={{ backgroundColor: 'var(--bg-primary)' }}>
      {/* Header */}
      <header className="flex items-center p-4 justify-between themed-bg-card backdrop-blur-sm shadow-sm" style={{ backgroundColor: 'color-mix(in srgb, var(--bg-card) 85%, transparent)' }}>
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7f3ee] text-[#4e9778]"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex flex-col items-center">
          <h2 className="text-xl font-bold themed-text">عجلة المشاعر</h2>
          <p className="text-xs themed-text-muted">استكشف مشاعرك وتفهمها</p>
        </div>
        <button 
          onClick={resetSelection}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-[#e7f3ee] text-[#4e9778]"
        >
          <RefreshCw size={20} />
        </button>
      </header>

      {/* Wheel Container */}
      <div className="flex justify-center p-4">
        <div 
          ref={wheelRef}
          className="relative transition-all duration-500 rounded-full shadow-lg"
        >
          <MultiRingWheel 
            data={FEELINGS_WHEEL} 
            onSelect={(emotion) => {
              setSelected(emotion);
              setShowCoping(false);
            }}
          />
        </div>
      </div>

      {/* Instructions */}
      {!selected && (
        <div className="flex flex-col items-center px-4 mb-4">
          <div className="themed-bg-card rounded-xl p-4 shadow-sm max-w-md w-full">
            <div className="flex items-center mb-2">
              <Info size={20} className="themed-text-secondary mr-2" />
              <h3 className="font-medium themed-text">كيف تستخدم العجلة</h3>
            </div>
            <ul className="text-sm themed-text list-disc list-inside space-y-1">
              <li>انقر على المشاعر الأساسية (الدوائر الداخلية الملونة)</li>
              <li>اختر المشاعر الفرعية (الطبقات الخارجية)</li>
              <li>حدد شدة الشعور باستخدام الشريط المنزلق</li>
              <li>أضف تفاصيل عن شعورك وموقفك</li>
              <li>احفظ تدويناتك لمتابعة مشاعرك</li>
            </ul>
          </div>
        </div>
      )}

      {/* Details Section */}
      <div className="flex-1 overflow-y-auto px-4 pb-20">
        {selected ? (
          <div className="themed-bg-card rounded-xl shadow-sm p-4 mb-4 transition-all duration-300">
            {/* Emotion Path */}
            <div className="flex items-center justify-center mb-3">
              <div className="flex items-center bg-[#f0f9f4] px-3 py-1 rounded-full">
                <span className="text-xs text-[#0e1b15]">{selected.core}</span>
                <span className="mx-1 text-[#5a8c76]">→</span>
                {selected.middleName && (
                  <>
                    <span className="text-xs text-[#0e1b15]">{selected.middleName}</span>
                    <span className="mx-1 text-[#5a8c76]">→</span>
                  </>
                )}
                <span className="text-xs text-[#0e1b15] font-medium">{selected.name}</span>
              </div>
            </div>

            {/* Emotion Header */}
            <div className="flex items-center justify-center mb-3">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center mr-2"
                style={{ backgroundColor: selected.coreColor + '30' }}
              >
                {emotionIcons[selected.core]}
              </div>
              <h1 
                className="text-xl font-bold text-center"
                style={{ color: selected.coreColor }}
              >
                {selected.name}
              </h1>
            </div>

            {/* Description */}
            <p className="text-center text-sm mb-4 themed-text">{selected.desc}</p>

            {/* Intensity Control */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <label className="text-sm font-medium themed-text">شدة الشعور</label>
                <div className="flex items-center">
                  <button 
                    onClick={decreaseIntensity}
                    className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center text-[#4e9778]"
                  >
                    <Minus size={16} />
                  </button>
                  <div 
                    className="mx-2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                    style={{ backgroundColor: selected.coreColor }}
                  >
                    {intensity}
                  </div>
                  <button 
                    onClick={increaseIntensity}
                    className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center text-[#4e9778]"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                value={intensity} 
                onChange={(e) => setIntensity(parseInt(e.target.value))} 
                className="w-full h-2  bg-[#e0e8e4] rounded-lg appearance-none cursor-pointer accent-[#30e898]"
                style={{ 
                  background: `linear-gradient(to right, ${selected.coreColor}30, ${selected.coreColor})  `,
                  // backgroundSize: `${(intensity / 10) * 100}% 100%`,
                  // backgroundRepeat: 'no-repeat'
                }}
              />
              <div className="flex justify-between text-xs text-[#5a8c76] mt-1">
                <span>خفيف</span>
                <span>شديد</span>
              </div>
            </div>

            {/* Text Areas */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1 themed-text">وصف الشعور</label>
                <textarea
                  className="w-full themed-bg-input themed-border border rounded-xl p-3 text-sm themed-text focus:outline-none focus:ring-1 focus:ring-[#4e9778]"
                  placeholder="كيف تشعر بالضبط؟ ماذا يحدث في جسدك؟..."
                  rows="3"
                  value={details.description}
                  onChange={(e) => setDetails({ ...details, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 themed-text">الموقف أو الأفكار المرتبطة</label>
                <textarea
                  className="w-full themed-bg-input themed-border border rounded-xl p-3 text-sm themed-text focus:outline-none focus:ring-1 focus:ring-[#4e9778]"
                  placeholder="ما الذي حدث؟ ما الأفكار التي تدور في ذهنك؟..."
                  rows="3"
                  value={details.context}
                  onChange={(e) => setDetails({ ...details, context: e.target.value })}
                />
              </div>
            </div>

            {/* Coping Strategies */}
            <div className="themed-border border rounded-xl overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-3 themed-text font-medium"
                onClick={() => setShowCoping(!showCoping)}
              >
                <div className="flex items-center">
                  <span>استراتيجيات التعامل</span>
                  <span className="text-xs themed-bg-subtle themed-text-secondary px-2 py-1 rounded-full ml-2">
                    {selected.coping.length}
                  </span>
                </div>
                {showCoping ? <ChevronUp size={20} className="themed-text" /> : <ChevronDown size={20} className="themed-text" />}
              </button>

              {showCoping && (
                <div className="p-3 themed-bg-input themed-border border-t">
                  <ul className="space-y-2">
                    {selected.coping.map((tip, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-5 h-5 rounded-full themed-bg-subtle themed-text-secondary text-xs flex items-center justify-center mt-1 mr-2 flex-shrink-0">
                          {index + 1}
                        </div>
                        <span className="text-sm themed-text">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="themed-bg-card rounded-xl p-6 inline-block shadow-sm">
              <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full themed-bg-subtle flex items-center justify-center themed-text-secondary">
                  <Smile size={32} />
                </div>
              </div>
              <p className="themed-text-muted font-medium">اختر شعورًا من العجلة لبدء التدوين</p>
              <p className="themed-text-muted text-sm mt-1">اضغط على أي قطاع لاستكشاف مشاعرك</p>
            </div>
          </div>
        )}

        {/* Save Button */}
        {selected && (
          <div className="sticky bottom-4 left-0 right-0 px-4 z-10">
            <button 
              onClick={onSave}
              disabled={saved}
              className={`w-full py-3 rounded-xl font-bold flex items-center justify-center shadow-lg transition-all ${
                saved 
                  ? 'bg-green-500 text-white' 
                  : `text-white ${saved ? 'animate-pulse' : ''}`
              }`}
              style={{ 
                backgroundColor: saved ? '#10B981' : selected.coreColor,
                boxShadow: `0 4px 14px ${selected.coreColor}50`
              }}
            >
              {saved ? (
                <>
                  <Check size={20} className="mr-2" />
                  تم الحفظ بنجاح!
                </>
              ) : (
                <>
                  <Save size={20} className="mr-2" />
                  حفظ الشعور
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}