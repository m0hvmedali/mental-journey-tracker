import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Search, ChevronDown, ChevronUp } from 'lucide-react';
import Footer from "@/components/Footer";

// 24 DBT SKILLS DATA
const DBT_SKILLS = [
  // ==================== الجزء الأول: وحدة مهارات اليقظة الذهنية (Mindfulness Skills) ====================
  {
    id: 1,
    key: 'wise-mind',
    number: 1,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية',
    title: '1. مهارة الراشد الحكيم / العقل الحكيم (Wise Mind)',
    titleEn: 'Wise Mind',
    explanation: 'يرى العلاج الجدلي السلوكي أن العقل البشري يعمل في ثلاثة حالات رئيسية:\n• العقل المنطقي (Reasonable Mind): يركز بالكامل على الحقائق والأرقام والتحليل الفكري، متجاهلاً العواطف تماماً.\n• العقل العاطفي (Emotion Mind): تهيمن عليه المشاعر والانفعالات السريعة، وتصدر القرارات بناءً على الحالة المزاجية الآنية دون اعتبار للحقائق المنطقية.\n• العقل الحكيم (Wise Mind): هو حالة التوازن والدمج المتكامل بين العقل المنطقي والعقل العاطفي. إنه يقر بوجود المشاعر ويحترمها، لكنه يعتمد في الوقت نفسه على المنطق لاتخاذ قرار متزن يحقق الفعالية والراحة النفسية العميقة.',
    exerciseTitle: 'تمرين "شهيق العقل، زفير الحكمة"',
    exerciseSteps: [
      'اجلس في مكان هادئ ومريح، واغلق عينيك بلطف.',
      'خذ شهيقاً عميقاً ببطء، وتخيل أن الهواء الداخل يحمل الهدوء والمنطق إلى عقلك. أثناء الشهيق، قل لنفسك صامتاً: "عقل".',
      'خذ زفيراً طويلاً ببطء، وتخيل أنك تطلق كل التوتر الانفعالي الزائد. أثناء الزفير، ركز انتباهك في منطقة مركز جسدك (خلف السرة أو الصدر) وقل صامتاً: "حكيم".',
      'استمر في هذا التنفس لـ 5 دقائق. اطرح على نفسك في نهاية التمرين هذا السؤال بلطف: "ما هو القرار الحكيم الذي أحتاجه الآن في مشكلتي الحالية؟"، وانتظر الإجابة التي تنبع من داخلك بهدوء وصمت، دون استعجال أو تفكير مفرط.'
    ],
    promptQuestion: 'ما الموقف أو القرار الذي تحتاج لاستشارة عقلك الحكيم فيه الآن؟'
  },
  {
    id: 2,
    key: 'observe',
    number: 2,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية (ماذا تفعل؟)',
    title: '2. مهارة الملاحظة (Observe)',
    titleEn: 'Observe',
    explanation: 'تعني الملاحظة الانتباه التام والتركيز على مراقبة ما يحدث داخل العقل والجسد وخارج الكيان الشخصي في اللحظة الحالية، دون محاولة تعديله أو الهروب منه. يشبه ذلك مراقبة الأفكار والمشاعر كأنها قطار يمر أمامك أو سحاب يعبر السماء، حيث تسمح للحدث بالدخول إلى وعيك والمغادرة بحرية دون الاندماج فيه.',
    exerciseTitle: 'تمرين "ملاحظة تفاصيل الغرض الخارجي"',
    exerciseSteps: [
      'اختر غرضاً مادياً بسيطاً أمامك ليس له أي ارتباط عاطفي أو مواقف سابقة بذاكرتك (مثل: قلم، حجر صغير، كوب ماء فارغ).',
      'اضبط مؤقتاً لهاتفك على 5 دقائق، وركز بصرك ووعيك بالكامل على هذا الغرض.',
      'لاحظ شكله، خطوطه، انحناءاته، ألوانه، ملمسه، ووزنه.',
      'عندما تشعر بالملل أو يهرب عقلك للتفكير في مشكلات أخرى (وهذا طبيعي جداً)، لاحظ ذلك بلطف وبدون لوم، وأعد تركيزك مباشرة إلى تأمل الغرض المادي. هذا التمرين يعيد بناء "عضلة التركيز" في الدماغ.'
    ],
    promptQuestion: 'ما الغرض المادي الذي اخترته لممارسه مهارة الملاحظة؟ وما التفاصيل الجديدة التي لاحظتها؟'
  },
  {
    id: 3,
    key: 'describe',
    number: 3,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية (ماذا تفعل؟)',
    title: '3. مهارة الوصف (Describe)',
    titleEn: 'Describe',
    explanation: 'تعني تسمية ما تلاحظه والتعبير عنه بكلمات موضوعية مبنية على الواقع الصرف والبيانات الحسية، دون تفسيرات مبالغ فيها أو تضخيم عاطفي. تساعد هذه المهارة على فصل المشاعر عن الأفكار والسلوكيات، مما يمنع انغماس الفرد في مشاعره أو الترجمة الخاطئة للأفكار كأنها حقائق مطلقة.',
    exerciseTitle: 'تمرين "فصل الفكرة عن الشعور"',
    exerciseSteps: [
      'فكر في موقف بسيط ضايقك اليوم.',
      'ارسم جدولاً من ثلاثة أعمدة واكتب فيه ما يلي بوعي تام:\n - العمود الأول (الحقائق والأحداث الحسية): اكتب ما حدث بالضبط بلغة الكاميرا الفوتوغرافية (مثال: "اتصلت بـ صديقي ولم يرد على الهاتف"، بدلاً من "هو يتجاهلني").\n - العمود الثاني (الأفكار): اكتب ما يدور بعقلك (مثال: "أتتني فكرة تقول إنني لست مهماً بالنسبة له").\n - العمود الثالث (المشاعر والأحاسيس الجسدية): حدد عاطفتك بدقة (مثال: "أشعر بالحزن، وهناك انقباض خفيف في صدري").',
      'لاحظ كيف تتراجع حدة الألم العاطفي بمجرد تجريد الأحداث من التفسيرات والافتراضات غير الحقيقية.'
    ],
    promptQuestion: 'اكتب الموقف ووصّفه بلغة الكاميرا والمشاعر الدقيقة هنا:'
  },
  {
    id: 4,
    key: 'participate',
    number: 4,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية (ماذا تفعل؟)',
    title: '4. مهارة المشاركة (Participate)',
    titleEn: 'Participate',
    explanation: 'تعني الانغماس الكامل وبكامل الوجود والوعي في النشاط الحالي الذي تقوم به في اللحظة الراهنة، مع إلغاء حالة التشتت الذاتي أو التفكير المزدوج. عندما تشارك، فإنك تتخلى عن وعيك بالذات وتصبح "واحداً" مع التجربة (مثل العزف، أو تناول الطعام، أو التحدث مع شخص بإنصات كامل).',
    exerciseTitle: 'تمرين "مشاركة غسل الأطباق بوعي"',
    exerciseSteps: [
      'في المرة القادمة التي تقوم فيها بغسل الأطباق أو إعداد القهوة، لا تسمح لعقلك بالتفكير في الماضي أو المستقبل.',
      'انغمس في النشاط بكل حواسك: اشعر بدفء الماء أو برودته على يديك، واسمع صوت تدفق المياه ورغوة الصابون، ولاحظ لمعان الكوب بعد تنظيفه.',
      'إذا شرد عقلك، قل له بلطف: "أنا الآن أقوم بغسل الأطباق فقط"، وأعد كامل انتباهك لحركة يديك حتى تنتهي تماماً من العمل.'
    ],
    promptQuestion: 'ما النشاط اليومي البسيط الذي ستنغمس فيه بكامل حواسك اليوم؟'
  },
  {
    id: 5,
    key: 'non-judgmentally',
    number: 5,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية (كيف تفعل؟)',
    title: '5. مهارة الموقف غير القضائي / دون حكم (Non-judgmentally)',
    titleEn: 'Non-judgmentally',
    explanation: 'تعني عدم تصنيف الأشخاص أو المواقف أو الذات تحت ثنائيات متطرفة مثل "جيد وسيء" أو "عدل وظلم" أو "ناجح وفاشل". إصدار الأحكام التلقائية يقتل الاحتمالات، ويضخم المعاناة والألم العاطفي دون داعٍ. الموقف غير القضائي يستبدل الأحكام بالحقائق والاعتراف بالواقع كما هو.',
    exerciseTitle: 'تمرين "تجريد الأحكام القاسية"',
    exerciseSteps: [
      'اكتب حكماً قاسياً أطلقته مؤخراً على نفسك أو على الآخرين (مثال: "أنا شخص غبي وفاشل لأنني أخطأت في العرض التقديمي").',
      'أعد صياغة الجملة مستبعداً كل كلمات الأحكام والقيم، واكتب فقط الحقائق الواقعية:\n - الحكم الأول: "أنا غبي وفاشل".\n - الحقائق الواقعية البديلة: "لقد نسيت ذكر نقطتين أساسيتين أثناء العرض التقديمي اليوم، وشعرت بالإحراج والتوتر، لكني قدمت بقية النقاط بوضوح".',
      'لاحظ كيف أن الصياغة الثانية الخالية من الأحكام تمنحك فرصة للتعلم والتطوير، بدلاً من الدخول في نوبة إحباط وجلد للذات.'
    ],
    promptQuestion: 'اكتب حكماً أطلقته مؤخراً، ثم استبدله بـ حقائق مجردة:'
  },
  {
    id: 6,
    key: 'one-mindfully',
    number: 6,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية (كيف تفعل؟)',
    title: '6. مهارة التركيز على الحاضر / وعي تام بمهمة واحدة (One-mindfully)',
    titleEn: 'One-mindfully',
    explanation: 'تعني القيام بشيء واحد فقط في اللحظة الحالية بتركيز مطلق وتوجيه كامل الانتباه له. مكافحة التشتت التكنولوجي والقيام بمهام متعددة (Multitasking) ضروري جداً لتقليل القلق والتوتر الذهني الناتج عن تشتت الطاقة العقلية.',
    exerciseTitle: 'تمرين "دقيقة التركيز السمعي"',
    exerciseSteps: [
      'أغمض عينيك أينما كنت واضبط المؤقت على دقيقة واحدة.',
      'ركز وعيك بالكامل على الأصوات المحيطة بك فقط. حاول عزل وتحديد أكبر عدد ممكن من الأصوات الفردية (مثال: طنين المكيف، صوت سيارة بعيدة، دقات الساعة، صوت تنفسك).',
      'لا تصدر حكماً على الأصوات (مثال: هذا صوت مزعج)، بل لاحظ الترددات والاتجاهات التي تأتي منها بتركيز مطلق.'
    ],
    promptQuestion: 'كم صوتاً مختلفاً استطعت عزله خلال دقيقة التركيز السمعي؟'
  },
  {
    id: 7,
    key: 'effectively',
    number: 7,
    module: 'mindfulness',
    moduleTitle: 'وحدة مهارات اليقظة الذهنية',
    moduleBadge: 'اليقظة الذهنية (كيف تفعل؟)',
    title: '7. مهارة الفعالية (Effectively)',
    titleEn: 'Effectively',
    explanation: 'تعني التركيز على القيام بما هو "مفيد وفعّال" لتحقيق أهدافك الحقيقية في الموقف الحالي، بدلاً من الانشغال بـ من هو "على حق" أو "على خطأ". الفعالية تتطلب التخلي عن الرغبة في الانتقام أو العناد أو إثبات وجهة النظر الشخصية إذا كان ذلك سيعوق الوصول للهدف الأكبر أو يضر العلاقات.',
    exerciseTitle: 'تمرين "اختيار الفعالية مقابل الانتصار الذاتي"',
    exerciseSteps: [
      'تذكر خلافاً سابقاً مع شخص مقرب، حيث كنت تصر بعناد على إثبات أنك "على حق" مما أدى لتفاقم المشكلة.',
      'اسأل نفسك الأسئلة التالية بصدق منطقي:\n 1. ماذا كان هدفي الحقيقي من هذا التواصل على المدى الطويل؟ (مثال: الحفاظ على الود والاحترام المتبادل).\n 2. هل أسلوبي وإصراري على الصواب حقق هذا الهدف؟ (الإجابة غالباً: لا).\n 3. ما هو السلوك الفعال الذي كان يمكنني اتخاذه لتحقيق الهدف الحقيقي والعملي حتى لو تطلب الأمر التنازل عن الانتصار اللفظي المؤقت؟'
    ],
    promptQuestion: 'ما السلوك الفعال الذي يمكنك اتخاذه اليوم لحل خلافك دون الانشغال بإثبات من على حق؟'
  },

  // ==================== الجزء الثاني: وحدة مهارات تحمل الضيق والضغط (Distress Tolerance Skills) ====================
  {
    id: 8,
    key: 'stop-skill',
    number: 8,
    module: 'distress',
    moduleTitle: 'وحدة مهارات تحمل الضيق والضغط',
    moduleBadge: 'تحمل الضيق',
    title: '8. مهارة قاطع السلوك المندفع (STOP Skill)',
    titleEn: 'STOP Skill',
    explanation: 'هي مهارة ذهنية حاسمة تُستخدم لفرملة ردود الأفعال الاندفاعية التلقائية وحماية النفس من اتخاذ قرارات تندم عليها لاحقاً. يتكون الاختصار من أربع خطوات رئيسية:\n• S (Stop / توقف): تجمد فوراً ولا تتخذ أي خطوة أو تقل أي كلمة.\n• T (Take a step back / تراجع خطوة للخلف): خذ مسافة مادية أو معنوية من الموقف وتنفس بعمق.\n• O (Observe / لاحظ): راقب الموقف من الخارج بعين المحايد واجمع الحقائق.\n• P (Proceed wisely / تصرف بحكمة): اسأل عقلك الحكيم عن التصرف الأكثر فعالية والأنسب لإنهاء الأزمة.',
    exerciseTitle: 'تمرين "تطبيق بروفة STOP الذهنية"',
    exerciseSteps: [
      'تخيل سيناريو يثير غضبك الشديد (مثال: شخص يوجه لك انتقاداً حاداً وغير عادل أمام زملائك).',
      'تخيل نفسك تمر بالخطوات الأربع ببطء:\n - S: تخيل عقلك يقول بصوت عالٍ: توقف! واشعر بجسدك يتصلب دون حراك.\n - T: تخيل نفسك تأخذ نفساً عميقاً وتتراجع بوعيك خطوة للوراء.\n - O: لاحظ ضربات قلبك السريعة وتعرف عليها: "أنا أشعر بالتهديد والغضب الشديد الآن".\n - P: تخيل نفسك تسأل عقلك الحكيم عن الرد الأكثر هدوءاً وقوة (مثال: "سأناقش هذا الأمر معك على انفراد لاحقاً عندما نهدأ").'
    ],
    promptQuestion: 'اكتب الرد الحكيم المستقبلي الذي ستستحضر مهارة STOP لتطبيقه عند اللزوم:'
  },
  {
    id: 9,
    key: 'tipp-skill',
    number: 9,
    module: 'distress',
    moduleTitle: 'وحدة مهارات تحمل الضيق والضغط',
    moduleBadge: 'تحمل الضيق (إطفاء الأزمات)',
    title: '9. مهارة خفض شدة الانفعال سريعاً (TIPP Skill)',
    titleEn: 'TIPP Skill',
    explanation: 'عندما تصل حدة الانفعال لدرجة تمنع العقل من التفكير ويصبح الشخص على وشك الانفجار، يجب التدخل جسدياً لتهدئة الجهاز العصبي اللاإرادي عبر TIPP:\n• T (Temperature / درجة الحرارة): غسل الوجه بماء بارد جداً أو وضع ثلج على الوجنتين لـ 30 ثانية لتفعيل منعكس الغوص الذي يخفض ضربات القلب فوراً.\n• I (Intense exercise / التمرين المكثف السريع): ممارسة نشاط بدني قوي ولفترة قصيرة (قفز، جري سريع) لتصريف طاقة الأدرينالين.\n• P (Paced breath / التنفس المنظم): إطالة مدة الزفير عن الشهيق (شهيق 4 عدات، زفير 8 عدات).\n• P (Progressive relaxation / الاسترخاء العضلي التدريجي): شد وإرخاء عضلات الجسد للتخلص من التوتر.',
    exerciseTitle: 'تمرين "تطبيق التنفس بطيء الإيقاع والاسترخاء"',
    exerciseSteps: [
      'اجلس مفرود الظهر واسترخِ تماماً.',
      'خذ شهيقاً عميقاً من أنفك متخيلاً امتلاء بطنك بالهواء لـ 4 ثوانٍ.',
      'احبس نفسك لثانيتين.',
      'أخرج الزفير ببطء شديد من فمك كأنك تنفخ شمعة برفق لـ 8 ثوانٍ كاملة.',
      'كرر هذا الإيقاع 5 مرات متتالية، ولاحظ الانخفاض التلقائي الملحوظ في ضربات قلبك وتوترك.'
    ],
    promptQuestion: 'كيف شعرت بجسدك بعد إتمام الـ 5 دورات تنفسية بطيئة؟'
  },
  {
    id: 10,
    key: 'accepts-skill',
    number: 10,
    module: 'distress',
    moduleTitle: 'وحدة مهارات تحمل الضيق والضغط',
    moduleBadge: 'تحمل الضيق',
    title: '10. مهارة تشتيت الانتباه عن الألم العاطفي (ACCEPTS Skill)',
    titleEn: 'ACCEPTS Skill',
    explanation: 'تهدف لتوجيه طاقتك العقلية بعيداً عن الألم العاطفي مؤقتاً لتجنب الاندفاع، عبر 7 استراتيجيات:\n• A (Activities / الأنشطة): مشي، تنظيف، حل ألغاز.\n• C (Contributing / المساهمة): فعل لطيف لشخص آخر.\n• C (Comparisons / المقارنات): التذكر بأنك تجاوزت ظروفاً أصعب سابقاً.\n• E (Emotions / المشاعر المعاكسة): الاستماع لموسيقى مبهجة أو فيلم يبعث الهدوء.\n• P (Pushing away / الابتعاد وتأجيل المشكلة): وضع المشكلة في صندوق عقلي مغلق وتأجيلها لساعتين.\n• T (Thoughts / الأفكار المشتتة): العد التنازلي من 100 بخصم 7.\n• S (Sensations / الأحاسيس الجسدية البديلة): الاستحمام بماء دافئ، الإمساك بثلج.',
    exerciseTitle: 'تمرين "تصميم خطة الطوارئ الشخصية ACCEPTS"',
    exerciseSteps: [
      'اكتب قائمة مخصصة لثلاث استراتيجيات تشتيت تناسبك تماماً وتستطيع تطبيقها فوراً عند الأزمات:\n 1. نشاطي المفضل للتشتيت (Activities)\n 2. طريقتي البسيطة للمساهمة ومساعدة غيري (Contributing)\n 3. المحتوى المعاكس لعاطفة الحزن/القلق الذي يسعدني (Emotions)'
    ],
    promptQuestion: 'اكتب خياراتك الـ 3 المحددة لخطة الطوارئ الذهنية هنا:'
  },
  {
    id: 11,
    key: 'improve-skill',
    number: 11,
    module: 'distress',
    moduleTitle: 'وحدة مهارات تحمل الضيق والضغط',
    moduleBadge: 'تحمل الضيق',
    title: '11. مهارة تحسين اللحظة الصعبة (IMPROVE Skill)',
    titleEn: 'IMPROVE Skill',
    explanation: 'تحويل اللحظات الصعبة والتجارب المؤلمة التي لا يمكن تجنبها إلى مواقف أكثر تحملاً وراحة عبر بناء بيئة ذهنية وجسدية داعمة:\n• Imagery (التخيل الإيجابي المهدئ)\n• Meaning (استخراج معنى وقيمة من المعاناة)\n• Prayer (الدعاء والاتصال بالقوة العليا)\n• Relaxation (تمارين الاسترخاء العضلي)\n• One thing (التركيز على شيء واحد صغير الآن)\n• Vacation (استراحة قصيرة مؤقتة)\n• Encouragement (الحديث الذاتي المشجع).',
    exerciseTitle: 'تمرين "بناء الملاذ الذهني الآمن"',
    exerciseSteps: [
      'أغمض عينيك وتخيل مكاناً هادئاً ومثاليًا تشعر فيه بالأمان والراحة التامة (مثال: شاطئ بحر دافئ، كوخ ريفي هادئ، أو بستان من الزهور).',
      'استخدم حواسك لتخيل المشهد بكامل تفاصيله: تخيل نسيم الهواء العليل على وجهك، ورائحة العشب والزهور، وصوت أمواج البحر الهادئة.',
      'ركز في هذا الملاذ لـ 3 دقائق، واشعر بالأمان يتسلل لجسدك. في كل مرة تقع في أزمة يومية، تنفس بعمق وتذكر هذا المكان الذهبي لتهدئة روعك والعودة لعقلك الحكيم.'
    ],
    promptQuestion: 'صف المكان الآمن الذي تتخيله في ذهنك بالتفصيل:'
  },
  {
    id: 12,
    key: 'pros-cons',
    number: 12,
    module: 'distress',
    moduleTitle: 'وحدة مهارات تحمل الضيق والضغط',
    moduleBadge: 'تحمل الضيق',
    title: '12. مهارة موازنة الإيجابيات والسلبيات (Pros and Cons)',
    titleEn: 'Pros and Cons',
    explanation: 'تساعد الشخص على اتخاذ قرار عقلاني متزن بتجنب السلوكيات الاندفاعية الضارة والخطرة (مثل إيذاء الذات، أو نوبات الغضب المدمرة، أو الإدمان) من خلال موازنة المنافع والأضرار بعيدة وقصيرة المدى لتحمل الضيق بوعي.',
    exerciseTitle: 'تمرين "مصفوفة اتخاذ القرار للاندفاع"',
    exerciseSteps: [
      'تذكر سلوكاً اندفاعياً ترغب في التخلص منه (مثال: تناول الطعام المفرط عند القلق، أو الصراخ في وجه المقربين).',
      'ارسم جدولاً رباعياً واكتب فيه بدقة:\n - المربع 1: إيجابيات الاستسلام للاندفاع (راحة مؤقتة لثوانٍ).\n - المربع 2: سلبيات الاستسلام للاندفاع (شعور بالذنب، تدمير الصحة، خسارة العلاقات).\n - المربع 3: إيجابيات مقاومة الاندفاع وتحمل الضيق (بناء احترام الذات، الثقة، جودة الحياة).\n - المربع 4: سلبيات مقاومة الاندفاع (تحمل الألم العاطفي لعدة دقائق قبل أن يتراجع).',
      'احتفظ بهذه المصفوفة واقرأها فوراً عندما تأتيك الرغبة الاندفاعية القادمة.'
    ],
    promptQuestion: 'ما السلوك الاندفاعي الذي تريد كبح شحنته، وما هي أهم فائدة لمقاومته؟'
  },
  {
    id: 13,
    key: 'radical-acceptance',
    number: 13,
    module: 'distress',
    moduleTitle: 'وحدة مهارات تحمل الضيق والضغط',
    moduleBadge: 'تحمل الضيق (جوهر التعافي)',
    title: '13. مهارة القبول الكامل للواقع / القبول الراديكالي (Radical Acceptance)',
    titleEn: 'Radical Acceptance',
    explanation: 'يعني القبول الكامل للواقع كما هو تماماً دون قيد أو شرط، ودون محاولة محاربته أو إنكاره أو الشكوى المستمرة منه. الألم في الحياة حتمي، لكن محاربة الألم وإنكار الواقع هي التي تحول الألم إلى "معاناة مستمرة" وعذاب نفسي ممتد. القبول الراديكالي لا يعني الاستسلام للظلم، بل يعني التوقف عن إهدار الطاقة العقلية في رفض الحقيقة التاريخية للأحداث، ومن ثم اتخاذ قرارات واعية للتغيير.',
    exerciseTitle: 'تمرين "تحويل المعاناة إلى قبول راديكالي"',
    exerciseSteps: [
      'فكر في واقعة مؤلمة ترفض قبولها وتسبب لك الضيق المستمر (مثال: "لقد خسرت وظيفتي أو انتهت علاقتي بشخص ما").',
      'لاحظ كيف أن الرفض اللفظي مثل: "ما كان يجب أن يحدث هذا!" أو "لماذا أنا تحديداً؟" يزيد من عذابك العاطفي.',
      'خذ نفساً عميقاً، وافتح كفوف يديك بلطف للأعلى كدليل جسدي على الاستسلام والقبول، ثم قل لنفسك بصوت مسموع ومحب: "لقد حدث هذا الأمر بالفعل. لا يمكنني تغيير الماضي. الألم موجود لكني لن أحوله لمعاناة بمحاربة الواقع. أقبل هذا الموقف راديكالياً وأركز على ما يمكنني فعله الآن". اشعر بالاسترخاء الجسدي والتخلي عن المقاومة.'
    ],
    promptQuestion: 'ما الموقف المؤلم الذي قررت منحه القبول الراديكالي اليوم لتتفرغ للتغيير؟'
  },

  // ==================== الجزء الثالث: وحدة مهارات تنظيم الانفعالات (Emotion Regulation Skills) ====================
  {
    id: 14,
    key: 'please-skill',
    number: 14,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '14. مهارة PLEASE (الاعتناء بالجسم لتقليل هشاشة المشاعر)',
    titleEn: 'PLEASE Skill',
    explanation: 'هناك ارتباط بيولوجي وثيق بين الحالة الجسدية والصحة النفسية. إذا كان الجسد مرهقاً أو جائعاً أو يعاني من اضطراب النوم، تزداد الهشاشة العاطفية ويصبح الشخص أكثر عرضة للانفجار. صُممت مهارة PLEASE لتقليل هذا الضعف العاطفي من خلال خمسة ركائز صحية:\n• PL (Physical illness / الصحة الجسدية)\n• E (Eating / الغذاء المتوازن)\n• A (Avoid mood-altering substances)\n• S (Sleep / النوم المنظم)\n• E (Exercise / الرياضة).',
    exerciseTitle: 'تمرين "تأمين ركائز الجسد الخمس"',
    exerciseSteps: [
      'راجع ليلتك الفائتة ويومك الحالي وسجل كتابة:\n 1. كم ساعة نمت؟ وهل كان النوم مريحاً؟\n 2. هل تناولت وجبات متوازنة اليوم؟\n 3. هل قمت بأي حركة بدنية بسيطة لرفع طاقتك؟',
      'لاحظ كيف أن الحفاظ على روتين صحي ثابت لـ 3 أيام يقلل بشكل مذهل من سرعة غضبك أو حساسيتك المفرطة للمواقف اليومية.'
    ],
    promptQuestion: 'ما الركيزة الجسدية التي تحتاج لتعزيزها بدءاً من اليوم لتقليل هشاشتك العاطفية؟'
  },
  {
    id: 15,
    key: 'opposite-action',
    number: 15,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '15. مهارة الاستجابة المعاكسة / الفعل المعاكس (Opposite Action)',
    titleEn: 'Opposite Action',
    explanation: 'كل عاطفة قوية تولد دافعاً سلوكياً تلقائياً (الخوف يدفع للهروب، الغضب يدفع للهجوم والصراخ، الحزن يدفع للانعزال والجمود). إذا كانت العاطفة غير واقعية أو غير مفيدة للموقف الحالي، فإن الاستسلام لدافعها يزيدها اشتعالاً وضيقاً. مهارة Opposite Action تتطلب القيام بفعل معاكس تماماً لعكس اتجاه الدافع السلوكي العاطفي لتفكيك شحنة المشاعر وتغييرها بنجاح.',
    exerciseTitle: 'تمرين "كفوف الغضب المفتوحة"',
    exerciseSteps: [
      'في المرة القادمة التي تشعر فيها بالغضب العارم تجاه نقاش عائلي أو بالعمل، لا تصرخ ولا تعقد حاجبيك.',
      'أرخِ كتفيك لأسفل ببطء، وافتح كفي يديك تماماً واجعلهما في وضع مريح (هذا الفعل المعاكس الجسدي يرسل إشارات بيولوجية عاجلة للدماغ بأنه لا يوجد تهديد حقيقي، مما يقلل من نوبة الغضب تلقائياً خلال دقيقة واحدة).'
    ],
    promptQuestion: 'ما السلوك المعاكس الذي ستطبقه عند شعورك بالحزن أو الخوف أو الغضب القادم؟'
  },
  {
    id: 16,
    key: 'abc-please',
    number: 16,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '16. مهارة ABC PLEASE لبناء المشاعر الإيجابية',
    titleEn: 'ABC PLEASE',
    explanation: 'تهدف هذه المهارة المتكاملة لتعزيز رصيد مشاعرك الإيجابية يومياً لزيادة مناعتك النفسية ضد الأزمات عبر ثلاثة مكونات:\n• A (Accumulate Positive Emotions / تراكم المشاعر الإيجابية)\n• B (Build Mastery / بناء البراعة والكفاءة)\n• C (Cope Ahead / الاستعداد للمواقف الصعبة).',
    exerciseTitle: 'تمرين "تراكم البهجة اليومي البسيط"',
    exerciseSteps: [
      'خطط لثلاث تجارب بهجة بسيطة جداً وغير مكلفة لتقوم بأحدها غداً بوعي ويقظة ذهنية كاملة:\n - تلقي أشعة الشمس الصباحية الدافئة مع فنجان قهوة دون تصفح الهاتف.\n - الاتصال بصديق قديم تحبه وسؤاله عن أحواله بإنصات كامل.\n - الاستماع لقصة أو بودكاست تحفيزي مبهج يغير نظرتك اليومية للحياة.'
    ],
    promptQuestion: 'ما التجربة المبهجة البسيطة التي ستنفذها غداً لتغذية رصيدك العاطفي؟'
  },
  {
    id: 17,
    key: 'problem-solving',
    number: 17,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '17. مهارة حل المشكلات المنهجي (Problem Solving)',
    titleEn: 'Problem Solving',
    explanation: 'عندما تتطابق عواطفك السلبية مع حقائق الموقف الفعلي (مثال: أزمة مالية حقيقية، أو مشكلة صحية مؤكدة)، فإن الفعل المعاكس لن يكون فعالاً هنا، بل يجب التدخل بمهارة حل المشكلات المنهجي والعملي لتقليل الضغط وتغيير الواقع المزعج.',
    exerciseTitle: 'تمرين "تطبيق منهجية حل المشكلات في 6 خطوات"',
    exerciseSteps: [
      'حدد مشكلة واقعية تضايقك حالياً واكتبها بوضوح.',
      'طبق الخطوات الست بدقة تامة:\n 1. التعريف الدقيق للمشكلة بالحسابات والحقائق فقط.\n 2. توليد 5 حلول بديلة وممكنة دون تقييم مبكر.\n 3. موازنة إيجابيات وسلبيات أفضل الخيارات.\n 4. اختيار الحل الأنسب والعقلاني.\n 5. التنفيذ الفوري لأول خطوة إجرائية.\n 6. مراجعة النتائج والتقييم.'
    ],
    promptQuestion: 'ما المشكلة المحددة التي اخترت تطبيق الخطوات الست عليها اليوم؟'
  },
  {
    id: 18,
    key: 'build-mastery',
    number: 18,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '18. مهارة بناء الكفاءة والبراعة (Build Mastery)',
    titleEn: 'Build Mastery',
    explanation: 'تعني القيام بنشاط يومي واحد على الأقل يتحدى قدراتك قليلاً ويحتاج لجهد وتركيز، مما يمنحك شعوراً بالفخر والقدرة على التحكم والسيطرة على تفاصيل حياتك اليومية.',
    exerciseTitle: 'تمرين "مهمة الـ 1% الصعبة"',
    exerciseSteps: [
      'اختر مهارة أو موضوعاً طالما رغبت في تعلمه وتطوير ذاتك فيه.',
      'خصص 15 دقيقة فقط يومياً لإنجاز تقدم بسيط ومستمر في هذا الموضوع.',
      'لاحظ كيف أن التقدم التراكمي اليومي الصغير يبني بداخلك حصناً من الثقة والكفاءة النفسية العالية.'
    ],
    promptQuestion: 'ما المهارة أو المهمة التي ستخصص لها 15 دقيقة يومياً لبناء الكفاءة؟'
  },
  {
    id: 19,
    key: 'cope-ahead',
    number: 19,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '19. مهارة الاستعداد المسبق للمواقف الصعبة (Cope Ahead)',
    titleEn: 'Cope Ahead',
    explanation: 'تهدف هذه المهارة لإعداد خطة حماية مرنة للتعامل مع السيناريوهات المستقبلية الصعبة التي تثير توترك أو خوفك أو حزنك الشديد، مما يمنع المفاجآت والانهيار العاطفي والتصرفات غير الفعالة.',
    exerciseTitle: 'تمرين "البروفة الذهنية لمواجهة الأزمات"',
    exerciseSteps: [
      'حدد موقفاً صعباً ستقابله قريباً ويثير قلقك الشديد.',
      'اجلس واسترخ تماماً، وتخيل السيناريو يحدث أمامك بوضوح في عقلك.',
      'بدلاً من تخيل الانهيار أو التراجع، تخيل نفسك بوعي تام تطبق مهارات العلاج الجدلي السلوكي بنجاح رائع.'
    ],
    promptQuestion: 'ما الموقف المستقبلي الموتر الذي ستجري عليه بروفة Cope Ahead الذهنية؟'
  },
  {
    id: 20,
    key: 'positive-self-talk',
    number: 20,
    module: 'emotion',
    moduleTitle: 'وحدة مهارات تنظيم الانفعالات',
    moduleBadge: 'تنظيم الانفعالات',
    title: '20. مهارة بناء الحديث الذاتي الإيجابي (Positive Self-Talk)',
    titleEn: 'Positive Self-Talk',
    explanation: 'الأفكار والكلمات الموجهة للذات تلعب دوراً جوهرياً في تضخيم الألم أو تهدئة النفس. الحديث الذاتي السلبي المستمر القاسي يعزز العجز المكتسب والهشاشة النفسية الشديدة.',
    exerciseTitle: 'تمرين "إعادة بناء مرشدك الداخلي الداعم"',
    exerciseSteps: [
      'اكتب عبارة قاسية اعتدت توجيهها لنفسك عند الخطأ.',
      'تخيل أن صديقاً مقرباً تحبه يمر بنفس أزمتك الحالية وجاء يطلب دعمك، ماذا ستقول له؟',
      'وجه نفس هذه الكلمات الحانية والمشجعة لنفسك فوراً بوعي كامل.'
    ],
    promptQuestion: 'ما العبارة المشجعة الداعمة التي ستكررها لنفسك عندما تخطئ؟'
  },

  // ==================== الجزء الرابع: وحدة مهارات الفعالية الشخصية في العلاقات (Interpersonal Effectiveness) ====================
  {
    id: 21,
    key: 'dear-man',
    number: 21,
    module: 'interpersonal',
    moduleTitle: 'وحدة مهارات الفعالية الشخصية في العلاقات',
    moduleBadge: 'الفعالية الشخصية',
    title: '21. مهارة تحقيق الأهداف والطلب بفعالية (DEAR MAN Skill)',
    titleEn: 'DEAR MAN Skill',
    explanation: 'تستخدم هذه المهارة عندما تحتاج إلى طلب شيء محدد من شخص ما، أو عندما تريد رفض طلب يوجهه لك الآخرون بفعالية وقوة تامة دون التضحية بالعلاقة:\n• D (Describe / صِف الموقف بوضوح بالحسابات فقط)\n• E (Express / عبّر بدقة وعاطفة متزنة)\n• A (Assert / افرض حقك بوضوح)\n• R (Reinforce / كافئ الشخص)\n• M (Mindful / حافظ على تركيزك)\n• A (Appear confident / اظهر بمظهر الواثق)\n• N (Negotiate / تفاوض بمرونة).',
    exerciseTitle: 'تمرين "صياغة سيناريو DEAR MAN مخصص"',
    exerciseSteps: [
      'تذكر طلباً صعباً ترغب في تقديمه لشخص ما بالمنزل أو العمل.',
      'صِغ سيناريو حواري متكامل ملتزماً بالخطوات السبع السابقة بدقة تامة واكتبه ليكون دليلك أثناء الحديث العملي والفعال القادم لضمان النجاح وقوة التأثير البناء.'
    ],
    promptQuestion: 'اكتب صياغة طلبك بالخطوات (D-E-A-R) هنا:'
  },
  {
    id: 22,
    key: 'give-skill',
    number: 22,
    module: 'interpersonal',
    moduleTitle: 'وحدة مهارات الفعالية الشخصية في العلاقات',
    moduleBadge: 'الفعالية الشخصية',
    title: '22. مهارة الحفاظ على العلاقات والتواصل اللطيف (GIVE Skill)',
    titleEn: 'GIVE Skill',
    explanation: 'تستخدم عندما يكون هدفك الرئيسي من التفاعل هو الحفاظ على دفء العلاقة وتوطيد الروابط والمحبة وتجنب النفور والتباعد والاضطراب:\n• G (Gentle / أسلوب لطيف)\n• I (Interested / إظهار الاهتمام)\n• V (Validate / التحقق والتقبل)\n• E (Easy manner / معاملة سهلة ومرحة).',
    exerciseTitle: 'تمرين "لعبة التحقق والإنصات العميق GIVE"',
    exerciseSteps: [
      'في حوارك القادم مع شريك حياتك أو صديقك المقرب، جرب التركيز بالكامل على تطبيق مهارة GIVE.',
      'استمع لحديثه دون التفكير في ردك القادم.',
      'لاحظ كيف أن هذا الاحتواء والتحقق الفوري يزيل الحواجز تلقائياً ويبني علاقة إنسانية وثيقة وداعمة لكلا الطرفين.'
    ],
    promptQuestion: 'ما عبارة التحقق والاحتواء التي ستستخدمها مع شخص قريب لك اليوم؟'
  },
  {
    id: 23,
    key: 'fast-skill',
    number: 23,
    module: 'interpersonal',
    moduleTitle: 'وحدة مهارات الفعالية الشخصية في العلاقات',
    moduleBadge: 'الفعالية الشخصية',
    title: '23. مهارة حماية احترام الذات والالتزام بالقيم (FAST Skill)',
    titleEn: 'FAST Skill',
    explanation: 'تستخدم عندما يكون هدفك الأساسي من التواصل هو الحفاظ على كرامتك الشخصية، واحترامك لذاتك، وصدقك الداخلي، والتمسك الكامل بقيمك وأخلاقك دون تنازلات تندم عليها لاحقاً:\n• F (Fair / عادل ومتزن)\n• A (No Apologies / خالٍ من الاعتذارات الزائدة)\n• S (Stick to values / التمسك التام بقيمك)\n• T (Truthful / الصدق المطلق والأمانة).',
    exerciseTitle: 'تمرين "قول \'لا\' الواثقة العادلة"',
    exerciseSteps: [
      'تخيل أن زميلاً في العمل يطلب منك القيام بمهام إضافية تقع خارج نطاق مسؤولياتك.',
      'صِغ رداً واثقاً ومحترماً مستخدماً مهارة FAST مستبعداً الاعتذار المبالغ فيه.',
      'اشعر بالقوة الداخلية والراحة النفسية العميقة الناتجة عن حماية احترامك لذاتك وقيمك الأساسية.'
    ],
    promptQuestion: 'صِغ ردك الواثق العادل (FAST) لرفض طلب ينافي قدرتك وقيمك:'
  },
  {
    id: 24,
    key: 'boundary-building',
    number: 24,
    module: 'interpersonal',
    moduleTitle: 'وحدة مهارات الفعالية الشخصية في العلاقات',
    moduleBadge: 'الفعالية الشخصية',
    title: '24. مهارة بناء الحدود الصحية وحمايتها (Boundary Building)',
    titleEn: 'Boundary Building',
    explanation: 'تعني القدرة الواعية على رسم وتحديد مسافات الأمان النفسية والجسدية بينك وبين الآخرين لحماية طاقتك وصحتك العقلية من الاستنزاف والأذى المتكرر. الحدود الصحية هي التي تمنع تدفق مشاكل وتوترات الآخرين العاطفية لداخلك وتحدد للآخرين بدقة السلوكيات المقبولة وغير المقبولة للتعامل معك باحترام.',
    exerciseTitle: 'تمرين "تحديد دوائر الحدود الثلاث"',
    exerciseSteps: [
      'ارسم على ورقة بيضاء ثلاث دوائر متداخلة (حليفة، شخصية، ورسمية).',
      'حدد بوعي تام شخصاً واحداً يتجاوز حدوده حالياً ويثير ضيقك، واكتب سيناريو بسيطاً لترسيخ وتفعيل حدودك معه بلطف وثقة.'
    ],
    promptQuestion: 'من الشخص الذي تحتاج لإعادة رسم حدودك معه بوضوح، وما أول خطوة ستتخذها؟'
  }
];

export default function DBTTipp() {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openSkillId, setOpenSkillId] = useState(1);
  const [userNotes, setUserNotes] = useState({});
  const [completedExercises, setCompletedExercises] = useState({});

  const MODULE_TABS = [
    { id: 'all', label: 'الكل (24 مهارة)' },
    { id: 'mindfulness', label: '1. اليقظة الذهنية' },
    { id: 'distress', label: '2. تحمل الضيق' },
    { id: 'emotion', label: '3. تنظيم الانفعالات' },
    { id: 'interpersonal', label: '4. الفعالية الشخصية' }
  ];

  const filteredSkills = DBT_SKILLS.filter(skill => {
    const matchesModule = selectedModule === 'all' || skill.module === selectedModule;
    const query = searchQuery.trim().toLowerCase();
    const matchesSearch = !query ||
      skill.title.toLowerCase().includes(query) ||
      skill.titleEn.toLowerCase().includes(query) ||
      skill.explanation.toLowerCase().includes(query) ||
      skill.exerciseTitle.toLowerCase().includes(query);
    return matchesModule && matchesSearch;
  });

  const handleNoteChange = (skillId, val) => {
    setUserNotes(prev => ({ ...prev, [skillId]: val }));
  };

  const toggleExerciseCompleted = (skillId) => {
    setCompletedExercises(prev => ({ ...prev, [skillId]: !prev[skillId] }));
  };

  const completedCount = Object.values(completedExercises).filter(Boolean).length;

  return (
    <div className="flex flex-col min-h-screen bg-bg-app text-text-primary dir-rtl font-sans pb-20">

      {/* HEADER */}
      <header className="sticky top-0 z-30 bg-bg-surface border-b border-border-subtle shadow-xs">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-bg-surface-elevated hover:bg-bg-surface-hover text-text-muted hover:text-text-primary text-xs font-semibold transition-all border border-border-subtle"
          >
            <ArrowLeft size={16} className="rotate-180" />
            <span>رجوع</span>
          </button>

          <div className="text-center flex-1">
            <h1 className="text-base sm:text-xl font-bold text-text-primary leading-tight">
              الدليل الشامل لمهارات العلاج الجدلي السلوكي (DBT)
            </h1>
            <p className="text-xs text-text-muted">
              24 مهارة علاجية وتطبيقات عمليّة
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 px-3 py-1.5 rounded-xl text-xs font-bold">
            <span>المكتمل: {completedCount} / 24</span>
          </div>
        </div>
      </header>

      {/* HERO / INTRODUCTION */}
      <section className="bg-bg-surface border-b border-border-subtle py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-3 text-center">
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            دليل قائم على الأدلة العلمية (DBT Manual)
          </span>
          <h2 className="text-xl sm:text-3xl font-bold text-text-primary leading-snug">
            المبادئ والتطبيقات والتمارين العملية لـ 24 مهارة علاجية
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-3xl mx-auto">
            العلاج الجدلي السلوكي (DBT) هو نظام نفسي معرفي سلوكي يتكامل فيه القبول الكامل للذات في اللحظة الراهنة مع العمل المستمر نحو التغيير الإيجابي لبناء حياة ذات معنى.
          </p>
        </div>
      </section>

      {/* CONTROLS & SEARCH BAR */}
      <section className="bg-bg-surface border-b border-border-subtle py-3 px-4 sticky top-[57px] z-20 shadow-xs">
        <div className="max-w-4xl mx-auto space-y-3">
          {/* Search Box */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث عن مهارة معينة (مثال: TIPP, القبول الراديكالي, DEAR MAN)..."
              className="w-full pl-10 pr-4 py-2 bg-bg-surface-elevated border border-border-medium rounded-xl text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary"
              >
                مسح
              </button>
            )}
          </div>

          {/* Module Tabs */}
          <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none">
            {MODULE_TABS.map((tab) => {
              const active = selectedModule === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedModule(tab.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? 'bg-emerald-700 text-white shadow-xs'
                      : 'bg-bg-surface-elevated text-text-muted hover:bg-bg-surface-hover hover:text-text-primary'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* MAIN CONTENT: 24 SKILLS CATALOG */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 space-y-4">
        {filteredSkills.length === 0 ? (
          <div className="text-center py-12 bg-bg-surface rounded-2xl border border-border-subtle p-6 space-y-3">
            <p className="text-text-muted font-bold text-sm">لم نجد مهارات تطابق بحثك حالياً.</p>
            <button
              onClick={() => { setSelectedModule('all'); setSearchQuery(''); }}
              className="px-4 py-2 bg-emerald-700 text-white rounded-xl text-xs font-bold"
            >
              عرض جميع المهارات
            </button>
          </div>
        ) : (
          filteredSkills.map((skill) => {
            const isOpen = openSkillId === skill.id;
            const isDone = Boolean(completedExercises[skill.id]);

            return (
              <article
                key={skill.id}
                id={`skill-${skill.number}`}
                className="bg-bg-surface rounded-2xl border border-border-subtle overflow-hidden shadow-2xs hover:border-border-medium transition-all"
              >
                {/* Skill Card Header */}
                <header
                  onClick={() => setOpenSkillId(isOpen ? null : skill.id)}
                  className="p-4 sm:p-5 flex items-start justify-between gap-3 cursor-pointer select-none hover:bg-bg-surface-elevated/60 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className="size-8 sm:size-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">
                      {skill.number}
                    </div>

                    <div className="space-y-1 text-right flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-bg-surface-elevated text-text-secondary border border-border-subtle">
                          {skill.moduleBadge}
                        </span>
                        {isDone && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                            <Check size={12} />
                            <span>تم التطبيق</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-text-primary leading-tight">
                        {skill.title}
                      </h3>
                      <p className="text-xs text-text-muted dir-ltr text-right font-mono">
                        {skill.titleEn}
                      </p>
                    </div>
                  </div>

                  <button className="text-text-muted p-1 rounded-lg bg-bg-surface-elevated mt-1">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </header>

                {/* Skill Details (When Expanded) */}
                {isOpen && (
                  <div className="border-t border-border-subtle p-4 sm:p-6 space-y-5 bg-bg-surface-elevated/30">

                    {/* Detailed Explanation */}
                    <div className="bg-bg-surface p-4 rounded-xl border border-border-subtle space-y-2">
                      <h4 className="font-bold text-xs sm:text-sm text-text-primary">
                        الشرح التفصيلي والآلية النفسية:
                      </h4>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed whitespace-pre-line font-normal">
                        {skill.explanation}
                      </p>
                    </div>

                    {/* Interactive Exercise */}
                    <div className="bg-bg-surface p-4 sm:p-5 rounded-xl border border-border-subtle space-y-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                        <h4 className="font-bold text-xs sm:text-sm text-text-primary">
                          {skill.exerciseTitle}
                        </h4>
                        <button
                          onClick={() => toggleExerciseCompleted(skill.id)}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            isDone
                              ? 'bg-emerald-700 text-white'
                              : 'bg-bg-surface-elevated text-text-secondary border border-border-subtle hover:bg-bg-surface-hover'
                          }`}
                        >
                          <Check size={14} />
                          <span>{isDone ? 'تم الإكمال' : 'تحديد كـ مكتمل'}</span>
                        </button>
                      </div>

                      {/* Exercise Steps */}
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-text-primary">خطوات التطبيق العملي:</p>
                        <ol className="space-y-2">
                          {skill.exerciseSteps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-text-secondary leading-relaxed bg-bg-surface-elevated p-2.5 rounded-lg border border-border-subtle">
                              <span className="size-4 rounded-full bg-emerald-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <span className="whitespace-pre-line">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Reflection / Note Box */}
                      <div className="pt-2 space-y-1.5">
                        <label className="block text-xs font-bold text-text-primary">
                          {skill.promptQuestion}
                        </label>
                        <textarea
                          rows={2}
                          value={userNotes[skill.id] || ''}
                          onChange={(e) => handleNoteChange(skill.id, e.target.value)}
                          placeholder="اكتب ملاحظاتك وتطبيقك الذاتي هنا..."
                          className="w-full p-3 bg-bg-surface border border-border-medium rounded-xl text-xs sm:text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-emerald-600"
                        />
                        {userNotes[skill.id] && (
                          <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                            <Check size={12} />
                            <span>تم حفظ الملاحظات الشخصية لهذه المهارة.</span>
                          </p>
                        )}
                      </div>

                    </div>

                  </div>
                )}
              </article>
            );
          })
        )}
      </main>

      <Footer />
    </div>
  );
}
