// src/components/garden/GardenTimeline.jsx

export default function GardenTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="bg-bg-surface rounded-3xl p-6 border border-border-medium text-center space-y-2">
        <h3 className="text-base font-bold text-text-primary">رحلتك حتى الآن</h3>
        <p className="text-xs text-text-muted">سوف تظهر خطواتك ومذكرات إنجازاتك هنا بترتيب زمني بمجرد بدء رحلتك.</p>
      </div>
    );
  }

  // Reverse timeline to show most recent first
  const sorted = [...timeline].reverse();

  // Helper to format relative time in Arabic
  const formatTime = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const now = new Date();
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffHours < 1) return 'منذ قليل';
    if (diffHours < 24) return `منذ ${diffHours} ${diffHours === 1 ? 'ساعة' : 'ساعات'}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'أمس';
    if (diffDays < 7) return `منذ ${diffDays} أيام`;
    return date.toLocaleDateString('ar-EG', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="bg-bg-surface rounded-3xl p-5 border border-border-medium shadow-2xs space-y-4 transition-colors">
      <div className="flex items-center justify-between border-b border-border-subtle pb-3">
        <div>
          <h3 className="text-base font-bold text-text-primary">رحلتك حتى الآن</h3>
          <p className="text-xs text-text-muted">مذكرات زمنية لجميع محطاتك وإنجازاتك النفسية</p>
        </div>

        <span className="text-xs font-semibold text-text-muted bg-bg-surface-elevated px-3 py-1 rounded-full border border-border-subtle">
          {sorted.length} {sorted.length === 1 ? 'محطة' : 'محطات'}
        </span>
      </div>

      <div className="relative pr-4 border-r-2 border-border-subtle space-y-4 my-2">
        {sorted.map((item, idx) => (
          <div key={item.id || idx} className="relative group">
            {/* Dot on timeline stem */}
            <div className="absolute -right-[23px] top-1.5 size-4 rounded-full bg-emerald-600 border-2 border-white dark:border-[#121e1a] shadow-2xs group-hover:scale-125 transition-transform" />

            <div className="p-3.5 rounded-2xl bg-bg-app border border-border-subtle hover:border-emerald-300 transition-all space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-text-primary">
                  {item.title || item.label}
                </h4>
                <span className="text-[11px] font-medium text-text-muted bg-bg-surface px-2 py-0.5 rounded-md border border-border-medium">
                  {formatTime(item.date)}
                </span>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                {item.description || 'خطوة إيجابية مضافة إلى سجل تعافيك ونموك الشخصي.'}
              </p>

              {item.category && (
                <div className="pt-1 flex items-center gap-2">
                  <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 border border-emerald-200/80 dark:border-emerald-700 px-2 py-0.5 rounded-md">
                    {item.category}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
