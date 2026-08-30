// src/components/wellness/InstagramOnboarding.jsx
import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Music, 
  Search, 
  ArrowUp, 
  ArrowDown, 
  Settings, 
  Moon, 
  Sun, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  BookOpen, 
  Smile, 
  Compass, 
  Activity, 
  MessageSquare,
  Play,
  Pause,
  Home
} from 'lucide-react';

export default function InstagramOnboarding({ onClose, forceShow = false }) {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const timerRef = useRef(null);
  const SLIDE_DURATION = 6000; // 6 seconds per slide
  const PROGRESS_INTERVAL = 30; // update progress every 30ms

  // Instagram Story Slides Data
  const slides = [
    {
      title: "مرحباً بك في رحلتك الروحية",
      subtitle: "مساحتك الآمنة للهدوء والتأمل وتتبع صحتك النفسية بكل خصوصية وسرية.",
      icon: <Compass className="size-16 text-emerald-400 animate-pulse" />,
      gradient: "from-emerald-950/80 via-emerald-900/40 to-slate-950",
      content: (
        <div className="space-y-4 text-center">
          <p className="text-[13px] leading-relaxed text-slate-300">
            صُمم هذا الموقع ليكون رفيقك اليومي للوصول إلى السكينة والتعامل مع المشاعر والضغوطات اليومية باستخدام أحدث الأساليب السلوكية المعرفية.
          </p>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 text-right">
            <Smile className="text-emerald-400 shrink-0" size={18} />
            <span className="text-[11px] text-slate-300 leading-normal">
              كل بياناتك، مذكراتك وتتبع مشاعرك تحفظ بأمان تام على جهازك الخاص.
            </span>
          </div>
        </div>
      )
    },
    {
      title: "مستشارك النفسي الذكي",
      subtitle: "مساعد ذكاء اصطناعي متكامل بجانبك في كل خطوة ومقالة.",
      icon: <Sparkles className="size-16 text-amber-400 animate-bounce [animation-duration:3s]" />,
      gradient: "from-amber-950/80 via-amber-900/40 to-slate-950",
      content: (
        <div className="space-y-3.5">
          <p className="text-[13px] text-center leading-relaxed text-slate-300">
            في أي صفحة تقرأها، ستجد مستشارك الذكي جاهزاً دائماً بلمسة واحدة:
          </p>
          <div className="space-y-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-right">
              <span className="size-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-[11px] text-slate-200">
                <strong>تلخيص ذكي فوري:</strong> لخص المحتوى والمقالات الطويلة بلمسة واحدة.
              </span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 text-right">
              <span className="size-2 rounded-full bg-amber-400 shrink-0" />
              <span className="text-[11px] text-slate-200">
                <strong>إرشاد وحوار مستمر:</strong> اسأله عن أي شيء يخص مشاعرك، نومك، أو تمارين التنفس.
              </span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "الخلفية الموسيقية الهادئة",
      subtitle: "أصوات طبيعية وموجات صوتية تعزز التركيز والراحة.",
      icon: <Music className="size-16 text-cyan-400 animate-pulse" />,
      gradient: "from-cyan-950/80 via-cyan-900/40 to-slate-950",
      content: (
        <div className="space-y-4 text-center">
          <p className="text-[13px] leading-relaxed text-slate-300">
            استمع إلى باقة من مقطوعات السكينة والتركيز أثناء القراءة أو ممارسة تمارين التنفس والتأمل اليومي.
          </p>
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between text-right">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 rounded-full bg-cyan-500/15 text-cyan-400">
                <Music size={14} />
              </span>
              <span className="text-[11px] text-slate-200 font-semibold">المشغل العائم في الأسفل</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-medium">متاح دائماً</span>
          </div>
        </div>
      )
    },
    {
      title: "أدوات البحث والتحكم الذكي",
      subtitle: "تصفح مريح وأدوات مرنة مدمجة بكل ذكاء وسهولة.",
      icon: <Search className="size-16 text-sky-400" />,
      gradient: "from-sky-950/80 via-sky-900/40 to-slate-950",
      content: (
        <div className="space-y-3">
          <p className="text-[13px] text-center leading-relaxed text-slate-300">
            سهلنا عليك التصفح والوصول السريع إلى كل ما تبحث عنه:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
              <div className="flex justify-center text-sky-400"><Search size={16} /></div>
              <h5 className="text-[11px] font-bold text-slate-100">البحث الشامل</h5>
              <p className="text-[9px] text-slate-400">ابحث عن أي تمرين أو مقالة</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center space-y-1">
              <div className="flex justify-center gap-1 text-sky-400">
                <ArrowUp size={14} />
                <ArrowDown size={14} />
              </div>
              <h5 className="text-[11px] font-bold text-slate-100">أزرار التنقل</h5>
              <p className="text-[9px] text-slate-400">سهم الصعود والهبوط السريع</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "تخصيص كامل للمظهر والخصوصية",
      subtitle: "ألوان مريحة للعين تناسب حالتك المزاجية ووقت تصفحك.",
      icon: <Settings className="size-16 text-indigo-400 rotate-45" />,
      gradient: "from-indigo-950/80 via-indigo-900/40 to-slate-950",
      content: (
        <div className="space-y-4 text-center">
          <p className="text-[13px] leading-relaxed text-slate-300">
            تفضّل الوضع الداكن الفاخر أو الوضع الفاتح الدافئ؟ اختر السمة الأنسب لك من قائمة الإعدادات لحماية عينيك.
          </p>
          <div className="flex justify-center gap-3 pt-1">
            <div className="px-4 py-2 rounded-full bg-white/5 border border-indigo-500/20 flex items-center gap-2 text-indigo-300 text-xs">
              <Moon size={14} />
              <span>الوضع الداكن</span>
            </div>
            <div className="px-4 py-2 rounded-full bg-white/5 border border-indigo-500/20 flex items-center gap-2 text-amber-300 text-xs">
              <Sun size={14} />
              <span>الوضع الفاتح</span>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "جاهز للانطلاق؟",
      subtitle: "انطلق الآن وعش رحلة الهدوء والصحة النفسية المتكاملة.",
      icon: <Activity className="size-16 text-rose-400 animate-pulse" />,
      gradient: "from-rose-950/80 via-rose-900/40 to-slate-950",
      content: (
        <div className="space-y-5 text-center">
          <p className="text-[13px] leading-relaxed text-slate-300">
            استكشف المقالات، تمارين التنفس 4-7-8، عجلة المشاعر، سجل مذكراتك اليومي، وتفاعل مع مساعدك الذكي في أي وقت.
          </p>
          <button
            onClick={handleComplete}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm rounded-full shadow-lg shadow-emerald-500/20 transition-all transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            بدء الرحلة الآن 🌿
          </button>
        </div>
      )
    }
  ];

  useEffect(() => {
    // Determine whether to show onboarding
    const hasSeen = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeen || forceShow) {
      setVisible(true);
    }
  }, [forceShow]);

  // Handle progress timer
  useEffect(() => {
    if (!visible || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    const intervalTime = PROGRESS_INTERVAL;
    const progressStep = (intervalTime / SLIDE_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Move to next slide
          if (currentSlide < slides.length - 1) {
            setCurrentSlide(curr => curr + 1);
            return 0;
          } else {
            // Reached end, trigger completion
            handleComplete();
            return 100;
          }
        }
        return prev + progressStep;
      });
    }, intervalTime);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, currentSlide, isPaused]);

  // Reset progress when changing slides
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  function handleComplete() {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setVisible(false);
    if (onClose) onClose();
  }

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  // Tap-based navigation (Instagram style left/right zone clicks)
  const handleTap = (e) => {
    const containerWidth = e.currentTarget.offsetWidth;
    const tapX = e.nativeEvent.offsetX;
    
    // Left 30% tap -> Previous slide
    if (tapX < containerWidth * 0.3) {
      handlePrev();
    } else {
      // Right 70% tap -> Next slide
      handleNext();
    }
  };

  if (!visible) return null;

  const current = slides[currentSlide];

  return (
    <div dir="rtl" className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/80 backdrop-blur-md">
      <div 
        className="relative w-full h-full sm:w-[390px] sm:h-[680px] sm:rounded-[36px] overflow-hidden flex flex-col bg-slate-950 shadow-2xl text-white select-none border border-white/5 transition-all duration-500 animate-in fade-in zoom-in-95 duration-300"
      >
        {/* Slide Gradient Overlay Background */}
        <div className={`absolute inset-0 bg-gradient-to-b ${current.gradient} to-slate-950 pointer-events-none -z-10`} />

        {/* 1. TOP PROGRESS INDICATORS */}
        <div className="px-4 pt-5 pb-3 flex gap-1.5 shrink-0 z-10">
          {slides.map((_, idx) => {
            let widthPercent = 0;
            if (idx < currentSlide) widthPercent = 100;
            else if (idx === currentSlide) widthPercent = progress;

            return (
              <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full transition-all duration-30" 
                  style={{ width: `${widthPercent}%` }}
                />
              </div>
            );
          })}
        </div>

        {/* 2. INSTAGRAM STORY TOP PROFILE & ACTIONS BAR */}
        <div className="px-4 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1.5px]">
              <div className="size-full rounded-full bg-slate-950 flex items-center justify-center text-emerald-400 font-bold text-xs">
                م
              </div>
            </div>
            <div>
              <span className="text-xs font-bold block leading-none">مستشارك وسكينتك</span>
              <span className="text-[9px] text-slate-400 mt-1 block">مرشد الاستكشاف السريع</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Play/Pause Control */}
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer active:scale-90"
              title={isPaused ? "تشغيل" : "إيقاف مؤقت"}
            >
              {isPaused ? <Play size={12} /> : <Pause size={12} />}
            </button>

            {/* Skip / Close */}
            <button 
              onClick={handleComplete}
              className="size-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all cursor-pointer active:scale-90"
              title="تخطي"
            >
              <X size={12} />
            </button>
          </div>
        </div>

        {/* 3. INTERACTIVE BODY - Tap to navigate */}
        <div 
          onClick={handleTap}
          onMouseDown={() => setIsPaused(true)}
          onMouseUp={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          className="flex-1 flex flex-col items-center justify-center px-6 py-4 cursor-pointer relative"
        >
          {/* Subtle Swipe Guidance Indicators */}
          <div className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white/40 transition-all pointer-events-none">
            <ChevronLeft size={20} />
          </div>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white/20 hover:text-white/40 transition-all pointer-events-none">
            <ChevronRight size={20} />
          </div>

          {/* Icon Display */}
          <div className="mb-6 filter drop-shadow-[0_8px_24px_rgba(16,185,129,0.15)]">
            {current.icon}
          </div>

          {/* Heading Description */}
          <div className="space-y-2 text-center max-w-xs mb-6">
            <h2 className="text-lg font-black tracking-tight text-white leading-snug">
              {current.title}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed font-medium px-2">
              {current.subtitle}
            </p>
          </div>

          {/* Page-Specific Content Custom Render */}
          <div className="w-full max-w-[280px] bg-slate-950/45 border border-white/5 backdrop-blur-md rounded-2xl p-4 shrink-0" onClick={(e) => e.stopPropagation()}>
            {current.content}
          </div>
        </div>

        {/* 4. FOOTER SWIPE & CONTROLS BAR */}
        <div className="px-5 py-4 border-t border-white/5 bg-slate-950 shrink-0 z-10 flex items-center justify-between text-xs text-slate-400">
          <button 
            disabled={currentSlide === 0}
            onClick={handlePrev}
            className="flex items-center gap-1 text-slate-400 hover:text-white transition-all disabled:opacity-20 cursor-pointer"
          >
            <ChevronRight size={14} className="rotate-180" />
            <span>السابق</span>
          </button>

          <span className="text-[10px] text-slate-500 select-none">
            {currentSlide + 1} من {slides.length}
          </span>

          <button 
            onClick={handleNext}
            className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-all cursor-pointer"
          >
            <span>{currentSlide === slides.length - 1 ? "إغلاق" : "التالي"}</span>
            <ChevronLeft size={14} className="rotate-180" />
          </button>
        </div>
      </div>
    </div>
  );
}
