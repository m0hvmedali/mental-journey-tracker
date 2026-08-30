import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
 ArrowLeft, HeartHandshake, HeartOff, ShieldX, HelpCircle,
 UserCheck, User, Users, MessageCircle, Laugh, Meh, Frown
} from 'lucide-react';

/* 1️⃣ أنماط التعلق ---------------------------------------------- */
const ATTACHMENT = [
 {
 key: 'secure',
 title: 'Secure (آمن)',
 icon: <UserCheck size={18} />,
 desc: 'يشعر بالثقة — يطلب الدعم ويمنحه بسهولة.',
 effect: 'يسمح بعلاقات مستقرة ومرضية.'
 },
 {
 key: 'avoidant',
 title: 'Avoidant (متجنّب)',
 icon: <HeartOff size={18} />,
 desc: 'يخاف من الاعتماد — يبتعد عندما تقترب.',
 effect: 'يُشعر الآخر بالرفض وعدم الأمان.'
 },
 {
 key: 'anxious',
 title: 'Anxious (قلِق)',
 icon: <ShieldX size={18} />,
 desc: 'يبحث باستمرار عن الطمأنة والتواصل.',
 effect: 'علاقة دوّامة طلب/انسحاب.'
 },
 {
 key: 'disorg',
 title: 'Disorganized (مُشوَّش)',
 icon: <HelpCircle size={18} />,
 desc: 'يمزج القرب والهروب، غالبًا بعد صدمات.',
 effect: 'يصنع فوضى وتقلّب حادّ بالمشاعر.'
 }
];

/* 2️⃣ أنماط التواصل --------------------------------------------- */
const COMM = [
 {
 key: 'assertive',
 title: 'Assertive (حازم محترم)',
 icon: <Users size={18} />,
 desc: 'واضح، مباشر، يحترم نفسه والآخر.',
 effect: 'أكثر نمط صحّي يبني الثقة.'
 },
 {
 key: 'passive',
 title: 'Passive (سلبي)',
 icon: <Meh size={18} />,
 desc: 'يسكت عن احتياجاته خوفًا من المواجهة.',
 effect: 'تراكم مشاعر وانفجار لاحق.'
 },
 {
 key: 'aggressive',
 title: 'Aggressive (عدواني)',
 icon: <Frown size={18} />,
 desc: 'يفرض رأيه بقوة دون مراعاة.',
 effect: 'توتر، خوف، انسحاب.'
 },
 {
 key: 'pas‑agg',
 title: 'Passive‑Aggressive',
 icon: <Laugh size={18} />,
 desc: 'يعبر بسخرية أو تجاهل بدل الوضوح.',
 effect: 'حيرة وفقدان ثقة.'
 }
];

/* 3️⃣ استبيان سريع ---------------------------------------------- */
const QUIZ = [
 { q: 'آخر نقاش… كنت أكثر:', a: ['واضح', 'ساكت', 'هجومي', 'ساخر'] },
 { q: 'لما حد يقرب قوي، أنا غالبًا', a: ['مرتاح', 'بهرب', 'بلزق زيادة', 'متلخبط'] }
];

export default function RelationshipDynamics() {
 const nav = useNavigate();
 const [open, setOpen] = useState(null);
 const [answers, setAnswers] = useState(Array(QUIZ.length).fill(''));

 /* تحليل مبسّط */
 const analyse = () => {
 const agg = answers.join(' ');
 if (/هجومي|عدواني|سخر/i.test(agg)) return 'يميل للتواصل العدواني أو السلبي‑العدواني.';
 if (/ساكت|هرب/i.test(agg)) return 'نمط تجنّبي/سلبي يحتاج وضوح.';
 if (/واضح|مرتاح/i.test(agg)) return 'تواصل حازم ونمط آمن 👏';
 return 'بحاجة لوعي أعمق بالنمط.';
 };

 return (
 <div className="flex flex-col min-h-screen bg-bg-app" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
 {/* Header */}
 <header className="flex items-center p-4 pb-2">
 <button onClick={() => nav(-1)} className="text-text-primary"><ArrowLeft size={24} /></button>
 <h2 className="flex-1 text-center pr-12 text-lg font-bold text-text-primary">Relationship Dynamics</h2>

 </header>

 <main className="flex-1 overflow-y-auto px-4 pb-8 space-y-6">

 {/* Attachment styles */}
 <Section title="أنماط التعلق (Attachment Patterns)" data={ATTACHMENT} open={open} setOpen={setOpen} />

 {/* Communication styles */}
 <Section title="أنماط التواصل (Communication Styles)" data={COMM} open={open} setOpen={setOpen} offset={ATTACHMENT.length} />

 {/* Quick self‑check */}
 <h3 className="text-lg font-bold text-text-primary mt-6 mb-3">📝 استبيان ذاتي سريع</h3>
 <div className="space-y-4">
 {QUIZ.map((item, i) => (
 <div key={i} className="bg-bg-surface p-4 rounded-xl border border-border-medium">
 <p className="mb-2 font-medium text-text-primary">{item.q}</p>
 <div className="grid grid-cols-2 gap-2">
 {item.a.map((opt) => (
 <button
 key={opt}
 onClick={() => setAnswers(a => { const c=[...a]; c[i]=opt; return c; })}
 className={`rounded-lg p-2 text-sm ${answers[i]===opt?'bg-[#afe8cf] text-text-primary':'bg-bg-surface-elevated text-text-muted'}`}
 >
 {opt}
 </button>
 ))}
 </div>
 </div>
 ))}
 {answers.every(Boolean) && (
 <p className="text-sm text-emerald-600 bg-bg-surface-elevated rounded-xl p-3">
 <strong>تحليل مبدئي:</strong> {analyse()}
 </p>
 )}
 </div>
 </main>
 </div>
 );
}

/* Accordion Section Component */
function Section({ title, data, open, setOpen, offset=0 }) {
 return (
 <>
 <h3 className="text-lg font-bold text-text-primary">{title}</h3>
 <div className="space-y-3">
 {data.map((d, idx) => {
 const i = idx + offset;
 return (
 <div key={d.key} className="border border-border-medium rounded-xl bg-bg-surface">
 <button
 onClick={() => setOpen(open===i?null:i)}
 className="w-full flex justify-between items-center px-4 py-3 text-right"
 >
 <div className="flex items-center gap-3">
 <div className="size-10 flex items-center justify-center rounded-lg bg-bg-surface-elevated text-text-primary">
 {d.icon}
 </div>
 <p className="font-semibold text-text-primary">{d.title}</p>
 </div>
 <svg className={`transition-transform ${open===i?'rotate-180':''}`} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4e9778" strokeWidth="2"><path d="M6 9l6 6 6-6"/></svg>
 </button>
 {open===i && (
 <div className="px-4 pb-4 text-sm text-text-secondary bg-bg-app space-y-1">
 <p><strong>الوصف:</strong> {d.desc}</p>
 <p><strong>الأثر:</strong> {d.effect}</p>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </>
 );
}
