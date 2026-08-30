import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Plus,
  Trash2,
  Check,
  Sparkles,
  CircleDot,
} from 'lucide-react';
import Footer from '@/components/Footer';

// ============================================================
// ACT SECTIONS
// ============================================================

const ACT_SECTIONS = [
  { id: 'defusion', title: 'الفصل المعرفي' },
  { id: 'acceptance', title: 'القبول والتحمل' },
  { id: 'present', title: 'عيش الحاضر' },
  { id: 'values', title: 'استكشاف القيم' },
  { id: 'metaphors', title: 'الاستعارات' },
  { id: 'action', title: 'العمل الملتزم' },
];

// ============================================================
// SHARED UI COMPONENTS
// ============================================================

const cardClass =
  'bg-bg-surface border border-border-subtle rounded-3xl';

const inputClass =
  'w-full min-h-[44px] px-4 py-2.5 bg-bg-surface border border-border-medium rounded-xl text-sm text-text-primary placeholder:text-text-muted/70 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10';

const textareaClass =
  'w-full px-4 py-3 bg-bg-surface border border-border-medium rounded-xl text-sm text-text-primary placeholder:text-text-muted/70 outline-none resize-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10';

const primaryButtonClass =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-purple-700 hover:bg-purple-800 active:scale-[0.98] text-white text-sm font-bold transition-all';

const secondaryButtonClass =
  'inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-bg-surface-elevated hover:bg-bg-surface-hover border border-border-subtle text-text-secondary hover:text-text-primary text-sm font-bold transition-all';

function SectionIntro({ eyebrow, title, description }) {
  return (
    <div className={`${cardClass} p-6 sm:p-8`}>
      <div className="max-w-3xl space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold">
          <CircleDot size={12} />
          {eyebrow}
        </span>

        <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
          {title}
        </h3>

        <p className="text-sm leading-7 text-text-secondary">
          {description}
        </p>
      </div>
    </div>
  );
}

function ToolHeader({ number, title, description, icon }) {
  return (
    <div className="flex items-start gap-4 pb-5 border-b border-border-subtle">
      <div className="shrink-0 w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 flex items-center justify-center">
        {icon || <span className="text-sm font-bold">{number}</span>}
      </div>

      <div className="min-w-0">
        <h4 className="text-base sm:text-lg font-bold text-text-primary">
          {title}
        </h4>

        {description && (
          <p className="mt-1.5 text-xs sm:text-sm leading-6 text-text-muted">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <label className="block text-xs font-bold text-text-secondary mb-2">
      {children}
    </label>
  );
}

function ExerciseCard({ number, title, children }) {
  return (
    <div
      className={`${cardClass} p-5 sm:p-6 hover:border-purple-200 dark:hover:border-purple-900/60 transition-colors`}
    >
      <div className="flex items-start gap-3">
        <span className="shrink-0 w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-bold">
          {number}
        </span>

        <div className="min-w-0 space-y-3">
          <h5 className="font-bold text-sm text-text-primary">{title}</h5>

          <div className="text-xs sm:text-sm leading-7 text-text-secondary">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function ACTSkills() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('defusion');

  // ============================================================
  // 1. COGNITIVE DEFUSION
  // ============================================================

  const [inputThought, setInputThought] = useState('');
  const [storyName, setStoryName] = useState('');

  const [savedCards, setSavedCards] = useState(() => {
    try {
      const saved = localStorage.getItem('act_saved_cards');

      return saved
        ? JSON.parse(saved)
        : [
            {
              id: 1,
              thought: 'أنا شخص غير كفء ولن أنجح في مشروعي القادم',
              story: 'قصة الفشل المحتوم',
              date: 'اليوم',
            },
          ];
    } catch {
      return [];
    }
  });

  // ============================================================
  // 2. ACCEPTANCE
  // ============================================================

  const [avoidanceStrategies, setAvoidanceStrategies] = useState([
    {
      id: 1,
      strategy: 'الانعزال التام عن المناسبات الاجتماعية',
      shortTerm: 'راحة مؤقتة لليلة واحدة',
      longTerm: 'تفاقم الوحدة والشعور بالإحباط والحرَج',
      effective: false,
    },
    {
      id: 2,
      strategy: 'التصفح المفرط للهاتف طوال اليوم',
      shortTerm: 'تشتيت الانتباه لحظياً',
      longTerm: 'تضييع الوقت وزيادة تأنيب الضمير',
      effective: false,
    },
  ]);

  const [newStrategy, setNewStrategy] = useState('');
  const [newShortTerm, setNewShortTerm] = useState('');
  const [newLongTerm, setNewLongTerm] = useState('');

  // ============================================================
  // 3. PRESENT MOMENT
  // ============================================================

  const [groundingSteps, setGroundingSteps] = useState({
    sight: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    sound: ['', '', ''],
    smell: ['', ''],
    taste: [''],
  });

  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [selectedObject, setSelectedObject] = useState('كوب قهوة فخاري');

  React.useEffect(() => {
    let interval = null;

    if (isTimerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerActive(false);
    }

    return () => clearInterval(interval);
  }, [isTimerActive, timerSeconds]);

  // ============================================================
  // 4. VALUES
  // ============================================================

  const [bullsEyeDomains, setBullsEyeDomains] = useState(() => {
    try {
      const saved = localStorage.getItem('act_bullseye');

      return saved
        ? JSON.parse(saved)
        : {
            relationships: {
              title: 'العلاقات الأسرية والاجتماعية',
              value:
                'أن أكون شريكاً منصتاً ومسانداً ومتاحاً عاطفياً',
              score: 6,
              barriers:
                'الخوف من النقد، الانشغال المفرط بالعمل',
            },

            work: {
              title: 'العمل والمسار المهني والتعليم',
              value:
                'الإتقان والابتكار والعمل بنزاهة وشغف',
              score: 7,
              barriers:
                'المماطلة بسبب الخوف من عدم المثالية',
            },

            growth: {
              title: 'النمو الشخصي والصحة والنفس',
              value:
                'العناية بالجسد والتعلم المستمر والهدوء',
              score: 5,
              barriers:
                'إرهاق الروتين اليومي والشعور بالقلق',
            },

            leisure: {
              title: 'الترفيه والاستمتاع بالحياة',
              value:
                'تذوق اللحظات البسيطة وممارسة الهوايات',
              score: 4,
              barriers:
                'الشعور بالذنب عند عدم العمل',
            },
          };
    } catch {
      return {};
    }
  });

  const saveBullsEye = (updated) => {
    setBullsEyeDomains(updated);
    localStorage.setItem(
      'act_bullseye',
      JSON.stringify(updated)
    );
  };

  // ============================================================
  // 5. METAPHORS
  // ============================================================

  const [magicWandText, setMagicWandText] = useState('');
  const [magicWandRevealed, setMagicWandRevealed] =
    useState(false);

  // ============================================================
  // 6. COMMITTED ACTION
  // ============================================================

  const [actionPlan, setActionPlan] = useState(() => {
    try {
      const saved = localStorage.getItem('act_action_plan');

      return saved
        ? JSON.parse(saved)
        : {
            activity:
              'المشي في الطبيعة والاتصال بصديق يوم السبت',
            valueAlignment:
              'دعم قيمة العناية بالصحة والروابط الاجتماعية',
            avoidanceToStop:
              'التوقف عن التأجيل بحجة الإرهاق التلقائي',
            willingToFeel:
              'مستعد لاستقبال شعور القلق وفكرة "قد أكون ثقيلاً"',
          };
    } catch {
      return {
        activity: '',
        valueAlignment: '',
        avoidanceToStop: '',
        willingToFeel: '',
      };
    }
  });

  const [dailyDiaryEntries, setDailyDiaryEntries] =
    useState(() => {
      try {
        const saved = localStorage.getItem(
          'act_daily_diary'
        );

        return saved
          ? JSON.parse(saved)
          : [
              {
                id: 1,
                date: '2026-08-20',
                alignedActivity:
                  'قضيت ساعة في قراءة كتاب مفيد بدون هاتف',
                uncomfortableFeelings:
                  'ظهرت فكرة "يجب أن تعمل أكثر"',
                handling:
                  'لاحظت الفكرة وشكرت عقلي وواصلت القراءة',
              },
            ];
      } catch {
        return [];
      }
    });

  const [newDiary, setNewDiary] = useState({
    alignedActivity: '',
    uncomfortableFeelings: '',
    handling: '',
  });

  // ============================================================
  // HELPERS
  // ============================================================

  const handleAddCard = () => {
    if (!inputThought.trim()) return;

    const newCard = {
      id: Date.now(),
      thought: inputThought,
      story: storyName || 'قصة من العقل',
      date: new Date().toLocaleDateString('ar-EG'),
    };

    const updated = [newCard, ...savedCards];

    setSavedCards(updated);
    localStorage.setItem(
      'act_saved_cards',
      JSON.stringify(updated)
    );

    setInputThought('');
    setStoryName('');
  };

  const handleAddAvoidance = () => {
    if (!newStrategy.trim()) return;

    const item = {
      id: Date.now(),
      strategy: newStrategy,
      shortTerm: newShortTerm || 'راحة مؤقتة',
      longTerm: newLongTerm || 'لم تعالج المشكلة',
      effective: false,
    };

    setAvoidanceStrategies([
      ...avoidanceStrategies,
      item,
    ]);

    setNewStrategy('');
    setNewShortTerm('');
    setNewLongTerm('');
  };

  const handleAddDiary = () => {
    if (!newDiary.alignedActivity.trim()) return;

    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-EG'),
      ...newDiary,
    };

    const updated = [entry, ...dailyDiaryEntries];

    setDailyDiaryEntries(updated);

    localStorage.setItem(
      'act_daily_diary',
      JSON.stringify(updated)
    );

    setNewDiary({
      alignedActivity: '',
      uncomfortableFeelings: '',
      handling: '',
    });
  };

  const totalScore = Object.values(
    bullsEyeDomains
  ).reduce(
    (acc, curr) => acc + Number(curr.score || 0),
    0
  );

  const avgProximityPercent = Math.round(
    (totalScore / 40) * 100
  );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-bg-app text-text-primary font-sans"
    >
      {/* ========================================================
          HEADER
      ======================================================== */}

      <header className="sticky top-0 z-40 bg-bg-surface/95 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="h-[68px] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() =>
                  navigate(
                    '/modules/major-psychotherapies/act'
                  )
                }
                className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-bg-surface-hover transition-all"
                title="العودة"
              >
                <ArrowLeft
                  size={20}
                  className="rotate-180"
                />
              </button>

              <div className="min-w-0">
                <h1 className="text-sm sm:text-base font-bold text-text-primary truncate">
                  الدليل العملي لتمارين واستعارات ACT
                </h1>

                <p className="hidden sm:block text-xs text-text-muted mt-0.5">
                  العلاج بالقبول والالتزام • تعزيز المرونة النفسية
                </p>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/60">
              <span className="w-2 h-2 rounded-full bg-purple-600" />

              <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                المرونة {avgProximityPercent}%
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          HERO
      ======================================================== */}

      <section className="relative overflow-hidden border-b border-border-subtle bg-bg-surface">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full bg-purple-500/5 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-5 sm:px-6 py-12 sm:py-16 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[11px] font-bold mb-5">
            <Sparkles size={13} />
            نموذج المرونة النفسية • Hexaflex
          </span>

          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-text-primary leading-tight">
            استكشف تمارين العلاج بالقبول والالتزام
          </h2>

          <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base leading-7 text-text-secondary">
            مساحة عملية ومنظمة لاستكشاف أفكارك ومشاعرك وقيمك،
            وتحويل ما تكتشفه إلى خطوات صغيرة ذات معنى.
          </p>
        </div>
      </section>

      {/* ========================================================
          TABS
      ======================================================== */}

      <div className="sticky top-[68px] z-30 bg-bg-app/95 backdrop-blur-xl border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-none">
            {ACT_SECTIONS.map((tab, index) => {
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    shrink-0 min-h-[40px] px-4 rounded-xl
                    text-xs sm:text-sm font-bold
                    transition-all
                    ${
                      isActive
                        ? 'bg-purple-700 text-white shadow-sm'
                        : 'bg-bg-surface text-text-muted border border-border-subtle hover:bg-bg-surface-hover hover:text-text-primary'
                    }
                  `}
                >
                  <span className="opacity-60 ml-1">
                    {index + 1}.
                  </span>

                  {tab.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          MAIN
      ======================================================== */}

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* ======================================================
            SECTION 1
        ====================================================== */}

        {activeTab === 'defusion' && (
          <div className="space-y-8">
            <SectionIntro
              eyebrow="القسم الأول"
              title="تمارين الفصل المعرفي"
              description="الفصل المعرفي هو مهارة مراقبة عملية التفكير نفسها بدلاً من الانغماس الكامل في محتوى الأفكار. الهدف ليس التخلص من الفكرة، وإنما تغيير علاقتك بها."
            />

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="بطاقات الفصل المعرفي الرقمية"
                description="حوّل الفكرة المسيطرة إلى بطاقة تأملية تساعدك على ملاحظتها بدلاً من الاندماج معها."
                icon={<CircleDot size={18} />}
              />

              <div className="mt-7 grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-6">
                {/* FORM */}

                <div className="space-y-5">
                  <div>
                    <FieldLabel>
                      1. ما هي الفكرة المزعجة؟
                    </FieldLabel>

                    <input
                      type="text"
                      value={inputThought}
                      onChange={(e) =>
                        setInputThought(e.target.value)
                      }
                      placeholder="مثال: أنا فاشل، الجميع يكرهني، لن أنجح..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      2. سمّها كقصة من تأليف عقلك
                    </FieldLabel>

                    <input
                      type="text"
                      value={storyName}
                      onChange={(e) =>
                        setStoryName(e.target.value)
                      }
                      placeholder="مثال: قصة الفشل المحتوم"
                      className={inputClass}
                    />
                  </div>

                  <button
                    onClick={handleAddCard}
                    className={`${primaryButtonClass} w-full`}
                  >
                    <Plus size={17} />
                    إنشاء بطاقة جديدة
                  </button>
                </div>

                {/* PREVIEW */}

                <div className="rounded-2xl bg-bg-surface-elevated border border-border-subtle p-5 flex flex-col justify-between gap-6">
                  <div>
                    <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                      معاينة البطاقة
                    </span>

                    <div className="mt-3 p-5 rounded-2xl bg-bg-surface border border-border-subtle">
                      <p className="text-sm leading-7 text-text-secondary">
                        أنا ألاحظ أن عقلي يعرض علي الآن فكرة أن:
                      </p>

                      <p className="mt-2 text-sm font-bold leading-7 text-text-primary">
                        {inputThought || 'اكتب الفكرة هنا...'}
                      </p>

                      <div className="mt-4 pt-4 border-t border-border-subtle">
                        <p className="text-xs leading-6 font-semibold text-emerald-700 dark:text-emerald-400">
                          هذه مجرد:
                        </p>

                        <p className="mt-1 text-sm font-bold text-text-primary">
                          {storyName ||
                            'قصة من تأليف العقل'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] leading-6 text-text-muted">
                    الهدف ليس تغيير الفكرة أو محاربتها، بل
                    ملاحظتها والاستمرار في الاتجاه لما يهمك.
                  </p>
                </div>
              </div>

              {/* SAVED CARDS */}

              {savedCards.length > 0 && (
                <div className="mt-8 pt-7 border-t border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-text-primary">
                      بطاقاتك المحفوظة
                    </h5>

                    <span className="text-[11px] text-text-muted">
                      {savedCards.length} بطاقة
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {savedCards.map((card) => (
                      <div
                        key={card.id}
                        className="group p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle hover:border-purple-200 dark:hover:border-purple-900/60 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                              {card.story}
                            </span>

                            <p className="mt-3 text-sm leading-7 text-text-primary">
                              "{card.thought}"
                            </p>
                          </div>

                          <button
                            onClick={() => {
                              const filtered =
                                savedCards.filter(
                                  (c) => c.id !== card.id
                                );

                              setSavedCards(filtered);

                              localStorage.setItem(
                                'act_saved_cards',
                                JSON.stringify(filtered)
                              );
                            }}
                            className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all"
                            title="حذف"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* EXERCISES */}

            <div>
              <div className="mb-4">
                <h4 className="text-lg font-bold text-text-primary">
                  تمارين إضافية
                </h4>

                <p className="mt-1 text-xs text-text-muted">
                  طرق بسيطة لتدريب مهارة الفصل المعرفي خلال اليوم.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ExerciseCard
                  number="1"
                  title="تمرين تسمية القصة"
                >
                  عندما تبدأ الأفكار السلبية المألوفة بالظهور،
                  سمّها كقصة يكررها عقلك دائماً.
                  <br />
                  <br />
                  مثال: "آه، ها هي قصة أنا لست جيداً بما
                  يكفي تبدأ من جديد."
                </ExerciseCard>

                <ExerciseCard
                  number="2"
                  title='تمرين "أنا لدي فكرة أن..."'
                >
                  بدلاً من قول "أنا شخص فاشل"، جرّب:
                  <br />
                  <br />
                  "أنا لدي فكرة بأنني شخص فاشل."
                  <br />
                  <br />
                  الإضافة البسيطة تذكّرك بأنك تلاحظ الفكرة ولا
                  تمثلها.
                </ExerciseCard>

                <ExerciseCard
                  number="3"
                  title="الصوت السخيف أو الغناء"
                >
                  كرر الفكرة المزعجة بنبرة كرتونية أو بطريقة
                  موسيقية ساخرة. الهدف هو رؤية الفكرة كحدث
                  ذهني، وليس كحقيقة مطلقة.
                </ExerciseCard>

                <ExerciseCard
                  number="4"
                  title="شكر العقل"
                >
                  عندما يبدأ عقلك في نسج سيناريوهات القلق،
                  جرّب أن تقول:
                  <br />
                  <br />
                  "شكراً لك يا عقلي على محاولتك حمايتي."
                  <br />
                  <br />
                  ثم عد إلى ما تريد فعله.
                </ExerciseCard>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================
            SECTION 2
        ====================================================== */}

        {activeTab === 'acceptance' && (
          <div className="space-y-8">
            <SectionIntro
              eyebrow="القسم الثاني"
              title="القبول والتحمل"
              description="القبول في ACT لا يعني الاستسلام للألم، بل السماح للخبرات الداخلية بالوجود دون الدخول في صراع مستمر لمحاولة التخلص منها أو التحكم بها."
            />

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="تقنية اليأس الإبداعي"
                description="استكشف استراتيجيات التجنب التي تستخدمها، وما إذا كانت تمنحك حلاً حقيقياً أم مجرد راحة مؤقتة."
                icon={<CircleDot size={18} />}
              />

              <div className="mt-7 space-y-6">
                <div className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                  <p className="text-sm leading-7 text-text-secondary">
                    سجّل استراتيجيات التجنب التي جربتها سابقاً،
                    ثم لاحظ الفرق بين تأثيرها الفوري وتأثيرها
                    على المدى الطويل.
                  </p>
                </div>

                {/* FORM */}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <FieldLabel>
                      استراتيجية التجنب
                    </FieldLabel>

                    <input
                      type="text"
                      value={newStrategy}
                      onChange={(e) =>
                        setNewStrategy(e.target.value)
                      }
                      placeholder="مثل: الانعزال"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      الأثر المباشر
                    </FieldLabel>

                    <input
                      type="text"
                      value={newShortTerm}
                      onChange={(e) =>
                        setNewShortTerm(e.target.value)
                      }
                      placeholder="مثل: راحة لساعة"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      الأثر بعيد المدى
                    </FieldLabel>

                    <input
                      type="text"
                      value={newLongTerm}
                      onChange={(e) =>
                        setNewLongTerm(e.target.value)
                      }
                      placeholder="مثل: تفاقم المشكلة"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddAvoidance}
                  className={primaryButtonClass}
                >
                  <Plus size={17} />
                  إضافة استراتيجية
                </button>

                {/* LIST */}

                <div className="space-y-5">
                  {avoidanceStrategies.map((item) => (
                    <div
                      key={item.id}
                      className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-text-primary">
                            {item.strategy}
                          </p>

                          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
                              <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 block">
                                المدى القصير
                              </span>

                              <p className="mt-1 text-xs leading-6 text-text-secondary">
                                {item.shortTerm}
                              </p>
                            </div>

                            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                              <span className="text-[10px] font-bold text-rose-700 dark:text-rose-400 block">
                                المدى الطويل
                              </span>

                              <p className="mt-1 text-xs leading-6 text-text-secondary">
                                {item.longTerm}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />

                          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
                            راحة مؤقتة وليست حلاً
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                  <h5 className="text-sm font-bold text-text-primary">
                    خلاصة التمرين
                  </h5>

                  <p className="mt-2 text-xs sm:text-sm leading-7 text-text-secondary">
                    عندما ترى بوضوح أن بعض محاولات التحكم
                    والتجنب تمنحك راحة مؤقتة لكنها لا تقودك إلى
                    الحياة التي تريدها، يصبح من الأسهل تجربة
                    مساحة مختلفة: السماح بالمشاعر والتحرك رغم
                    وجودها.
                  </p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================
            SECTION 3
        ====================================================== */}

        {activeTab === 'present' && (
          <div className="space-y-8">
            <SectionIntro
              eyebrow="القسم الثالث"
              title="عيش الحاضر واليقظة"
              description="الاتصال بالحاضر يساعدك على ملاحظة ما يحدث الآن بدلاً من الانغماس المستمر في ذكريات الماضي أو سيناريوهات المستقبل."
            />

            {/* GROUNDING */}

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="تأريض الحواس الخمس"
                description="استخدم حواسك لإعادة انتباهك إلى البيئة المحيطة بك."
                number="1"
              />

              <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* SIGHT */}

                <div className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-text-primary">
                      5 أشياء تراها
                    </h5>

                    <span className="text-[10px] font-bold text-text-muted">
                      البصر
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[0, 1, 2, 3, 4].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`شيء ${idx + 1}`}
                        value={groundingSteps.sight[idx]}
                        onChange={(e) => {
                          const arr = [
                            ...groundingSteps.sight,
                          ];

                          arr[idx] = e.target.value;

                          setGroundingSteps({
                            ...groundingSteps,
                            sight: arr,
                          });
                        }}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>

                {/* TOUCH */}

                <div className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-text-primary">
                      4 أشياء تلمسها
                    </h5>

                    <span className="text-[10px] font-bold text-text-muted">
                      اللمس
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`ملمس ${idx + 1}`}
                        value={groundingSteps.touch[idx]}
                        onChange={(e) => {
                          const arr = [
                            ...groundingSteps.touch,
                          ];

                          arr[idx] = e.target.value;

                          setGroundingSteps({
                            ...groundingSteps,
                            touch: arr,
                          });
                        }}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>

                {/* SOUND */}

                <div className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-text-primary">
                      3 أصوات تسمعها
                    </h5>

                    <span className="text-[10px] font-bold text-text-muted">
                      السمع
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[0, 1, 2].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`صوت ${idx + 1}`}
                        value={groundingSteps.sound[idx]}
                        onChange={(e) => {
                          const arr = [
                            ...groundingSteps.sound,
                          ];

                          arr[idx] = e.target.value;

                          setGroundingSteps({
                            ...groundingSteps,
                            sound: arr,
                          });
                        }}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>

                {/* SMELL */}

                <div className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-text-primary">
                      رائحتان تشعر بهما
                    </h5>

                    <span className="text-[10px] font-bold text-text-muted">
                      الشم
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[0, 1].map((idx) => (
                      <input
                        key={idx}
                        type="text"
                        placeholder={`رائحة ${idx + 1}`}
                        value={groundingSteps.smell[idx]}
                        onChange={(e) => {
                          const arr = [
                            ...groundingSteps.smell,
                          ];

                          arr[idx] = e.target.value;

                          setGroundingSteps({
                            ...groundingSteps,
                            smell: arr,
                          });
                        }}
                        className={inputClass}
                      />
                    ))}
                  </div>
                </div>

                {/* TASTE / BREATH */}

                <div className="lg:col-span-2 p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                  <div className="flex items-center justify-between mb-4">
                    <h5 className="text-sm font-bold text-text-primary">
                      التنفس الواعي
                    </h5>

                    <span className="text-[10px] font-bold text-text-muted">
                      الانتباه
                    </span>
                  </div>

                  <input
                    type="text"
                    placeholder="لاحظ إيقاع شهيقك وزفيرك..."
                    value={groundingSteps.taste[0]}
                    onChange={(e) => {
                      setGroundingSteps({
                        ...groundingSteps,
                        taste: [e.target.value],
                      });
                    }}
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* TIMER */}

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="تأمل الغرض المادي لخمس دقائق"
                description="اختر شيئاً عادياً أمامك، ودرّب انتباهك على ملاحظته بتفاصيله."
                number="2"
              />

              <div className="mt-7 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-center">
                <div className="space-y-5">
                  <div>
                    <FieldLabel>
                      الغرض الذي ستتأمله
                    </FieldLabel>

                    <input
                      type="text"
                      value={selectedObject}
                      onChange={(e) =>
                        setSelectedObject(e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {!isTimerActive ? (
                      <button
                        onClick={() =>
                          setIsTimerActive(true)
                        }
                        className={primaryButtonClass}
                      >
                        بدء التأمل
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          setIsTimerActive(false)
                        }
                        className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold transition-all"
                      >
                        إيقاف مؤقت
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setIsTimerActive(false);
                        setTimerSeconds(300);
                      }}
                      className={secondaryButtonClass}
                    >
                      إعادة ضبط
                    </button>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/50 flex flex-col items-center justify-center">
                    <Clock
                      size={22}
                      className="text-purple-600 dark:text-purple-400 mb-2"
                    />

                    <span
                      dir="ltr"
                      className="text-3xl font-bold tracking-tight text-purple-700 dark:text-purple-300"
                    >
                      {Math.floor(timerSeconds / 60)}:
                      {(timerSeconds % 60)
                        .toString()
                        .padStart(2, '0')}
                    </span>

                    <span className="mt-1 text-[10px] font-bold text-text-muted">
                      دقائق
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-7 p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                <h5 className="text-sm font-bold text-text-primary">
                  أثناء التأمل
                </h5>

                <ul className="mt-3 space-y-2 text-xs sm:text-sm leading-6 text-text-secondary">
                  <li>
                    • لاحظ شكل {selectedObject} وحجمه ولونه
                    وملمسه ووزنه.
                  </li>

                  <li>
                    • إذا حركته، لاحظ الصوت الناتج عنه.
                  </li>

                  <li>
                    • عندما يسرح عقلك، لاحظ ذلك بلطف وأعد
                    انتباهك للغرض.
                  </li>
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================
            SECTION 4
        ====================================================== */}

        {activeTab === 'values' && (
          <div className="space-y-8">
            <SectionIntro
              eyebrow="القسم الرابع"
              title="استكشاف وتحديد القيم"
              description="القيم في ACT ليست أهدافاً تنتهي عند تحقيقها، وإنما اتجاهات وجودية تختار أن تتحرك نحوها من خلال طريقة تعاملك مع حياتك."
            />

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="لوحة هدف الرماية — Bull's-Eye"
                description="قيّم مدى اقتراب سلوكك الحالي من القيم التي اخترتها."
                number="1"
              />

              {/* SCORE */}

              <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40">
                <div>
                  <p className="text-xs font-bold text-text-muted">
                    مستوى الاقتراب من القيم
                  </p>

                  <p className="mt-1 text-sm text-text-secondary">
                    10 = قريب جداً من المركز
                  </p>
                </div>

                <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                  {avgProximityPercent}%
                </div>
              </div>

              {/* TARGET */}

              <div className="mt-6 flex justify-center">
                <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full border-2 border-purple-200 dark:border-purple-900/70 bg-purple-50/50 dark:bg-purple-950/20 flex items-center justify-center">
                  <div className="absolute w-[78%] h-[78%] rounded-full border-2 border-purple-200 dark:border-purple-900/70" />

                  <div className="absolute w-[52%] h-[52%] rounded-full border-2 border-purple-300 dark:border-purple-800" />

                  <div className="relative w-16 h-16 rounded-full bg-purple-700 text-white flex items-center justify-center text-xs font-bold shadow-lg">
                    عين الثور
                  </div>
                </div>
              </div>

              <p className="max-w-xl mx-auto mt-5 text-center text-xs sm:text-sm leading-7 text-text-muted">
                كلما اقتربت من المركز، كان سلوكك الحالي أقرب
                إلى الطريقة التي تريد أن تعيش بها قيمك.
              </p>

              {/* DOMAINS */}

              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(bullsEyeDomains).map(
                  ([key, item]) => (
                    <div
                      key={key}
                      className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle"
                    >
                      <div className="flex items-start justify-between gap-3 pb-4 border-b border-border-subtle">
                        <h5 className="text-sm font-bold leading-6 text-text-primary">
                          {item.title}
                        </h5>

                        <span className="shrink-0 px-2.5 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-[10px] font-bold">
                          {item.score}/10
                        </span>
                      </div>

                      <div className="mt-5 space-y-5">
                        <div>
                          <FieldLabel>
                            القيمة التي تريد تجسيدها
                          </FieldLabel>

                          <textarea
                            rows={3}
                            value={item.value}
                            onChange={(e) => {
                              const updated = {
                                ...bullsEyeDomains,
                                [key]: {
                                  ...item,
                                  value: e.target.value,
                                },
                              };

                              saveBullsEye(updated);
                            }}
                            className={textareaClass}
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <FieldLabel>
                              مدى اقترابك الحالي
                            </FieldLabel>

                            <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                              {item.score}
                            </span>
                          </div>

                          <input
                            type="range"
                            min={1}
                            max={10}
                            value={item.score}
                            onChange={(e) => {
                              const updated = {
                                ...bullsEyeDomains,
                                [key]: {
                                  ...item,
                                  score: Number(
                                    e.target.value
                                  ),
                                },
                              };

                              saveBullsEye(updated);
                            }}
                            className="w-full accent-purple-600 cursor-pointer"
                          />

                          <div className="flex justify-between mt-2 text-[10px] text-text-muted">
                            <span>بعيد</span>
                            <span>في المنتصف</span>
                            <span>قريب جداً</span>
                          </div>
                        </div>

                        <div>
                          <FieldLabel>
                            العقبات والحواجز
                          </FieldLabel>

                          <input
                            type="text"
                            value={item.barriers}
                            onChange={(e) => {
                              const updated = {
                                ...bullsEyeDomains,
                                [key]: {
                                  ...item,
                                  barriers: e.target.value,
                                },
                              };

                              saveBullsEye(updated);
                            }}
                            placeholder="الخوف، التسويف، القلق..."
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            </section>
          </div>
        )}

        {/* ======================================================
            SECTION 5
        ====================================================== */}

        {activeTab === 'metaphors' && (
          <div className="space-y-8">
            <SectionIntro
              eyebrow="القسم الخامس"
              title="استعارات ACT"
              description="تساعد الاستعارات على تحويل المفاهيم المجردة إلى صور ذهنية بسيطة يمكن الرجوع إليها أثناء الحياة اليومية."
            />

            {/* MAGIC WAND */}

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="استعارة العصا السحرية"
                description="اكتشف ما الذي ستتجه إليه حياتك لو لم يعد الألم هو الشرط الذي تنتظره قبل أن تبدأ."
                number="1"
              />

              <div className="mt-7 max-w-2xl mx-auto">
                <div className="p-6 sm:p-8 rounded-2xl bg-bg-surface-elevated border border-border-subtle text-center">
                  <p className="text-sm sm:text-base font-bold leading-7 text-text-primary">
                    تخيل أن كل آلامك ومخاوفك اختفت فوراً...
                  </p>

                  <p className="mt-3 text-xs sm:text-sm leading-7 text-text-secondary">
                    ماذا كنت ستفعل في حياتك اليوم؟
                    <br />
                    ما الأنشطة والعلاقات التي كنت ستتجه إليها؟
                  </p>

                  <div className="mt-6 text-right">
                    <FieldLabel>
                      اكتب ما كنت ستفعله
                    </FieldLabel>

                    <textarea
                      rows={5}
                      value={magicWandText}
                      onChange={(e) =>
                        setMagicWandText(e.target.value)
                      }
                      placeholder="اكتب الأنشطة والقيم الحقيقية التي ترغب ببدئها..."
                      className={textareaClass}
                    />
                  </div>

                  <button
                    onClick={() =>
                      setMagicWandRevealed(true)
                    }
                    className={`${primaryButtonClass} mt-5`}
                  >
                    <Sparkles size={16} />
                    كشف الرؤية
                  </button>

                  {magicWandRevealed && (
                    <div className="mt-6 p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/40 text-right">
                      <span className="text-xs font-bold text-purple-700 dark:text-purple-300">
                        ما كشفته الإجابة
                      </span>

                      <p className="mt-2 text-sm leading-7 text-text-secondary">
                        الإجابة التي كتبتها تكشف غالباً عن
                        أشياء وقيم مهمة بالنسبة لك. الفكرة في
                        ACT ليست أن تنتظر اختفاء الألم حتى تبدأ،
                        بل أن تتحرك باتجاه ما يهمك حتى مع وجود
                        بعض الألم.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* COMPASS */}

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="استعارة البوصلة والجبل"
                description="فرق بسيط لكنه مهم بين الاتجاه الذي تعيشه والأهداف التي تحققها."
                number="2"
              />

              <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                <ExerciseCard
                  number="1"
                  title="القيم = البوصلة"
                >
                  القيمة تعطيك اتجاه السير المستمر. لا تصل
                  إلى "نهاية" القيمة، بل تجسدها في طريقة
                  تصرفك.
                  <br />
                  <br />
                  مثال: أن تكون صديقاً مخلصاً.
                </ExerciseCard>

                <ExerciseCard
                  number="2"
                  title="الأهداف = الجبال"
                >
                  الهدف محطة محددة تريد الوصول إليها أثناء
                  رحلتك.
                  <br />
                  <br />
                  بعد تحقيق الهدف، تواصل السير في اتجاه
                  البوصلة.
                </ExerciseCard>
              </div>
            </section>
          </div>
        )}

        {/* ======================================================
            SECTION 6
        ====================================================== */}

        {activeTab === 'action' && (
          <div className="space-y-8">
            <SectionIntro
              eyebrow="القسم السادس"
              title="العمل الملتزم واليوميات"
              description="حوّل القيم التي اكتشفتها إلى أفعال صغيرة وواقعية، مع الاستعداد لمواجهة المشاعر الصعبة التي قد تظهر أثناء التغيير."
            />

            {/* ACTION PLAN */}

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="خطة العمل الملتزم"
                description="حدد خطوة عملية واحدة، ولماذا تخدم قيمك، وما الذي أنت مستعد لتحمله أثناء تنفيذها."
                number="1"
              />

              <div className="mt-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <FieldLabel>
                    النشاط الذي ألتزم بالقيام به
                  </FieldLabel>

                  <input
                    type="text"
                    value={actionPlan.activity}
                    onChange={(e) => {
                      const updated = {
                        ...actionPlan,
                        activity: e.target.value,
                      };

                      setActionPlan(updated);

                      localStorage.setItem(
                        'act_action_plan',
                        JSON.stringify(updated)
                      );
                    }}
                    placeholder="مثال: الاتصال بصديق السبت"
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel>
                    كيف يخدم هذا النشاط قيمك؟
                  </FieldLabel>

                  <input
                    type="text"
                    value={actionPlan.valueAlignment}
                    onChange={(e) => {
                      const updated = {
                        ...actionPlan,
                        valueAlignment: e.target.value,
                      };

                      setActionPlan(updated);

                      localStorage.setItem(
                        'act_action_plan',
                        JSON.stringify(updated)
                      );
                    }}
                    placeholder="يدعم قيمة الترابط الاجتماعي..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel>
                    سلوك التجنب الذي سأتركه
                  </FieldLabel>

                  <input
                    type="text"
                    value={actionPlan.avoidanceToStop}
                    onChange={(e) => {
                      const updated = {
                        ...actionPlan,
                        avoidanceToStop: e.target.value,
                      };

                      setActionPlan(updated);

                      localStorage.setItem(
                        'act_action_plan',
                        JSON.stringify(updated)
                      );
                    }}
                    placeholder="التوقف عن التأجيل..."
                    className={inputClass}
                  />
                </div>

                <div>
                  <FieldLabel>
                    المشاعر الصعبة التي أستعد لاستقبالها
                  </FieldLabel>

                  <input
                    type="text"
                    value={actionPlan.willingToFeel}
                    onChange={(e) => {
                      const updated = {
                        ...actionPlan,
                        willingToFeel: e.target.value,
                      };

                      setActionPlan(updated);

                      localStorage.setItem(
                        'act_action_plan',
                        JSON.stringify(updated)
                      );
                    }}
                    placeholder="القلق، الخوف، الشك..."
                    className={inputClass}
                  />
                </div>
              </div>
            </section>

            {/* DIARY */}

            <section className={`${cardClass} p-6 sm:p-8`}>
              <ToolHeader
                title="يوميات القيم اليومية"
                description="سجل الأفعال التي قمت بها اليوم، وما ظهر معها من مشاعر وأفكار، وكيف تعاملت معها."
                number="2"
              />

              <div className="mt-7 p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div>
                    <FieldLabel>
                      نشاط متسق مع قيمك
                    </FieldLabel>

                    <input
                      type="text"
                      value={newDiary.alignedActivity}
                      onChange={(e) =>
                        setNewDiary({
                          ...newDiary,
                          alignedActivity:
                            e.target.value,
                        })
                      }
                      placeholder="ماذا فعلت اليوم؟"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      مشاعر أو أفكار صعبة
                    </FieldLabel>

                    <input
                      type="text"
                      value={
                        newDiary.uncomfortableFeelings
                      }
                      onChange={(e) =>
                        setNewDiary({
                          ...newDiary,
                          uncomfortableFeelings:
                            e.target.value,
                        })
                      }
                      placeholder="ما الذي ظهر؟"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <FieldLabel>
                      كيف تعاملت معها؟
                    </FieldLabel>

                    <input
                      type="text"
                      value={newDiary.handling}
                      onChange={(e) =>
                        setNewDiary({
                          ...newDiary,
                          handling: e.target.value,
                        })
                      }
                      placeholder="ماذا فعلت؟"
                      className={inputClass}
                    />
                  </div>
                </div>

                <button
                  onClick={handleAddDiary}
                  className={`${primaryButtonClass} mt-5`}
                >
                  <Plus size={17} />
                  حفظ اليومية
                </button>
              </div>

              {/* ENTRIES */}

              <div className="mt-7 space-y-6">
                {dailyDiaryEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-5 rounded-2xl bg-bg-surface-elevated border border-border-subtle"
                  >
                    <div className="flex items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                      <div className="flex items-center gap-2">
                        <Check
                          size={15}
                          className="text-emerald-600"
                        />

                        <span className="text-xs font-bold text-text-primary">
                          يومية محفوظة
                        </span>
                      </div>

                      <span className="text-[11px] text-text-muted">
                        {entry.date}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
                      <div>
                        <span className="text-[10px] font-bold text-text-muted">
                          النشاط
                        </span>

                        <p className="mt-1.5 text-sm leading-6 text-text-primary">
                          {entry.alignedActivity}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-text-muted">
                          المشاعر والأفكار
                        </span>

                        <p className="mt-1.5 text-sm leading-6 text-rose-700 dark:text-rose-400">
                          {entry.uncomfortableFeelings ||
                            '—'}
                        </p>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-text-muted">
                          طريقة التعامل
                        </span>

                        <p className="mt-1.5 text-sm leading-6 text-emerald-700 dark:text-emerald-400">
                          {entry.handling || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}
      </main>

      <div className="mt-8">
        <Footer />
      </div>
    </div>
  );
}