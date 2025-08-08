 // src/pages/ModuleDetail.jsx – تفاصيل كل موديول علمي
import { useParams, useNavigate } from 'react-router-dom';

export const MODULE_DATA = [
  {
    id: '1',
    slug: "thinking-errors",
    title: 'Thinking Errors',
    tagline: 'Identify and challenge common cognitive distortions.',
    hero:'https://lh3.googleusercontent.com/aida-public/AB6AXuBNTzJhCtwyXnAIlSIJ49yjs-nlzGIlWjiojFIu8ZSG7EmpSxTCl0rbUMVAB5ok0bxc9NAvQLt3yU6F15XRopQTJ83V0-uSg13mOl8lNCOWhkLVPZEN0yM4yvBTEYYLxVcoB6_YxiTi69BYUPPHk0hoy3a0rRUaHGdfVDPNRyTeaZUQhZPYdGoozKIecycGWsczkTf8YgEykyhlniAd9Upv2nfqIgS4bVjVlBnxQfpasajqyl1VQ8dKIuHT1i3_kfbeRNevmdWsD68p',
    overview: `Cognitive distortions are biased ways of thinking that reinforce negative thoughts and emotions. They fuel anxiety, depression, and unhelpful behaviours. Becoming aware of these patterns is the first step to changing them.`,
    learningObjectives: [
      'Recognise at least 10 common cognitive distortions.',
      'Practise a 3‑step technique to challenge distorted thoughts.',
      'Track personal thinking errors for one week.',
    ],
    lessons: [
      { title: 'What Are Thinking Errors?', minutes: 8 },
      { title: 'Top 10 Distortions (with examples)', minutes: 15 },
      { title: 'The ABC Thought Record', minutes: 10 },
      { title: 'Reframing & Reality‑Testing', minutes: 12 },
    ],
  },
  {
    id: '2',
    slug: 'defense-mechanisms',
    title: 'Defense Mechanisms',
    tagline: 'Understand how your mind protects itself from stress.',
    hero:'https://lh3.googleusercontent.com/aida-public/AB6AXuC2c4sebKfaBNxFQNU_3cXgxCahoUjRl4o9piGRR0avtasonepUxy6LUQnuCu07N1RG0-wJ0DbDwzQUZhVQXvmnStiRlrmM6P9ijJAmM8WoadvYnxE-kddSvmB9662q0gwrdRuWgorZx-w6Y1MBiLmrEKVZZaO16jbto1L8h6ZTammjfZMap6PiQ6YMQrBPuXaYC37k92QytIyAZrZbi21EprvciZQlCHz4tEl38aknU2unb-H4sRHc4iyUAiL7nYTze3i3MJxM1xRH',
    overview: `Defense mechanisms are unconscious processes that reduce anxiety by distorting reality. Knowing them helps you respond consciously instead of reacting automatically.`,
    learningObjectives: [
      'Define defence mechanisms & why they develop.',
      'Differentiate adaptive vs. maladaptive defences.',
      'Apply mindfulness to notice your own defences in action.',
    ],
    lessons: [
      { title: 'Freud & The Ego', minutes: 6 },
      { title: '20 Classic Defence Mechanisms', minutes: 18 },
      { title: 'Healthy vs. Unhealthy Use', minutes: 9 },
      { title: 'Building Adaptive Coping', minutes: 11 },
    ],
  },
  {
    id: '3',
    slug: 'emotional-regulation',
    title: 'Emotional Regulation',
    tagline: 'Techniques to manage and express emotions effectively.',
    hero:'https://lh3.googleusercontent.com/aida-public/AB6AXuDAZMNTmZspaXqHRIueDF3Jo_P6BH4HV-ISBflPf6y6gknJZ6NpwUXycWRX9tX69kxTAVI2Vs8yq0_7EALOFWHO__Q-5L9AdMy5xvF9LLPRUM1LMPs3tVU3Y7x3SoNPB1T3MSYN6ao7nGI9D6T-AbINl1MjWCELPSg4qa2niqyFyZDPFHLj7hJ_Byrv3BcpLrkR2ovyRb9w3jxFpWtCWzxhGH83gPUmJwGPe2LOqZvqkjVNsDsnpKtW_zrbzOveNKdZ86w9F23udlQd',
    
    overview: `Emotion regulation is the ability to monitor and modify emotional reactions. DBT & CBT strategies teach skills to calm the nervous system and act in line with your values.`,
    learningObjectives: [
      'Understand the emotion‑regulation cycle.',
      'Practise grounding & paced breathing.',
      'Create a personal coping plan for high‑intensity feelings.',
    ],
    lessons: [
      { title: 'Why We Have Emotions', minutes: 7 },
      { title: 'DBT: PLEASE + TIPP Skills', minutes: 14 },
      { title: 'CBT: Situation‑Thought‑Feeling', minutes: 10 },
      { title: 'Building an ER Toolkit', minutes: 13 },
    ],
  },
  {
    id: '4',
    slug: 'relationship-dynamics',
    title: 'Relationship Dynamics',
    tagline: 'Patterns & communication styles that shape connection.',
    hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClFL4EWtw0szdkXeYmlEG-34tQ80N3ThAVwsgxvdRMaaInfb_82rQDCt7TyMQ-6FQj7-LgEAOsK1evcmisnfwViORMpdKARDZxjA1RQsd9zwrKBIKg954KTJgaVHuB0mNh7E-ByGM_aQS-g5kXQItGDY_EVDB57xd0DynbaLQgeso4_vI4hFFpm4wB4nI-ocEHx3R0K21XqtNRT3euu24NIovC3sCMvVyaWicctGN49vVgyIuPfEVBP0WtTIFANU_RdAlY5VMsaW8w',
    
    overview: `Relationship dynamics are recurring patterns between people. Recognising cycles like pursuer–distancer helps you break negative loops and build secure bonds.`,
    learningObjectives: [
      'Identify your attachment style.',
      'Spot 3 common unhealthy patterns.',
      'Practise assertive listening & "I" statements.',
    ],
    lessons: [
      { title: 'Attachment 101', minutes: 9 },
      { title: '12 Common Dynamics', minutes: 15 },
      { title: 'Communication Reset', minutes: 12 },
      { title: 'Creating Secure Connection', minutes: 14 },
    ],
  },
  {
    id: '5',
    slug: 'self-compassion',
    title: 'Self‑Compassion',
    tagline: 'Cultivate kindness and understanding toward yourself.',
    hero:'https://lh3.googleusercontent.com/aida-public/AB6AXuBwag2XGmo4n1YtNR_eLKc-bT4tpa7I-ObjUbpLN6KgoDjqrQ6J-1w6GVKAg7YdX0onQXZuSyHoZ-foHzlZiFBkKUnPTYp7YmySoTBzSLzjeDdVchHy_S_gMZeiuJOUmw71XRnUpD5dVpC7dbwX6bUKQCnd3yjTOGsnLTm65MzrsGrs1QarvJbTPjTrRHijkLCBAdem5j3C9s4h7pZhmyXcDZE_IU-CdqTKxNxGJqfp_CAGCEGrW5Iwgsh5Tx-kOtdjHGO965V_Q_hK',
    
    overview: `Self‑compassion means treating yourself with warmth in times of failure. Research shows it boosts resilience, motivation, and wellbeing.`,
    learningObjectives: [
      'Define the 3 components of self‑compassion (Neff).',
      'Practise the Self‑Compassion Break exercise.',
      'Replace negative self‑talk with supportive language.',
    ],
    lessons: [
      { title: 'Myth‑busting Self‑Compassion', minutes: 8 },
      { title: 'The Self‑Compassion Break', minutes: 10 },
      { title: 'Daily Micro‑practices', minutes: 9 },
      { title: 'Building a Kind Inner Voice', minutes: 11 },
    ],
  },
];

export default function ModuleDetail() {
    const { slug } = useParams();
    const module = MODULE_DATA.find((m) => m.slug === slug);
  
    if (!module) return <div className="p-4">Module not found.</div>;

  return (
    <div className="flex flex-col min-h-screen bg-[#f9fbfa] font-sans">
      {/* Header */}
      <header className="flex justify-between items-center p-4 pb-2">
        <button onClick={() => navigate(-1)} className="flex size-12 shrink-0 items-center text-[#0e1b15]">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256"><path d="M224 128a8 8 0 0 1-8 8H59.31l58.35 58.34a8 8 0 0 1-11.32 11.32l-72-72a8 8 0 0 1 0-11.32l72-72a8 8 0 0 1 11.32 11.32L59.31 120H216a8 8 0 0 1 8 8Z"/></svg>
        </button>
        <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#0e1b15]">{module.title}</h2>
      </header>

      <img src={module.hero} alt="banner" className="w-full object-cover aspect-[16/9]" />

      <div className="px-4 py-5 space-y-6">
        {/* Overview */}
        <section>
          <h3 className="text-xl font-bold mb-2 text-[#0e1b15]">Overview</h3>
          <p className="text-sm text-[#374151] leading-relaxed whitespace-pre-line">{module.overview}</p>
        </section>

        {/* Objectives */}
        <section>
          <h3 className="text-xl font-bold mb-2 text-[#0e1b15]">Learning Objectives</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#0e1b15]">
            {module.learningObjectives.map((o) => <li key={o}>{o}</li>)}
          </ul>
        </section>

        {/* Lessons */}
        <section>
          <h3 className="text-xl font-bold mb-2 text-[#0e1b15]">Lessons</h3>
          <div className="space-y-2">
            {module.lessons.map((l, idx) => (
              <div key={idx} className="flex justify-between bg-[#e7f3ee] rounded-lg px-3 py-2 text-sm text-[#0e1b15]">
                <span>{l.title}</span>
                <span>{l.minutes} min</span>
              </div>
            ))}
          </div>
        </section>

        {/* Coping / Practices */}
        <section>
          <h3 className="text-xl font-bold mb-2 text-[#0e1b15]">Practice Tips</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-[#0e1b15]">
            {module.coping?.map((c) => <li key={c}>{c}</li>)}
          </ul>
        </section>
      </div>
    </div>
  );
}
