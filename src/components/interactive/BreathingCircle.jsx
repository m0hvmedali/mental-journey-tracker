import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Wind, Play, Pause, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function BreathingCircle({ pattern = '4-7-8' }) {
  const [phase, setPhase] = useState('شهيق'); // شهيق, حبس, زفير
  const [isActive, setIsActive] = useState(false);
  const [counter, setCounter] = useState(4);

  const phaseDurations = pattern === '4-7-8' 
    ? { 'شهيق': 4, 'حبس': 7, 'زفير': 8 }
    : { 'شهيق': 4, 'حبس': 4, 'زفير': 4 };

  useEffect(() => {
    let timer = null;
    if (isActive) {
      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev <= 1) {
            if (phase === 'شهيق') {
              setPhase('حبس');
              return phaseDurations['حبس'];
            } else if (phase === 'حبس') {
              setPhase('زفير');
              return phaseDurations['زفير'];
            } else {
              setPhase('شهيق');
              return phaseDurations['شهيق'];
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isActive, phase, phaseDurations]);

  const handleReset = () => {
    setIsActive(false);
    setPhase('شهيق');
    setCounter(phaseDurations['شهيق']);
  };

  const circleScale = phase === 'شهيق' ? 1.3 : phase === 'حبس' ? 1.3 : 0.8;

  return (
    <div className="w-full my-6 rounded-2xl bg-gradient-to-b from-teal-950/20 to-transparent border border-teal-500/20 p-6 text-center font-sans">
      <div className="flex items-center justify-center gap-2 mb-4 text-teal-600 dark:text-teal-400">
        <Wind className="w-5 h-5" />
        <h3 className="text-base font-bold font-display">تمرين التنفس المنتظم ({pattern})</h3>
      </div>

      <div className="h-56 flex items-center justify-center relative">
        <motion.div
          animate={{ scale: isActive ? circleScale : 1 }}
          transition={{ duration: phaseDurations[phase], ease: "easeInOut" }}
          className="w-36 h-36 rounded-full bg-teal-500/20 border-2 border-teal-500 flex flex-col items-center justify-center shadow-lg shadow-teal-500/10"
        >
          <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
            {phase}
          </span>
          <span className="text-2xl font-black text-teal-600 dark:text-teal-400 mt-1">
            {counter}
          </span>
        </motion.div>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={() => setIsActive(!isActive)}
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2 px-6"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          {isActive ? 'إيقاف مؤقت' : 'بدء التنفس'}
        </Button>
        <Button variant="ghost" size="icon" onClick={handleReset}>
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
