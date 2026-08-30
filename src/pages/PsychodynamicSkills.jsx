import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import Footer from "@/components/Footer";

export default function PsychodynamicSkills() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pillars');

  // ===================== STATE FOR INTERACTIVE EXERCISES =====================

  // EXERCISE 1: Relationship Blueprint Map State
  const [blueprintParents, setBlueprintParents] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_blueprint_parents');
      return saved || 'والد متسلط وناقد باستمرار، وأم مهملة عاطفياً ومرتبكة';
    } catch { return ''; }
  });

  const [blueprintPartners, setBlueprintPartners] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_blueprint_partners');
      return saved || 'شركاء غامضون عاطفياً، يوجهون نقدًا مستترًا ويصعب إرضاؤهم';
    } catch { return ''; }
  });

  const [blueprintAnalysis, setBlueprintAnalysis] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_blueprint_analysis');
      return saved || 'ألاحظ أنني أختار لا شعورياً أشخاصاً يشبهون والدي في النقد والاستياء، محاولاً نيل قبولهم لإصلاح ما حدث في طفولتي.';
    } catch { return ''; }
  });

  const saveBlueprint = () => {
    localStorage.setItem('psy_blueprint_parents', blueprintParents);
    localStorage.setItem('psy_blueprint_partners', blueprintPartners);
    localStorage.setItem('psy_blueprint_analysis', blueprintAnalysis);
  };

  // EXERCISE 2: Defense Style Log State
  const [defenseLogs, setDefenseLogs] = useState(() => {
    try {
      const saved = localStorage.getItem('psy_defense_logs');
      return saved ? JSON.parse(saved) : [
        {
          id: 1,
          date: 'اليوم',
          situation: 'تعرضت لنقد حاد وغير مبرر من مديري في العمل أمام زملائي',
          rationalization: 'أقنعت نفسي بأن المدير مريض نفسياً والموضوع لا يستحق الغضب (عقلنة مفرطة)',
          reactionFormation: 'ابتسمت بزيادة وشكرته بحرارة وشغف لتغطية الغضب الشديد',
          repressionDenial: 'تظاهرت بأنني لم أتأثر مطلقاً وأكملت اليوم كأن شيئاً لم يكن',
          cost: 'صداع نصفي شديد في المساء مع شعور بالحنق المكتوم'
        }
      ];
    } catch { return []; }
  });

  const [newDefense, setNewDefense] = useState({
    situation: '',
    rationalization: '',
    reactionFormation: '',
    repressionDenial: '',
    cost: ''
  });

  const handleAddDefense = () => {
    if (!newDefense.situation.trim()) return;
    const item = {
      id: Date.now(),
      date: new Date().toLocaleDateString('ar-EG'),
      ...newDefense
    };
    const updated = [item, ...defenseLogs];
    setDefenseLogs(updated);
    localStorage.setItem('psy_defense_logs', JSON.stringify(updated));
    setNewDefense({ situation: '', rationalization: '', reactionFormation: '', repressionDenial: '', cost: '' });
  };

  // EXERCISE 3: Free Association Written Stream State
  const [freeAssocSeconds, setFreeAssocSeconds] = useState(600); // 10 mins
  const [isFreeAssocActive, setIsFreeAssocActive] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [freeReflections, setFreeReflections] = useState('');

  useEffect(() => {
    let interval = null;
    if (isFreeAssocActive && freeAssocSeconds > 0) {
      interval = setInterval(() => setFreeAssocSeconds(s => s - 1), 1000);
    } else if (freeAssocSeconds === 0) {
      setIsFreeAssocActive(false);
    }
    return () => clearInterval(interval);
  }, [isFreeAssocActive, freeAssocSeconds]);

  // EXERCISE 4: From Conflict to Insight State
  const [conflictBehavior, setConflictBehavior] = useState('أوافق دائماً على طلبات الآخرين الإضافية على حساب راحتي ووقتي ثم أشعر بالحنق الداخلي');
  const [consciousLevel, setConsciousLevel] = useState('أفعل ذلك لأنني أريد أن أكون شخصاً متعاوناً ولطيفاً مع الجميع');
  const [unconsciousFear, setUnconsciousFear] = useState('أخشى أن يرفضوني أو يكرهوني، وأبقى وحيداً تماماً كما كنت أشعر بالهجر في طفولتي');
  const [unconsciousDesire, setUnconsciousDesire] = useState('أحاول شراء حبهم وقبولهم وتأمين الشعور بالأمان الاستباقي');
  const [insightStatement, setInsightStatement] = useState('أنا أرى الآن أن رغبتي في حماية نفسي من الهجر هي التي تقود سلوكي. الماضي قد انتهى، وأنا كشخص بالغ قادر على حماية نفسي والتعايش مع رفض الآخرين دون أن يهدد ذلك وجودي.');

  return (
    <div className="min-h-screen bg-bg-app text-text-primary dir-rtl font-sans pb-20">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-bg-surface border-b border-border-subtle shadow-xs">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/modules/major-psychotherapies/psychodynamic')}
              className="p-2 text-text-muted hover:text-text-primary hover:bg-bg-surface-elevated rounded-xl transition-all border border-border-subtle"
              title="العودة"
            >
              <ArrowLeft size={18} className="rotate-180" />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-text-primary leading-tight">
                دليل العلاج النفسي الديناميكي الحديث (Psychodynamic)
              </h1>
              <p className="text-xs text-text-muted font-medium">
                الركائز الأربعة، آليات الدفاع اللاشعورية، وتطبيقات الاستبصار
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* HERO BANNER */}
      <section className="bg-bg-surface border-b border-border-subtle py-8 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            Modern Psychodynamic Psychotherapy Guide
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-text-primary leading-tight">
            استبصار عميق وتغيير بنيوي للشخصية
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary max-w-3xl mx-auto leading-relaxed">
            يهدف العلاج الديناميكي الحديث إلى زيادة الوعي بالعمليات النفسية اللاشعورية، وفك تشابك صراعات الماضي التي تشوه الحاضر، وتطوير استبصار انفعالي يقود إلى الشفاء الحقيقي.
          </p>
        </div>
      </section>

      {/* NAVIGATION TABS */}
      <div className="bg-bg-surface border-b border-border-subtle sticky top-[57px] z-20 shadow-xs">
        <div className="max-w-6xl mx-auto px-2 sm:px-4 flex items-center gap-2 overflow-x-auto py-2.5 scrollbar-none">
          {[
            { id: 'pillars', title: '1. الركائز الأربعة' },
            { id: 'defenses', title: '2. آليات الدفاع اللاشعورية' },
            { id: 'clinical', title: '3. أدوات الاستبصار' },
            { id: 'exercises', title: '4. تمارين الاستبصار العملية' }
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

        {/* SECTION 1: CORE PILLARS */}
        {activeTab === 'pillars' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                أولاً: الركائز الأربعة الأساسية للمنظور الديناميكي الحديث
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                تستند النظرية والممارسة الديناميكية المعاصرة إلى أربعة أعمدة تكاملية تفسر السلوك الإنساني.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">الركيزة الأولى</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">أولوية العمليات اللاشعورية (Primacy of the Unconscious)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  معظم سلوكياتنا ومشاعرنا وقراراتنا يتم توجيهها بقوى ودوافع ومخاوف لا شعورية لا نعي وجودها بشكل كامل. إحضار هذه المواد إلى الوعي هو الخطوة الأولى للتحرر.
                </p>
              </div>

              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">الركيزة الثانية</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">الأهمية الحاسمة لخبرات الطفولة المبكرة (Early Experiences)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  تجارب الطفولة والعلاقات المبكرة مع مقدمي الرعاية ليست مجرد ذكريات، بل هي القالب الأساسي الذي يشكل معالم وتضاريس شخصية البالغ.
                </p>
              </div>

              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">الركيزة الثالثة</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">الحتمية النفسية (Psychic Causality)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  لا توجد فكرة أو حلم أو زلة لسان أو عرض نفسي يحدث بمحض الصدفة؛ فكل حدث عاطفي له دافع ومغزى لا شعوري يرتبط بالبنية الداخلية.
                </p>
              </div>

              <div className="bg-bg-surface rounded-2xl p-5 border border-border-subtle shadow-2xs space-y-2">
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-100 dark:bg-emerald-950/60 px-2.5 py-1 rounded-lg">الركيزة الرابعة</span>
                <h4 className="font-bold text-text-primary text-sm sm:text-base">المخططات الذهنية للعلاقات (Relationship Blueprints)</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  الصور الذهنية والتمثيلات الداخلية التي نكونها عن والدينا تعمل كـ"خرائط طريق" لا شعورية تحدد توقعاتنا وأنماط تفاعلنا في العلاقات العاطفية والاجتماعية في الكبر.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 2: EGO DEFENSES */}
        {activeTab === 'defenses' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                ثانياً: أساليب وآليات الدفاع النفسي اللاشعورية (Ego Defenses)
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                هي مصادر لا شعورية يستخدمها الأنا (Ego) لتقليل القلق والتوتر الداخلي الناتجة عن الصراع بين الدوافع والضمير والعالم الخارجي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ADAPTIVE DEFENSES */}
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-text-primary text-sm border-b border-border-subtle pb-2">
                  1. الدفاعات الناضجة والتكيفية (Adaptive Defenses)
                </h4>

                <div className="space-y-3">
                  <div className="bg-bg-surface-elevated p-4 rounded-xl border border-border-subtle space-y-1">
                    <h5 className="font-bold text-text-primary text-xs sm:text-sm">التسامي / التسامي بالنفس (Sublimation)</h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      تحويل الدوافع اللاشعورية غير المقبولة إلى أنشطة إبداعية أو اجتماعية مفيدة (مثل تحويل الغضب إلى ممارسة الرياضة التنافسية أو الفن).
                    </p>
                  </div>

                  <div className="bg-bg-surface-elevated p-4 rounded-xl border border-border-subtle space-y-1">
                    <h5 className="font-bold text-text-primary text-xs sm:text-sm">العقلنة والتبرير المقبول (Rationalization)</h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      تفسير المواقف الصعبة بطرق منطقية ومقبولة شعورياً لتقليل وطأة الفشل أو الصدمة.
                    </p>
                  </div>
                </div>
              </div>

              {/* LESS ADAPTIVE DEFENSES */}
              <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-text-primary text-sm border-b border-border-subtle pb-2">
                  2. الدفاعات الأقل تكيفاً (Less Adaptive Defenses)
                </h4>

                <div className="space-y-3">
                  <div className="bg-bg-surface-elevated p-4 rounded-xl border border-border-subtle space-y-1">
                    <h5 className="font-bold text-text-primary text-xs sm:text-sm">الكبت اللاشعوري (Repression)</h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      دفع الأفكار والمشاعر المؤلمة قسراً إلى مناطق اللاشعور لتجنب مواجهتها.
                    </p>
                  </div>

                  <div className="bg-bg-surface-elevated p-4 rounded-xl border border-border-subtle space-y-1">
                    <h5 className="font-bold text-text-primary text-xs sm:text-sm">التكوين العكسي (Reaction Formation)</h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      التعبير عن تصرفات تعاكس تماماً المشاعر اللاشعورية الحقيقية (مثل إظهار مبالغ فيه للحب تجاه شخص تشعر تجاهه بخصومة لا شعورية).
                    </p>
                  </div>

                  <div className="bg-bg-surface-elevated p-4 rounded-xl border border-border-subtle space-y-1">
                    <h5 className="font-bold text-text-primary text-xs sm:text-sm">الإنكار (Denial)</h5>
                    <p className="text-xs text-text-secondary leading-relaxed">
                      رفض الاعتراف بواقع خارجي مؤلم؛ وهي آلية تجعل الشخص يتجاهل الأعراض والمشكلات حتى فوات الأوان.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: CLINICAL TOOLS */}
        {activeTab === 'clinical' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                ثالثاً: أدوات وتطبيقات الاستبصار العلاجي (Clinical Tools for Insight)
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                يهدف العلاج الديناميكي إلى تفعيل أدوات محددة لتحويل الصراع إلى استبصار وتغيير بنيوي.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-bg-surface p-5 rounded-2xl border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-primary text-sm">1. الاستبصار المعرفي والانفعالي</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  لا يكفي أن تفهم مشكلتك عقلانياً؛ بل يجب أن تختبر المشاعر المرتبطة بالصراع اللاشعوري وتعيشها لكي يحدث الشفاء الفعلي.
                </p>
              </div>

              <div className="bg-bg-surface p-5 rounded-2xl border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-primary text-sm">2. التحويل والتحويل المقابل</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  <strong>التحويل:</strong> إعادة تكرار المشاعر والصراعات الطفولية اللاشعورية نحو المعالج أو الشريك.<br />
                  <strong>التحويل المقابل:</strong> المشاعر التي تنشأ لدى الطرف الآخر كمرآة لفهم العالم الداخلي.
                </p>
              </div>

              <div className="bg-bg-surface p-5 rounded-2xl border border-border-subtle space-y-2">
                <h4 className="font-bold text-text-primary text-sm">3. التداعي الحر والتنفيس</h4>
                <p className="text-xs text-text-secondary leading-relaxed">
                  تدفق الأفكار والمشاعر بحرية تامة دون أي رقابة منطقية أو أخلاقية، مما يسمح للمواد اللاشعورية بالظهور والتفريغ.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 4: FOUR PRACTICAL EXERCISES */}
        {activeTab === 'exercises' && (
          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-2xl p-5 space-y-2">
              <h3 className="text-lg font-bold text-text-primary">
                رابعاً: تمارين عملية وتأملية ذاتية لتطوير الاستبصار
              </h3>
              <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                أربع أدوات تفاعلية لتطبيق المبادئ الديناميكية واكتشاف المخططات الذهنية وآليات الدفاع وتفكيك الصراعات.
              </p>
            </div>

            {/* EXERCISE 1: RELATIONSHIP BLUEPRINT MAP */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
                <h4 className="font-bold text-text-primary text-sm sm:text-base">
                  التمرين الأول: كشف المخطط الذهني للعلاقات (Relationship Blueprint Map)
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-secondary">1. صفات الوالدين والمعاملة بالطفولة:</label>
                  <textarea
                    rows={3}
                    value={blueprintParents}
                    onChange={e => setBlueprintParents(e.target.value)}
                    placeholder="مثال: والد متسلط، أم غير متفرغة..."
                    className="w-full p-2.5 bg-bg-surface-elevated border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-secondary">2. صفات الشركاء العاطفيين والتوقعات:</label>
                  <textarea
                    rows={3}
                    value={blueprintPartners}
                    onChange={e => setBlueprintPartners(e.target.value)}
                    placeholder="مثال: شركاء ينتقدون دائماً..."
                    className="w-full p-2.5 bg-bg-surface-elevated border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-text-primary">3. تحليل التشابه وتكرار الصراعات القديمة:</label>
                  <textarea
                    rows={3}
                    value={blueprintAnalysis}
                    onChange={e => setBlueprintAnalysis(e.target.value)}
                    placeholder="هل تعيد تكرار نفس الصراع القديم مع أمل إصلاح الماضي؟"
                    className="w-full p-2.5 bg-bg-surface-elevated border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <button
                onClick={saveBlueprint}
                className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
              >
                حفظ مخطط العلاقات الذهني
              </button>
            </div>

            {/* EXERCISE 2: DEFENSE STYLE LOG */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
                <h4 className="font-bold text-text-primary text-sm sm:text-base">
                  التمرين الثاني: مذكرات الملاحظة الذاتية لأسلوب الدفاع (Defense Style Log)
                </h4>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-bg-surface-elevated p-3.5 rounded-xl border border-border-subtle">
                  <input
                    type="text"
                    placeholder="موقف أثار القلق أو الغضب الشديد"
                    value={newDefense.situation}
                    onChange={e => setNewDefense({ ...newDefense, situation: e.target.value })}
                    className="p-2.5 bg-bg-surface rounded-xl border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="هل بررت عقلانياً للتملص؟ (عقلنة)"
                    value={newDefense.rationalization}
                    onChange={e => setNewDefense({ ...newDefense, rationalization: e.target.value })}
                    className="p-2.5 bg-bg-surface rounded-xl border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="هل بالغت في اللطف للتغطية؟ (تكوين عكسي)"
                    value={newDefense.reactionFormation}
                    onChange={e => setNewDefense({ ...newDefense, reactionFormation: e.target.value })}
                    className="p-2.5 bg-bg-surface rounded-xl border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <input
                    type="text"
                    placeholder="الخسائر الجسدية/النفسية بعيدة المدى"
                    value={newDefense.cost}
                    onChange={e => setNewDefense({ ...newDefense, cost: e.target.value })}
                    className="p-2.5 bg-bg-surface rounded-xl border border-border-medium text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <button
                  onClick={handleAddDefense}
                  className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                >
                  تسجيل دفاع لا شعوري جديد
                </button>

                <div className="space-y-2 pt-2">
                  {defenseLogs.map(item => (
                    <div key={item.id} className="bg-bg-surface-elevated border border-border-subtle p-3.5 rounded-xl text-xs space-y-1.5">
                      <div className="font-bold text-text-primary">الموقف: {item.situation}</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-text-secondary">
                        <div>العقلنة: {item.rationalization || 'لا يوجد'}</div>
                        <div>التكوين العكسي: {item.reactionFormation || 'لا يوجد'}</div>
                      </div>
                      <div className="text-text-muted font-bold text-[11px]">التكلفة والخسارة: {item.cost}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* EXERCISE 3: FREE ASSOCIATION STREAM */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
                <h4 className="font-bold text-text-primary text-sm sm:text-base">
                  التمرين الثالث: التداعي الحر المكتوب (Written Stream-of-Consciousness)
                </h4>
                <div className="flex items-center gap-1 text-text-primary font-bold text-xs dir-ltr">
                  <Clock size={16} />
                  <span>{Math.floor(freeAssocSeconds / 60)}:{(freeAssocSeconds % 60).toString().padStart(2, '0')}</span>
                </div>
              </div>

              <div className="bg-bg-surface-elevated p-3 rounded-xl text-xs text-text-secondary space-y-1 border border-border-subtle">
                <p className="font-bold text-text-primary">شروط التمرين:</p>
                <p>اكتب فوراً وبأقصى سرعة كل ما يرد في ذهنك حرفياً دون توقف أو تصحيح حتى يرن المؤقت (10 دقائق).</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {!isFreeAssocActive ? (
                    <button
                      onClick={() => setIsFreeAssocActive(true)}
                      className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold hover:bg-emerald-800 transition-all"
                    >
                      بدء مؤقت التداعي الحر (10 دقائق)
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsFreeAssocActive(false)}
                      className="px-4 py-2 bg-bg-surface-hover text-text-primary rounded-xl text-xs font-bold transition-all border border-border-subtle"
                    >
                      إيقاف مؤقت
                    </button>
                  )}
                  <button
                    onClick={() => { setIsFreeAssocActive(false); setFreeAssocSeconds(600); }}
                    className="px-3 py-2 bg-bg-surface-elevated text-text-muted rounded-xl text-xs font-bold hover:bg-bg-surface-hover transition-all border border-border-subtle"
                  >
                    إعادة ضبط
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={freeText}
                  onChange={e => setFreeText(e.target.value)}
                  placeholder="تدفق الأفكار اللاشعورية بحرية بدون رقابة..."
                  className="w-full p-3 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />

                <textarea
                  rows={2}
                  value={freeReflections}
                  onChange={e => setFreeReflections(e.target.value)}
                  placeholder="ملاحظة الأنماط أو المشاعر المتكررة أو الذكريات المفاجئة التي ظهرت..."
                  className="w-full p-3 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>

            {/* EXERCISE 4: CONFLICT TO INSIGHT */}
            <div className="bg-bg-surface rounded-2xl border border-border-subtle p-5 space-y-4">
              <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
                <h4 className="font-bold text-text-primary text-sm sm:text-base">
                  التمرين الرابع: تحويل الصراع إلى استبصار انفعالي (From Conflict to Insight)
                </h4>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-text-secondary mb-1">السلوك المتكرر الذي يسبب المعانة وتريد تغييره:</label>
                  <input
                    type="text"
                    value={conflictBehavior}
                    onChange={e => setConflictBehavior(e.target.value)}
                    className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-text-secondary">1. المستوى العقلي (الوعي):</label>
                    <textarea
                      rows={2}
                      value={consciousLevel}
                      onChange={e => setConsciousLevel(e.target.value)}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-text-secondary">2. مستوى الخوف اللاشعوري:</label>
                    <textarea
                      rows={2}
                      value={unconsciousFear}
                      onChange={e => setUnconsciousFear(e.target.value)}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-text-secondary">3. مستوى الرغبة اللاشعورية:</label>
                    <textarea
                      rows={2}
                      value={unconsciousDesire}
                      onChange={e => setUnconsciousDesire(e.target.value)}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-text-primary">4. صيغة الاستبصار النهائي المستقل:</label>
                    <textarea
                      rows={2}
                      value={insightStatement}
                      onChange={e => setInsightStatement(e.target.value)}
                      className="w-full p-2.5 bg-bg-surface border border-border-medium rounded-xl text-xs text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                    />
                  </div>
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
