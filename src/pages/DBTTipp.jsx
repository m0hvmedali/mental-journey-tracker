import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  ArrowLeft, Handshake, MessageCircleHeart, ShieldCheck,
  ThermometerSnowflake, HeartPulse, StopCircle, Lightbulb,
  RefreshCw, Eye, Check, Activity, Brain, Target, ChevronDown, 
  Leaf, BrainCog, User, Clock, Globe, BookOpen, Video, Building, Users, FileText,
  GraduationCap
} from 'lucide-react';
import Footer from "@/components/Footer";
import { Global } from 'recharts';
/* قائمة المهارات المحدثة مع التصنيفات والأمثلة ======================== */
const SKILLS = [
  // ░░ Mindfulness (اليقظة)
  {
    key: 'wise-mind',
    icon: <Brain size={18} />,
    title: 'الراشد الحكيم',
    group: 'اليقظة',
    category: 'Mindfulness',
    desc: 'دمج العقل المنطقي والعاطفي لاتخاذ قرار متوازن.',
    steps: [
      'توقف، خُذ نفس بطيء، لاحظ أفكارك ومشاعرك.',
      'اسأل: «ما الذي يقوله المنطق؟ وما الذي يقوله القلب؟»',
      'اختر تصرفاً يشرّف كلا الجانبين.',
      'تذكر دائما التوازن هو الحل'
    ],
    examples: [
      "السيناريو 1: سارة تشعر بالغضب لأن صديقتها ألغت موعد الغداء. بدلاً من الرد بغضب، توقفت، تنفست، وسألت نفسها: العقل المنطقي يقول: «ربما لديها ظرف طارئ»، والعاطفي يقول: «أشعر بالإهمال». اختارت أن ترسل رسالة: «أتفهم ظروفك، لكن الموعد كان مهماً لي».",
      "السيناريو 2: أحمد يشعر بالقلق قبل مقابلة عمل. جمع بين التفكير المنطقي («لدي المؤهلات المطلوبة») والمشاعر («أشعر بالتوتر الطبيعي»). اتخذ قراراً متوازناً: الاستعداد الجيد مع قبول مشاعره."
    ]
  },
  {
    key: 'observe-describe-participate',
    icon: <Eye size={18} />,
    title: 'لاحظ • صف • شارك',
    group: 'اليقظة',
    category: 'Mindfulness',
    desc: 'لاحظ دون حكم، صف بلغة الواقع، شارك بكامل وجودك.',
    steps: [
      'لاحِظ الحواس/الأفكار بدون تعليق.',
      'صف ما يحدث بعبارات "أرى/أسمع/أشعر".',
      'اندمج فى اللحظة؛ افعل شيئاً واحداً فقط. دون تشتيت'
    ],
    examples: [
      "السيناريو 1: علي يشعر بالتوتر قبل الامتحان. لاحظ: «أشعر بضربات قلبي السريعة»، وصف: «هذا توتر طبيعي بسبب الامتحان»، ثم شارك بالتركيز الكامل على الأسئلة دون تشتيت.",
      "السيناريو 2: لمياء تشعر بالغضب في زحمة المرور. لاحظت: «يدي تضغط على المقود»، وصفت: «أشعر بتوتر في كتفي»، ثم شاركت بالاستماع لأغنية مريحة والتركيز على القيادة."
    ]
  },
  {
    key: 'what-skill',
    icon: <Target size={18} />,
    title: 'What Skill',
    group: 'اليقظة',
    category: 'Mindfulness',
    desc: 'المراقبة والوصف والمشاركة في اللحظة الحالية.',
    steps: [
      'راقب الأحداث والمشاعر والأفكار دون إنهائها مبكراً',
      'صف الأحداث، حدد المشاعر، تعرف على الأفكار',
      'شارك كلياً في نشاط اللحظة الحالية'
    ],
    examples: [
      "السيناريو 1: أثناء نزهة في الحديقة، ركز سامي على مراقبة الأشجار (المراقبة)، وصف ألوان الأزهار (الوصف)، ثم شارك باللعب مع أطفاله دون التفكير في العمل (المشاركة).",
      "السيناريو 2: عند شعورها بالقلق، راقبت سلمى أفكارها دون إيقافها، وصفت مشاعرها: «أشعر بضيق في صدري»، ثم شاركت في قراءة كتابها المفضل بكامل تركيزها."
    ]
  },
  {
    key: 'how-skill',
    icon: <Check size={18} />,
    title: 'How Skill',
    group: 'اليقظة',
    category: 'Mindfulness',
    desc: 'الموقف غير القضائي، التركيز على الحاضر والفعالية.',
    steps: [
      'تجنب الحكم على الأشياء بأنها جيدة أو سيئة',
      'ركز على المهمة الحالية دون تشتيت',
      'افعل ما ينفع ويركز على النتائج المرجوة'
    ],
    examples: [
      "السيناريو 1: عندما انتقد مديره عمله، تجنب محمد الحكم («هذا غير عادل»)، وركز على الحاضر («ما الذي يمكنني تحسينه الآن؟»)، واختار التصرف الفعال: طلب توضيح للتحسينات.",
      "السيناريو 2: بعد خطأ في العشاء، قالت ليلى لنفسها: «بدلاً من الحكم على نفسي بأني فاشلة، سأركز على كيفية إصلاح الأمر الآن»، فقدمت حلوى بديلة لضيوفها."
    ]
  },

  // ░░ Distress‑Tolerance (تحمل الضيق)
  {
    key: 'tipp',
    icon: <ThermometerSnowflake size={18} />,
    title: 'TIPP',
    group: 'تحمل الضيق',
    category: 'Distress Tolerance',
    desc: 'خفض شدة الانفعال سريعًا: Temperature, Intense exercise, Paced breath, Progressive relaxation.',
    steps: [
      'T: ماء بارد الوجه أو كمادات رقبة.',
      'I: تمرين عالى الشدة 60‑90 ثانية.',
      'P: تنفس 5‑5 أو Box Breathing.',
      'P: شد/إرخاء عضلى تدريجى.'
    ],
    examples: [
      "السيناريو 1: بعد شجار مع زميله، شعر خالد بنوبة غضب. غسل وجهه بالماء البارد (T)، قام بـ20 قفزة (I)، تنفس 4-7-8 (P)، ثم أرخى عضلاته تدريجياً (P). هدأ خلال 5 دقائق.",
      "السيناريو 2: نورا تشعر بالذعر قبل العرض التقديمي. وضعت كمادة باردة على رقبتها، مشت بسرعة لمدة دقيقتين، تنفست بعمق، ثم أجرت استرخاء عضلي. عادت للهدوء."
    ]
  },
  {
    key: 'stop',
    icon: <StopCircle size={18} />,
    title: 'STOP',
    group: 'تحمل الضيق',
    category: 'Distress Tolerance',
    desc: 'قاطع السلوك المندفع: Stop • Take a step back • Observe • Proceed wisely.',
    steps: [
      'توقّف فورًا عن أي تصرف تلقائي',
      'انفصل ذهنياً أو حركياً عن الموقف',
      'لاحظ الأفكار والمشاعر والجسد بموضوعية',
      'تَصرّف بحكمة ووفق أهدافك'
    ],
    examples: [
      "السيناريو 1: عندما أراد ياسر الرد بعنف على انتقاد، توقف (S)، خرج للحصول على الماء (T)، لاحظ غضبه (O)، ثم رد بهدوء: «سأفكر في ملاحظاتك» (P).",
      "السيناريو 2: قبل إرسال رسالة غاضبة لصديقتها، توقفت سارة (S)، مشيت في الغرفة (T)، لاحظت مشاعرها (O)، ثم كتبت رداً متزناً بعد ساعة (P)."
    ]
  },
  {
    key: 'accepts',
    icon: <RefreshCw size={18} />,
    title: 'ACCEPTS',
    group: 'تحمل الضيق',
    category: 'Distress Tolerance',
    desc: '7 استراتيجيات لتشتيت الانتباه عن الألم العاطفي.',
    steps: [
      'Activities: انخرط في نشاط تحبه (مشي، قراءة)',
      'Contributions: ساعد شخصاً آخر أو قدم هدية',
      'Comparisons: قارن وضعك بمن هم في ظروف أصعب',
      'Emotions: استمع لموسيقى أو شاهد فيلماً مؤثراً',
      'Pushing away: ضع المشكلة "على الرف" مؤقتاً',
      'Thoughts: اعمل أحاجي أو عدّاً ذهنياً',
      'Sensations: جرّب الإحساس بشيء قوي (ثلج، موسيقى صاخبة)'
    ],
    examples: [
      "السيناريو 1: بعد فصل من العمل، ذهب خالد للجري (A)، ساعد جاره في نقل الأثاث (C)، شاهد فيلماً كوميدياً (E)، ثم شعر بتحسن وبدأ البحث عن فرص جديدة.",
      "السيناريو 2: عند شعورها بالحزن الشديد، اتصلت سلمى بصديقة تحتاج الدعم (C)، أمسكت مكعب ثلج حتى ذاب (S)، ثم عملت أحجية الصور المقطوعة (T)."
    ]
  },
  {
    key: 'improve',
    icon: <Activity size={18} />,
    title: 'perfective',
    group: 'تحمل الضيق',
    category: 'Distress Tolerance',
    desc: 'تحويل اللحظة الصعبة إلى تجربة أكثر تحملاً.',
    steps: [
      'Imagery: تخيل مكاناً يبعث الطمأنينة',
      'Meaning: استمد معنى من الموقف',
      'Prayer: اطلب العون من قوة عليا',
      'Relaxation: مارس تمارين الاسترخاء',
      'One thing: ركّز على مهمة صغيرة واحدة',
      'Vacation: امنح نفسك استراحة قصيرة',
      'Encouragement: كرر تأكيدات إيجابية ("أنا قادر")'
    ],
    examples: [
      "السيناريو 1: أثناء انتظار نتائج الفحوصات الطبية، تخيل أحمد نفسه على شاطئ البحر (I)، ركز على تنظيف درج مكتبه (O)، وكرر: «أنا قوي وقادر على المواجهة» (E).",
      "السيناريو 2: في زحمة المرور، استمعت لموسيقى هادئة (R)، أعطت نفسها «إجازة ذهنية» لمدة 5 دقائق (V)، وكررت: «هذه لحظة مؤقتة وستمر» (E)."
    ]
  },
  {
    key: 'pros-cons',
    icon: <ChevronDown size={18} />,
    title: 'الإيجابيات والسلبيات',
    group: 'تحمل الضيق',
    category: 'Distress Tolerance',
    desc: 'موازنة إيجابيات وسلبيات تحمل الضيق.',
    steps: [
      'حدد السلوك الذي تحاول تجنبه',
      'اكتب إيجابيات وسلبيات التصرف الاندفاعي',
      'اكتب إيجابيات وسلبيات تحمل الضيق',
      'راجع القائمة عند الشعور بالرغبة في التصرف الاندفاعي'
    ],
    examples: [
      "السيناريو 1: عند رغبته في ترك العمل فجأة، كتب محمد: إيجابيات البقاء (راتب، خبرة) وسلبيات المغادرة (بطالة، ندم). ساعده ذلك على الصمود حتى تحسن الوضع.",
      "السيناريو 2: رغبة سارة في قطع علاقة أثناء خلاف، قارنت بين: إيجابيات التسرع (راحة مؤقتة) وسلبياته (ندم)، وإيجابيات التحمل (حل المشكلات) وسلبياته (ضيق مؤقت). اختارت التحمل وحلت المشكلة."
    ]
  },
  {
    key: 'radical-acceptance',
    icon: <Check size={18} />,
    title: 'القبول',
    group: 'تحمل الضيق',
    category: 'Distress Tolerance',
    desc: 'القبول الكامل للواقع كما هو.',
    steps: [
      'اعترف بالواقع دون مقاومة',
      'تذكر أن كل شيء له سبب',
      'تخلى عن المرارة واللوم',
      'ركز على ما يمكنك التحكم فيه'
    ],
    examples: [
      "السيناريو 1: بعد فشله في مشروع، قال خالد: «أقبل أن المشروع فشل، له أسبابه، بدلاً من لوم نفسي سأركز على الدروس المستفادة».",
      "السيناريو 2: عند إلغاء رحلتها، قالت لمياء: «أقبل أن هذا خارج سيطرتي، سأستغل الوقت في تعلم شيء جديد بدلاً من الغضب»."
    ]
  },

  // ░░ Emotion Regulation (تنظيم الانفعالات)
  {
    key: 'please',
    icon: <HeartPulse size={18} />,
    title: 'PLEASE',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'اعتنِ بالجسم لتقليل هشاشة المشاعر: (Physical health, Eating, Avoid mood-altering drugs, Sleep, Exercise).',
    steps: [
      'P: اتبع الخطة العلاجية',
      'L: تغذية متوازنة',
      'E: تجنب المواد المُعدلة للمزاج',
      'A: تجنب الكحول والمخدرات',
      'S: نوم 7-9 ساعات',
      'E: حركة يومية 30 دقيقة'
    ],
    examples: [
      "السيناريو 1: ياسر كان يعاني من تقلبات مزاجية. التزم بالنوم 7 ساعات (S)، مشي يومي 30 دقيقة (E)، وتجنب القهوة بعد الظهر (A). تحسن مزاجه وتركيزه بشكل ملحوظ.",
      "السيناريو 2: سارة كانت تشعر بالكآبة المستمرة. بدأت بتناول وجبات متوازنة (L)، مارست اليوجا يومياً (E)، والتزمت بمواعيد نوم منتظمة (S). تحسن مزاجها خلال أسبوعين."
    ]
  },
  {
    key: 'opposite-action',
    icon: <RefreshCw size={18} />,
    title: 'Opposite Action',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'الاستجابة المعاكسة للدافع العاطفي.',
    steps: [
      'الغضب: أظهر اللطف بدلاً من الهجوم',
      'الخوف: تقدم نحو مصدر الخوف',
      'الخجل: ارفع رأسك وتواصل بالعين',
      'الكآبة: انخرط في نشاط بدني',
      'الاشمئزاز: تقدم وتجاوز الموقف',
      'الذنب: اعتذر وأصلح الخطأ'
    ],
    examples: [
      "السيناريو 1: عندما شعرت لمياء بالخوف من التحدث في اجتماع، قامت بالفعل المعاكس: تحدثت أولاً بجملة قصيرة بدلاً من الصمت. اكتسبت ثقة تدريجياً.",
      "السيناريو 2: عند غضبه من زميله، اختار خالد الفعل المعاكس: قدم له كوب قهوة بدلاً من الصراخ. تحول الموقف إلى محادثة بناءة."
    ]
  },
  {
    key: 'abc-please',
    icon: <HeartPulse size={18} />,
    title: 'ABC PLEASE',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'تقليل الضعف العاطفي عبر بناء المشاعر الإيجابية.',
    steps: [
      'A: تراكم المشاعر الإيجابية',
      'B: بناء الإتقان في أنشطة ممتعة',
      'C: التكيف المسبق بالاستعداد للمواقف الصعبة',
      'PLEASE: العناية بالجسد كما في مهارة PLEASE'
    ],
    examples: [
      "السيناريو 1: محمد بدأ يومه بقراءة شيء إيجابي (A)، تعلم وصفة طهي جديدة (B)، جهز ملابس العمل ليلاً (C)، ونظم نومه (PLEASE). أصبحت أيامه أكثر إيجابية.",
      "السيناريو 2: سارة تخصص 10 دقائق يومياً لكتابة الأشياء الجميلة (A)، تتعلم العزف على البيانو (B)، وتجهز حقيبة الطوارئ للاجتماعات الصعبة (C). قل توترها بشكل ملحوظ."
    ]
  },
  {
    key: 'problem-solving',
    icon: <Lightbulb size={18} />,
    title: 'حل المشكلات',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'حل المشكلات عبر 6 خطوات منهجية.',
    steps: [
      'حدد المشكلة (من، ماذا، متى، أين، لماذا)',
      'حدد تأثيرها على أهدافك',
      'اقترح 3 بدائل على الأقل',
      'قيم عواقب كل بديل',
      'نفذ الخطوات بجدول زمني',
      'راجع النتائج وعدل الخطة'
    ],
    examples: [
      "السيناريو 1: عند تأخر موظفيه، حدد علي المشكلة: «التأخر يقلل الإنتاجية». اقترح حلولاً: مرونة الدخول، حوافز الحضور، اجتماع توعوي. اختار الحوافز وحلت المشكلة.",
      "السيناريو 2: مشكلة: «تأخر الأبناء عن موعد النوم». حددت الأم تأثيرها: «تعب صباحي». الحلول: روتين ما قبل النوم، تقليل السكريات مساءً، تشجيع المشاركة. طبقت الروتين بفعالية."
    ]
  },
  {
    key: 'build-mastery',
    icon: <Activity size={18} />,
    title: 'Build Mastery',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'بناء الكفاءة عبر ممارسة الأنشطة الممتعة.',
    steps: [
      'اختر نشاطاً تستمتع به (طبخ، قراءة، موسيقى)',
      'تعلم قدر المستطاع عن الموضوع',
      'مارس بانتظام وتقبل الأخطاء',
      'اعترف بإنجازاتك يومياً'
    ],
    examples: [
      "السيناريو 1: سارة اختارت تعلم الخياطة. بدأت بمشاريع بسيطة، تقبلت أخطاءها الأولى، والآن تصنع ملابس لنفسها وتشعر بالفخر بإنجازاتها.",
      "السيناريو 2: خالد بدأ بممارسة الرسم 20 دقيقة يومياً. بدأ بنسخ صور بسيطة، ثم طور أسلوبه الخاص. أصبح الرسم مصدراً للثقة والاسترخاء."
    ]
  },
  {
    key: 'cope-ahead',
    icon: <Target size={18} />,
    title: 'الاستعداد المسبق',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'الاستعداد المسبق للمواقف الصعبة.',
    steps: [
      'صف الموقف المتوقع والمشاعر المحتملة',
      'حدد مهارات التكيف التي ستستخدمها',
      'تخيل الموقع بوضوح',
      'تدرّب على التكيف الفعال في ذهنك',
      'مارس الاسترخاء بعد التمرين'
    ],
    examples: [
      "السيناريو 1: قبل مقابلة عمل، تخيل أحمد الأسئلة الصعبة (مثل «لماذا تركت وظيفتك السابقة؟»)، تدرب على الإجابة، واستخدم تنفس 4-7-8 قبل الدخول. ساعده ذلك على الظهور بثقة.",
      "السيناريو 2: سارة تتوقع جدالاً في اجتماع العائلة. حددت مسبقاً: «سأستخدم مهارة STOP إذا شعرت بالغضب». تخيلت نفسها تتنفس وتستمع بفعالية. نجحت في تجنب الصدام."
    ]
  },
  {
    key: 'positive-self-talk',
    icon: <MessageCircleHeart size={18} />,
    title: 'Positive Self-Talk',
    group: 'تنظيم الانفعالات',
    category: 'Emotion Regulation',
    desc: 'بناء الحديث الذاتي الإيجابي.',
    steps: [
      'حدد الأفكار السلبية التلقائية',
      'استبدلها بأفكار إيجابية واقعية',
      'كرر التأكيدات الإيجابية يومياً',
      'استلهم من تجارب الناجحين'
    ],
    examples: [
      "السيناريو 1: عند فشله في اختبار، استبدل خالد «أنا غبي» بـ«هذه فرصة لأتعلم من أخطائي». كرر: «أنا قادر على التحسن مع الممارسة».",
      "السيناريو 2: سارة كانت تقول: «لا أحد يحبني». استبدلتها بـ«لدي أصدقاء مقربون يقدرونني». بدأت يومها بثلاث عبارات إيجابية عن نفسها."
    ]
  },

  // ░░ Interpersonal Effectiveness (الفعالية الشخصية)
  {
    key: 'dear-man',
    icon: <MessageCircleHeart size={18} />,
    title: 'DEAR MAN',
    group: 'الفعالية الشخصية',
    category: 'Interpersonal',
    desc: 'طلب/رفض بفعالية: Describe • Express • Assert • Reinforce • Mindful • Appear confident • Negotiate.',
    steps: [
      'D: صف الوقائع باختصار.',
      'E: عبر عن شعورك.',
      'A: اطلب بوضوح ("أريد...").',
      'R: عزز (وضح الفائدة للطرف).',
      'M: ابق يقظًا لهدفك، كرّر.',
      'A: لغة جسد واثقة.',
      'N: ابحث عن حل وسط.'
    ],
    examples: [
      "السيناريو 1: ريم تريد زيادة راتبها: وصفت إنجازاتها (D)، عبرت عن شعورها بالتقدير (E)، طلبت زيادة 10% (A)، وضحت أن هذا سيزيد إنتاجها (R)، حافظت على ثباتها (M)، ووافقت على زيادة 7% كحل وسط (N).",
      "السيناريو 2: عند رغبته في إجازة، قال خالد لمديره: «أكملت 3 مشاريع قبل موعدها (D)، أشعر بالإنهاك (E)، أريد إجازة 3 أيام (A)، سأعود بنشاط أكبر (R)». وافق المدير بعد مناقشة."
    ]
  },
  {
    key: 'give',
    icon: <Handshake size={18} />,
    title: 'GIVE',
    group: 'الفعالية الشخصية',
    category: 'Interpersonal',
    desc: 'الحفاظ على العلاقة: Gentle • Interested • Validate • Easy manner.',
    steps: [
      'G: كن لطيفًا، امتنع عن تهكّم.',
      'I: أظهر اهتمامًا (استمع، انظر).',
      'V: صحّح مشاعرهم ("أتفهم أنك...").',
      'E: أسلوب هادئ/مرح عند اللزوم.'
    ],
    examples: [
      "السيناريو 1: عند اختلاف أحمد مع صديقه: تحدث بلطف (G)، استمع باهتمام (I)، قال: «أتفهم غضبك» (V)، وأضفى جوًا مرحًا (E). حافظ على الصداقة رغم الخلاف.",
      "السيناريو 2: سارة اختلفت مع زميلتها في العمل: استخدمت نبرة لطيفة (G)، سألت عن وجهة نظرها (I)، أكدت فهمها لقلقها (V)، واختتمت الحديث بابتسامة (E)."
    ]
  },
  {
    key: 'fast',
    icon: <ShieldCheck size={18} />,
    title: 'FAST',
    group: 'الفعالية الشخصية',
    category: 'Interpersonal',
    desc: 'حماية احترامك لذاتك: Fair • Apology free • Stick to values • Truthful.',
    steps: [
      'F: كن منصفًا لك ولهم.',
      'A: لا تعتذر عن الوجود أو الشعور.',
      'S: تمسّك بقيمك (قل "لا" إن لزم).',
      'T: كن صادقًا، لا تبالغ.'
    ],
    examples: [
      "السيناريو 1: عندما طلب منه صديقه قرضاً للمرة الثالثة، قال خالد: «أشعر أن الإقراض المتكرر يضر صداقتنا (F)، لا أستطيع المساعدة هذه المرة (S)، لكني سأساعدك في البحث عن حلول أخرى (T)».",
      "السيناريو 2: رفضت سارة العمل الإضافي في عطلة نهاية الأسبوع: «هذا غير منصف للموظفين (F)، أحتاج هذا الوقت لعائلتي (S)، لكني مستعدة لمناقشة حلول أخرى (T)»."
    ]
  },
  {
    key: 'boundary-building',
    icon: <ShieldCheck size={18} />,
    title: 'بناء الحدود',
    group: 'الفعالية الشخصية',
    category: 'Interpersonal',
    desc: 'وضع حدود صحية وحمايتها.',
    steps: [
      'حدد ما هو مقبول وغير مقبول بالنسبة لك',
      'تواصل بوضوح عند اختراق الحدود',
      'احترم حدود الآخرين كما تحترم حدودك',
      'تفاوض بلطف عند الحاجة'
    ],
    examples: [
      "السيناريو 1: ليلى حددت أن الاتصال بعد الساعة 10 مساءً غير مقبول. عندما اتصلت صديقتها في 11 مساءً، قالت: «أقدر اتصالك، لكن هاتفي صامت بعد العاشرة، نتحدث غداً؟».",
      "السيناريو 2: خالد أوضح لزملائه: «لا أرد على رسائل العمل في عطلات نهاية الأسبوع إلا للطوارئ». احترموا حدوده بعد أن شرح أهمية وقت الراحة."
    ]
  }
];

const sources = [
  // كتب
  { 
    label: "دليل تدريب مهارات العلاج الجدلي السلوكي (عربي)", 
    url: "https://dbt-mena.com/ar/", 
    icon: <BookOpen size={14} /> 
  },
  { 
    label: "العلاج المعرفي السلوكي لاضطراب الشخصية الحدية", 
    url: "https://dbt-mena.com/ar/", 
    icon: <BookOpen size={14} /> 
  },
  { 
    label: "Building a Life Worth Living - Marsha Linehan", 
    url: "https://www.guilford.com/books/Building-a-Life-Worth-Living/Marsha-Linehan/9780812994612", 
    icon: <BookOpen size={14} /> 
  },
  
  // فيديوهات
  { 
    label: "قناة DBT-RU (Rutgers University)", 
    url: "https://www.youtube.com/@DBTSkillsTraining", 
    icon: <Video size={14} /> 
  },
  { 
    label: "فيديوهات مهارات DBT (Ontario Shores)", 
    url: "https://www.ontarioshores.ca/dbt-videos-module", 
    icon: <Video size={14} /> 
  },
  
  // مواقع تعليمية
  { 
    label: "DBT Self Help (المرجع الرئيسي)", 
    url: "https://dialecticalbehaviortherapy.com", 
    icon: <Globe size={14} /> 
  },
  { 
    label: "APA - American Psychological Association", 
    url: "https://www.apa.org", 
    icon: <Globe size={14} /> 
  },
  { 
    label: "Therapist Aid (أوراق عمل)", 
    url: "https://www.therapistaid.com", 
    icon: <FileText size={14} /> 
  },
  
  // منظمات وشركات
  { 
    label: "DBT MENA (الشرق الأوسط)", 
    url: "https://dbt-mena.com/ar/", 
    icon: <Building size={14} /> 
  },
  { 
    label: "DBT Labs (تدريب مهني)", 
    url: "https://www.getdbt.com/dbt-learn", 
    icon: <GraduationCap size={14} /> 
  },
  { 
    label: "Treatment Implementation Collaborative", 
    url: "https://www.ticllc.org", 
    icon: <Users size={14} /> 
  },
  
  // مراجع إضافية
  { 
    label: "NHS - Cognitive Behavioral Therapy Guide", 
    url: "https://www.nhs.uk", 
    icon: <Globe size={14} /> 
  },
  { 
    label: "المعهد الوطني للصحة النفسية (NIMH)", 
    url: "https://www.nimh.nih.gov", 
    icon: <Building size={14} /> 
  }
];
/* ============================ Component ============================ */
export default function DBTSkills() {
  const nav = useNavigate();
  const [open, setOpen] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'الكل', icon: <Target size={16} /> },
    { id: 'Mindfulness', label: 'اليقظة', icon: <Leaf size={16} /> },
    { id: 'Distress Tolerance', label: 'تحمل الضيق', icon: <BrainCog size={16} /> },
    { id: 'Emotion Regulation', label: 'تنظيم الانفعالات', icon: <User size={16} /> },
    { id: 'Interpersonal', label: 'الفعالية الشخصية', icon: <Activity size={16} /> }
  ];

  // تصفية المهارات حسب التصنيف المحدد
  const filteredSkills = selectedCategory === 'all' 
    ? SKILLS 
    : SKILLS.filter(skill => skill.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-[#f5fbf8]" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center p-4 bg-white shadow-sm">
        <button 
          onClick={() => nav(-1)} 
          className="flex items-center justify-center w-10 h-10 rounded-full "
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1 flex flex-col items-center">
          <h2 className="text-xl font-bold text-[#0e1b15]">مركز مهارات DBT</h2>
          <p className="text-xs text-[#5a8c76]">أدوات عملية لتحسين صحتك النفسية</p>
        </div>
      </header>

      {/* Introduction */}
      <div className="p-4 bg-white">
        <p className="text-sm text-[#374151] text-center">
          اختر التصنيف أو المهارة المناسبة لحالتك الحالية. هذه المهارات تساعدك على:
        </p>
        <div className="grid grid-cols-2 gap-2 mt-3">
          <div className="flex items-center bg-[#f0f9f4] p-2 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <Leaf size={14} className="text-[#4e9778]" />
            </div>
            <span className="text-xs text-[#374151]">إدارة المشاعر</span>
          </div>
          <div className="flex items-center bg-[#f0f9f4] p-2 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <BrainCog size={14} className="text-[#4e9778]" />
            </div>
            <span className="text-xs text-[#374151]">تحمل الضغوط</span>
          </div>
          <div className="flex items-center bg-[#f0f9f4] p-2 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <User size={14} className="text-[#4e9778]" />
            </div>
            <span className="text-xs text-[#374151]">تحسين العلاقات</span>
          </div>
          <div className="flex items-center bg-[#f0f9f4] p-2 rounded-xl">
            <div className="w-6 h-6 rounded-full bg-[#e7f3ee] flex items-center justify-center mr-2">
              <Clock size={14} className="text-[#4e9778]" />
            </div>
            <span className="text-xs text-[#374151]">زيادة الوعي</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 bg-[#e0f0e9]">
        <h3 className="font-medium text-[#0e1b15] mb-2">التصنيفات:</h3>
        <div className="flex overflow-x-auto pb-2 space-x-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center px-3 py-1.5 rounded-xl whitespace-nowrap text-sm ${
                selectedCategory === cat.id 
                  ? 'bg-[#4e9778] text-white' 
                  : 'bg-white text-[#374151] border border-[#e0eae5]'
              }`}
            >
              <span className="mr-1">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {filteredSkills.map((s, i) => (
          <section 
            key={s.key} 
            className="border border-[#e3e8e6] rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex justify-between items-center px-4 py-3 text-right"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 flex items-center justify-center rounded-lg bg-[#e9f1ee] text-[#0e8a5f]">
                  {s.icon}
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#0e1b15]">{s.title}</p>
                  <p className="text-xs text-[#5a8c76]">{s.group} • {s.desc}</p>
                </div>
              </div>
              <svg 
                className={`transition-transform ${open === i ? 'rotate-180' : ''}`} 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#4e9778" 
                strokeWidth="2"
              >
                <path d="M6 9l6 6 6-6"/>
              </svg>
            </button>

            {open === i && (
              <div className="px-4 pb-4 text-sm text-[#374151] bg-[#f9fbfa] border-t border-[#e3e8e6]">
                <h4 className="font-bold text-[#0e1b15] mb-2 pt-2">خطوات التطبيق:</h4>
                <ul className="space-y-2 pl-2">
                  {s.steps.map((st, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span>{st}</span>
                    </li>
                  ))}
                </ul>
                
                <h4 className="font-bold text-[#0e1b15] mb-2 pt-4">أمثلة تطبيقية:</h4>
                <div className="space-y-3">
                  {s.examples.map((ex, idx) => (
                    <div key={idx} className="bg-[#f0f9f4] p-3 rounded-lg">
                      <p className="text-[#0e1b15] font-medium">مثال {idx+1}:</p>
                      <p>{ex}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        ))}
      </main>

      {/* Footer Tips */}
      <div className="p-4 bg-[#e7f3ee] border-t border-[#d9e8e1]">
        <h3 className="font-bold text-[#0e1b15] mb-2 flex items-center">
          <Lightbulb size={18} className="mr-2 text-[#4e9778]" /> نصائح تطبيقية
        </h3>
        <ul className="text-sm text-[#374151] space-y-1 pl-2">
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
            <span>اختر مهارة واحدة يومياً ومارسها في مواقف حياتك</span>
          </li>
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
            <span>سجل ملاحظاتك عن تأثير المهارة في مفكرة يومية</span>
          </li>
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
            <span>ابدأ بالمهارات البسيطة قبل التقدم للصعبة</span>
          </li>
          <li className="flex items-start">
            <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
            <span>اطلب الدعم من معالج أو مجموعة دعم عند الحاجة</span>
          </li>
        </ul>
      </div>
      <Footer sources={sources} />

    </div>
  );
}