import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    scenario: '"لو لم أحصل على التقييم الممتاز في مشروع اليوم، فكل جهودي وتاريخي في الشركة لا قيمة له."',
    options: [
      { key: 'allOrNothing', label: 'التفكير بالأبيض والأسود', correct: true },
      { key: 'mindReading', label: 'قراءة الأفكار', correct: false },
      { key: 'emotionalReasoning', label: 'الاستدلال العاطفي', correct: false }
    ],
    explanation: 'الموقف يمثل تفكيراً قطبياً متطرفاً (يا كامل يا فاشل) دون أي اعتراف بالنجاح الجزئي أو التدرج.'
  },
  {
    id: 2,
    scenario: '"أشعر بانقباض شديد في صدري، هذا يعني أن هناك كارثة محققة ستحدث غداً بالتأكيد."',
    options: [
      { key: 'emotionalReasoning', label: 'الاستدلال العاطفي (Emotional Reasoning)', correct: true },
      { key: 'shouldStatements', label: 'عبارات الإلزام', correct: false },
      { key: 'personalization', label: 'الشخصنة', correct: false }
    ],
    explanation: 'الاستدلال العاطفي هو اتخاذ المشاعر كدليل قاطع على حقيقة الواقع الموضوعي.'
  }
];

export default function DistortionQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelect = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    setShowResult(true);
    if (option.correct) {
      setScore(prev => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption(null);
    setShowResult(false);
    if (currentIdx < QUIZ_QUESTIONS.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setCurrentIdx(0);
      setScore(0);
    }
  };

  return (
    <div className="w-full my-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-right font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-teal-600" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-display">
            اختبار سريع: ميّز نوع التشوه المعرفي
          </h3>
        </div>
        <span className="text-xs text-neutral-400">
          السؤال {currentIdx + 1} من {QUIZ_QUESTIONS.length}
        </span>
      </div>

      <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700/60 mb-4">
        <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 leading-relaxed">
          {currentQ.scenario}
        </p>
      </div>

      <div className="space-y-2 mb-4">
        {currentQ.options.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleSelect(opt)}
            disabled={selectedOption !== null}
            className={`w-full p-3 rounded-xl border text-sm text-right transition-all flex items-center justify-between ${
              selectedOption === opt
                ? opt.correct
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold'
                  : 'border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold'
                : 'border-neutral-200 dark:border-neutral-800 hover:border-teal-500 text-neutral-700 dark:text-neutral-300'
            }`}
          >
            <span>{opt.label}</span>
            {selectedOption === opt && (
              opt.correct ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <XCircle className="w-4 h-4 text-red-600" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence>
        {showResult && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-xl bg-teal-50/50 dark:bg-teal-950/20 border border-teal-200 dark:border-teal-900/40 text-xs text-neutral-700 dark:text-neutral-300 mb-4"
          >
            <span className="font-bold text-teal-800 dark:text-teal-300 ml-1">التفسير الإكلينيكي:</span>
            {currentQ.explanation}
          </motion.div>
        )}
      </AnimatePresence>

      {showResult && (
        <div className="flex justify-end">
          <Button size="sm" onClick={handleNext} className="bg-teal-600 hover:bg-teal-700 text-white text-xs">
            {currentIdx < QUIZ_QUESTIONS.length - 1 ? 'السؤال التالي' : 'إعادة الاختبار'}
          </Button>
        </div>
      )}
    </div>
  );
}
