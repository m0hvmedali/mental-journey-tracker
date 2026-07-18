// src/pages/EmotionalRegulation.jsx
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LibraryBig, BookOpenCheck } from 'lucide-react';

export default function EmotionalRegulation() {
  const nav = useNavigate();
  return (
    <div className="relative flex min-h-screen flex-col justify-between themed-bg overflow-x-hidden" style={{ fontFamily: 'Lexend, Noto Sans, sans-serif' }}>
      {/* Header */}
      <header className="flex items-center p-4 pb-2 justify-between">
        <button onClick={() => nav(-1)} className="flex size-12 items-center themed-text"><ArrowLeft size={24} /></button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold themed-text">Mind Skills</h2>
      </header>

      {/* Hero */}
      <section className="@container">
        <div className="@[480px]:px-4 @[480px]:py-3">
          <div
            className="w-full min-h-[218px] bg-cover bg-center @[480px]:rounded-xl"
            style={{ backgroundImage: 'url(/Common-Thinking-Errors.jpeg)' }}
          />
        </div>
      </section>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <h1 className="px-4 pt-5 pb-3 text-[22px] font-bold themed-text">Understanding & Managing Your Emotions, thoughts</h1>
        <p className="px-4 pb-3 text-base themed-text">
          This module teaches you how emotions arise, how they influence thoughts & behaviour, and gives you practical CBT & DBT skills To regulate intense emotions, thoughts and behavior.
        </p>

        {/* Key Concepts */}
        <h3 className="px-4 pt-4 pb-2 text-lg font-bold themed-text">Key Concepts</h3>
        {[
          ['Dictionary of feelings', 'You can find and learn emotions here.', '/EmotionSelect'],
          ['CBT Core', 'Emotion‑Thought‑Behaviour Link (CBT)', '/EmotionCBT'],
          ['Tolerance and gratitude', 'Two of the healthiest feelings', '/ToleranceWindow'],
          ['Regulation vs. Suppression', 'Why managing emotions ≠ pushing them away.', '/SuppressionVsRegulation'],
        ].map(([t, d, path]) => (
          <Concept key={t} title={t} desc={d} path={path} />
        ))}

        {/* Exercises */}
        <h3 className="px-4 pt-4 pb-2 text-lg font-bold themed-text">Skills</h3>
        {[
          ['Emotion Journaling', 'Track triggers, body cues, intensity, coping used.', '/JournalingExercise'],
          ['Be calm', 'Here you will learn how to be calm.', '/Breathing478'],
          ['DBT  Skills', 'Dialectical Behavior Therapy (DBT) Tools', '/DBTTipp'],
          ['Cognitive Re‑appraisal', 'Reframe thoughts driving stuck emotions.', '/CognitiveReappraisal'],
        ].map(([t, d, path]) => (
          <Exercise key={t} title={t} desc={d} path={path} />
        ))}
      </main>
    </div>
  );
}

const Concept = ({ title, desc, path }) => {
  const nav = useNavigate();
  return (
    <div onClick={() => nav(path)} className="flex items-center gap-4 px-6 py-2 cursor-pointer hover:themed-bg-subtle rounded-lg transition-colors">
      <div className="size-12 flex items-center justify-center rounded-lg themed-bg-subtle themed-text-secondary">
        <LibraryBig size={24} />
      </div>
      <div>
        <p className="text-base font-medium themed-text">{title}</p>
        <p className="text-sm themed-text-muted">{desc}</p>
      </div>
    </div>
  );
};

const Exercise = ({ title, desc, path }) => {
  const nav = useNavigate();
  return (
    <div onClick={() => nav(path)} className="flex items-center gap-4 px-6 py-2 cursor-pointer hover:themed-bg-subtle rounded-lg transition-colors">
      <div className="size-12 flex items-center justify-center rounded-lg themed-bg-subtle themed-text-secondary">
        <BookOpenCheck size={24} />
      </div>
      <div>
        <p className="text-base font-medium themed-text">{title}</p>
        <p className="text-sm themed-text-muted">{desc}</p>
      </div>
    </div>
  );
};
