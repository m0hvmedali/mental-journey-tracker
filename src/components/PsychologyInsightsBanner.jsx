import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  Copy, 
  Check, 
  Play, 
  Pause,
  User
} from 'lucide-react';
import { contentService } from '@/services/contentService';

const TOPIC_MAP = {
  solution_focused_brief_therapy: {
    label: 'العلاج المركّز على الحلول (SFBT)',
    link: '/SFBTSkills',
    badge: 'SFBT'
  },
  acceptance_commitment_therapy: {
    label: 'القبول والالتزام (ACT)',
    link: '/ACTSkills',
    badge: 'ACT'
  },
  dialectical_behavior_therapy: {
    label: 'الجدلي السلوكي (DBT)',
    link: '/DBTTipp',
    badge: 'DBT'
  },
  psychodynamic_therapy: {
    label: 'العلاج النفسي الديناميكي',
    link: '/PsychodynamicSkills',
    badge: 'سيكوديناميك'
  }
};

const TYPE_MAP = {
  scientist_quote: {
    label: 'مقولة علمية موثقة'
  },
  scientific_insight: {
    label: 'رؤية وأدلة إكلينيكية'
  },
  evidence_based_tip: {
    label: 'تطبيق عملي مبني على الدليل'
  }
};

const DEFAULT_INSIGHTS = [
  {
    id: "001",
    type: "scientist_quote",
    text: "على الرغم من أن أسباب المشاكل قد تكون معقدة للغاية، إلا أن حلولها لا يجب بالضرورة أن تكون كذلك.",
    author: "ستيف دي شازر",
    topic: "solution_focused_brief_therapy",
    source: "Solution-focused brief therapy - Wikipedia",
    source_location: "General introduction",
    verified: true
  },
  {
    id: "039",
    type: "scientist_quote",
    text: "هدف العلاج بالقبول والالتزام ليس التخلص من المشاعر الصعبة، بل التواجد الحقيقي في الحاضر والتحرك نحو عيش قيمنا بصدق وحرية.",
    author: "ستيفن هايز",
    topic: "acceptance_commitment_therapy",
    source: "Acceptance and commitment therapy - Wikipedia",
    source_location: "Technique - Aims",
    verified: true
  },
  {
    id: "077",
    type: "scientist_quote",
    text: "الجدلية هي القدرة المتوازنة على الجمع بين فكرتين تبدوان متناقضتين تماماً في الظاهر: القبول الكامل للذات، والتغيير المستمر للسلوك.",
    author: "مارشا لينهان",
    topic: "dialectical_behavior_therapy",
    source: "العِلاجاتُ الثلاثة (CBT) و(ACT) و(DBT)",
    source_location: "مفهوم الجدلية",
    verified: true
  }
];

export default function PsychologyInsightsBanner() {
  const [insights, setInsights] = useState(DEFAULT_INSIGHTS);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const saved = localStorage.getItem('psychology_insight_index');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef(null);

  // Fetch dataset from content service
  useEffect(() => {
    contentService.getPsychologyInsights()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          // Format the data appropriately if keys differ (e.g., insight_text to text)
          const formatted = data.map(item => ({
            id: item.id || String(Math.random()),
            type: item.type || 'scientific_insight',
            text: item.insight_text || item.text || '',
            author: item.author_or_source || item.author || 'دليل الوعي النفسي',
            topic: item.topic || 'عام',
            source: item.source || '',
            source_location: item.source_location || '',
            verified: item.verified || true
          }));
          setInsights(formatted);
          // Keep index bounded
          setCurrentIndex((prev) => (prev >= formatted.length ? 0 : prev));
        }
      })
      .catch((err) => {
        console.warn('Could not load psychology insights from service, using defaults', err);
      });
  }, []);

  // Save current index
  useEffect(() => {
    localStorage.setItem('psychology_insight_index', currentIndex.toString());
  }, [currentIndex]);

  const currentInsight = useMemo(() => {
    if (!insights || insights.length === 0) return DEFAULT_INSIGHTS[0];
    const safeIndex = ((currentIndex % insights.length) + insights.length) % insights.length;
    return insights[safeIndex];
  }, [insights, currentIndex]);

  const total = insights.length || 1;

  // Auto progression with pause on hover
  useEffect(() => {
    if (!isAutoPlaying || isHovered) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 12000); // 12 seconds per insight

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoPlaying, isHovered, total]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleCopy = async () => {
    if (!currentInsight) return;
    const authorText = currentInsight.author ? ` — ${currentInsight.author}` : '';
    const textToCopy = `"${currentInsight.text}"${authorText}\n(عبر تطبيق شجرة النمو)`;
    
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative mt-4 ml-0 p-4 sm:p-5 md:p-6 rounded-2xl bg-[#3e5938] border border-emerald-800/50 shadow-md flex flex-col justify-between space-y-3.5 transition-all duration-300 overflow-hidden"
    >
      {/* Background Decorative Graphic */}
      <div className="absolute top-0 left-0 -translate-x-6 -translate-y-6 opacity-10 dark:opacity-5 pointer-events-none text-[#065F46] dark:text-emerald-300">
        <Quote className="size-36" />
      </div>

      {/* Top Meta Bar */}
      <div className="relative z-10 flex items-center justify-end">
        {/* Action Controls (Copy / PlayPause / Prev / Next) */}
        <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm p-1 rounded-full border border-emerald-700/50">
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-200 transition-colors"
            title="نسخ الحكمة"
            aria-label="نسخ الحكمة"
          >
            {copied ? <Check className="size-3.5 text-emerald-400" /> : <Copy className="size-3.5" />}
          </button>

          <button
            onClick={() => setIsAutoPlaying((prev) => !prev)}
            className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-200 transition-colors"
            title={isAutoPlaying ? 'إيقاف التمرير التلقائي مؤقتاً' : 'تشغيل التمرير التلقائي'}
            aria-label="التحكم بالتمرير التلقائي"
          >
            {isAutoPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
          </button>

          <div className="h-3 w-px bg-emerald-700/60 mx-0.5" />

          <button
            onClick={handlePrev}
            className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-200 transition-colors"
            title="الحكمة السابقة"
            aria-label="الحكمة السابقة"
          >
            <ChevronRight className="size-3.5" />
          </button>

          <button
            onClick={handleNext}
            className="p-1.5 rounded-full hover:bg-emerald-800/60 text-emerald-200 transition-colors"
            title="الحكمة التالية"
            aria-label="الحكمة التالية"
          >
            <ChevronLeft className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Quote Text */}
      <div className="relative z-10 space-y-2 flex flex-col justify-center">
        <blockquote className="font-serif-display italic text-base sm:text-xl text-emerald-50 leading-relaxed font-medium transition-all duration-300">
          "{currentInsight.text}"
        </blockquote>

        {/* Author if available */}
        {currentInsight.author && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 mt-0.5">
            <User className="size-3.5 shrink-0 opacity-75" />
            <span>{currentInsight.author}</span>
            {currentInsight.source_location && (
              <span className="text-[11px] font-normal opacity-70 mr-1 text-emerald-200/80">
                ({currentInsight.source_location})
              </span>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
