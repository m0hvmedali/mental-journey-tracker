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
      icon: <Wind size={24} className="text-[#4e9778]" />,
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
      icon: <Waves size={24} className="text-[#4e9778]" />,
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
      icon: <BrainCog size={24} className="text-[#4e9778]" />,
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
      icon: <Feather size={24} className="text-[#4e9778]" />,
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
      icon: <Music size={24} className="text-[#4e9778]" />,
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
      icon: <Leaf size={24} className="text-[#4e9778]" />,
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
      icon: <Heart size={24} className="text-[#4e9778]" />,
      description: 'كرر عبارات داعمة مثل: أنا أستحق الحب والاهتمام.',
      steps: [
        'اختر عبارة داعمة مثل: "أنا أستحق الحنو والاهتمام".',
        'كررها بصوت منخفض أو بصمت.',
        'تخيل أنك تتحدث إلى صديق مقرب.'
      ]
    },
    energize: {
      label: 'الحركة التنشيطية',
      category: 'النشاط',
      duration: '2-3 دقائق',
      icon: <Activity size={24} className="text-[#4e9778]" />,
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
        <div className="bg-white rounded-2xl p-6 w-full max-w-sm flex flex-col items-center relative">
          <button onClick={() => setPlayerOpen(false)} className="absolute top-4 left-4 text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
          
          <div className="w-48 h-48 relative mb-6">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full rounded-full bg-[#e7f3ee] flex items-center justify-center">
                <div 
                  className="absolute w-full h-full rounded-full border-8 border-[#4e9778]"
                  style={{
                    clipPath: `inset(0 ${100 - progress}% 0 0)`
                  }}
                ></div>
              </div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <h2 className="text-2xl font-bold text-[#0e1b15]">{current.phase}</h2>
              <p className="text-4xl font-semibold text-[#4e9778] mt-2">{time}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center space-x-2 w-full">
            {CYCLE.map((phase, i) => (
              <div 
                key={i} 
                className={`flex-1 py-2 rounded-lg text-center ${
                  idx === i ? 'bg-[#4e9778] text-white' : 'bg-[#e7f3ee] text-[#4e9778]'
                }`}
              >
                <span className="block text-sm font-medium">{phase.phase}</span>
                <span className="block text-xs">{phase.secs} ثانية</span>
              </div>
            ))}
          </div>
          
          <p className="mt-6 text-sm text-[#5a8c76] text-center">
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
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative overflow-hidden">
          <div className="bg-[#4e9778] p-4 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold">{ex.label}</h2>
                <div className="flex items-center mt-1 space-x-3">
                  <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded-full">
                    <Clock size={14} className="mr-1" /> {ex.duration}
                  </span>
                  <span className="flex items-center text-sm bg-white/20 px-2 py-1 rounded-full">
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
            <p className="text-[#374151] mb-4">{ex.description}</p>
            
            <h3 className="font-bold text-lg text-[#0e1b15] mb-3">خطوات التمرين:</h3>
            <ol className="space-y-3">
              {ex.steps.map((step, i) => (
                <li key={i} className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#e7f3ee] text-[#4e9778] flex items-center justify-center mr-3 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-[#374151]">{step}</p>
                </li>
              ))}
            </ol>
            
            {activeExercise === 'breathing' && (
              <div className="mt-5 p-3 bg-[#f5fbf8] rounded-lg border border-[#e0eae5]">
                <p className="text-sm text-[#5a8c76]">
                  يمكنك استخدام الأداة التفاعلية لمتابعة العد والتوجيه أثناء التمرين.
                </p>
              </div>
            )}
            
            <button 
              onClick={() => {
                if (activeExercise === 'breathing') setPlayerOpen(true);
                setModalOpen(false);
              }}
              className="w-full mt-6 py-3 bg-[#4e9778] hover:bg-[#3e8668] text-white rounded-xl font-bold flex items-center justify-center"
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
    <div className="flex flex-col min-h-screen bg-[#f5fbf8] p-4" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center mb-4 ">
        <button 
          onClick={() => nav(-1)} 
          className="flex items-center justify-center"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="flex-1 text-center text-xl font-bold text-[#0e1b15]">تمارين التهدئة وإدارة المشاعر</h2>
      </header>
      
      {/* Introduction */}
      <div className="bg-white rounded-2xl p-5 mb-6 shadow-sm">
        <p className="text-[#374151] text-center mb-3">
          اختر التمرين المناسب لحالتك الحالية. هذه التمارين تساعدك على:
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center bg-[#f0f9f4] p-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <Leaf size={16} className="text-[#4e9778]" />
            </div>
            <span className="text-sm text-[#374151]">تقليل التوتر والقلق</span>
          </div>
          <div className="flex items-center bg-[#f0f9f4] p-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <BrainCog size={16} className="text-[#4e9778]" />
            </div>
            <span className="text-sm text-[#374151]">تحسين التركيز</span>
          </div>
          <div className="flex items-center bg-[#f0f9f4] p-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <Heart size={16} className="text-[#4e9778]" />
            </div>
            <span className="text-sm text-[#374151]">تنظيم المشاعر</span>
          </div>
          <div className="flex items-center bg-[#f0f9f4] p-3 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <Activity size={16} className="text-[#4e9778]" />
            </div>
            <span className="text-sm text-[#374151]">زيادة الطاقة</span>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="mb-5">
        <h3 className="font-medium text-[#0e1b15] mb-3">التصنيفات:</h3>
        <div className="flex overflow-x-auto pb-2 space-x-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center px-4 py-2 rounded-xl whitespace-nowrap ${
                selectedCategory === cat.id 
                  ? 'bg-[#4e9778] text-white' 
                  : 'bg-white text-[#374151] border border-[#e0eae5]'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Exercises List */}
      <div className="space-y-4">
        <h3 className="font-medium text-[#0e1b15] mb-2">التمارين المتاحة:</h3>
        
        {filteredExercises.map(([key, ex]) => (
          <div 
            key={key} 
            className="bg-white rounded-2xl p-4 flex gap-4 items-start shadow-sm hover:shadow-md transition-shadow"
            onClick={() => startExercise(key)}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-[#e7f3ee] flex items-center justify-center">
              {ex.icon}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-[#0e1b15]">{ex.label}</h3>
                <div className="flex items-center text-xs text-[#5a8c76] bg-[#f0f9f4] px-2 py-1 rounded-full">
                  <Clock size={12} className="mr-1" /> {ex.duration}
                </div>
              </div>
              <p className="text-sm text-[#5a8c76] mt-1 mb-2">{ex.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 bg-[#f0f9f4] text-[#4e9778] rounded-full">
                  {ex.category}
                </span>
                <button className="flex items-center text-xs font-medium text-[#4e9778]">
                  ابدأ الآن <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Breathing Player */}
      {playerOpen && <BreathingPlayer />}
      
      {/* Exercise Details Modal */}
      {modalOpen && <Modal />}
      
      {/* Footer Tips */}
      <div className="mt-6 bg-white rounded-2xl p-4 shadow-sm">
        <h3 className="font-bold text-[#0e1b15] mb-3">نصائح للاستفادة القصوى:</h3>
        <ul className="space-y-2 text-sm text-[#374151]">
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e7f3ee] text-[#4e9778] text-xs flex items-center justify-center">✓</span>
            <span>اختر مكاناً هادئاً ومريحاً لممارسة التمارين</span>
          </li>
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e7f3ee] text-[#4e9778] text-xs flex items-center justify-center">✓</span>
            <span>مارس التمارين بانتظام للحصول على أفضل النتائج</span>
          </li>
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e7f3ee] text-[#4e9778] text-xs flex items-center justify-center">✓</span>
            <span>لا تتردد في تعديل التمارين لتناسب احتياجاتك الشخصية</span>
          </li>
        </ul>
      </div>
    </div>
  );
}