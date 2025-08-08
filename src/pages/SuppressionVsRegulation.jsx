import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Slash, Zap, BookOpen, Activity } from 'lucide-react';

export default function SuppressionVsRegulationPage() {
  return (
    <div className="bg-gray-50 min-h-screen p-8">
 <header className="flex justify-between items-center  pb-2">
        <button onClick={() => window.history.back()} className="flex size-12 shrink-0 items-center text-[#0e1b15]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/></svg>
        </button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#0e1b15]"> Suppression VS Regulation </h2>
      </header>     
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* تعريفات */}
        <Card className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Slash className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold">كبت المشاعر (Suppression)</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible = "true">
              <AccordionItem value="sup-overview">
                <AccordionTrigger>نبذة</AccordionTrigger>
                <AccordionContent>
                  <p>الكبت هو محاولة وعيّة لمنع التعبير الخارجي للمشاعر بعد حدوثها. عادة ما يكون ملحوظًا بجهود لاحتواء وجهات النظر الظاهرة أو الصوت المتأثر.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sup-effects">
                <AccordionTrigger>الآثار النفسية والجسدية</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>زيادة التنشيط الفسيولوجي: ارتفاع معدل ضربات القلب وضغط الدم (Gross & Levenson, 1997).</li>
                    <li>انخفاض الإيجابية وزيادة الاكتئاب والقلق (Gross & John, 2003).</li>
                    <li>تثبيط الدعم الاجتماعي وتقليل العلاقات الحميمة (Srivastava et al., 2009).</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="sup-research">
                <AccordionTrigger>أبحاث</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal list-inside">
                    <li>Gross & John (2003): أظهرت الدراسة أن المستخدمين المتكررون للكبت يمتلكون رفاهية ذاتية أقل.</li>
                    <li>Butler et al. (2007): بالرغم من فعالية الكبت ثقافيًا، إلا أنه يُرتبط بآثار سلبية في مجتمعات غربية.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Zap className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold">تنظيم المشاعر (Regulation)</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible>
              <AccordionItem value="reg-overview">
                <AccordionTrigger>مقدمة</AccordionTrigger>
                <AccordionContent>
                  <p>تنظيم المشاعر هو مجموعة استراتيجيات تُطبَّق للتحكم العصبي والمعرفي قبل وبعد استجابة عاطفية بهدف تعديل شدة أو مدة التجربة.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reg-strategies">
                <AccordionTrigger>أنواع الاستراتيجيات</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>إعادة التقييم المعرفي (Reappraisal): تغيير تفسير الحدث قبل التطور الكامل للعاطفة.</li>
                    <li>الانتباه الانتقائي (Attention deployment): توجيه الانتباه بعيدًا عن المنبه العاطفي.</li>
                    <li>الاسترخاء وإدارة التنفس: تقنيات تهدئة استجابة الجسم المناعية.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reg-benefits">
                <AccordionTrigger>الفوائد</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside">
                    <li>خفض الاستجابات الفسيولوجية السلبية دون تكاليف معرفية كبيرة (Ochsner & Gross, 2008).</li>
                    <li>زيادة المشاعر الإيجابية وتحسين الرفاهية (Gross & John, 2003).</li>
                    <li>تعزيز العلاقات الاجتماعية والدعم المتبادل.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="reg-research">
                <AccordionTrigger>دراسات</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal list-inside">
                    <li>Gross & Levenson (1997): ربطت إعادة التقييم بخفض التنشيط الفسيولوجي.</li>
                    <li>Webb et al. (2018): ناقشت حدود إعادة التقييم في مواقف الضغط العالي.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* ملاحظة */}
        <Card className="bg-white shadow-md lg:col-span-2">
          <CardHeader className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold">المقارنة والاختيار</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              <AccordionItem value="compare">
                <AccordionTrigger>الفرق الجوهري</AccordionTrigger>
                <AccordionContent>
                  <p>الكبت يركز على استجابات لاحقة بعد الشعور بالعاطفة غالبًا ما يزيد العبء النفسي والجسدي، بينما إعادة التقييم والمعالجة المسبقة تقللان العاطفة مبكرًا وتوفران نتائج أكثر إيجابية على المدى الطويل.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="practice">
                <AccordionTrigger>تمارين مقترحة</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside">
                    <li>تدرب على إعادة التقييم: قبل التفاعل العاطفي، أعد تفسير الموقف بما يدعم الشعور الإيجابي.</li>
                    <li>مارس الانتباه المنتقل: ابتعد عن المنبه العاطفي ووجّه تفكيرك نحو مهمة محفزة.</li>
                    <li>قارن: سجّل موقفًا استخدمت فيه الكبت وآخر استخدمت فيه إعادة التقييم، قارن في دفتر يومياتك مدى الراحة النفسية والجسدية.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

/*
References:
- Gross, J.J. & Levenson, R.W. (1997). Hiding feelings... Journal of Personality and Social Psychology.
- Gross, J.J. & John, O.P. (2003). Individual differences in emotion regulation... Journal of Personality and Social Psychology.
- Butler, E.A. et al. (2007). The social consequences of expressive suppression. Emotion.
- Ochsner, K.N. & Gross, J.J. (2008). Cognitive emotion regulation insights. Trends in Cognitive Sciences.
- Webb, T.L., Miles, E., & Sheeran, P. (2018). Dealing with feeling: regulation under pressure. Journal of Experimental Psychology.
*/
