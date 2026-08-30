import React, { useState } from 'react';
import { Activity, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';

export default function ScalingSlider({ 
  label = 'مقياس شدة الضيق النفسي (SUDS Scale)', 
  min = 0, 
  max = 10, 
  defaultValue = 5,
  onChange 
}) {
  const [value, setValue] = useState(defaultValue);

  const getStatus = (val) => {
    if (val <= 3) return { label: 'استقرار وهدوء نسبي', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', action: 'استمر في ممارسة الامتنان واليقظة الذهنية' };
    if (val <= 6) return { label: 'توتر وضيق معتدل', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', action: 'يوصى بتمارين التنفس العميق 4-7-8 وسجل الأفكار CBT' };
    return { label: 'استثارة انفعالية حادة', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', action: 'استخدم فوراً مهارات TIPP (الماء البارد / التمارين المكثفة) لاستعادة التوازن' };
  };

  const status = getStatus(value);

  const handleChange = (e) => {
    const newVal = Number(e.target.value);
    setValue(newVal);
    if (onChange) onChange(newVal);
  };

  return (
    <div className="w-full my-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 text-right font-sans">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-teal-600 dark:text-teal-400" />
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 font-display">
            {label}
          </h3>
        </div>
        <span className={`text-xl font-black ${status.color}`}>
          {value} / 10
        </span>
      </div>

      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="w-full h-2.5 bg-neutral-200 dark:bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-teal-600"
      />

      <div className="flex justify-between text-[11px] text-neutral-400 mt-2">
        <span>0 - هدوء تام</span>
        <span>5 - ضيق متوسط</span>
        <span>10 - أقصى ذعر</span>
      </div>

      <div className={`mt-4 p-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 ${status.bg} flex items-start gap-2.5`}>
        <div className="mt-0.5">
          {value > 6 ? <ShieldAlert className={`w-4 h-4 ${status.color}`} /> : <Sparkles className={`w-4 h-4 ${status.color}`} />}
        </div>
        <div>
          <div className={`text-xs font-bold ${status.color}`}>{status.label}</div>
          <div className="text-xs text-neutral-600 dark:text-neutral-300 mt-0.5">{status.action}</div>
        </div>
      </div>
    </div>
  );
}
