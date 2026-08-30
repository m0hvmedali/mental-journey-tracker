// src/components/wellness/InstagramOnboarding.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function InstagramOnboarding({ onClose, forceShow = false }) {
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);

  const SLIDE_DURATION = 6000;
  const PROGRESS_INTERVAL = 30;

  const slides = [
    {
      title: 'مرحبًا بك',
      description:
        'مساحة صُممت لتساعدك على فهم نفسك، ومتابعة مشاعرك، وبناء وعي أعمق بذاتك.',
    },
    {
      title: 'افهم نفسك',
      description:
        'تعرّف على مشاعرك وأفكارك وأنماطك النفسية بطريقة بسيطة وواضحة.',
    },
    {
      title: 'تحدث مع الذكاء الاصطناعي',
      description:
        'اسأل، ناقش، واستكشف أفكارك مع مساعد ذكي يفهم سياق رحلتك.',
    },
    {
      title: 'تعلّم',
      description:
        'محتوى نفسي مبسّط يساعدك على فهم المفاهيم والأساليب والأدوات التي قد تفيدك.',
    },
    {
      title: 'سجّل رحلتك',
      description:
        'احتفظ بمذكراتك ومشاعرك وملاحظاتك لتتمكن من رؤية تطورك مع الوقت.',
    },
    {
      title: 'ابدأ رحلتك',
      description:
        'كل ما تحتاجه لفهم نفسك في مكان واحد.',
    },
  ];

  // Show onboarding
  useEffect(() => {
    const hasSeen = localStorage.getItem('hasSeenOnboarding');

    if (!hasSeen || forceShow) {
      setVisible(true);
    }
  }, [forceShow]);

  // Complete onboarding
  const handleComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setVisible(false);
    setCurrentSlide(0);
    setProgress(0);

    if (onClose) {
      onClose();
    }
  };

  // Next slide
  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      setProgress(0);
    } else {
      handleComplete();
    }
  };

  // Previous slide
  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      setProgress(0);
    }
  };

  // Auto progress
  useEffect(() => {
    if (!visible || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      return;
    }

    const progressStep =
      (PROGRESS_INTERVAL / SLIDE_DURATION) * 100;

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlide < slides.length - 1) {
            setCurrentSlide((slide) => slide + 1);
            return 0;
          }

          handleComplete();
          return 100;
        }

        return prev + progressStep;
      });
    }, PROGRESS_INTERVAL);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [visible, isPaused, currentSlide]);

  // Reset progress when slide changes
  useEffect(() => {
    setProgress(0);
  }, [currentSlide]);

  // Keyboard navigation
  useEffect(() => {
    if (!visible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleComplete();
      }

      if (event.key === 'ArrowRight') {
        handlePrev();
      }

      if (event.key === 'ArrowLeft') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [visible, currentSlide]);

  // Tap navigation
  const handleTap = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;

    if (x < rect.width * 0.35) {
      handlePrev();
    } else if (x > rect.width * 0.65) {
      handleNext();
    }
  };

  if (!visible) {
    return null;
  }

  const current = slides[currentSlide];

  return (
    <div
      dir="rtl"
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        bg-black/60
        backdrop-blur-sm
        px-0 sm:px-4
      "
      role="dialog"
      aria-modal="true"
      aria-label="مقدمة التطبيق"
    >
      <div
        className="
          relative
          w-full h-full
          sm:w-[430px] sm:h-[720px]
          sm:max-h-[90vh]
          sm:rounded-[32px]
          overflow-hidden
          bg-surface
          text-text-primary
          border border-border-subtle
          shadow-2xl
          flex flex-col
          select-none
          animate-in
          fade-in
          zoom-in-95
          duration-300
        "
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Top progress */}
        <div className="px-5 pt-5">
          <div className="flex gap-1.5">
            {slides.map((_, index) => {
              let width = 0;

              if (index < currentSlide) {
                width = 100;
              } else if (index === currentSlide) {
                width = progress;
              }

              return (
                <div
                  key={index}
                  className="
                    relative
                    h-[3px]
                    flex-1
                    overflow-hidden
                    rounded-full
                    bg-text-primary/10
                  "
                >
                  <div
                    className="
                      absolute inset-y-0 right-0
                      rounded-full
                      bg-text-primary
                    "
                    style={{
                      width: `${width}%`,
                      transition:
                        'width 30ms linear',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div>
            <div className="text-sm font-semibold text-text-primary">
              رحلتك
            </div>

            <div className="mt-1 text-[11px] text-text-muted">
              {currentSlide + 1} / {slides.length}
            </div>
          </div>

          <button
            type="button"
            onClick={handleComplete}
            className="
              px-3 py-1.5
              rounded-full
              text-xs
              text-text-muted
              hover:text-text-primary
              hover:bg-surface-elevated
              transition-colors
            "
          >
            تخطي
          </button>
        </div>

        {/* Main content */}
        <div
          onClick={handleTap}
          className="
            flex-1
            flex
            items-center
            justify-center
            px-8
            cursor-pointer
          "
        >
          <div
            className="
              w-full
              max-w-[340px]
              text-center
              animate-in
              fade-in
              slide-in-from-bottom-2
              duration-300
            "
            key={currentSlide}
          >
            {/* Minimal visual element */}
            <div
              className="
                mx-auto
                mb-10
                w-14 h-14
                rounded-2xl
                border
                border-border-subtle
                bg-surface-elevated
                flex
                items-center
                justify-center
              "
            >
              <span
                className="
                  w-2.5 h-2.5
                  rounded-full
                  bg-text-primary
                "
              />
            </div>

            <h1
              className="
                text-2xl
                sm:text-3xl
                font-bold
                tracking-tight
                text-text-primary
              "
            >
              {current.title}
            </h1>

            <p
              className="
                mt-5
                text-sm
                sm:text-[15px]
                leading-8
                text-text-secondary
              "
            >
              {current.description}
            </p>
          </div>
        </div>

        {/* Bottom navigation */}
        <div
          className="
            px-6
            pb-6
            pt-4
            border-t
            border-border-subtle
          "
        >
          <div className="flex items-center justify-between gap-4">
            {/* Previous */}
            <button
              type="button"
              onClick={handlePrev}
              disabled={currentSlide === 0}
              className="
                px-4 py-2.5
                rounded-xl
                text-sm
                text-text-secondary
                hover:text-text-primary
                hover:bg-surface-elevated
                transition-all
                disabled:opacity-0
                disabled:pointer-events-none
              "
            >
              السابق
            </button>

            {/* Pause indicator */}
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                setIsPaused((prev) => !prev);
              }}
              className="
                w-2 h-2
                rounded-full
                bg-text-muted
                opacity-40
                hover:opacity-100
                transition-opacity
              "
              aria-label={
                isPaused
                  ? 'تشغيل تلقائي'
                  : 'إيقاف مؤقت'
              }
            />

            {/* Next / Start */}
            <button
              type="button"
              onClick={handleNext}
              className="
                px-5 py-2.5
                rounded-xl
                bg-text-primary
                text-surface
                text-sm
                font-semibold
                hover:opacity-90
                active:scale-[0.98]
                transition-all
              "
            >
              {currentSlide === slides.length - 1
                ? 'ابدأ الآن'
                : 'التالي'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}