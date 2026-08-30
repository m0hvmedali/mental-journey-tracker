import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Layers, Sparkles, Copy, Check, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DefusionCardCreator({ initialThought = '' }) {
  const [rawThought, setRawThought] = useState(initialThought || 'أنا شخص فاشل ولن أنجح أبداً');
  const [level, setLevel] = useState(1);
  const [copied, setCopied] = useState(false);

  const defusionLevels = [
    {
      level: 1,
      title: 'الاندماج الكامل (Fusion)',
      text: `"${rawThought}"`,
      badge: 'الواقع = الفكرة',
      color: 'border-red-500/30 bg-red-50/20 text-red-900 dark:text-red-200'
    },
    {
      level: 2,
      title: 'الملاحظة الواعية (Noticing)',
      text: `"أنا ألاحظ أن لدي فكرة بأنني: ${rawThought}"`,
      badge: 'إدراك الفكرة',
      color: 'border-amber-500/30 bg-amber-50/20 text-amber-900 dark:text-amber-200'
    },
    {
      level: 3,
      title: 'فك الاندماج التام (Defusion)',
      text: `"عقلي ينتج قصة قديمة مألوفة مفادها أن: ${rawThought}. شكراً يا عقلي على المحاولة."`,
      badge: 'الفصل والحرية',
      color: 'border-emerald-500/30 bg-emerald-50/20 text-emerald-900 dark:text-emerald-200'
    }
  ];

  const currentLevel = defusionLevels[level - 1];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentLevel.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full my-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-right font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-display">
            مولد بطاقات فك الاندماج المعرفي (ACT Defusion)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            فصل الذات الملاحظة عن ثرثرة العقل التلقائية
          </p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5">
          الفكرة المزعجة التي يكررها عقلك:
        </label>
        <input
          type="text"
          value={rawThought}
          onChange={e => setRawThought(e.target.value)}
          placeholder="اكتب الفكرة المزعجة هنا..."
          className="w-full px-4 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 text-neutral-900 dark:text-neutral-100"
        />
      </div>

      <div className="flex gap-2 mb-4">
        {defusionLevels.map(d => (
          <button
            key={d.level}
            onClick={() => setLevel(d.level)}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold border transition-all ${
              level === d.level
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300'
                : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400'
            }`}
          >
            المستوى {d.level}
          </button>
        ))}
      </div>

      <motion.div
        key={level}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`p-5 rounded-2xl border ${currentLevel.color} flex flex-col justify-between min-h-[140px]`}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/60 dark:bg-black/40">
            {currentLevel.badge}
          </span>
          <span className="text-xs opacity-75">{currentLevel.title}</span>
        </div>
        <p className="text-base font-semibold leading-relaxed my-2 text-neutral-900 dark:text-neutral-100">
          {currentLevel.text}
        </p>
        <div className="flex justify-end pt-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="text-xs gap-1.5 h-8"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'تم النسخ' : 'نسخ العبارة'}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
