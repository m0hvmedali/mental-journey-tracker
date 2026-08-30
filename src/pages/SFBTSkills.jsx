import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Footer from "@/components/Footer";

export default function SFBTSkills() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('philosophy');

  // ===================== STATE FOR INTERACTIVE TOOLS =====================

  // 1. Listen, Select, Build Tool State
  const [lsbInput, setLsbInput] = useState(
    'أشعر بإحباط شديد بسبب طلاقي، لا أستطيع النوم مطلقاً، لكني أريد فقط أن أرتب فوضى حياتي وأهتم بطفلي'
  );
  const [lsbExtractedProblem, setLsbExtractedProblem] = useState(['الطلاق', 'عدم النوم', 'الإحباط الشديد']);
  const [lsbExtractedSolution, setLsbExtractedSolution] = useState(['أرتب فوضى حياتي', 'أهتم بطفلي']);
  const [lsbGeneratedQuestion, setLsbGeneratedQuestion] = useState(
    'عندما تبدأ في ترتيب فوضى حياتك والاهتمام بطفلك غداً، ما هي أول خطوة صغيرة ستلاحظ أنك قمت بها وتخبرك بأنك تسير في الطريق الصحيح؟'
  );

  const handleLsbAnalyze = () => {
    if (!lsbInput.trim()) return;
    const text = lsbInput;
    const solutionWords = [];
    if (text.includes('أريد') || text.includes('أرتب') || text.includes('أهتم') || text.includes('أنجح') || text.includes('تغيير')) {
      if (text.includes('أرتب فوضى حياتي')) solutionWords.push('أرتب فوضى حياتي');
      if (text.includes('أهتم بطفلي')) solutionWords.push('أهتم بطفلي');
      if (solutionWords.length === 0) solutionWords.push('الرغبة الصادقة في ترتيب الحياة وتحقيق الاستقرار');
    } else {
      solutionWords.push('القدرة على التعبير والبحث عن التغيير الأفضل');
    }
    setLsbExtractedSolution(solutionWords);

    const question = `عندما تبدأ في ${solutionWords.join(' و ')} غداً، ما هي أول خطوة صغيرة جداً ستلاحظ أنك قمت بها وتخبرك بأنك تسير في الطريق الصحيح؟`;
    setLsbGeneratedQuestion(question);
  };

  // 2. Miracle Question State
  const [miracleData, setMiracleData] = useState(() => {
    try {
      const saved = localStorage.getItem('sfbt_miracle');
      return saved ? JSON.parse(saved) : {
        breathing: 'تنفس عميق وهادئ مع شعور بخفة في الصدر وحرية من ثقل القلق',
        firstWords: 'الحمد لله، اليوم يبدو مختلفاً ومشرقاً، أنا أملك زمام أمري',
        coffeeMovement: 'حركة خفيفة وواثقة مع ابتسامة عفوية وتأمل البخار بصبر',
        othersNotice: 'سيلاحظون هدوء نبرة صوتي، ابتسامتي الحقيقية، وإقبالي على الحديث بإنشراح'
      };
    } catch {
      return { breathing: '', firstWords: '', coffeeMovement: '', othersNotice: '' };
    }
  });

  const saveMiracleData = (data) => {
    setMiracleData(data);
    localStorage.setItem('sfbt_miracle', JSON.stringify(data));
  };

  // 3. Exception Tracker State
  const [exceptions, setExceptions] = useState(() => {
    try {
      const saved = localStorage.getItem('sfbt_exceptions');
      return saved ? JSON.parse(saved) : [
        { id: 1, day: 'الأحد', timeSlot: 'الساعة 5 مساءً', whatWasDifferent: 'جلست لقراءة كتاب مع شرب الشاي بنشاط', whoWasWithYou: 'بمفردي في الشرفة', mySmallRole: 'قررت إغلاق الهاتف لمدة ساعة والجلوس في مكان هادئ' }
      ];
    } catch { return []; }
  });

  const [newException, setNewException] = useState({
    day: 'الإثنين',
    timeSlot: '',
    whatWasDifferent: '',
    whoWasWithYou: '',
    mySmallRole: ''
  });

  const handleAddException = () => {
    if (!newException.whatWasDifferent.trim()) return;
    const updated = [...exceptions, { ...newException, id: Date.now() }];
    setExceptions(updated);
    localStorage.setItem('sfbt_exceptions', JSON.stringify(updated));
    setNewException({ day: 'الإثنين', timeSlot: '', whatWasDifferent: '', whoWasWithYou: '', mySmallRole: '' });
  };

  // 4. Coping Anatomy State
  const [copingItems, setCopingItems] = useState(() => {
    try {
      const saved = localStorage.getItem('sfbt_coping');
      return saved ? JSON.parse(saved) : [
        { id: 1, challenge: 'ضغط العمل والتأخير في تسليم المهام', preventingStrategy: 'تقسيم المهام لخطوات صغيرة جداً والتنفس عند الشعور بالارتباك', innerStrength: 'الصبر والمسؤولية تجاه طفلي' }
      ];
    } catch { return []; }
  });

  const [newCoping, setNewCoping] = useState({ challenge: '', preventingStrategy: '', innerStrength: '' });

  const handleAddCoping = () => {
    if (!newCoping.challenge.trim()) return;
    const updated = [...copingItems, { ...newCoping, id: Date.now() }];
    setCopingItems(updated);
    localStorage.setItem('sfbt_coping', JSON.stringify(updated));
    setNewCoping({ challenge: '', preventingStrategy: '', innerStrength: '' });
  };

  // 5. Scaling Questions State
  const [scalingGoal, setScalingGoal] = useState('الشعور بالاستقرار النفسي والسيطرة على اليوم');
  const [scaleScore, setScaleScore] = useState(4);
  const [holdingFactors, setHoldingFactors] = useState('الالتزام بالاستيقاظ المبكر والاعتناء بطفلي يومياً');
  const [oneStepForward, setOneStepForward] = useState('المشي لمدة 10 دقائق في الهواء الطلق صباحاً');

  // 6. Time-out Reflection Timer State
  const [timeoutTimer, setTimeoutTimer] = useState(300); // 5 mins
  const [isTimeoutActive, setIsTimeoutActive] = useState(false);
  const [feedbackLetter, setFeedbackLetter] = useState('');
  const [proposedExperiment, setProposedExperiment] = useState('');

  useEffect(() => {
    let interval = null;
    if (isTimeoutActive && timeoutTimer > 0) {
      interval = setInterval(() => setTimeoutTimer(t => t - 1), 1000);
    } else if (timeoutTimer === 0) {
      setIsTimeoutActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimeoutActive, timeoutTimer]);

  // 7. Accolades State
  const [accolades, setAccolades] = useState(() => {
    try {
      const saved = localStorage.getItem('sfbt_accolades');
      return saved ? JSON.parse(saved) : [
        { id: 1, text: 'أنا فخور بطريقتي الصبورة في الاستماع لزميلي المحبط اليوم دون مقاطعته أو إشعاره بالملل.', date: 'اليوم' }
      ];
    } catch { return []; }
  });
  const [newAccoladeText, setNewAccoladeText] = useState('');

  const handleAddAccolade = () => {
    if (!newAccoladeText.trim()) return;
    const item = { id: Date.now(), text: newAccoladeText, date: new Date().toLocaleDateString('ar-EG') };
    const updated = [item, ...accolades];
    setAccolades(updated);
    localStorage.setItem('sfbt_accolades', JSON.stringify(updated));
    setNewAccoladeText('');
  };

  // 8. Behavioral Experiment State
  const [chosenException, setChosenException] = useState('المشي الجانبي لمدة 15 دقيقة مع الاستماع لبودكاست مفيد');
  const [expFrequency, setExpFrequency] = useState('مرتين هذا الأسبوع (الثلاثاء والخميس)');

  // 9. Pre-session Change State
  const [preSessionDecision, setPreSessionDecision] = useState('القرار ببدء تنظيف وتنظيم مساحتي الشخصية والبدء ببرنامج التعافي');
  const [preSessionActions, setPreSessionActions] = useState('ترتيب المكتب وإغلاق الإشعارات المشتتة وتدوين الملاحظات');

  return (
    <div className="min-h-screen bg-bg-app text-text-primary dir-rtl font-sans pb-20">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-bg-surface border-b border-border-subtle shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/modules/major-psychotherapies/sfbt')}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated rounded-xl transition-all border border-border-subtle"
              title="العودة"
            >
              <ArrowLeft size={18} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-text-primary leading-tight">
                دليل العلاج المركّز على الحلول قصير المدى (SFBT)
              </h1>
              <p className="text-xs text-text-muted font-medium">
                المبادئ والتقنيات وحزمة تمارين MECSTAT التطبيقية
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-bg-surface border-b border-border-subtle py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            Solution-Focused Brief Therapy Guide
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-text-primary leading-tight">
            استكشف الفلسفة والمهارات العملية لـ SFBT
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-3xl mx-auto leading-relaxed">
            تعتمد ممارسة SFBT على فلسفة علاجية راديكالية تختلف عن التشخيص وتحليل المشاكل الماضية. يفترض النموذج أنك تمتلك بالفعل الموارد والقدرات اللازمة للتغيير الإيجابي، وأن التركيز على المستقبل المفضل واللحظات الناجحة هو المفتاح.
          </p>
        </div>
      </section>

      {/* TABS NAVIGATION */}
      <div className="bg-bg-surface border-b border-border-subtle sticky top-[57px] z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'philosophy', title: '1. الفلسفة والمبادئ' },
            { id: 'lsb', title: '2. نموذج استمع، اختر، وابنِ' },
            { id: 'mecstat', title: '3. حزمة مهارات MECSTAT' },
            { id: 'presession', title: '4. التغيير قبل الجلسة' }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'bg-bg-surface-elevated text-text-muted hover:bg-bg-surface-hover hover:text-text-primary'
                }`}
              >
                <span>{tab.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* SECTION 1: PHILOSOPHY & PRINCIPLES */}
        {activeTab === 'philosophy' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                أولاً: الفلسفة والمبادئ الأساسية لـ SFBT
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                تستند ممارسة العلاج المركّز على الحلول قصير المدى على أربعة أركان فلسفية تحوّل الانتباه من تحليل أسباب المعاناة التاريخية إلى استثمار نقاط القوة وتصميم المستقبل المفضل.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">المبدأ الأول</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">التركيز على القوة والكفاءة (Competency & Resource-Based)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  يفترض النموذج أن العميل يمتلك بالفعل الموارد والقدرات والكفاءات اللازمة لإحداث التغيير الإيجابي في حياته، وأن دور المعالج أو التقييم الذاتي هو تفعيل هذه الموارد بدلاً من تقديم حلول جاهزة أو تشخيص نقاط الضعف.
                </p>
              </div>

              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">المبدأ الثاني</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">التوجه نحو الحاضر والمستقبل (Present & Future-Focused)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  يتجنب العلاج الغوص في تاريخ المشكلة أو البحث عن أصولها التاريخية المعقدة، ويركز بدلاً من ذلك على صياغة "المستقبل المفضل" واستكشاف اللحظات الحالية التي يعمل فيها الشخص بشكل جيد.
                </p>
              </div>

              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">المبدأ الثالث</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">الحلول تختلف عن المشكلات (Solutions are Different from Problems)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  ليس من الضروري صياغة وفهم المشكلة بدقة لتطوير الحلول؛ فالحل غالبًا ما يتخذ شكلاً وطريقًا مختلفًا تمامًا عن طبيعة وتاريخ المشكلة نفسها.
                </p>
              </div>

              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">المبدأ الرابع</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">التغيير مستمر وثابت (Personal Change is Constant)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  يفترض العلاج أن التغيير يحدث طوال الوقت بشكل حتمي؛ ومهمتنا هي رصد وتضخيم التغييرات الإيجابية الصغيرة وتوجيه الانتباه نحوها.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: LISTEN, SELECT, BUILD */}
        {activeTab === 'lsb' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                ثانياً: نموذج الصياغة اللغوية "استمع، اختر، وابنِ" (Listen, Select, Build)
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                تمثل هذه المهارة اللغوية جوهر المقابلة والتحاور الذاتي في SFBT، وتعمل على تجاوز "حديث المشكلة" والتقاط "حديث الحل".
              </p>
            </div>

            {/* INTERACTIVE TOOL */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-5">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <h4 className="font-bold text-text-primary text-sm sm:text-base">
                  تمرين تطبيقي: صائد حديث الحل (Listen, Select, Build Converter)
                </h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">
                    1. استمع (Listen): اكتب فقرة تعبر عن مشكلة أو صعوبة تواجهها حالياً:
                  </label>
                  <textarea
                    rows={3}
                    value={lsbInput}
                    onChange={(e) => setLsbInput(e.target.value)}
                    placeholder="مثال: أشعر بإحباط شديد بسبب ضغط العمل، لكني أريد تنظيم وقتي واستعادة شغفي..."
                    className="w-full p-3 rounded-xl border border-border-medium bg-bg-surface-elevated text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <button
                  onClick={handleLsbAnalyze}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                >
                  2. اختر وابنِ السؤال الموجه للمستقبل
                </button>
              </div>

              {/* OUTPUT DISPLAY */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="bg-bg-surface-elevated border border-border-subtle p-3.5 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-text-muted block">حديث المشكلة (تم تحييده)</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lsbExtractedProblem.map((p, i) => (
                      <span key={i} className="text-[11px] bg-bg-surface text-text-muted px-2 py-0.5 rounded-lg border border-border-subtle line-through">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-bg-surface-elevated border border-border-subtle p-3.5 rounded-xl space-y-1.5">
                  <span className="text-xs font-bold text-text-primary block">اختر (Select): كلمات الحل والقوة</span>
                  <div className="flex flex-wrap gap-1.5">
                    {lsbExtractedSolution.map((s, i) => (
                      <span key={i} className="text-[11px] bg-bg-surface text-text-primary px-2 py-0.5 rounded-lg border border-border-medium font-bold">
                        "{s}"
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-bg-surface-elevated border border-border-subtle p-3.5 rounded-xl space-y-1.5 md:col-span-1">
                  <span className="text-xs font-bold text-text-primary block">ابنِ (Build): السؤال المستقبلي الموجه</span>
                  <p className="text-xs font-bold text-text-primary bg-bg-surface p-2.5 rounded-lg border border-border-subtle leading-relaxed">
                    "{lsbGeneratedQuestion}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: MECSTAT TECHNIQUES */}
        {activeTab === 'mecstat' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                ثالثاً: حزمة مهارات وتقنيات MECSTAT التفصيلية
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                يرمز اختصار MECSTAT إلى التقنيات الأساسية السبع في SFBT: Miracle Question, Exception Questions, Coping Questions, Scaling Questions, Time-out, Accolades, Task.
              </p>
            </div>

            {/* 1. MIRACLE QUESTION */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">M</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">1. سؤال المعجزة (Miracle Question)</h4>
                </div>
              </div>

              <div className="bg-bg-surface-elevated p-3.5 rounded-xl text-xs text-text-secondary space-y-1 border border-border-subtle">
                <p className="font-bold text-text-primary">نص سؤال المعجزة القياسي:</p>
                <p className="italic leading-relaxed">
                  "تخيل أنه أثناء نومك الليلة، حدثت معجزة وحُلت المشكلة تماماً. نظراً لأنك كنت نائماً، لم تكن تعلم بحدوثها. عندما تستيقظ في الصباح، ما هي أولى العلامات الطفيفة التي ستلاحظها وتخبرك بأن المعجزة قد حدثت بالفعل؟"
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <h5 className="text-xs font-bold text-text-primary">تمرين: "سيناريو الصباح بعد المعجزة" (رسم خريطة المستقبل بحواسك):</h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">طريقة تنفسك عند فتح عينيك:</label>
                    <input
                      type="text"
                      value={miracleData.breathing}
                      onChange={e => saveMiracleData({ ...miracleData, breathing: e.target.value })}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">أول شيء ستقوله لنفسك أو لشريكك:</label>
                    <input
                      type="text"
                      value={miracleData.firstWords}
                      onChange={e => saveMiracleData({ ...miracleData, firstWords: e.target.value })}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">حركتك وتعبير وجهك أثناء القهوة/الشاي:</label>
                    <input
                      type="text"
                      value={miracleData.coffeeMovement}
                      onChange={e => saveMiracleData({ ...miracleData, coffeeMovement: e.target.value })}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">ما الذي سيلاحظه المقربون منك؟:</label>
                    <input
                      type="text"
                      value={miracleData.othersNotice}
                      onChange={e => saveMiracleData({ ...miracleData, othersNotice: e.target.value })}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. EXCEPTION QUESTIONS */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">E</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">2. أسئلة الاستثناءات (Exception Questions)</h4>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                تُستخدم لاستكشاف الأوقات التي لم تكن فيها المشكلة موجودة أو كانت بحدة أقل، لرصد السلوكيات الفعالة وتكرارها.
              </p>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-text-primary">تمرين: "صائد الاستثناءات الأسبوعي":</h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle">
                  <input
                    type="text"
                    placeholder="اليوم/الوقت (مثل: الأحد 5 مساءً)"
                    value={newException.timeSlot}
                    onChange={e => setNewException({ ...newException, timeSlot: e.target.value })}
                    className="p-2 bg-bg-surface rounded-lg border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="ما الذي كان مختلفاً بالضبط؟"
                    value={newException.whatWasDifferent}
                    onChange={e => setNewException({ ...newException, whatWasDifferent: e.target.value })}
                    className="p-2 bg-bg-surface rounded-lg border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="دورك الصغير الفعال؟"
                    value={newException.mySmallRole}
                    onChange={e => setNewException({ ...newException, mySmallRole: e.target.value })}
                    className="p-2 bg-bg-surface rounded-lg border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <button
                  onClick={handleAddException}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                >
                  تسجيل استثناء جديد
                </button>

                <div className="space-y-2 pt-1">
                  {exceptions.map(item => (
                    <div key={item.id} className="bg-bg-surface-elevated border border-border-subtle p-3 rounded-xl text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="font-bold text-text-primary">{item.timeSlot || 'ساعة استثناء'}:</span>{' '}
                        <span className="text-text-secondary">{item.whatWasDifferent}</span>
                      </div>
                      <div className="text-[11px] bg-bg-surface px-2.5 py-1 rounded-lg border border-border-subtle text-text-primary font-bold shrink-0">
                        دورك: {item.mySmallRole || 'مبادرة شخصية'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. COPING QUESTIONS */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">C</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">3. أسئلة التكيف والتعايش (Coping Questions)</h4>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                تُستخدم عند الشعور بضغوط شديدة لكشف مواطن الصمود الداخلي والتساؤل: "رغم كل هذه الضغوط، كيف تنجح في مواجهة يومك ومنعه من التدهور لأسوأ من ذلك؟"
              </p>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-text-primary">تمرين: "تشريح الصمود اليومي":</h5>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle">
                  <input
                    type="text"
                    placeholder="التحدي الكبير القائم"
                    value={newCoping.challenge}
                    onChange={e => setNewCoping({ ...newCoping, challenge: e.target.value })}
                    className="p-2 bg-bg-surface rounded-lg border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="ماذا تفعل لتمنع انهيار حياتك؟"
                    value={newCoping.preventingStrategy}
                    onChange={e => setNewCoping({ ...newCoping, preventingStrategy: e.target.value })}
                    className="p-2 bg-bg-surface rounded-lg border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="القوة الشخصية المستنبطة"
                    value={newCoping.innerStrength}
                    onChange={e => setNewCoping({ ...newCoping, innerStrength: e.target.value })}
                    className="p-2 bg-bg-surface rounded-lg border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <button
                  onClick={handleAddCoping}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                >
                  إضافة توثيق صمود
                </button>

                <div className="space-y-2 pt-1">
                  {copingItems.map(item => (
                    <div key={item.id} className="bg-bg-surface-elevated border border-border-subtle p-3 rounded-xl text-xs space-y-1">
                      <div className="font-bold text-text-primary">التحدي: {item.challenge}</div>
                      <div className="text-text-secondary">حمايتك لنفسك: {item.preventingStrategy}</div>
                      <div className="text-text-primary font-bold text-[11px]">القوة الداخلية: {item.innerStrength}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. SCALING QUESTIONS */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">S</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">4. أسئلة التقييم الرقمي / المدرج (Scaling Questions)</h4>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-text-primary">تمرين: "لعبة الدرجة الواحدة":</h5>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">الهدف أو الحالة المطلوبة:</label>
                  <input
                    type="text"
                    value={scalingGoal}
                    onChange={e => setScalingGoal(e.target.value)}
                    className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-text-secondary">موقعك الحالي على مقياس من 0 إلى 10:</label>
                    <span className="text-sm font-bold text-text-primary bg-bg-surface-elevated px-3 py-0.5 rounded-lg border border-border-subtle">
                      {scaleScore} / 10
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={scaleScore}
                    onChange={e => setScaleScore(Number(e.target.value))}
                    className="w-full accent-emerald-700 h-2 bg-bg-surface-hover rounded-lg cursor-pointer"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle space-y-1">
                    <label className="block text-[11px] font-bold text-text-secondary">ما الذي يثبتك عند الرقم ({scaleScore}) ويمنع السقوط؟</label>
                    <input
                      type="text"
                      value={holdingFactors}
                      onChange={e => setHoldingFactors(e.target.value)}
                      className="w-full p-2 bg-bg-surface border border-border-medium rounded-lg text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="bg-bg-surface-elevated p-3 rounded-xl border border-border-subtle space-y-1">
                    <label className="block text-[11px] font-bold text-text-primary">عمل واحد صغير لينقلك للدرجة ({scaleScore < 10 ? scaleScore + 1 : 10}) غداً؟</label>
                    <input
                      type="text"
                      value={oneStepForward}
                      onChange={e => setOneStepForward(e.target.value)}
                      className="w-full p-2 bg-bg-surface border border-border-medium rounded-lg text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 5. TIME-OUT */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">T</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">5. الاستراحة الفنية / وقت التوقف المستقطع (Time-out)</h4>
                </div>
                <div className="flex items-center gap-1 text-text-primary font-bold text-xs dir-ltr">
                  <Clock size={16} />
                  <span>{Math.floor(timeoutTimer / 60)}:{(timeoutTimer % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed">
                وقفة تأمل مدتها 5 دقائق لمراجعة الملاحظات وتلخيص نقاط القوة والتغلب على تشتت الذهن.
              </p>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {!isTimeoutActive ? (
                    <button
                      onClick={() => setIsTimeoutActive(true)}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                    >
                      بدء مؤقت الـ 5 دقائق
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsTimeoutActive(false)}
                      className="px-4 py-2 bg-bg-surface-hover text-text-primary rounded-xl text-xs font-bold transition-all border border-border-subtle"
                    >
                      إيقاف مؤقت
                    </button>
                  )}
                  <button
                    onClick={() => { setIsTimeoutActive(false); setTimeoutTimer(300); }}
                    className="px-3 py-2 bg-bg-surface-elevated text-text-muted rounded-xl text-xs font-bold hover:bg-bg-surface-hover transition-all border border-border-subtle"
                  >
                    إعادة ضبط
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <textarea
                    rows={2}
                    placeholder="رسالة تغذية راجعة لنفسك تلخص نقاط القوة..."
                    value={feedbackLetter}
                    onChange={e => setFeedbackLetter(e.target.value)}
                    className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <textarea
                    rows={2}
                    placeholder="تجربة صغيرة مقترحة لتطبيقها..."
                    value={proposedExperiment}
                    onChange={e => setProposedExperiment(e.target.value)}
                    className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* 6. ACCOLADES */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">A</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">6. الإطراءات والتقدير السلوكي (Accolades)</h4>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-text-primary">تمرين: "مفكرة الإطراء الذاتي السلوكي":</h5>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="إطراء سلوكي محدد مرتبط بحدث واقعي..."
                    value={newAccoladeText}
                    onChange={e => setNewAccoladeText(e.target.value)}
                    className="flex-1 p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    onClick={handleAddAccolade}
                    className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all shrink-0"
                  >
                    حفظ الإطراء
                  </button>
                </div>

                <div className="space-y-2 pt-1">
                  {accolades.map(a => (
                    <div key={a.id} className="bg-bg-surface-elevated border border-border-subtle p-3 rounded-xl text-xs flex items-center justify-between gap-2">
                      <span className="font-bold text-text-primary">"{a.text}"</span>
                      <span className="text-[10px] text-text-muted font-semibold">{a.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 7. TASK / EXPERIMENT */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border-subtle pb-3">
                <div className="flex items-center gap-2">
                  <span className="size-6 rounded-lg bg-emerald-700 text-white font-bold text-xs flex items-center justify-center">T</span>
                  <h4 className="font-bold text-text-primary text-sm sm:text-base">7. المهمة والتجربة السلوكية (Task)</h4>
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="text-xs font-bold text-text-primary">تمرين: "تصميم تجربة الاستثناء":</h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">الاستثناء المختار لتكراره عن عمد:</label>
                    <input
                      type="text"
                      value={chosenException}
                      onChange={e => setChosenException(e.target.value)}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1">التكرار والمواعيد المقترحة:</label>
                    <input
                      type="text"
                      value={expFrequency}
                      onChange={e => setExpFrequency(e.target.value)}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SECTION 4: PRE-SESSION CHANGE */}
        {activeTab === 'presession' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                رابعاً: مهارة استكشاف التغيير قبل الجلسة (Pre-Session Change)
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                تبدأ عملية التغيير والتنفيذ من اللحظة التي يتخذ فيها الشخص القرار الواعي بطلب المساعدة أو بدء برنامج التعافي.
              </p>
            </div>

            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-5">
              <div className="bg-bg-surface-elevated p-3.5 rounded-xl border border-border-subtle text-xs text-text-secondary">
                <p className="font-bold text-text-primary">السؤال الافتتاحي القياسي:</p>
                <p className="italic leading-relaxed">
                  "ما هي التغييرات أو التحسنات التي لاحظت أنها بدأت تحدث بالفعل في حياتك منذ أن اتخذت القرار الواعي بالتعافي وحتى الآن؟"
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="font-bold text-text-primary text-sm">تمرين: "رصد قوة القرار":</h4>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">قرار هام اتخذته مؤخراً للتغيير:</label>
                  <input
                    type="text"
                    value={preSessionDecision}
                    onChange={e => setPreSessionDecision(e.target.value)}
                    className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">تصرفات طفيفة بدأت تفعلها بمجرد استقرار القرار بوعيك:</label>
                  <textarea
                    rows={2}
                    value={preSessionActions}
                    onChange={e => setPreSessionActions(e.target.value)}
                    className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
