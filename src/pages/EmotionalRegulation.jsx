// src/pages/EmotionalRegulation.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Sparkles, 
  Zap, 
  Heart, 
  Target, 
  Shield, 
  BookOpen, 
  Wind, 
  Pencil, 
  LibraryBig, 
  ChevronLeft,
  Info,
  CheckCircle2,
  SlidersHorizontal,
  Flame
} from 'lucide-react';

export default function EmotionalRegulation() {
  const nav = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'جميع المهارات' },
    { id: 'cbt', label: 'المعرفي والسلوكي (CBT)' },
    { id: 'somatic', label: 'الجسدي والفسيولوجي (Somatic)' },
    { id: 'acceptance', label: 'التقبل والتحليل (ACT & Psychodynamic)' },
    { id: 'practical', label: 'أدوات وتمارين تفاعلية' },
  ];

  const allSkills = [
    {
      id: 'cbt-reappraisal',
      category: 'cbt',
      title: 'إعادة التقييم المعرفي (Cognitive Reappraisal)',
      subtitle: 'تعديل الأفكار التلقائية وإعادة صياغة المواقف',
      desc: 'استراتيجية سريرية مثبتة لإعادة تقييم المواقف الضاغطة وتقليل حدة المشاعر السلبية عبر تغيير تفسيرك للأحداث.',
      badge: 'CBT | مهارة معرفية',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: BookOpen,
      iconBg: 'bg-emerald-100 text-emerald-700',
      path: '/CognitiveReappraisal'
    },
    {
      id: 'dbt-tipp',
      category: 'cbt',
      title: 'مهارات DBT وتقنيات TIPP للتهدئة السريعة',
      subtitle: 'التعامل مع الضائقة الشديدة والتأريض الفوري',
      desc: 'بروتوكول العلاج السلوكي الجدلي للتحكم في الغضب والذعر عبر التغيرات الفسيولوجية المباشرة (الماء البارد، التمارين، التنفس الموجه).',
      badge: 'DBT | طوارئ المشاعر',
      badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
      icon: Zap,
      iconBg: 'bg-blue-100 text-blue-700',
      path: '/DBTTipp'
    },
    {
      id: 'act-skills',
      category: 'acceptance',
      title: 'العلاج بالتقبل والالتزام (ACT Skills)',
      subtitle: 'الافتراق المعرفي وتقبل المشاعر دون صراع',
      desc: 'تعلم كيفية السماح للمشاعر بالمرور دون مقاومة، وفك الاندماج مع الأفكار المزعجة، والتحرك نحو قيمك الحقيقية.',
      badge: 'ACT | مرونة نفسية',
      badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
      icon: Heart,
      iconBg: 'bg-purple-100 text-purple-700',
      path: '/ACTSkills'
    },
    {
      id: 'psychodynamic',
      category: 'acceptance',
      title: 'التحليل النفسي وآليات الدفاع (Psychodynamic)',
      subtitle: 'فهم الجذور الدفينة والاستجابات اللاواعية',
      desc: 'استكشاف آليات الدفاع النفسي، وفهم الأنماط العاطفية المتكررة من الماضي للوصول لنضج عاطفي واستبصار أعمق.',
      badge: 'تحليلي | استبصار',
      badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
      icon: Target,
      iconBg: 'bg-amber-100 text-amber-700',
      path: '/PsychodynamicSkills'
    },
    {
      id: 'somatic',
      category: 'somatic',
      title: 'مهارات وتنظيم الجهاز العصبي والحسي (Somatic Skills)',
      subtitle: 'التهدئة الجسدية، التأريض الحسي 5-4-3-2-1 وتوقيع العصب الحائر',
      desc: 'البروتوكولات السريرية لتهدئة الاستجابات الانفعالية الفسيولوجية والتنظيم الذاتي عبر حواسك الجسدية.',
      badge: 'Somatic | تنظيم عصبي',
      badgeBg: 'bg-teal-100 text-teal-800 border-teal-300',
      icon: Shield,
      iconBg: 'bg-teal-100 text-teal-700',
      path: '/modules/how-will-we-fix-it/somatic-nervous-system-skills'
    },
    {
      id: 'practical-cbt',
      category: 'practical',
      title: 'الدليل العملي لـ 19 مهارة علاجية وتطبيقية',
      subtitle: 'استراتيجيات تنفيذية للتعامل مع المثيرات اليومية',
      desc: 'دليل شامل يجمع المهارات التطبيقية للأفكار والسلوكيات لمواجهة مواقف الضغط والتوتر.',
      badge: 'تطبيقي | 19 مهارة',
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: BookOpen,
      iconBg: 'bg-emerald-100 text-emerald-700',
      path: '/modules/how-will-we-fix-it/practical-therapeutic-skills'
    },
    {
      id: 'breathing',
      category: 'practical',
      title: 'تمرين تنفس 4-7-8 التفاعلي',
      subtitle: 'أداة بالتايمر الحركي المباشر لتهدئة القلق',
      desc: 'تمرين تنفس موجه بالتايمر يحفز الجهاز العصبي اللاحسامي ويهدئ نبضات القلب في ثوانٍ.',
      badge: 'تفاعلي | تنفس',
      badgeBg: 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300',
      icon: Wind,
      iconBg: 'bg-fuchsia-100 text-fuchsia-700',
      path: '/Breathing478'
    },
    {
      id: 'journaling',
      category: 'practical',
      title: 'مفكرة وتتبع المشاعر والمحفزات اليومية',
      subtitle: 'سجل كتابي لترسيم المحفزات والاستجابات الجسدية',
      desc: 'تمرين موجه لتتبع محفزات المشاعر وشدتها والتكيف المستخدم لاستخراج أنماط الاستجابة.',
      badge: 'تتبع | مفكرة',
      badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
      icon: Pencil,
      iconBg: 'bg-rose-100 text-rose-700',
      path: '/JournalingExercise'
    },
    {
      id: 'dictionary',
      category: 'practical',
      title: 'قاموس المشاعر ورابط (فكرة - شعور - سلوك)',
      subtitle: 'تحديد المسميات الدقيقة للمشاعر ورابط CBT',
      desc: 'استكشاف موسع لقاموس الشعور البشري وفهم كيف تتولد المشاعر وتؤثر على سلوكياتنا.',
      badge: 'تشخيص | قاموس',
      badgeBg: 'bg-bg-surface-hover text-text-primary border-slate-300',
      icon: LibraryBig,
      iconBg: 'bg-bg-surface-hover text-text-secondary',
      path: '/EmotionSelect'
    }
  ];

  const filteredSkills = useMemo(() => {
    if (activeCategory === 'all') return allSkills;
    return allSkills.filter(skill => skill.category === activeCategory);
  }, [activeCategory]);

  return (
    <div 
      dir="rtl" 
      className="relative flex min-h-screen flex-col justify-between bg-bg-app text-text-primary overflow-x-hidden" 
      style={{ fontFamily: 'Lexend, Noto Sans, sans-serif, system-ui' }}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between p-4 bg-bg-app/90 backdrop-blur-md border-b border-border-subtle">
        <button 
          onClick={() => nav(-1)} 
          className="flex size-10 items-center justify-center rounded-xl bg-bg-surface border border-border-subtle text-text-primary shadow-2xs hover:bg-bg-surface-hover active:scale-95 transition-all"
          aria-label="الرجوع"
        >
          <ArrowRight size={20} />
        </button>
        <h2 className="flex-1 text-center pr-2 text-lg font-bold text-text-primary">
          تنظيم المشاعر والمهارات النفسية
        </h2>
        <div className="w-10" />
      </header>

      {/* Hero Section */}
      <section className="px-4 pt-3 pb-2">
        <div 
          className="relative w-full min-h-[200px] rounded-2xl bg-cover bg-center overflow-hidden shadow-sm border border-border-subtle flex items-end p-5"
          style={{ backgroundImage: 'url(/Common-Thinking-Errors.jpeg)' }}
        >
          <div className="absolute inset-0 bg-black/40" />
          <div className="relative z-10 space-y-1 text-white max-w-2xl">
         
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
              مجموعة شاملة من الأدوات والتمارين المعتمدة علمياً (CBT, DBT, ACT, Somatic) لمساعدتك على تنظيم مشاعرك وتنمية المرونة النفسية.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 px-4 py-4 space-y-6 max-w-4xl mx-auto w-full">
        
        {/* Category Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-1.5 text-text-muted shrink-0 pl-1 text-xs font-bold">
            <SlidersHorizontal size={15} />
            <span>التصنيف:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
                activeCategory === cat.id
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs scale-100'
                  : 'bg-bg-surface text-text-secondary border-border-subtle hover:bg-bg-surface-hover'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between text-xs font-semibold text-text-muted px-1">
            <span>عرض {filteredSkills.length} من أصل {allSkills.length} مهارات</span>
            {activeCategory !== 'all' && (
              <button 
                onClick={() => setActiveCategory('all')} 
                className="text-emerald-700 hover:underline font-bold"
              >
                إظهار الكل
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3.5">
            {filteredSkills.map((skill) => {
              const IconComp = skill.icon;
              return (
                <div
                  key={skill.id}
                  onClick={() => nav(skill.path)}
                  className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-bg-surface border border-border-subtle shadow-2xs hover:shadow-md hover:border-emerald-300/80 hover:-translate-y-0.5 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 flex-1">
                    <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 ${skill.iconBg} shadow-2xs group-hover:scale-105 transition-transform`}>
                      <IconComp size={24} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-text-primary group-hover:text-emerald-700 transition-colors">
                          {skill.title}
                        </h3>
                        <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${skill.badgeBg}`}>
                          {skill.badge}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm font-semibold text-[#3d7a61]">
                        {skill.subtitle}
                      </p>
                      <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                        {skill.desc}
                      </p>
                    </div>
                  </div>

                  <div className="self-end sm:self-center shrink-0 pt-2 sm:pt-0">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-bg-surface-elevated text-text-primary text-xs font-bold group-hover:bg-emerald-600 group-hover:text-white transition-all">
                      <span>فتح المهارة</span>
                      <ChevronLeft size={16} className="rotate-0 group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Continuous Update Banner */}
        <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/80 flex items-start gap-3 text-emerald-950 text-xs sm:text-sm shadow-2xs">
          <Info size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold">تحديث وإثراء مستمر:</p>
            <p className="text-emerald-900/80 leading-relaxed">
              هذه الصفحة يتم تحديثها وإثراؤها باستمرار بأحدث الأدوات التفاعلية، بروتوكولات التهدئة، والتمارين العلاجية المعتمدة سريرياً.
            </p>
          </div>
        </div>

      </main>

      <div className="h-10" />
    </div>
  );
}
