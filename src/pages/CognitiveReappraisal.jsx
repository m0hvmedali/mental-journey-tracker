import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCcw, Eye, MessageSquareQuote, Save, History, Info, Brain, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { updateProgress } from '../utils/progress';
import { supabase } from '@/supabaseClient'
import  { saveTextToDB } from '@/lib/db'
 export default function CognitiveReappraisal() {
  const nav = useNavigate();
  const [thought, setThought] = useState('');
  const [reframe, setReframe] = useState('');
  const [logs, setLogs] = useState([]);
  const [activeSection, setActiveSection] = useState('intro');
  const [expandedExamples, setExpandedExamples] = useState(false);

  useEffect(() => {
    const fetchLogs = async () => {
      const username = localStorage.getItem('username')
      if (!username) return
  
      const { data, error } = await supabase
        .from('reappraisal_logs')
        .select('*')
        .eq('user_id', username)
        .order('ts', { ascending: false })
  
      if (!error) setLogs(data)
      else console.error('Error loading logs:', error)
    }
  
    fetchLogs()
  }, [])

  const handleSave = async () => {
    if (!thought || !reframe) {
      alert('اكتب الفكرتين يا عبقري 🌪️🧠')
      return
    }
  
    try {
      const newEntry = await saveTextToDB('reappraisal_logs', {
        thought,
        reframe,
      })
  
      setLogs([newEntry, ...logs])
      setThought('')
      setReframe('')
  
      updateProgress({
        entries: 1,
        timeline: { label: 'Cognitive Reappraisal Entry' }
      })
    } catch (error) {
      console.error('Error saving entry:', error)
      alert('حصلت مشكلة أثناء الحفظ 😢')
    }
  }
  
  

 
  

  const commonThoughts = [
    "أنا فاشل في كل شيء",
    "لا أحد يحبني أو يهتم بي",
    "أنا لا أستحق النجاح",
    "كل شيء ضدّي",
    "لن أتحسن أبداً",
    "أنا شخص غير محظوظ",
    "الأخطاء تثبت أنني غير كفء"
  ];

  return (
    <div className="flex flex-col min-h-screen themed-bg font-sans">
      {/* Header */}
      <header className="flex items-center p-4 pb-2 themed-text">
        <button onClick={() => nav(-1)} className="themed-text"><ArrowLeft size={24} /></button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold themed-text">إعادة التقييم المعرفي</h2>
      </header>

      {/* Navigation Tabs */}
      <div className="flex bg-[#e0f0e9] dark:bg-[#1a2820] px-2 border-b themed-border">
        <button 
          onClick={() => setActiveSection('intro')}
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'intro' ? 'border-b-2 border-[#0e8a5f] text-[#0e8a5f]' : 'themed-text-muted'}`}
        >
          <div className="flex items-center gap-1">
            <Info size={16} /> مقدمة
          </div>
        </button>
        <button 
          onClick={() => setActiveSection('exercise')}
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'exercise' ? 'border-b-2 border-[#0e8a5f] text-[#0e8a5f]' : 'themed-text-muted'}`}
        >
          <div className="flex items-center gap-1">
            <RefreshCcw size={16} /> التمرين
          </div>
        </button>
        <button 
          onClick={() => setActiveSection('history')}
          className={`px-4 py-2 text-sm font-medium ${activeSection === 'history' ? 'border-b-2 border-[#0e8a5f] text-[#0e8a5f]' : 'themed-text-muted'}`}
        >
          <div className="flex items-center gap-1">
            <History size={16} /> السجل
          </div>
        </button>
      </div>

      {/* Introduction Section */}
      {activeSection === 'intro' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div className="themed-bg-card rounded-xl border themed-border p-4 space-y-3 shadow-sm">
            <h3 className="text-[#101915] font-bold text-lg flex items-center gap-2">
              <Brain size={20} className="text-[#0e8a5f]" /> ما هي إعادة التقييم المعرفي؟
            </h3>
            <p className="text-[#374151] text-sm leading-relaxed">
              إعادة التقييم المعرفي هي تقنية نفسية قوية تساعدك على تغيير طريقة تفسيرك للمواقف والأحداث السلبية. 
              بدلاً من التركيز على الجوانب السلبية فقط، تتعلم كيف تبحث عن تفسيرات بديلة أكثر توازناً وإيجابية.
            </p>
            <p className="text-[#374151] text-sm leading-relaxed">
              أثبتت الأبحاث العلمية أن هذه المهارة تقلل من مشاعر القلق والاكتئاب، وتحسن المزاج العام، 
              وتزيد من المرونة النفسية في مواجهة التحديات.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 space-y-3 shadow-sm">
            <h3 className="text-[#101915] font-bold text-lg flex items-center gap-2">
              <Lightbulb size={20} className="text-[#0e8a5f]" /> لماذا تعتبر مهمة؟
            </h3>
            <ul className="space-y-2 text-sm text-[#374151]">
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>تساعد في كسر دائرة التفكير السلبي المتكرر</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>تحسن القدرة على التعامل مع الضغوط اليومية</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>تعزز المشاعر الإيجابية والتفاؤل</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>تساعد في بناء نظرة أكثر واقعية للحياة</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 space-y-3 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-[#101915] font-bold text-lg flex items-center gap-2">
                <MessageSquareQuote size={20} className="text-[#0e8a5f]" /> أمثلة عملية
              </h3>
              <button 
                onClick={() => setExpandedExamples(!expandedExamples)}
                className="text-[#0e8a5f] text-sm flex items-center"
              >
                {expandedExamples ? 'تصغير' : 'عرض المزيد'} 
                {expandedExamples ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-3 bg-[#f9fbfa] rounded-lg">
                <p className="text-sm text-[#374151]">
                  <strong className="text-[#dc2626]">الفكرة الأصلية:</strong> "أنا فشلت في المقابلة، يبقى عمري ما هشتغل."
                </p>
                <p className="text-sm text-[#0e8a5f] mt-1">
                  <strong className="text-[#0e8a5f]">إعادة التقييم:</strong> "المقابلة دي كانت فرصة أتعلم منها، وممكن أستعد أحسن للمرة الجاية."
                </p>
              </div>
              
              <div className="p-3 bg-[#f9fbfa] rounded-lg">
                <p className="text-sm text-[#374151]">
                  <strong className="text-[#dc2626]">الفكرة الأصلية:</strong> "أخطائي تثبت أنني فاشل."
                </p>
                <p className="text-sm text-[#0e8a5f] mt-1">
                  <strong className="text-[#0e8a5f]">إعادة التقييم:</strong> "الأخطاء جزء من التعلم، كل مرة أتعلم منها وأصبح أفضل."
                </p>
              </div>
              
              {expandedExamples && (
                <>
                  <div className="p-3 bg-[#f9fbfa] rounded-lg">
                    <p className="text-sm text-[#374151]">
                      <strong className="text-[#dc2626]">الفكرة الأصلية:</strong> "لا أحد يحبني أو يهتم بي."
                    </p>
                    <p className="text-sm text-[#0e8a5f] mt-1">
                      <strong className="text-[#0e8a5f]">إعادة التقييم:</strong> "قد أشعر بالوحدة الآن، لكن هناك أشخاص يهتمون بي، ويمكنني بناء علاقات جديدة."
                    </p>
                  </div>
                  
                  <div className="p-3 bg-[#f9fbfa] rounded-lg">
                    <p className="text-sm text-[#374151]">
                      <strong className="text-[#dc2626]">الفكرة الأصلية:</strong> "كل شيء في حياتي يسير بشكل خاطئ."
                    </p>
                    <p className="text-sm text-[#0e8a5f] mt-1">
                      <strong className="text-[#0e8a5f]">إعادة التقييم:</strong> "هناك تحديات حالية، لكن هناك أيضاً جوانب إيجابية في حياتي يمكنني التركيز عليها."
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 space-y-3 shadow-sm">
            <h3 className="text-[#101915] font-bold text-lg flex items-center gap-2">
              <RefreshCcw size={20} className="text-[#0e8a5f]" /> خطوات إعادة التقييم
            </h3>
            <ol className="space-y-3 text-sm text-[#374151] pl-2">
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">1</span>
                <span><strong>لاحظ الفكرة:</strong> تعرف على الأفكار السلبية عندما تظهر في عقلك</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">2</span>
                <span><strong>اسأل نفسك:</strong> هل هذه الفكرة واقعية؟ هل هناك أدلة تدعمها أو تنفيها؟</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">3</span>
                <span><strong>ابحث عن تفسير بديل:</strong> كيف يمكن تفسير هذا الموقف بشكل أكثر توازناً؟</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">4</span>
                <span><strong>اكتب التقييم الجديد:</strong> صيغ الفكرة الجديدة بلغة إيجابية وواقعية</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">5</span>
                <span><strong>مارس وتدرب:</strong> كلما مارست أكثر، أصبح التغيير أسهل</span>
              </li>
            </ol>
          </div>

          <div className="bg-[#e0f0e9] rounded-xl p-4 space-y-2">
            <h4 className="text-[#0e1b15] font-medium flex items-center gap-2">
              <Lightbulb size={16} /> نصيحة عملية
            </h4>
            <p className="text-sm text-[#374151]">
              لا تحاول "تزييف" المشاعر الإيجابية، بل ابحث عن تفسير أكثر توازناً وواقعية. 
              الهدف ليس إنكار المشاعر السلبية، بل تغيير طريقة تفسيرها.
            </p>
          </div>
        </div>
      )}

      {/* Exercise Section */}
      {activeSection === 'exercise' && (
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 shadow-sm">
            <h3 className="text-[#101915] font-bold text-lg mb-3">تمرين إعادة التقييم</h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-[#0e1b15] mb-2 flex items-center gap-2">
                  <Eye size={18} className="text-[#0e8a5f]" /> الفكرة السلبية
                </h4>
                <p className="text-xs text-[#5a8c76] mb-2">اكتب الفكرة اللي بتدور في دماغك دلوقتي</p>
                <textarea
                  value={thought}
                  onChange={(e) => setThought(e.target.value)}
                  placeholder="مثال: محدش بيحبني، أنا فاشل..."
                  className="w-full p-3 min-h-[100px] bg-[#f9fbfa] border border-[#e0eae5] rounded-xl text-[#101915] focus:outline-none focus:ring-2 focus:ring-[#0e8a5f]/30"
                />
                
                <div className="mt-2">
                  <p className="text-xs text-[#5a8c76] mb-1">أفكار شائعة:</p>
                  <div className="flex flex-wrap gap-2">
                    {commonThoughts.map((t, i) => (
                      <button
                        key={i}
                        onClick={() => setThought(t)}
                        className="px-3 py-1 text-xs bg-[#e0f0e9] text-[#0e8a5f] rounded-full hover:bg-[#cce3d9]"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-[#0e1b15] mb-2 flex items-center gap-2">
                  <RefreshCcw size={18} className="text-[#0e8a5f]" /> إعادة التقييم
                </h4>
                <p className="text-xs text-[#5a8c76] mb-2">اكتب نفس الفكرة بلغة ألطف وأوضح</p>
                <textarea
                  value={reframe}
                  onChange={(e) => setReframe(e.target.value)}
                  placeholder="مثال: يمكن ده إحساس لحظي، لكن في ناس بتحبني فعلًا."
                  className="w-full p-3 min-h-[100px] bg-[#f9fbfa] border border-[#e0eae5] rounded-xl text-[#101915] focus:outline-none focus:ring-2 focus:ring-[#0e8a5f]/30"
                />
                
                <div className="mt-2">
                  <p className="text-xs text-[#5a8c76] mb-1">نصائح للإعادة الصياغة:</p>
                  <ul className="text-xs text-[#5a8c76] space-y-1 pl-4 list-disc">
                    <li>استبدل الكلمات المطلقة (دائماً، أبداً، كل شيء) بكلمات نسبية (أحياناً، بعض، مؤقتاً)</li>
                    <li>ابحث عن الجوانب الإيجابية أو الدروس المستفادة</li>
                    <li>تذكر أن المشاعر مؤقتة وليست حقيقة مطلقة</li>
                    <li>ضع الموقف في سياق أوسع</li>
                  </ul>
                </div>
              </div>
              
              <button
                onClick={handleSave}
                className="flex items-center justify-center gap-2 w-full bg-[#0e8a5f] text-white py-3 rounded-xl font-bold hover:bg-[#0c7a52] transition-colors"
              >
                <Save size={18} /> احفظ التقييم الجديد
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 shadow-sm">
            <h3 className="text-[#101915] font-bold text-lg mb-3">كيف تعيد صياغة الأفكار؟</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 bg-[#f9fbfa] rounded-lg border border-[#e0eae5]">
                <h4 className="font-medium text-[#0e1b15] mb-1">أسئلة تساعدك</h4>
                <ul className="text-xs text-[#5a8c76] space-y-1 pl-4 list-disc">
                  <li>هل هناك تفسير آخر لهذا الموقف؟</li>
                  <li>ما هي الأدلة المؤيدة والمعارضة لهذه الفكرة؟</li>
                  <li>كيف سأنظر لهذا الموقف بعد سنة من الآن؟</li>
                  <li>ماذا سأقول لصديق يعاني من نفس الفكرة؟</li>
                </ul>
              </div>
              
              <div className="p-3 bg-[#f9fbfa] rounded-lg border border-[#e0eae5]">
                <h4 className="font-medium text-[#0e1b15] mb-1">استراتيجيات فعالة</h4>
                <ul className="text-xs text-[#5a8c76] space-y-1 pl-4 list-disc">
                  <li>ابحث عن الجانب التعليمي في التجربة</li>
                  <li>ضع الموقف في سياق أوسع (هذه مشكلة صغيرة في حياتي الكبيرة)</li>
                  <li>تذكر أن المشاعر مؤقتة</li>
                  <li>ركز على ما يمكنك التحكم فيه</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Section */}
      {activeSection === 'history' && (
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 shadow-sm mb-5">
            <h3 className="text-lg font-bold text-[#101915] mb-3 flex items-center gap-2">
              <History size={20} className="text-[#0e8a5f]" /> سجل إعادة التقييم
            </h3>
            
            {logs.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-[#5a8c76]">لا توجد تقييمات مسجلة بعد</p>
                <button 
                  onClick={() => setActiveSection('exercise')}
                  className="mt-3 px-4 py-2 bg-[#0e8a5f] text-white rounded-lg text-sm"
                >
                  ابدأ التمرين الآن
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {logs.map((log, i) => (
                  <div key={i} className="bg-[#f9fbfa] p-4 rounded-xl border border-[#e3e8e6]">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[#374151]"><strong className="text-[#dc2626]">💭:</strong> {log.thought}</p>
                        <p className="text-[#0e8a5f] mt-2"><strong>🔁:</strong> {log.reframe}</p>
                      </div>
                      <span className="text-xs text-[#9ca3af]">
                        {new Date(log.ts).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-xl border border-[#e0eae5] p-4 shadow-sm">
            <h3 className="text-[#101915] font-bold text-lg mb-3">فوائد المتابعة</h3>
            <p className="text-sm text-[#374151] mb-3">
              تتبع سجل إعادة التقييم يساعدك على:
            </p>
            <ul className="text-sm text-[#374151] space-y-2 pl-2">
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>ملاحظة تقدمك وتطور مهاراتك مع الوقت</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>اكتشاف أنماط التفكير المتكررة لديك</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>استرجاع التقييمات الناجحة عندما تمر بموقف مشابه</span>
              </li>
              <li className="flex items-start">
                <span className=" w-5 h-5 mr-2 mt-0.5 flex-shrink-0 rounded-full bg-[#e0f0e9] text-[#0e8a5f] text-xs flex items-center justify-center">✓</span>
                <span>زيادة وعيك بذاتك وطريقة تفكيرك</span>
              </li>
            </ul>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="sticky bottom-4 px-4">
        <button 
          onClick={() => setActiveSection(activeSection === 'exercise' ? 'history' : 'exercise')}
          className="w-full bg-[#0e8a5f] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-[#0c7a52] transition-colors"
        >
          {activeSection === 'exercise' ? 'عرض السجل السابق' : 'البدء في تمرين جديد'}
        </button>
      </div>
    </div>
  );
}