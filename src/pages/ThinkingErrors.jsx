import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { CheckCircle2, AlertTriangle, BookOpen, Youtube, Headphones, BookAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import ScrollToTopButton from '@/components/ScrollToTopButton';

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
      'حدد المواقف المحفزة: الضغوط، النقد، التوقعات العالية',
      'استخدم مفكرة لرصد 3 أفكار قطبية يومياً',


    ],
    sources: [
      { type: 'book', title: 'Feeling Good – David Burns', url: 'https://www.goodreads.com/en/book/show/215350', note: 'الفصل 3 يشرح الخطأ وأمثلة لإعادة الصياغة.' },
      { type: 'video', title: 'CBT Nuggets – Black‑and‑White Thinking', url: 'https://youtu.be/kdQ2MYbG7fQ', note: 'فيديو 7 دقائق يوضّح المشكلة بخريطة ذهنية.' },
    ],
  },
  {
    key: 'overGeneral',
    name: ' التعميم (Over‑generalization)',
    desc: 'اعتبار تجربة سلبية واحدة دليلاً قاطعًا على نمط دائم.',
    image: '/cognitive-bias-judgement-error-systematic-600nw-2236319449.webp',
    treatment: [
      'دوّن شواهد مضادة حدثت في أوقات أخرى.',
      'استبدل كلمة "دائمًا" أو "أبدًا" بعبارة أكثر دقة مثل "أحيانًا".',
    ],
    sources: [
      { type: 'pod', title: 'Therapy Chat – Ep.40', url: 'https://therapychatpodcast.com/40', note: 'مقابلة مع أخصائية عن التعميم.' },
    ],
  },
  {
    key: 'mentalFilter',
    name: 'التركيز على السلبيات (Mental Filter)',
    desc: 'التركيز على جانب سلبي واحد وإهمال الأحداث الإيجابية.',
    image: '/97ba60a5ff238613c5d0b849940f54ac.jpg',
    treatment: [
      'اكتب ثلاثة أشياء إيجابية حدثت اليوم ولو بسيطة.',
    ],
    sources: [
      { type: 'article', title: 'PositivePsychology – Cognitive Distortions', url: 'https://positivepsychology.com/cognitive-distortions/', note: 'قسم "Mental Filter".' },
    ],
  },
  {
    key: 'discountPositive',
    name: 'إبطال الإيجابي (Disqualifying the Positive)',
    desc: 'رفض الإيجابيات بالإصرار أنها لا تحسب.',
    image: '/68c5165ddf8ecec3dc33fc50e74ab197.jpg',
    treatment: [
      'عند تلقّي مديح، دوّنه كما هو بدون تبرير أو تقليل.',
    ],
    sources: [
      { type: 'book', title: 'Mind Over Mood', url: 'https://www.newharbinger.com/9781462544196/', note: 'تمرين “Catch the Positive”.' },
    ],
  },
  {
    key: 'mindReading',
    name: 'قراءة الأفكار (Mind Reading)',
    desc: 'الاعتقاد أنك تعرف ما يفكر فيه الآخرون دون دليل واضح.',
    image: '/thinking-errors-2-rs.webp',
    treatment: [
      'اختبر افتراضك بالسؤال المباشر بلطف.',
      'اكتب بدائل محتملة لتفسير سلوك الشخص الآخر.',
    ],
    sources: [
      { type: 'video', title: 'How to Stop Mind Reading – Kati Morton', url: 'https://youtu.be/9Gv0vJM3m8M', note: 'إستراتيجيّات تواصل مباشرة.' },
    ],
  },
  {
    key: 'fortuneTelling',
    name: 'القفز بالاستنتاجات السلبيه (Fortune Telling)',
    desc: 'الاعتقاد بأن الأمور ستسوء حتمًا قبل حدوثها.',
    image: '/03e37ed243361d08d8a028d0e233f800.jpg',
    treatment: [
      'اكتب الاحتمالات الإيجابية والواقعية بجانب السلبية.',
    ],
    sources: [
      { type: 'article', title: 'VeryWellMind – Fortune Telling', url: 'https://www.verywellmind.com/fortune-telling-4691791', note: 'أمثلة وتمارين.' },
    ],
  },
  {
    key: 'magnification',
    name: 'التهويل والتهوين(Magnification / Minimization)',
    desc: 'تضخيم السلبيات أو تصغير الإيجابيات بشكل غير واقعي.',
    image: '/97fb1a103b72240222f1302188e6b999.jpg',
    treatment: [
      'قيّم الحدث بدرجة من 1 إلى 10 لتضعه في حجمه الطبيعي.',
    ],
    sources: [
      { type: 'book', title: 'The CBT Toolbox', url: 'https://www.newharbinger.com/9781683734526/', note: 'ورقة عمل 2.4' },
    ],
  },
  {
    key: 'emotionalReasoning',
    name: 'التفكير الانفعالي (Emotional Reasoning)',
    desc: 'عدم التفكير في الفعل وقول ما تهدف اليه مشاعرك .',
    image: '/f6761102f1804ca5059d71b5c8a8d3b8.jpg',
    treatment: [
      'اكتب شعورك ثم أدلّة واقعية تؤيد أو تنفي الفكرة المصاحبة.',
    ],
    sources: [
      { type: 'pod', title: 'The Happiness Lab – Emotions ≠ Facts', url: 'https://open.spotify.com/episode/xyz', note: 'حلقة 12' },
    ],
  },
  {
    key: 'should',
    name: 'عبارات ينبغي (Should Statements)',
    desc: 'فرض قواعد صارمة على النفس أو الآخرين تُنتج لومًا وغضبًا.',
    image: '/b9838022495db0b3d51e37fe7bf50c62.jpg',
    treatment: [
      'استبدل "ينبغي" بـ "أفضّل" أو "من الأفضل" لتليين الحكم.',
    ],
    sources: [
      { type: 'article', title: 'PsychologyToday – Stop Shoulding', url: 'https://www.psychologytoday.com/intl/blog/', note: 'نصائح لغوية عملية.' },
    ],
  },
  {
    key: 'labeling',
    name: 'الوصمه(Labeling)',
    desc: 'وضع تصنيف سلبي شامل للشخص بعد خطأ واحد.',
    image: '/Food-Labeling-Services-by-K-International.jpg',
    treatment: [
      'ركز على السلوك لا على هوية الشخص.',
    ],
    sources: [
      { type: 'video', title: 'Labels & Identity – TED‑Ed', url: 'https://youtu.be/p8jJ2sp5J7g', note: 'شرح موجز للضرر النفسي.' },
    ],
  },
  {
    key: 'personalization',
    name: 'الشخصنة (Personalization)',
    desc: 'هي مغالطة منطقية حيث يتم مهاجمة شخصية أو صفات الشخص الذي يقدم حجة بدلاً من مناقشة الحجة نفسها [1، 11]. بمعنى آخر، بدلاً من الرد على فكرة أو حجة ما، يتم التركيز على الشخص الذي يطرحها ومهاجمته من خلال الإشارة إلى عيوبه أو صفاته السلبية.',
    image: '/unnamed.png',
    treatment: [
      'من خلال التركيز على جوهر الخلاف أو المشكلة، بدلاً من تحويلها إلى صراع شخصي.الشخصنة تعيق التواصل الفعال:لأنها تخلق بيئة غير آمنة وغير مريحة للنقاش.تجنب الشخصنة يساعد على الوصول إلى حلول أفضل:من خلال التركيز على المشكلة الفعلية، يمكن إيجاد حلول بناءة ومناسبة.',
    ],
    sources: [
      { type: 'article', title: 'MindTools – Personalization', url: 'https://www.mindtools.com/a123', note: 'خريطة عقلية.' },
    ],
  },
  {
    key: 'blaming',
    name: 'العزو الخارجي/الداخلي (Blaming)',
    desc: 'تحميل الآخرين مسؤولية مشاعرك أو لوم نفسك على كل شيء.',
    image: '/Jul22_20_86435164-1200x675.jpg',
    treatment: [
      'استخدم جملة: "أنا أشعر بـ... عندما يحدث..." بدلاً من اللوم.',
    ],
    sources: [
      { type: 'pod', title: 'Brené Brown on Blame', url: 'https://open.spotify.com/episode/abc', note: 'تمرين عملي.' },
    ],
  },
  {
    key: 'catastrophizing2',
    name: 'التفكير الكارثي (Catastrophizing)',
    desc: 'توقع أسوأ سيناريو ممكن مهما كان احتمال حدوثه ضئيلًا.',
    image: '/1-1591504.webp',
    treatment: [
      'اكتب احتمالات أخرى مع نسب احتمالية لكل منها (تفكير إحصائي).',
    ],
    sources: [
      { type: 'video', title: 'How to Stop Catastrophizing', url: 'https://youtu.be/qmhiO_y0AA0', note: 'تمرين تنفس + إعادة تقييم.' },
    ],
  },
  {
    key: 'catastrophizing1',
    name: 'الاحكام (Provisions)',
    desc: 'الحكم على نفسك او على شخص من موقف او من فكره.',
    image: '/42022300218201.jpg',
    treatment: [
      'اعلم انه لا يمكن ان تحكم على نفسك او على احد الى من خلال التجارب والثقه لا تاتي من تجربه وموقف بل من عمر كامل تحدثنا في قسم التسامح والامتنان ارجع اليه.',
    ],
    sources: [
      { type: 'video', title: 'How to Stop Catastrophizing', url: 'https://youtu.be/qmhiO_y0AA0', note: 'تمرين تنفس + إعادة تقييم.' },
    ],
  },
  {
    key: 'catastrophizing',
    name: 'المثاليه (Catastrophizing)',
    desc: 'الرغبه في الكمال سواء في اشياء او حتى اشخاص.',
    image: '/images.jpeg',
    treatment: [
      'ما يحعل الانسان انسانا هو الخطا لن تصبح في الحياة تجارب ان لم يكن للانسان فرصه الخطا وان كان كل شئ كاملا فما ينقص هذا الشئ هو الموت المثاليه فخ ياصديقي.',
    ],
    sources: [
      { type: 'video', title: 'How to Stop Catastrophizing', url: 'https://youtu.be/qmhiO_y0AA0', note: 'تمرين تنفس + إعادة تقييم.' },
    ],
  },
  {
    key: 'controlFallacy',
    name: 'وهم التحكم (Control Fallacy)',
    desc: 'اعتقاد أنك إما ضحية بلا قوة أو المتحكم المطلق في كل شيء.',
    image: '/90fc4529847e9e91be11596611c20e11.jpg',
    treatment: [
      'اكتب ما تتحكم فيه فعليًا وما لا يمكنك التحكم فيه.',
    ],
    sources: [
      { type: 'book', title: 'The Happiness Trap', url: 'https://www.actmindfully.com.au/the-happiness-trap-book', note: 'تقبل عدم التحكم الكامل.' },
    ],
  },
  {
    key: 'fairness',
    name: 'وهم العدالة (Fairness Fallacy)',
    desc: 'التمسك بمقياس شخصي للعدالة والشعور بالاستياء عندما لا يتحقق.',
    // image: 'https://i.imgur.com/RqpYQkw.jpg',
    treatment: [
      'استخدم التسامح الذاتي ووسّع تعريفك للعدالة الحياتية.',
    ],
    sources: [
      { type: 'article', title: 'The Myth of Fairness', url: 'https://medium.com/some', note: 'منظور CBT.' },
    ],
  },
  {
    key: 'heavensReward',
    name: 'وهم مكافأة السماء (Heaven’s Reward)',
    desc: 'توقع نتيجة إيجابية حتمية مقابل التضحية الطويلة، ثم الشعور بالمرارة.',
    // image: 'https://i.imgur.com/GvzYENj.jpg',
    treatment: [
      'ضع أهدافًا واقعية ومكافآت داخلية لا تعتمد على الاعتراف الخارجي.',
    ],
    sources: [
      { type: 'pod', title: 'Self‑Help Antidote – Episode on Reward Fallacy', url: 'https://podcast.com/xyz', note: 'أمثلة مجتمعية.' },
    ],
  },
];

/* --------------------------------------------------
   سيناريوهات الاختبار (وسعناه إلى 8)
-------------------------------------------------- */
const QUIZ = [
  { q: 'رسبت في اختبار واحد وقلت: "أنا فاشل للأبد."', a: 'allOrNothing' },
  { q: 'عندما نسيتْ صديقتك الاتصال، افترضت أنها لا تريد صداقتك بعد الآن.', a: 'mindReading' },
  { q: 'حصلت على 95٪ وقلت: "الـ5٪ الضائعة تعني أني غبي."', a: 'mentalFilter' },
  { q: 'توقعت أن عرضك التقديمي سيفشل قبل أن يبدأ.', a: 'fortuneTelling' },
  { q: 'حققت هدفًا وقال لك مديرك "أحسنت!" فقلت: "كان حظ".', a: 'discountPositive' },
  { q: 'قال صديقك رأيًا مخالفًا ففكرت: "أنا شخص ممل."', a: 'labeling' },
  { q: 'ازدحم الطريق فصرخت: "دائمًا يحدث لي فقط!"', a: 'personalization' },
  { q: 'تخيلت أن تأخرك خمس دقائق سيجعلك مطرودًا من العمل.', a: 'catastrophizing' },
];

export default function ThinkingErrors() {
  const navigate = useNavigate();
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [score, setScore] = useState(0);
  const [show, setShow] = useState(false);

  const current = QUIZ[index];
  const correctObj = ERRORS.find((e) => e.key === current.a);

  const submit = () => {
    if (!choice) return;
    if (choice === current.a) setScore(score + 1);
    setShow(true);
  };

  const next = () => {
    setShow(false);
    setChoice('');
    setIndex((i) => (i + 1) % QUIZ.length);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fbfa] space-y-6 px-4 pb-10 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center pt-4 pb-2">
        <button onClick={() => navigate(-1)} className="flex size-10 items-center text-[#0e1b15]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
            <path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/>
          </svg>
        </button>
        <h2 className="flex-1 text-center pr-10 text-lg font-bold text-[#0e1b15]">أخطاء التفكير</h2>
      </header>
  
      {/* عرض الأخطاء */}
      <section className="space-y-4">
        {ERRORS.map((error, i) => (
          <Accordion key={i} type="single" collapsible>
            <AccordionItem value="item-1">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="space-y-2">
                <div className="flex gap-2 items-center">
                  <BookAlert className="text-[#4e9778]" />
                  <h1 className="text-lg font-semibold text-[#0e1b15]">{error.name}  <br />  </h1>
                </div>
                <div className="h-[1px] bg-[#4e9778] my-2"></div>

                <p className="text-m text-[#555 font-bold ]">{error.desc}</p>
                <br />
                {error.image && <img src={error.image} alt={error.name} className="object-cover w-60 ml-7 max-h-62 rounded-xl" />}
                <h3 className="font-bold text-[#0e1b15] pt-2">طرق التعامل:</h3>
                <ul className="list-disc pl-6 text-sm text-[#333]">
                  {error.treatment.map((step, j) => <li key={j}>{step}</li>)}
                </ul>
                {error.sources?.length > 0 && (
                  <div className="grid gap-2 mt-3">
                    <h4 className="text-sm font-bold text-[#0e1b15]">مصادر للتعلّم:</h4>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {error.sources.map((src, k) => (
                        <a
                          key={k}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 p-2 bg-[#e7f3ee] rounded-xl text-sm text-[#0e1b15]"
                        >
                          {src.type === 'video'   && <Youtube   size={16} className="text-[#e94826]" />}
                          {src.type === 'book'    && <BookOpen  size={16} className="text-[#4e9778]" />}
                          {src.type === 'article' && <BookOpen  size={16} className="text-[#4e9778]" />}
                          {src.type === 'pod'     && <Headphones size={16} className="text-[#4e9778]" />}
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
      </section>
  
      {/* اختبار الفهم */}
      <section className="space-y-4">
        <h3 className="text-xl font-bold text-[#0e1b15] pt-6">اختبر فهمك</h3>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-4 space-y-4">
            <p className="text-base font-semibold text-[#0e1b15]">{current.q}</p>
  
            <div className="space-y-2">
              {ERRORS.map((err) => (
                <Button
                  key={err.key}
                  variant="outline"
                  onClick={() => setChoice(err.key)}
                  className={`w-full text-right ${choice === err.key ? 'border-[#4e9778] bg-[#e7f3ee]' : ''}`}
                >
                  {err.name}
                </Button>
              ))}
            </div>
  
            <div className="flex gap-2 justify-between items-center">
              <Button onClick={submit} disabled={!choice}>
                تأكيد
              </Button>
              {show && (
                <Button onClick={next}>
                  التالي
                </Button>
              )}
            </div>
  
            {show && (
              <div className={`rounded-lg p-4 mt-3 ${choice === current.a ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {choice === current.a ? (
                  <div className="flex gap-2 items-center">
                    <CheckCircle2 size={20} />
                    إجابة صحيحة! {correctObj.desc}
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="flex gap-2 items-center">
                      <AlertTriangle size={20} />
                  الصحيح هو {correctObj.name}.
                    </div>
                    <p className="text-sm leading-relaxed">
                      لماذا؟ {correctObj.desc}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
      <ScrollToTopButton />
    </div>
  );
} 