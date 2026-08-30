import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { CheckCircle2, AlertTriangle, BookOpen, PlayCircle, Headphones, BookAlert, ArrowRight, Sparkles, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollToTopButton from '@/components/ScrollToTopButton';

// CMS & Content Architecture Integration
import { contentService } from '@/services/contentService';
import { RenderContentTemplate } from '@/components/content/TemplateRegistry';

/* --------------------------------------------------
 قائمة الأخطاء الستة عشر (العربية + الإنجليزية)
-------------------------------------------------- */
const ERRORS = [
  {
    key: 'allOrNothing',
    name: 'التفكير بالأبيض والأسود (All‑or‑Nothing)',
    desc: 'رؤية الأمور في قطبين متطرفين بلا مساحات رمادية: النجاح التام أو الفشل الذريع.',
    image: '/article-by3DYy7JylaR.webp',
    treatment: [
      'اكتب ثلاثة احتمالات وسطية بين النجاح المطلق والفشل المطلق.',
      'اسأل صديقًا محايدًا ليعطيك وصفًا أكثر دقة للموقف.',
      'حدد المواقف المحفزة: الضغوط، النقد، التوقعات العالية.',
      'استخدم مفكرة لرصد 3 أفكار قطبية يومياً.'
    ],
    sources: [
      { type: 'book', title: 'Feeling Good – David Burns', url: 'https://www.goodreads.com/en/book/show/215350', note: 'الفصل 3 يشرح الخطأ وأمثلة لإعادة الصياغة.' },
      { type: 'video', title: 'CBT Nuggets – Black‑and‑White Thinking', url: 'https://youtu.be/kdQ2MYbG7fQ', note: 'فيديو 7 دقائق يوضّح المشكلة بخريطة ذهنية.' }
    ]
  },
  {
    key: 'overGeneral',
    name: 'التعميم المفرط (Over‑generalization)',
    desc: 'اعتبار تجربة سلبية واحدة دليلاً قاطعًا على نمط دائم في الحياة.',
    image: '/cognitive-bias-judgement-error-systematic-600nw-2236319449.webp',
    treatment: [
      'دوّن شواهد مضادة حدثت في أوقات أخرى.',
      'استبدل كلمة "دائمًا" أو "أبدًا" بعبارة أكثر دقة مثل "أحيانًا".'
    ],
    sources: [
      { type: 'pod', title: 'Therapy Chat – Ep.40', url: 'https://therapychatpodcast.com/40', note: 'مقابلة مع أخصائية عن التعميم.' }
    ]
  },
  {
    key: 'mentalFilter',
    name: 'التركيز على السلبيات (Mental Filter)',
    desc: 'التركيز على جانب سلبي واحد وإهمال باقي الأحداث الإيجابية المحيطة.',
    image: '/97ba60a5ff238613c5d0b849940f54ac.jpg',
    treatment: [
      'اكتب ثلاثة أشياء إيجابية حدثت اليوم ولو كانت بسيطة.'
    ],
    sources: [
      { type: 'article', title: 'PositivePsychology – Cognitive Distortions', url: 'https://positivepsychology.com/cognitive-distortions/', note: 'قسم Mental Filter.' }
    ]
  },
  {
    key: 'discountPositive',
    name: 'إبطال الإيجابي (Disqualifying the Positive)',
    desc: 'رفض الإيجابيات بالإصرار على أنها مجرد صدفة ولا تحسب.',
    image: '/68c5165ddf8ecec3dc33fc50e74ab197.jpg',
    treatment: [
      'عند تلقّي مديح أو إنجاز، دوّنه كما هو بدون تبرير أو تقليل.'
    ],
    sources: [
      { type: 'book', title: 'Mind Over Mood', url: 'https://www.newharbinger.com/9781462544196/', note: 'تمرين Catch the Positive.' }
    ]
  },
  {
    key: 'mindReading',
    name: 'قراءة الأفكار (Mind Reading)',
    desc: 'الاعتقاد الجازم بأنك تعرف ما يفكر فيه الآخرون تجاهك دون دليل واضح.',
    image: '/thinking-errors-2-rs.webp',
    treatment: [
      'اختبر افتراضك بالسؤال المباشر بلطف وبدون عدوانية.',
      'اكتب بدائل محتملة لتفسير سلوك الشخص الآخر.'
    ],
    sources: [
      { type: 'video', title: 'How to Stop Mind Reading – Kati Morton', url: 'https://youtu.be/9Gv0vJM3m8M', note: 'إستراتيجيّات تواصل مباشرة.' }
    ]
  },
  {
    key: 'fortuneTelling',
    name: 'القفز بالاستنتاجات السلبية (Fortune Telling)',
    desc: 'الاعتقاد بأن الأمور ستسوء حتمًا قبل حدوثها.',
    image: '/03e37ed243361d08d8a028d0e233f800.jpg',
    treatment: [
      'اكتب الاحتمالات الإيجابية والواقعية بجانب السلبية.'
    ],
    sources: [
      { type: 'article', title: 'VeryWellMind – Fortune Telling', url: 'https://www.verywellmind.com/fortune-telling-4691791', note: 'أمثلة وتمارين.' }
    ]
  },
  {
    key: 'magnification',
    name: 'التهويل والتهوين (Magnification / Minimization)',
    desc: 'تضخيم السلبيات أو تصغير الإيجابيات ونقاط القوة بشكل غير موضوعي.',
    image: '/97fb1a103b72240222f1302188e6b999.jpg',
    treatment: [
      'قيّم الحدث بدرجة من 1 إلى 10 لتضعه في حجمه الطبيعي.'
    ],
    sources: [
      { type: 'book', title: 'The CBT Toolbox', url: 'https://www.newharbinger.com/9781683734526/', note: 'ورقة عمل 2.4' }
    ]
  },
  {
    key: 'emotionalReasoning',
    name: 'التفكير الانفعالي (Emotional Reasoning)',
    desc: 'اتخاذ المشاعر اللحظية كدليل قاطع على حقيقة الواقع (أشعر بالخوف إذن أنا في خطر).',
    image: '/f6761102f1804ca5059d71b5c8a8d3b8.jpg',
    treatment: [
      'اكتب شعورك ثم ابحث عن أدلّة واقعية تؤيد أو تنفي الفكرة المصاحبة.'
    ],
    sources: [
      { type: 'pod', title: 'The Happiness Lab – Emotions ≠ Facts', url: 'https://open.spotify.com/episode/xyz', note: 'حلقة المشاعر ليست حقائق.' }
    ]
  },
  {
    key: 'should',
    name: 'عبارات الإلزام (Should Statements)',
    desc: 'فرض قواعد صارمة على النفس أو الآخرين تُنتج لومًا وغضبًا مستمراً.',
    image: '/b9838022495db0b3d51e37fe7bf50c62.jpg',
    treatment: [
      'استبدل "ينبغي" و"يجب" بـ "أفضّل" أو "من الأفضل" لتليين الحكم.'
    ],
    sources: [
      { type: 'article', title: 'PsychologyToday – Stop Shoulding', url: 'https://www.psychologytoday.com/intl/blog/', note: 'نصائح لغوية عملية.' }
    ]
  },
  {
    key: 'labeling',
    name: 'الوصم والتعليب (Labeling)',
    desc: 'وضع تصنيف سلبي شامل ودائم للشخص أو للنفس بعد خطأ عابر.',
    image: '/Food-Labeling-Services-by-K-International.jpg',
    treatment: [
      'ركز على السلوك المؤقت لا على هوية وجوهر الشخص.'
    ],
    sources: [
      { type: 'video', title: 'Labels & Identity – TED‑Ed', url: 'https://youtu.be/p8jJ2sp5J7g', note: 'شرح موجز للضرر النفسي.' }
    ]
  },
  {
    key: 'personalization',
    name: 'الشخصنة (Personalization)',
    desc: 'تحمل مسؤولية أحداث خارجة عن إرادتك واعتبار تصرفات الآخرين موجهة ضدك شخصياً.',
    image: '/unnamed.png',
    treatment: [
      'حدد العوامل المتعددة الأخرى التي ساهمت في حدوث الموقف خارج نطاقك.'
    ],
    sources: [
      { type: 'article', title: 'MindTools – Personalization', url: 'https://www.mindtools.com/a123', note: 'خريطة عقلية.' }
    ]
  },
  {
    key: 'blaming',
    name: 'اللوم والعزو الخارجي (Blaming)',
    desc: 'تحميل الآخرين المسؤولية الكاملة عن مشاعرك وسعادتك وسلب قوتك الذاتية.',
    image: '/Jul22_20_86435164-1200x675.jpg',
    treatment: [
      'استخدم جملة: "أنا أشعر بـ... وأنا مسؤول عن استجابتي" بدلاً من اللوم التام.'
    ],
    sources: [
      { type: 'pod', title: 'Brené Brown on Blame', url: 'https://open.spotify.com/episode/abc', note: 'تمرين عملي.' }
    ]
  }
];

/* --------------------------------------------------
 سيناريوهات الاختبار
-------------------------------------------------- */
const QUIZ = [
  { q: 'رسبت في اختبار واحد وقلت: "أنا فاشل للأبد وكل حياتي ستضيع."', a: 'allOrNothing' },
  { q: 'عندما تأخرت صديقتك في الرد، افترضت فوراً أنها تكرهك ولا تريدك.', a: 'mindReading' },
  { q: 'حصلت على 95٪ في التقييم وقلت: "الـ5٪ الضائعة تعني أني مقصر وغبي."', a: 'mentalFilter' },
  { q: 'توقعت أن المقابلة الشخصية ستفشل حتماً وتجهزت للانسحاب قبل أن تبدأ.', a: 'fortuneTelling' },
  { q: 'حققت إنجازاً كبيراً وقال لك زميلك "رائع!" فقلت: "مجرد حظ لا غير."', a: 'discountPositive' },
  { q: 'ازدحم الطريق صباحاً فصرخت: "دائماً يحدث هذا النحس معي أنا فقط!"', a: 'personalization' }
];

export default function ThinkingErrors() {
  const navigate = useNavigate();
  const [cmsContent, setCmsContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Quiz state
  const [quizIdx, setQuizIdx] = useState(0);
  const [choice, setChoice] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadContent() {
      try {
        setLoading(true);
        // Architectural flow: React -> contentService.getContentBySlug
        const data = await contentService.getContentBySlug('thinking-errors', 'ar');
        if (isMounted) {
          setCmsContent(data);
        }
      } catch (err) {
        console.error('Error fetching CMS content:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadContent();
    return () => { isMounted = false; };
  }, []);

  const currentQuiz = QUIZ[quizIdx];
  const correctObj = ERRORS.find((e) => e.key === currentQuiz?.a);

  const submitQuiz = () => {
    if (!choice) return;
    if (choice === currentQuiz.a) setScore(score + 1);
    setShowResult(true);
  };

  const nextQuiz = () => {
    setShowResult(false);
    setChoice('');
    setQuizIdx((i) => (i + 1) % QUIZ.length);
  };

  const filteredErrors = ERRORS.filter(err =>
    err.name.includes(searchTerm) ||
    err.desc.includes(searchTerm)
  );

  return (
    <div className="flex flex-col min-h-screen bg-bg-app text-right font-sans pb-16">
      {/* Top Bar Navigation */}
      <header className="w-full max-w-5xl mx-auto flex justify-between items-center px-4 pt-4 pb-2 border-b border-neutral-200/60 dark:border-neutral-800/60">
        <button
          onClick={() => navigate(-1)}
          className="flex size-10 items-center justify-center rounded-xl bg-neutral-100 dark:bg-neutral-800 text-text-primary hover:bg-neutral-200 transition-colors"
          aria-label="الرجوع للخلف"
        >
          <ArrowRight className="w-5 h-5" />
        </button>
        <div className="text-center font-display font-bold text-base text-text-primary">
          المكتبة المعرفية • العلاج المعرفي السلوكي
        </div>
        <div className="size-10 shrink-0" />
      </header>

      {/* Render CMS Content via TemplateRegistry */}
      {cmsContent && (
        <RenderContentTemplate content={cmsContent}>
          {/* Injected Interactive Section: 16 Thinking Errors Directory */}
          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 font-display">
                  موسوعة التشوهات المعرفية الـ 12 الشائعة
                </h2>
                <p className="text-xs text-neutral-500 mt-1">
                  استعرض كل تشوه معرفي، أمثلته، طرائق التعامل العلاجية، والمصادر العلمية الموثقة.
                </p>
              </div>

              {/* Search filter */}
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="ابحث عن خطأ تفكير..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-9 py-2 text-xs rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <Search className="w-4 h-4 text-neutral-400 absolute right-3 top-2.5" />
              </div>
            </div>

            {/* Error Cards Accordion */}
            <div className="space-y-4">
              {filteredErrors.map((error, i) => (
                <Accordion key={error.key || i} type="single" collapsible className="w-full">
                  <AccordionItem value={`item-${i}`} className="border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-white dark:bg-neutral-900 shadow-sm">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.03 }}
                      className="p-5 space-y-3"
                    >
                      <div className="flex items-center gap-2">
                        <BookAlert className="text-teal-600 dark:text-teal-400 w-5 h-5 shrink-0" />
                        <h3 className="text-base font-bold text-text-primary font-display">{error.name}</h3>
                      </div>

                      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed font-sans font-medium">
                        {error.desc}
                      </p>

                      {error.image && (
                        <div className="my-3 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 max-h-56">
                          <img
                            src={error.image}
                            alt={error.name}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      )}

                      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <h4 className="font-bold text-xs text-text-primary mb-2">طرق التعامل الإكلينيكية:</h4>
                        <ul className="list-disc pr-5 space-y-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                          {error.treatment.map((step, j) => (
                            <li key={j}>{step}</li>
                          ))}
                        </ul>
                      </div>

                      {error.sources?.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                          <h4 className="text-xs font-bold text-text-primary mb-2">مصادر للتعلّم والاستزادة:</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {error.sources.map((src, k) => (
                              <a
                                key={k}
                                href={src.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2 p-2.5 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-xs text-text-primary hover:bg-teal-50 dark:hover:bg-teal-950/30 transition-colors"
                              >
                                {src.type === 'video' && <PlayCircle size={15} className="text-rose-500 shrink-0" />}
                                {src.type === 'book' && <BookOpen size={15} className="text-teal-600 shrink-0" />}
                                {src.type === 'article' && <BookOpen size={15} className="text-teal-600 shrink-0" />}
                                {src.type === 'pod' && <Headphones size={15} className="text-teal-600 shrink-0" />}
                                <span className="truncate">{src.title}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>

            {/* Interactive Knowledge Quiz Section */}
            <section className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-teal-600" />
                <h3 className="text-xl font-bold text-text-primary font-display">اختبر فهمك للتشوهات المعرفية</h3>
              </div>

              <Card className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                <CardContent className="p-5 space-y-4">
                  <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700/60">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 leading-relaxed">
                      {currentQuiz?.q}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ERRORS.slice(0, 6).map((err) => (
                      <Button
                        key={err.key}
                        variant="outline"
                        onClick={() => setChoice(err.key)}
                        className={`w-full justify-start text-xs h-10 ${
                          choice === err.key ? 'border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200' : ''
                        }`}
                      >
                        {err.name}
                      </Button>
                    ))}
                  </div>

                  <div className="flex gap-2 justify-between items-center pt-2">
                    <Button
                      size="sm"
                      onClick={submitQuiz}
                      disabled={!choice}
                      className="bg-teal-600 hover:bg-teal-700 text-white text-xs px-5"
                    >
                      تأكيد الإجابة
                    </Button>
                    {showResult && (
                      <Button size="sm" variant="outline" onClick={nextQuiz} className="text-xs">
                        السؤال التالي
                      </Button>
                    )}
                  </div>

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl p-4 mt-3 text-xs leading-relaxed ${
                        choice === currentQuiz.a
                          ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800'
                          : 'bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800'
                      }`}
                    >
                      {choice === currentQuiz.a ? (
                        <div className="flex gap-2 items-center font-bold">
                          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                          إجابة صحيحة وموفقة! {correctObj?.desc}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex gap-2 items-center font-bold">
                            <AlertTriangle size={18} className="text-rose-600 shrink-0" />
                            الإجابة الصحيحة هي: {correctObj?.name}
                          </div>
                          <p className="text-xs opacity-90">
                            السبب: {correctObj?.desc}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </section>
          </div>
        </RenderContentTemplate>
      )}

      <ScrollToTopButton />
    </div>
  );
}
