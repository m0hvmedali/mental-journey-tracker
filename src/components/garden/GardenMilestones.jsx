// src/components/garden/GardenMilestones.jsx

export default function GardenMilestones({ progress }) {
  const totalSteps = progress?.timeline?.length || 0;
  const streak = progress?.streak || 0;
  const modulesCompleted = progress?.modulesCompleted || 0;

  const milestones = [
    {
      id: 'first_step',
      title: 'البداية',
      subtitle: 'أول خطوة في طريق الوعي',
      desc: 'بدأت رحلتك وغرست أول بذرة في حديقتك الشخصية.',
      isUnlocked: totalSteps >= 1,
      requirement: 'إكمال خطوة واحدة'
    },
    {
      id: 'streak_3',
      title: 'الاستمرار',
      subtitle: 'حضور ورعاية ذاتية',
      desc: 'المواظبة على العودة وتقديم العناية بنفسك.',
      isUnlocked: streak >= 3 || totalSteps >= 3,
      requirement: '3 أيام حضور أو 3 إنجازات'
    },
    {
      id: 'discovery',
      title: 'الاكتشاف',
      subtitle: 'فهم وتعبير عن المشاعر',
      desc: 'التعرف على أنماط تفكيرك ورسم خريطة مشاعرك.',
      isUnlocked: totalSteps >= 5,
      requirement: '5 خطوات وإنجازات متراكمة'
    },
    {
      id: 'deepening',
      title: 'التعمق',
      subtitle: 'إكمال مسار علاج كامل',
      desc: 'استكمال وحدات علاجية وتطبيق تمارين عميقة.',
      isUnlocked: modulesCompleted >= 1 || totalSteps >= 8,
      requirement: 'إكمال مسار علاجي كامل'
    },
    {
      id: 'serenity_well',
      title: 'التطبيق ',
      subtitle: 'الاستمرارية المستدامة',
      desc: 'تحويل مهارات تنظيم المشاعر والتأريض إلى نمط حياة.',
      isUnlocked: totalSteps >= 15 || streak >= 7,
      requirement: '15 خطوة أو 7 أيام استمرار'
    }
  ];

  const unlockedCount = milestones.filter(m => m.isUnlocked).length;

  return (
    <div className="bg-bg-surface rounded-3xl p-5 border border-border-medium shadow-2xs space-y-4 transition-colors">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h3 className="text-base font-bold text-text-primary">المحطات التي وصلت إليها</h3>
          <p className="text-xs text-text-muted">ذكريات معنوية توثق تعمقك ونموك النفسي</p>
        </div>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
          {unlockedCount} / {milestones.length} محطة
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {milestones.map((ms) => (
          <div
            key={ms.id}
            className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
              ms.isUnlocked 
                ? 'bg-bg-app border-emerald-300/80 shadow-2xs' 
                : 'bg-bg-surface-elevated/60 border-border-medium/80 opacity-70'
            }`}
          >
            <div className="space-y-1 flex-1">
              <div className="flex items-center justify-between gap-1">
                <h4 className={`text-sm font-bold ${ms.isUnlocked ? 'text-text-primary' : 'text-slate-500'}`}>
                  {ms.title}
                </h4>
                {ms.isUnlocked && (
                  <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-100 px-2 py-0.5 rounded-md">
                    مكتملة
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                {ms.subtitle}
              </p>
              <p className="text-xs text-text-muted leading-relaxed">
                {ms.desc}
              </p>
              {!ms.isUnlocked && (
                <p className="text-[10px] text-text-muted pt-1">
                  المطلوب: {ms.requirement}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
