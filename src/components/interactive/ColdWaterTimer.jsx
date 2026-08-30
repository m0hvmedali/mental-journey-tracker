import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw, Droplets, HeartPulse, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ColdWaterTimer({ defaultDuration = 30, showDistressScale = true }) {
  const [secondsLeft, setSecondsLeft] = useState(defaultDuration);
  const [isActive, setIsActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [preDistress, setPreDistress] = useState(9);
  const [postDistress, setPostDistress] = useState(4);

  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => setSecondsLeft(prev => prev - 1), 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      setCompleted(true);
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft]);

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(defaultDuration);
    setCompleted(false);
  };

  const progress = ((defaultDuration - secondsLeft) / defaultDuration) * 100;

  return (
    <div className="w-full my-6 rounded-2xl bg-gradient-to-br from-cyan-950/20 via-blue-950/10 to-transparent border border-cyan-500/20 dark:border-cyan-800/40 p-6 text-right font-sans">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
          <Droplets className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100 font-display">
            مؤقت مهارة الماء البارد (TIPP - Cold Water Temperature)
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            تفعيل منعكس الغطس الباراسيسباوي لتهدئة ضربات القلب الفورية
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center my-6">
        <div className="relative w-40 h-40 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-neutral-200 dark:text-neutral-800 stroke-current"
              strokeWidth="8"
              fill="transparent"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              className="text-cyan-500 stroke-current"
              strokeWidth="8"
              strokeDasharray="276"
              strokeDashoffset={276 - (276 * progress) / 100}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-4xl font-bold font-display text-neutral-900 dark:text-neutral-100">
              {secondsLeft}
            </span>
            <span className="text-xs text-neutral-500">ثانية</span>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          {!isActive ? (
            <Button
              onClick={() => setIsActive(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2 px-6"
            >
              <Play className="w-4 h-4" />
              ابدأ الغمر بالماء البارد
            </Button>
          ) : (
            <Button
              onClick={() => setIsActive(false)}
              variant="outline"
              className="gap-2 px-6"
            >
              <Pause className="w-4 h-4" />
              إيقاف مؤقت
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={handleReset}>
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showDistressScale && (
        <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-neutral-600 dark:text-neutral-400">شدة الانفعال قبل التمرين:</span>
              <span className="font-bold text-red-500">{preDistress}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={preDistress}
              onChange={e => setPreDistress(Number(e.target.value))}
              className="w-full accent-red-500"
            />
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-neutral-600 dark:text-neutral-400">شدة الانفعال بعد الغمر:</span>
              <span className="font-bold text-cyan-500">{postDistress}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={postDistress}
              onChange={e => setPostDistress(Number(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>
        </div>
      )}
    </div>
  );
}
