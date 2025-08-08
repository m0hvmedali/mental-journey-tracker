import React from 'react';
import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import {  
  Activity,
  ShieldCheck,
  Play,
  Headphones,
  Triangle,
  MessageCircle,
  UserCheck,
  Footprints,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ScrollToTopButton from '@/components/ScrollToTopButton';
// بيانات الرسم البياني التعرض المنهجي
const exposureData = [
  { day: 'Day 1', anxiety: 8 },
  { day: 'Day 5', anxiety: 6 },
  { day: 'Day 10', anxiety: 4 },
  { day: 'Day 15', anxiety: 2 },
  { day: 'Day 20', anxiety: 1 },
];



export default function CBTPage() {

  const skills = [
    { id: 'triangle', label: 'مثلث المعرفة' },
    { id: 'exposure', label: 'التعرض' },
    { id: 'filterModel', label: 'نموذج الفلترة' },
    { id: 'activation', label: 'التنشيط' },
    { id: 'approximation', label: 'التقريب' },
    { id: 'role', label: 'لعب الأدوار' },
    { id: 'relaxation', label: 'الاسترخاء' },
    { id: 'problem-solving', label: 'حل المشكلات' },
    { id: 'assertiveness', label: 'الحزم' },
    { id: 'applications', label: 'التطبيقات' },
    { id: 'socratic', label: 'التساؤل السقراطي' },
    { id: 'sandwich', label: 'نظريه السندويتش' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-8">
 <header className="flex justify-between items-center  pb-6">
        <button onClick={() => window.history.back()} className="flex size-12 shrink-0 items-center text-[#0e1b15]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/></svg>
        </button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#0e1b15]">Cognitive behavioral therapy </h2>
      </header>
 {/* شريط الاختصارات */}
 <div className="flex justify-center mb-6">
        <div className="w-full max-w-screen-sm overflow-x-auto transition-all">
          <div className="flex space-x-3 gap-4 py-2 px-3">
            {skills.map(skill => (
             <a
             key={skill.id}
             href={`#${skill.id}`}
             className="flex-shrink-0 px-3 py-1 bg-white text-black rounded-full text-sm border shadow-lg transition 
                       animate-[glow_2s_ease-in-out_infinite]"
           >
                {skill.label}
              </a>
            ))}
          </div>
        </div>
      </div>
   
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

 {/* نموذج الفلترة */}
 <Card id="filterModel" className="bg-white shadow-md col-span-full">
          <CardHeader className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-gray-700" />
            <h2 className="text-xl font-semibold">نموذج التصفية والفلترة</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="filter-overview">
                <AccordionTrigger>مقدمة</AccordionTrigger>
                <AccordionContent>
                  <p>نموذج يستخدم في جميع المهارات لتحليل الأفكار وتنقيتها من الأخطاء المعرفية وتوجيهها نحو نتائج أكثر واقعية.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="filter-steps">
                <AccordionTrigger>خطوات النموذج</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>أخذ الفكرة الأساسية.</li>
                    <li>تمريرة عبر قائمة أخطاء التفكير (التعميم المفرط، التفكير الكارثي، الإفراط في التبسيط).</li>
                    <li>اكتشاف وتصحيح الأخطاء بالتحدي والأسئلة.</li>
                    <li>تمريرة للفهم عبر ميكانيزمات الدفاع (التقبل، التحول الإيجابي).</li>
                    <li>الرصد والعلاج: متابعة تغيرات الفكرة والاستجابة السلوكية.</li>
                    <li>تحديد الفكرة والمشاعر الناتجة بدقة.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="filter-benefits">
                <AccordionTrigger>الأثر والتطبيق</AccordionTrigger>
                <AccordionContent>
                  <p>يساعد على وضوح الأفكار وتحسين اتخاذ القرار وتقليل التوتر عبر منهجية منظمة وشاملة.</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

 {/* 1. مثلث المعرفة: الأفكار - المشاعر - السلوك */}
 <Card id="triangle" className="bg-white shadow-md col-span-full">
          <CardHeader className="flex items-center space-x-2">
            <Triangle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-semibold">مثلث المعرفة: الأفكار - المشاعر - السلوك</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="triangle-overview">
                <AccordionTrigger>مقدمة عن المثلث</AccordionTrigger>
                <AccordionContent>
                  <p>مثلث المعرفة يوضح التفاعل بين ثلاثة مكونات رئيسية تؤثر على تجربتنا اليومية:الأفكار، المشاعر، والسلوك.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="triangle-components">
                <AccordionTrigger>مكونات المثلث</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li><strong>الأفكار (Thoughts):</strong> التفسيرات والتصورات التي نبنيها عن الأحداث.</li>
                    <li><strong>المشاعر (Feelings):</strong> الانفعالات العاطفية المصاحبة لهذه الأفكار.</li>
                    <li><strong>السلوك (Behaviors):</strong> الأفعال والاستجابات التي نقوم بها نتيجة للأفكار والمشاعر.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="triangle-usage">
                <AccordionTrigger>طرق الاستفادة</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>تحديد نمط التفكير السلبي وتحديه بطرح أسئلة بناءة: "ما الدليل؟ هل هناك تفسير بديل؟"</li>
                    <li>مراقبة المشاعر المرتبطة بالفكرة وتسجيل درجة الشدة (مثلاً من 0 إلى 10).</li>
                    <li>ملاحظة السلوكيات الناتجة عن المشاعر وتقييم تأثيرها، ثم تجربة سلوكيات بديلة أكثر توافقًا مع الهدف.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="triangle-exercise">
                <AccordionTrigger>تمرين المثلث</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>اختر موقفًا أثار قلقًا أو إحباطًا.</li>
                    <li>سجل الفكرة السلبية الأساسية.</li>
                    <li>حدد المشاعر المصاحبة (حزن، قلق، غضب) ودرجتها.</li>
                    <li>حلّل سلوكك الناتج واختر سلوكًا بديلًا يتناسب مع قيمك.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="triangle-benefits">
                <AccordionTrigger>فوائد التطبيق</AccordionTrigger>
                <AccordionContent>
                  <p>يساعد على فصل هذه العناصر والتحكم بها بشكل مستقل، مما يعزز المرونة الذهنية وتبني استراتيجيات فعالة لإدارة العواطف والسلوك.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="triangle-image">
                <AccordionTrigger>صورة توضيحية</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4 flex justify-center">
                    <img src="/DfenssImg/9b6ae604eb373de771a17d0bda675526.jpg" alt="مثلث المعرفة" className="w-2/3 rounded border" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

  {/* مهارة السندوتش */}
  <Card id="sandwich"  className="bg-white shadow-md col-span-full">
          <CardHeader className="flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-semibold">مهارة السندوتش (Sandwich Technique)</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="sandwich-overview">
                <AccordionTrigger>مقدمة عن التقنية</AccordionTrigger>
                <AccordionContent>
                  <p>تقنية تقديم الملاحظات بإطار مدح - نقد - مدح لتعزيز قبول التغذية الراجعة.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sandwich-steps">
                <AccordionTrigger>خطوات التطبيق</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>ابدأ بمدح صادق عن سلوك إيجابي.</li>
                    <li>قدم الملاحظة أو النصيحة بشكل واضح ومهني.</li>
                    <li>اختم بمدح أو تشجيع لتخفيف التوتر وتحفيز الاستقبال.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sandwich-benefits">
                <AccordionTrigger>فوائد التقنية</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>تقليل المقاومة النفسية تجاه النقد.</li>
                    <li>تعزيز العلاقة بين المرسل والمتلقي.</li>
                    <li>رفع مستوى التحفيز للتطوير.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sandwich-image">
                <AccordionTrigger>صورة توضيحية</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4 flex justify-center">
                    {/* استبدل المسار بالصورة الفعلية */}
                    <img src="/DfenssImg/1700840661142.jfif" alt="نموذج تقنية السندويتش" className="w-2/3 rounded border" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card id="socratic" className="bg-white shadow-md col-span-full">
          <CardHeader className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-blue-700" />
            <h2 className="text-xl font-semibold">نموذج التساؤل السقراطي</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="socratic-overview">
                <AccordionTrigger>مقدمة عن التساؤل السقراطي</AccordionTrigger>
                <AccordionContent>
                  <p>التساؤل السقراطي تقنية معرفية تهدف إلى تحدي الأفكار السلبية عبر طرح أسئلة بناءة لاستكشاف الأدلة والمنطق وراءها.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="socratic-steps">
                <AccordionTrigger>خطوات النموذج</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>تحديد الفكرة السلبية الأساسية.</li>
                    <li>جمع الأدلة الداعمة للفكرة.</li>
                    <li>تصفية الفكرة عبر أسئلة مثل: "ما الدليل؟ هل هناك بدائل؟"</li>
                    <li>عكس الفكرة وطرح: "ماذا لو كان العكس صحيحًا؟"</li>
                    <li>استنتاج النتائج والتأثيرات المحتملة لكل جانب.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="socratic-filter">
                <AccordionTrigger>تصفيّة الفكرة</AccordionTrigger>
                <AccordionContent>
                  <p>تصفية الفكرة تشمل تحليل التحيزات والانحرافات المعرفية مثل التفكير الكارثي، التعميم المفرط، والتأكيد الانتقائي للأدلة.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="socratic-reverse">
                <AccordionTrigger>عكس الفكرة والنتائج</AccordionTrigger>
                <AccordionContent>
                  <p>طرح الفكرة المعاكسة يساعد على رؤية المنظور المعاكس وتحديد مدى صحتها، ثم مقارنة تبعات كل منهما لتطوير منظور متوازن.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="socratic-research">
                <AccordionTrigger>دراسات وأبحاث</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>أظهرت أبحاث أن التساؤل السقراطي يحسن من إعادة الهيكلة المعرفية ويقلل الأعراض الاكتئابية بنسبة 20% (Smith et al., 2020).</li>
                    <li>دراسة أخرى بينت فعالية التقنية في علاج القلق الاجتماعي عند المراهقين (Jones & Lee, 2021).</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="socratic-image">
                <AccordionTrigger>صورة توضيحية</AccordionTrigger>
                <AccordionContent>
                  <div className="mt-4 flex justify-center">
                    <img src="/DfenssImg/330px-UWASocrates_gobeirne_cropped.jpg" alt="نموذج التساؤل السقراطي" className="w-2/3 rounded border" />
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>


        {/* 1. التعرض المنهجي */}
        <Card id="exposure" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <ShieldCheck className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">1. العلاج بالتعرض</h2>
          </CardHeader>
          <CardContent>
            <p><strong>الاستخدام:</strong> علاج الرهاب، القلق، واضطراب ما بعد الصدمة.</p>
            <p><strong>الآلية:</strong></p>
            <ul className="list-disc list-inside">
              <li>التعرض التدريجي: مواجهة المُثيرات من الأقل إلى الأكثر إثارة للقلق.</li>
              <li>منع الاستجابة: تجنب الهروب أو أي سلوك يخفف القلق مؤقتاً.</li>
            </ul>
            <p><strong>مثال:</strong> تخيل الوقوف على شرفة ثم الانتقال لزيارة مكان مرتفع فعليًا.</p>
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={exposureData}>
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="anxiety" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="exposure-train">
                <AccordionTrigger>تمارين التعرض</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1">
                    <li>إنشاء سلم هرمي من 1–10 لخوفك.</li>
                    <li>التعرض المستمر لكل مستوى حتى ينخفض القلق.</li>
                    <li>مارس التنفس العميق وتقنيات الاسترخاء أثناء التعرض.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 2. التنشيط السلوكي */}
        <Card id="activation" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Activity className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold">2. التنشيط السلوكي</h2>
          </CardHeader>
          <CardContent>
            <p><strong>الهدف:</strong> كسر حلقة الانسحاب والاكتئاب.</p>
            <p><strong>الطريقة:</strong></p>
            <ul className="list-disc list-inside">
              <li>جدولة أنشطة ممتعة أو ذات معنى.</li>
              <li>تعزيز المشاركة اليومية في المهام والعلاقات.</li>
            </ul>
            <CardContent>
           
          </CardContent>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="activation-train">
                <AccordionTrigger>تدريبات BA</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>اختر 3 أنشطة يومية ممتعة.</li>
                    <li>حدد وقتًا ثابتًا لها.</li>
                    <li>دوّن تقييمك للمزاج قبل وبعد.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 3. التقريب المتتالي (Successive Approximation) */}
        <Card id="shaping" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Footprints className="w-6 h-6 text-purple-500" />
            <h2 className="text-xl font-semibold">3. التقريب المتتالي</h2>
          </CardHeader>
          <CardContent>
            <p>تقسيم المهام الكبيرة إلى خطوات صغيرة قابلة للتحقيق.</p>
            <p><strong>مثال:</strong> الاتصال بصديق هاتفيًا ثم مقابلة سريعة وجهاً لوجه.</p>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="shaping-train">
                <AccordionTrigger>تمارين التقريب</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>حدد الهدف النهائي.</li>
                    <li>قسّمه إلى 5 خطوات صغيرة.</li>
                    <li>أنجز خطوة كل يوم.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 4. لعب الأدوار */}
        <Card id="role" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Play className="w-6 h-6 text-pink-500" />
            <h2 className="text-xl font-semibold">4. لعب الأدوار</h2>
          </CardHeader>
          <CardContent>
            <p>تحسين المهارات الاجتماعية والتدرب على مواقف صعبة.</p>
            <p><strong>فوائد:</strong></p>
            <ul className="list-disc list-inside">
              <li>تعلم مهارات حل النزاعات.</li>
              <li>التدرب على المقابلات الوظيفية.</li>
            </ul>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="role-train">
                <AccordionTrigger>تمارين لعب الأدوار</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>اختر موقفًا تحديًا.</li>
                    <li>قم بمحاكاته مع شريك أو مجموعة.</li>
                    <li>ناقش الأداء واحصل على تغذية راجعة.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 5. تمارين الاسترخاء */}
        <Card id="relaxation" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Headphones className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold">5. تمارين الاسترخاء</h2>
          </CardHeader>
          <CardContent>
            <p><strong>أنواع:</strong></p>
            <ul className="list-disc list-inside">
              <li>التنفس العميق لإبطاء ضربات القلب.</li>
              <li>استرخاء العضلات التدريجي لتقليل التوتر.</li>
              <li>التخيل الموجه للابتعاد عن الأفكار القلقة.</li>
            </ul>
          </CardContent>
        </Card>

        {/* 6. حل المشكلات */}
        <Card id="problem-solving" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Triangle className="w-6 h-6 text-indigo-500" />
            <h2 className="text-xl font-semibold">6. مهارات حل المشكلات</h2>
          </CardHeader>
          <CardContent>
            <p>تحديد المشكلة، توليد الحلول، تقييم النتائج وتنفيذ الأمثل.</p>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="pss-train">
                <AccordionTrigger>تمارين حل المشكلات</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>حدد المشكلة بوضوح.</li>
                    <li>اقترح 3 حلول محتملة.</li>
                    <li>قيّم الإيجابيات والسلبيات لكل حل.</li>
                    <li>نفذ الحل الأنسب وقيّم النتائج.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 7. التدريب على الحزم */}
        <Card id="assertiveness" className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <MessageCircle className="w-6 h-6 text-teal-500" />
            <h2 className="text-xl font-semibold">7. تدريب الحزم</h2>
          </CardHeader>
          <CardContent>
            <p>استخدام عبارات "أنا" ووضع حدود صحية للتعبير بثقة.

            </p>
            <Accordion type="single" collapsible className="mt-4">
              <AccordionItem value="assert-train">
                <AccordionTrigger>تمارين الحزم</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>استخدم جمل"أنا أشعر" عند التعبير عن الاحتياجات.</li>
                    <li>حدد حدودك وشاركها بوضوح.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* 8. التطبيقات و الاستراتيجيات */}
        <Card id="applications" className="bg-white shadow-md col-span-full">
          <CardHeader className="flex items-center space-x-2">
            <UserCheck className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">8. تطبيقات واستراتيجيات</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible = "true" >
              {/* اضطرابات */}
              <AccordionItem value="apps-disorders">
                <AccordionTrigger>اضطرابات محددة</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li><strong>القلق:</strong> التعرض المتدرج + إعادة الهيكلة المعرفية.</li>
                    <li><strong>الاكتئاب:</strong> التنشيط السلوكي وتحدي الأفكار السوداوية.</li>
                    <li><strong>OCD:</strong> التعرض ومنع الاستجابة للفكرة والطقس الوسواسي.</li>
                    <li><strong>فئات عمرية:</strong> الأطفال - ألعاب ورسوم، كبار السن - مشكلات صحية وحزن.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              {/* استراتيجيات تعزيز */}
              <AccordionItem value="apps-strat">
                <AccordionTrigger>استراتيجيات تعزيز الكفاءة</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li><strong>الواجبات المنزلية:</strong> تسجيل الأفكار ومهام التعرض.</li>
                    <li><strong>الهيكلة الزمنية:</strong> جلسات 45-60 دقيقة أسبوعياً.</li>
                    <li><strong>التعاون العلاجي:</strong> خطة مشتركة بين المعالج والمريض.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

      </div>
      < ScrollToTopButton />
    </div>
  );
}
