// src/pages/CognitiveReappraisal.jsx

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  RefreshCcw,
  Eye,
  MessageSquareQuote,
  Save,
  History,
  Info,
  Brain,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  ArrowLeftRight,
  CircleHelp,
  BookOpen,
  Loader2,
} from 'lucide-react';

import { updateProgress } from '../utils/progress';
import { supabase } from '@/supabaseClient';
import { saveTextToDB } from '@/lib/db';

const COMMON_THOUGHTS = [
  'أنا فاشل في كل شيء',
  'لا أحد يحبني أو يهتم بي',
  'أنا لا أستحق النجاح',
  'كل شيء ضدي',
  'لن أتحسن أبدًا',
  'أنا شخص غير محظوظ',
  'أخطائي تثبت أنني غير كفء',
];

const TABS = [
  {
    id: 'intro',
    label: 'الفكرة',
    icon: Info,
  },
  {
    id: 'exercise',
    label: 'التمرين',
    icon: RefreshCcw,
  },
  {
    id: 'history',
    label: 'السجل',
    icon: History,
  },
];

const EXAMPLES = [
  {
    thought: 'أنا فشلت في المقابلة، يبقى عمري ما هشتغل.',
    reframe:
      'المقابلة كانت تجربة أتعلم منها، ويمكنني الاستعداد بشكل أفضل للمرة القادمة.',
  },
  {
    thought: 'أخطائي تثبت أنني فاشل.',
    reframe:
      'الأخطاء جزء طبيعي من التعلم، والمهم هو ما أتعلمه منها وما أفعله بعدها.',
  },
  {
    thought: 'لا أحد يحبني أو يهتم بي.',
    reframe:
      'قد أشعر بالوحدة الآن، لكن هذا لا يعني أنني غير محبوب أو أن لا أحد يهتم بي.',
  },
  {
    thought: 'كل شيء في حياتي يسير بشكل خاطئ.',
    reframe:
      'هناك أشياء صعبة الآن، لكن هذا لا يعني أن كل جوانب حياتي سيئة.',
  },
];

function SectionTitle({ icon: Icon, eyebrow, title, description }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
        <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10">
          <Icon size={17} />
        </div>

        <span className="text-xs font-bold">{eyebrow}</span>
      </div>

      <h2 className="mt-3 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
        {title}
      </h2>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-text-muted">
          {description}
        </p>
      )}
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div className="flex items-start gap-3.5">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-xs font-bold text-emerald-600 dark:text-emerald-400">
        {number}
      </div>

      <div className="min-w-0 pt-0.5">
        <h4 className="text-sm font-bold text-text-primary">
          {title}
        </h4>

        <p className="mt-1 text-xs leading-6 text-text-secondary sm:text-sm">
          {children}
        </p>
      </div>
    </div>
  );
}

export default function CognitiveReappraisal() {
  const nav = useNavigate();

  const [thought, setThought] = useState('');
  const [reframe, setReframe] = useState('');
  const [logs, setLogs] = useState([]);
  const [activeSection, setActiveSection] = useState('intro');

  const [expandedExamples, setExpandedExamples] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const username = localStorage.getItem('username');

      if (!username) {
        setLoadingLogs(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('reappraisal_logs')
          .select('*')
          .eq('user_id', username)
          .order('ts', { ascending: false });

        if (error) {
          console.error('Error loading logs:', error);
          return;
        }

        setLogs(data || []);
      } catch (error) {
        console.error('Error loading logs:', error);
      } finally {
        setLoadingLogs(false);
      }
    };

    fetchLogs();
  }, []);

  const handleSave = async () => {
    const cleanThought = thought.trim();
    const cleanReframe = reframe.trim();

    if (!cleanThought || !cleanReframe || saving) {
      return;
    }

    setSaving(true);

    try {
      const newEntry = await saveTextToDB('reappraisal_logs', {
        thought: cleanThought,
        reframe: cleanReframe,
      });

      setLogs((current) => [newEntry, ...current]);

      setThought('');
      setReframe('');

      updateProgress({
        entries: 1,
        timeline: {
          label: 'تم تسجيل إعادة تقييم معرفي جديدة',
        },
      });

      setActiveSection('history');
    } catch (error) {
      console.error('Error saving entry:', error);
      alert('حدثت مشكلة أثناء حفظ التقييم. حاول مرة أخرى.');
    } finally {
      setSaving(false);
    }
  };

  const selectCommonThought = (value) => {
    setThought(value);

    requestAnimationFrame(() => {
      document
        .getElementById('reframe-editor')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
    });
  };

  return (
    <div
      className="min-h-screen bg-bg-app text-text-primary"
      dir="rtl"
      style={{
        fontFamily: 'Lexend, Noto Sans, sans-serif',
      }}
    >
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-app/90 px-4 py-3 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => nav(-1)}
              aria-label="رجوع"
              className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border-subtle bg-bg-surface text-text-primary transition hover:bg-bg-surface-hover active:scale-95"
            >
              <ArrowLeft
                size={19}
                className="rtl:rotate-180"
              />
            </button>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-base font-bold text-text-primary sm:text-lg">
                إعادة التقييم المعرفي
              </h1>

              <p className="mt-0.5 text-[11px] text-text-muted sm:text-xs">
                غيّر زاوية النظر، وليس حقيقة ما تشعر به.
              </p>
            </div>

            <div className="hidden size-10 shrink-0 sm:block" />
          </div>
        </header>

        {/* Main */}
        <main className="flex-1 px-4 pb-12 pt-5 sm:px-6 sm:pt-7">
          {/* Page Intro */}
          <section className="relative overflow-hidden rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-7">
            <div className="pointer-events-none absolute -left-16 -top-16 size-40 rounded-full bg-emerald-500/5 blur-3xl" />

            <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Brain size={27} />
              </div>

              <div className="min-w-0 flex-1">
                <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  أداة للتفكير المتوازن
                </span>

                <h2 className="mt-1.5 text-xl font-bold tracking-tight text-text-primary sm:text-2xl">
                  ليست كل فكرة حقيقة.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                  الهدف ليس إجبار نفسك على التفكير بإيجابية، بل التوقف
                  للحظة وفحص الفكرة والبحث عن تفسير أكثر واقعية وتوازنًا.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveSection('exercise')}
                className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                ابدأ التمرين
                <RefreshCcw size={15} />
              </button>
            </div>
          </section>

          {/* Navigation */}
          <nav className="mt-5 rounded-2xl border border-border-subtle bg-bg-surface p-1.5 shadow-sm">
            <div className="grid grid-cols-3 gap-1">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const active = activeSection === tab.id;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSection(tab.id)}
                    className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-bold transition sm:gap-2 sm:text-sm ${
                      active
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-text-muted hover:bg-bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <Icon size={15} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* INTRO */}
          {activeSection === 'intro' && (
            <div className="mt-6 space-y-5">
              {/* What */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <SectionTitle
                  icon={Brain}
                  eyebrow="فهم الفكرة"
                  title="ما هي إعادة التقييم المعرفي؟"
                  description="طريقة تساعدك على فحص تفسيرك للموقف بدلًا من التعامل مع أول فكرة تظهر في ذهنك كأنها حقيقة نهائية."
                />

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      title: 'لاحظ',
                      text: 'التقط الفكرة التي ظهرت تلقائيًا.',
                    },
                    {
                      title: 'افحص',
                      text: 'اسأل عن الأدلة والتفسيرات الأخرى.',
                    },
                    {
                      title: 'أعد التقييم',
                      text: 'اكتب تفسيرًا أكثر توازنًا.',
                    },
                  ].map((item, index) => (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border-subtle bg-bg-surface-elevated p-4"
                    >
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        0{index + 1}
                      </span>

                      <h3 className="mt-2 text-sm font-bold text-text-primary">
                        {item.title}
                      </h3>

                      <p className="mt-1 text-xs leading-5 text-text-muted">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Why */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <SectionTitle
                  icon={Lightbulb}
                  eyebrow="لماذا نستخدمها؟"
                  title="الفائدة ليست أن تفكر بإيجابية دائمًا"
                  description="الفكرة هي الوصول إلى قراءة أكثر دقة ومرونة للموقف."
                />

                <div className="grid gap-2.5 sm:grid-cols-2">
                  {[
                    'كسر التفكير السلبي المتكرر.',
                    'التعامل مع الضغوط بطريقة أكثر مرونة.',
                    'ملاحظة أنماط التفكير التلقائية.',
                    'بناء نظرة أكثر واقعية للمواقف.',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl bg-bg-surface-elevated px-4 py-3"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                        <Check size={15} />
                      </span>

                      <span className="text-xs font-medium leading-5 text-text-secondary sm:text-sm">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Examples */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <SectionTitle
                    icon={MessageSquareQuote}
                    eyebrow="أمثلة"
                    title="كيف يتغير التفسير؟"
                    description="لاحظ الفرق بين الفكرة المطلقة والتفسير الأكثر توازنًا."
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setExpandedExamples((value) => !value)
                    }
                    className="mt-1 flex shrink-0 items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-bold text-emerald-600 transition hover:bg-emerald-500/10 dark:text-emerald-400"
                  >
                    {expandedExamples ? 'أقل' : 'المزيد'}
                    {expandedExamples ? (
                      <ChevronUp size={15} />
                    ) : (
                      <ChevronDown size={15} />
                    )}
                  </button>
                </div>

                <div className="space-y-3">
                  {(expandedExamples
                    ? EXAMPLES
                    : EXAMPLES.slice(0, 2)
                  ).map((example) => (
                    <div
                      key={example.thought}
                      className="overflow-hidden rounded-2xl border border-border-subtle"
                    >
                      <div className="border-b border-border-subtle bg-bg-surface-elevated p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="size-2 rounded-full bg-red-400" />
                          <span className="text-[11px] font-bold text-text-muted">
                            الفكرة التلقائية
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-text-secondary">
                          {example.thought}
                        </p>
                      </div>

                      <div className="bg-emerald-500/5 p-4">
                        <div className="mb-2 flex items-center gap-2">
                          <span className="size-2 rounded-full bg-emerald-500" />
                          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                            إعادة التقييم
                          </span>
                        </div>

                        <p className="text-sm leading-6 text-text-secondary">
                          {example.reframe}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Steps */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <SectionTitle
                  icon={BookOpen}
                  eyebrow="الطريقة"
                  title="خمس خطوات بسيطة"
                />

                <div className="space-y-5">
                  <Step number="1" title="لاحظ الفكرة">
                    ما الفكرة التي ظهرت تلقائيًا في ذهنك؟
                  </Step>

                  <Step number="2" title="افحصها">
                    ما الأدلة التي تدعمها؟ وما الأدلة التي لا تتفق معها؟
                  </Step>

                  <Step number="3" title="ابحث عن بديل">
                    هل يوجد تفسير آخر للموقف لا يكون متطرفًا أو مطلقًا؟
                  </Step>

                  <Step number="4" title="أعد صياغتها">
                    اكتب فكرة جديدة تكون واقعية ولطيفة مع نفسك.
                  </Step>

                  <Step number="5" title="تدرّب">
                    كلما لاحظت هذه الأنماط مبكرًا، أصبح التعامل معها أسهل.
                  </Step>
                </div>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <Sparkles
                    size={18}
                    className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                  />

                  <p className="text-xs leading-6 text-text-secondary">
                    لا تحاول تحويل الفكرة إلى شيء إيجابي بشكل مصطنع.
                    ابحث عن صياغة <strong>أكثر دقة وتوازنًا</strong>.
                  </p>
                </div>
              </section>
            </div>
          )}

          {/* EXERCISE */}
          {activeSection === 'exercise' && (
            <div className="mt-6 space-y-5">
              {/* Exercise Header */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <div className="flex items-start gap-3.5">
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <RefreshCcw size={21} />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      تمرين قصير
                    </span>

                    <h2 className="mt-1 text-lg font-bold text-text-primary">
                      لنفحص الفكرة معًا
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-text-muted">
                      اكتب ما يدور في ذهنك كما هو، بدون محاولة تجميله.
                    </p>
                  </div>
                </div>
              </section>

              {/* Thought */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-red-500/10 text-red-500">
                    <Eye size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      01 — الفكرة التلقائية
                    </h3>

                    <p className="text-[11px] text-text-muted">
                      ما الفكرة التي تدور في ذهنك الآن؟
                    </p>
                  </div>
                </div>

                <textarea
                  value={thought}
                  onChange={(event) =>
                    setThought(event.target.value)
                  }
                  placeholder="مثال: أنا فاشل... محدش بيحبني... الموضوع عمره ما هيتحسن..."
                  className="mt-4 min-h-[140px] w-full resize-none rounded-2xl border border-border-medium bg-bg-app p-4 text-sm leading-7 text-text-primary outline-none transition placeholder:text-text-muted focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-bold text-text-muted">
                    أو اختر مثالًا قريبًا:
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {COMMON_THOUGHTS.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => selectCommonThought(item)}
                        className="rounded-xl border border-border-subtle bg-bg-surface-elevated px-3 py-2 text-[11px] font-medium text-text-secondary transition hover:border-emerald-500/30 hover:bg-emerald-500/5 hover:text-emerald-600 dark:hover:text-emerald-400"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Reframe */}
              <section
                id="reframe-editor"
                className="rounded-3xl border border-emerald-500/20 bg-bg-surface p-5 shadow-sm sm:p-6"
              >
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <ArrowLeftRight size={16} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-text-primary">
                      02 — أعد التقييم
                    </h3>

                    <p className="text-[11px] text-text-muted">
                      ابحث عن تفسير أكثر واقعية وتوازنًا.
                    </p>
                  </div>
                </div>

                <textarea
                  value={reframe}
                  onChange={(event) =>
                    setReframe(event.target.value)
                  }
                  placeholder="مثال: ممكن أكون بمر بفترة صعبة، لكن ده مش معناه إني فاشل..."
                  className="mt-4 min-h-[160px] w-full resize-none rounded-2xl border border-border-medium bg-bg-app p-4 text-sm leading-7 text-text-primary outline-none transition placeholder:text-text-muted focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                />

                <div className="mt-4 rounded-2xl bg-bg-surface-elevated p-4">
                  <div className="flex items-center gap-2 text-text-primary">
                    <CircleHelp size={15} />
                    <span className="text-xs font-bold">
                      اسأل نفسك
                    </span>
                  </div>

                  <ul className="mt-3 grid gap-2 text-[11px] leading-5 text-text-muted sm:grid-cols-2">
                    <li>• هل هناك تفسير آخر؟</li>
                    <li>• ما الدليل الذي أملكه فعلًا؟</li>
                    <li>• هل أستخدم كلمات مثل "دائمًا" أو "أبدًا"؟</li>
                    <li>• ماذا سأقول لصديق في نفس الموقف؟</li>
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    !thought.trim() ||
                    !reframe.trim() ||
                    saving
                  }
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />
                      جارٍ الحفظ...
                    </>
                  ) : (
                    <>
                      <Save size={17} />
                      احفظ إعادة التقييم
                    </>
                  )}
                </button>
              </section>

              {/* Quick principles */}
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-2">
                  <Lightbulb
                    size={18}
                    className="text-emerald-600 dark:text-emerald-400"
                  />

                  <h3 className="text-sm font-bold text-text-primary">
                    تذكّر أثناء الكتابة
                  </h3>
                </div>

                <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {[
                    'تجنب الكلمات المطلقة: دائمًا، أبدًا، كل شيء.',
                    'اعترف بالمشاعر بدلًا من إنكارها.',
                    'ابحث عما يمكنك التحكم فيه الآن.',
                    'ضع الموقف في سياقه بدلًا من تعميمه.',
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 rounded-xl bg-bg-surface-elevated p-3"
                    >
                      <Check
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400"
                      />

                      <span className="text-[11px] leading-5 text-text-muted">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* HISTORY */}
          {activeSection === 'history' && (
            <div className="mt-6 space-y-5">
              <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <SectionTitle
                    icon={History}
                    eyebrow="متابعتك"
                    title="سجل إعادة التقييم"
                    description="راجع كيف تعاملت مع أفكارك في المرات السابقة."
                  />

                  {logs.length > 0 && (
                    <span className="shrink-0 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {logs.length} سجل
                    </span>
                  )}
                </div>

                {loadingLogs ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2
                      size={22}
                      className="animate-spin text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                ) : logs.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border-medium bg-bg-surface-elevated px-5 py-10 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <History size={22} />
                    </div>

                    <h3 className="mt-4 text-sm font-bold text-text-primary">
                      لا توجد تقييمات بعد
                    </h3>

                    <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-text-muted">
                      أول إعادة تقييم تحفظها هنا ستظهر في هذا السجل.
                    </p>

                    <button
                      type="button"
                      onClick={() => setActiveSection('exercise')}
                      className="mt-5 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-emerald-700"
                    >
                      ابدأ أول تمرين
                    </button>
                  </div>
                ) : (
                  <div className="relative space-y-3">
                    {logs.map((log, index) => (
                      <article
                        key={log.id || log.ts || index}
                        className="relative overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface-elevated"
                      >
                        <div className="border-b border-border-subtle px-4 py-3">
                          <div className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-2 text-[11px] font-bold text-text-muted">
                              <span className="size-2 rounded-full bg-emerald-500" />
                              إعادة تقييم #{logs.length - index}
                            </span>

                            <span className="text-[10px] text-text-muted">
                              {log.ts
                                ? new Date(
                                    log.ts
                                  ).toLocaleDateString('ar-EG')
                                : '—'}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 p-4">
                          <div>
                            <span className="text-[10px] font-bold text-red-500">
                              الفكرة الأصلية
                            </span>

                            <p className="mt-1 text-xs leading-6 text-text-secondary sm:text-sm">
                              {log.thought}
                            </p>
                          </div>

                          <div className="h-px bg-border-subtle" />

                          <div>
                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                              إعادة التقييم
                            </span>

                            <p className="mt-1 text-xs leading-6 text-text-secondary sm:text-sm">
                              {log.reframe}
                            </p>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {logs.length > 0 && (
                <section className="rounded-3xl border border-border-subtle bg-bg-surface p-5 shadow-sm sm:p-6">
                  <div className="flex items-center gap-2">
                    <Sparkles
                      size={18}
                      className="text-emerald-600 dark:text-emerald-400"
                    />

                    <h3 className="text-sm font-bold text-text-primary">
                      ماذا يمكنك ملاحظته مع الوقت؟
                    </h3>
                  </div>

                  <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
                    {[
                      'أنماط التفكير التي تتكرر لديك.',
                      'المواقف التي تستدعي أفكارًا تلقائية.',
                      'الطرق التي أصبحت تستخدمها لإعادة التقييم.',
                      'التغير في طريقة تعاملك مع نفس النوع من المواقف.',
                    ].map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl bg-bg-surface-elevated p-3 text-[11px] leading-5 text-text-muted"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              <button
                type="button"
                onClick={() => setActiveSection('exercise')}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3.5 text-sm font-bold text-white transition hover:bg-emerald-700 active:scale-[0.98]"
              >
                <RefreshCcw size={17} />
                تسجيل إعادة تقييم جديدة
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}