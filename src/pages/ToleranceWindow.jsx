import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { BookOpen, Heart, Handshake } from 'lucide-react';

export default function GratitudeForgivenessPage() {
  return (
    <div className="bg-white min-h-screen p-8">
      <header className="flex justify-between items-center  pb-2">
        <button onClick={() => window.history.back()} className="flex size-12 shrink-0 items-center text-[#0e1b15]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor"><path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/></svg>
        </button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#0e1b15]">Gratitude & Forgiveness</h2>
      </header>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* بطاقة الامتنان */}
        <Card className="bg-gray-50 shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-red-500" />
            <h2 className="text-2xl font-semibold">الامتنان</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible = "true"  >
              <AccordionItem value="gratitude-overview">
                <AccordionTrigger>لمحة عامة</AccordionTrigger>
                <AccordionContent>
                  <p>الامتنان هو شعور التقدير والتعرف على جوانب الحياة الإيجابية، مع التركيز على النعم اليومية.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="gratitude-benefits">
                <AccordionTrigger>الفوائد النفسية والجسدية</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1">
                    <li>تحسين المزاج والرفاهية العامة.</li>
                    <li>خفض أعراض الاكتئاب والقلق.</li>
                    <li>تعزيز جودة النوم وصحة القلب.</li>
                    <li>تقوية العلاقات الاجتماعية والشعور بالدعم.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="gratitude-research">
                <AccordionTrigger>أبحاث ودراسات</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal list-inside space-y-1">
                    <li>دراسة Emmons & McCullough (2003): وجد المشاركون في مجموعة الامتنان زيادة ملحوظة في السعادة وتقليل في الاكتئاب بعد 10 أسابيع<sup>1</sup>.</li>
                    <li>بحوث Wood et al. (2010): ربطت الامتنان بنوعية نوم أفضل وانخفاض في ضغط الدم<sup>2</sup>.</li>
                    <li>دراسة Froh et al. على المراهقين: سجلت تحسنًا في الرفاهية العاطفية وزيادة في الدعم الاجتماعي<sup>3</sup>.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="gratitude-practice">
                <AccordionTrigger>تمارين عملية</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>مذكرة الامتنان: دون 3 نقاط ممتن لها كل مساء.</li>
                    <li>رسائل الشكر: اكتب رسالة لطرف قضى لك معروفًا.</li>
                    <li>تأمل الامتنان: خصص 5 دقائق يوميًا للتأمل في النعم.</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* بطاقة التسامح */}
        <Card className="bg-gray-50 shadow-md">
          <CardHeader className="flex items-center space-x-2">
            <Handshake className="w-6 h-6 text-green-500" />
            <h2 className="text-2xl font-semibold">التسامح</h2>
          </CardHeader>
          <CardContent>
            <Accordion type="multiple" collapsible ="true" >
              <AccordionItem value="forgiveness-overview">
                <AccordionTrigger>لمحة عامة</AccordionTrigger>
                <AccordionContent>
                  <p>التسامح هو التخلي عن مشاعر الاستياء والألم تجاه الآخرين بهدف التحرر النفسي والسلام الداخلي.</p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="forgiveness-benefits">
                <AccordionTrigger>الفوائد النفسية والجسدية</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc list-inside space-y-1">
                    <li>خفض التوتر والصحة القلبية.</li>
                    <li>زيادة الشعور بالسلام الداخلي.</li>
                    <li>تحسين العلاقات والارتباط الاجتماعي.</li>
                    <li>تقليل أعراض الاكتئاب والقلق.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="forgiveness-research">
                <AccordionTrigger>أبحاث ودراسات</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-decimal list-inside space-y-1">
                    <li>دراسة Worthington et al. (2006): أظهرت أن جلسات العلاج بالتسامح تقلل من الاكتئاب وتزيد من السعادة<sup>4</sup>.</li>
                    <li>بحوث Toussaint et al. (2015): ربطت التسامح بانخفاض العدائية وتحسين الدعم الاجتماعي<sup>5</sup>.</li>
                    <li>دراسة Fehr et al. (2010): بينت التأثير الإيجابي للتسامح على مقاومة التوتر<sup>6</sup>.</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="forgiveness-practice">
                <AccordionTrigger>تمارين عملية</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>تمرين التعاطف: حاول فهم مبررات الطرف الآخر.</li>
                    <li>مذكرة التسامح: دون مشاعرك تجاه من ترغب في مسامحته.</li>
                    <li>تأكيد السلام: كرر جمل إيجابية مثل "أختار السلام الداخلي".</li>
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
  1. Emmons, R.A., & McCullough, M.E. (2003). Counting blessings and ... Journal of Personality and Social Psychology.
  2. Wood, A.M., Joseph, S., Lloyd, J. (2010). Gratitude influences sleep ... Personality and Individual Differences.
  3. Froh, J.J., Sefick, W.J., Emmons, R.A. (2008). Counting blessings in early adolescents ... Journal of School Psychology.
  4. Worthington, E.L., Witvliet, C.V.O., Pietrini, P., Miller, A.J. (2006). Forgiveness therapy ... Journal of Consulting and Clinical Psychology.
  5. Toussaint, L., Worthington, E.L., Williams, D.R. (2015). Forgiveness and health ... Personality and Social Psychology Review.
  6. Fehr, R., Gelfand, M., Nag, M. (2010). The road to forgiveness ... Psychological Science.
*/
