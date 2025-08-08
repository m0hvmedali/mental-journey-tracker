// src/pages/SelfCompassion.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Quote, PencilLine, BookOpen, Headphones, Users } from 'lucide-react';

export default function SelfCompassion() {
  const nav = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-[#f9fbfa]" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center p-4 pb-2">
        <button onClick={() => nav(-1)} className="text-[#101915]"><ArrowLeft size={24} /></button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#101915]">Self‑Compassion</h2>
      </header>

      <main className="flex-1 overflow-y-auto px-4 pb-10 space-y-6">
        {/* Intro */}
        <section>
          <h1 className="text-[22px] font-bold text-[#101915] pb-1">What is Self‑Compassion?</h1>
          <p className="text-base text-[#374151] leading-relaxed">
            It’s the art of treating yourself with the same kindness, care, and understanding you’d offer a friend in pain.
            It doesn’t mean weakness or self‑pity — it means seeing your suffering with clear eyes and an open heart.
          </p>
        </section>

        {/* Core Components */}
        <section>
          <h2 className="text-lg font-bold text-[#101915]">3 Components (by Kristin Neff)</h2>
          <div className="space-y-4 mt-2">
            <Item icon={<Heart size={18} />} title="Mindfulness – الوعي المتوازن" desc="ملاحظة الألم دون تضخيمه أو تجاهله." />
            <Item icon={<Users size={18} />} title="Common Humanity – الإنسانية المشتركة" desc="أنت مش لوحدك، الألم جزء من التجربة البشرية." />
            <Item icon={<PencilLine size={18} />} title="Self-Kindness – اللطف مع النفس" desc="عامل نفسك بحنية، مش بقسوة أو جلد ذات." />
          </div>
        </section>

        {/* Exercises */}
        <section>
          <h2 className="text-lg font-bold text-[#101915]">Practical Exercises</h2>
          <div className="space-y-4 mt-2">
            <Exercise title="Write a Self‑Compassion Letter" desc="اكتب لنفسك رسالة من منظور صديق رحيم – عبّر عن تفهّمك، وواسِ نفسك." />
            <Exercise title="Hand on Heart" desc="ضع يدك على قلبك، تنفس ببطء، وقل: “أنا في ألم… أستحق الحب والرحمة.”" />
            <Exercise title="What would you say to a friend?" desc="فكر في كلامك لو كان صديقك هو من يمر بنفس حالتك… ثم وجّهه لنفسك." />
          </div>
        </section>

        {/* Quote */}
        <section className="bg-[#e9f1ee] rounded-xl p-4 border border-[#d3e3dc] flex gap-3 items-start">
          <Quote className="text-[#4e9778]" size={24} />
          <p className="text-sm text-[#0e1b15] italic">
            “Self-compassion is simply giving the same kindness to ourselves that we would give to others.”
            <br />– Kristin Neff
          </p>
        </section>

        {/* Resources */}
        <section>
          <h2 className="text-lg font-bold text-[#101915]">Learn More</h2>
          <div className="space-y-3 mt-2">
            <Resource icon={<BookOpen size={18} />} title="Self‑Compassion (Kristin Neff)" url="https://self-compassion.org" />
            <Resource icon={<Headphones size={18} />} title="Self‑Compassion Meditations" url="https://self-compassion.org/category/exercises/#guided-meditations" />
          </div>
        </section>
      </main>
    </div>
  );
}

function Item({ icon, title, desc }) {
  return (
    <div className="flex items-start gap-3">
      <div className="size-10 flex items-center justify-center bg-[#e9f1ee] rounded-lg text-[#4e9778]">{icon}</div>
      <div>
        <p className="font-semibold text-[#0e1b15]">{title}</p>
        <p className="text-sm text-[#374151]">{desc}</p>
      </div>
    </div>
  );
}

function Exercise({ title, desc }) {
  return (
    <div className="border border-[#e3e8e6] rounded-xl p-4 bg-white">
      <p className="font-semibold text-[#0e1b15] mb-1">{title}</p>
      <p className="text-sm text-[#374151]">{desc}</p>
    </div>
  );
}

function Resource({ icon, title, url }) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#e9f1ee] rounded-xl px-3 py-2 text-sm text-[#101915] hover:underline">
      {icon}
      <span>{title}</span>
    </a>
  );
}
