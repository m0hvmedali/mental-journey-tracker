import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  HelpCircle, 
  Scale, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const COMMON_DISTORTIONS = [
  { key: 'allOrNothing', label: 'التفكير بالأبيض والأسود', desc: 'إما نجاح تام أو فشل ذريع' },
  { key: 'catastrophizing', label: 'التفكير الكارثي', desc: 'توقع أسوأ سيناريو ممكن' },
  { key: 'mindReading', label: 'قراءة الأفكار', desc: 'افتراض معرفة ما يفكر به الآخرون' },
  { key: 'emotionalReasoning', label: 'الاستدلال العاطفي', desc: 'أشعر بالخوف إذن أنا في خطر حقيقي' },
  { key: 'shouldStatements', label: 'عبارات الإلزام (يجب/ينبغي)', desc: 'مطالب صارمة وغير واقعية للنفس' },
  { key: 'mentalFilter', label: 'التصفية الذهنية', desc: 'التركيز على السلبي فقط وإغفال الإيجابي' }
];

export default function ThoughtRecordWizard({ 
  initialDistortion = 'allOrNothing', 
  mode = 'guided',
  onComplete 
}) {
  const [step, setStep] = useState(1);
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [selectedDistortion, setSelectedDistortion] = useState(initialDistortion);
  const [evidenceFor, setEvidenceFor] = useState('');
  const [evidenceAgainst, setEvidenceAgainst] = useState('');
  const [balancedThought, setBalancedThought] = useState('');
  const [distressBefore, setDistressBefore] = useState(8);
  const [distressAfter, setDistressAfter] = useState(4);

  const handleReset = () => {
    setStep(1);
    setSituation('');
    setAutomaticThought('');
    setEvidenceFor('');
    setEvidenceAgainst('');
    setBalancedThought('');
    setDistressBefore(8);
    setDistressAfter(4);
  };

  return (
    <div className="w-full my-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden text-right font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600/10 via-emerald-600/5 to-transparent p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-600/20 text-teal-700 dark:text-teal-400 flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-display">
              تمرين سجل الأفكار المعرفي (CBT Thought Record)
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              خطوة بخطوة لاختبار الفكرة التلقائية وبناء منظور متوازن ومرن
            </p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
          <span>الخطوة {step} من 4</span>
        </div>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  1. ما الموقف الذي أثار هذا الشعور؟
                </label>
                <input
                  type="text"
                  placeholder="مثال: لم يرد زميلي على رسالتي في العمل اليوم..."
                  value={situation}
                  onChange={(e) => setSituation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  2. ما الفكرة التلقائية التي قفزت لذهنك مباشرة؟
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: هو يتجاهلني عمداً ولا يحترمني، وسيفشل المشروع..."
                  value={automaticThought}
                  onChange={(e) => setAutomaticThought(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    شدة الضيق النفسي حالياً:
                  </label>
                  <span className="text-sm font-bold text-teal-600 dark:text-teal-400">
                    {distressBefore} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={distressBefore}
                  onChange={(e) => setDistressBefore(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                ما نوع التشوه المعرفي الأقرب لهذه الفكرة؟
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {COMMON_DISTORTIONS.map((d) => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setSelectedDistortion(d.key)}
                    className={`p-3 text-right rounded-xl border text-sm transition-all ${
                      selectedDistortion === d.key
                        ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/30 text-teal-900 dark:text-teal-200 ring-2 ring-teal-500/20'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <div className="font-semibold">{d.label}</div>
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{d.desc}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2">
                <HelpCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  تذكر: الأدلة يجب أن تكون حقائق ملموسة وواقعية، وليست مجرد أحاسيس أو استنتاجات لا دليل عليها.
                </span>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  ما الأدلة الواقعية المؤيدة لصحة الفكرة؟
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: لم يرد منذ 3 ساعات..."
                  value={evidenceFor}
                  onChange={(e) => setEvidenceFor(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  ما الأدلة الموضوعية المعارضة للفكرة (تفسيرات بديلة)؟
                </label>
                <textarea
                  rows={2}
                  placeholder="مثال: هو في اجتماع طارئ، دائماً ما يتعاون معي، لا توجد خلافات سابقة بيننا..."
                  value={evidenceAgainst}
                  onChange={(e) => setEvidenceAgainst(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-800/50 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              key="step4"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1.5">
                  الفكرة البديلة المتوازنة والواقعية:
                </label>
                <textarea
                  rows={3}
                  placeholder="مثال: تأخره في الرد لا يعني تجاهله لي؛ من المرجح أنه مشغول، سأركز على عملي الآن وأتواصل معه لاحقاً بهدوء."
                  value={balancedThought}
                  onChange={(e) => setBalancedThought(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-emerald-500/50 bg-emerald-50/30 dark:bg-emerald-950/20 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                    شدة الضيق النفسي بعد إعادة التفكير:
                  </label>
                  <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {distressAfter} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={distressAfter}
                  onChange={(e) => setDistressAfter(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
              </div>

              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span className="text-xs font-semibold text-emerald-900 dark:text-emerald-200">
                    انخفاض مؤشر الضيق بمقدار: {Math.max(0, distressBefore - distressAfter)} درجات
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="text-xs gap-1.5 h-8"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  تمرين جديد
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation buttons */}
        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          {step > 1 ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep(step - 1)}
              className="gap-2 text-xs"
            >
              <ArrowRight className="w-4 h-4" />
              السابق
            </Button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <Button
              size="sm"
              onClick={() => setStep(step + 1)}
              className="bg-teal-600 hover:bg-teal-700 text-white gap-2 text-xs"
            >
              التالي
              <ArrowLeft className="w-4 h-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                if (onComplete) onComplete({ situation, automaticThought, balancedThought, distressBefore, distressAfter });
              }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2 text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              اعتماد الفكرة المتوازنة
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
