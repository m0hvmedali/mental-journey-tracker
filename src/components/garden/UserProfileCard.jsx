// src/components/garden/UserProfileCard.jsx

export default function UserProfileCard({ profile, progress, onOpenSettings }) {
  const name = profile?.name || 'ملاحق الذات';
  const bio = profile?.bio || 'في رحلة استكشاف الذات والتعافي النفسي وتنمية المرونة.';
  const joinDate = profile?.joinDate || 'أغسطس 2026';
  const firstLetter = name?.trim() ? name.trim().charAt(0).toUpperCase() : 'م';

  const totalSecs = progress?.totalTime || 0;
  const hours = Math.floor(totalSecs / 3600);
  const minutes = Math.floor((totalSecs % 3600) / 60);

  return (
    <div className="bg-bg-surface rounded-3xl p-5 border border-border-medium shadow-2xs space-y-4 transition-colors">
      {/* Header with Settings Button */}
      <div className="flex items-start justify-between gap-4 border-b border-border-subtle pb-4">
        <div className="flex items-start gap-3.5">
          {/* Avatar - First Letter Only */}
          <div className="size-13 sm:size-14 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold shrink-0 shadow-2xs">
            {firstLetter}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-text-primary">{name}</h3>
            <p className="text-xs text-text-muted leading-relaxed max-w-md">
              {bio}
            </p>
            <p className="text-[11px] text-text-muted pt-0.5">
              انضم منذ {joinDate}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="px-3.5 py-2 rounded-xl bg-bg-surface-elevated text-text-primary text-xs font-bold hover:bg-emerald-700 hover:text-white transition-all active:scale-95 shrink-0 border border-border-subtle shadow-2xs cursor-pointer"
        >
          الإعدادات
        </button>
      </div>

      {/* Secondary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
        <div className="p-3 rounded-2xl bg-bg-app border border-border-subtle space-y-1 text-center sm:text-right">
          <p className="text-xs text-text-muted font-medium">الخطوات المكتملة</p>
          <p className="text-lg font-bold text-text-primary">
            {progress?.timeline?.length || 0}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-bg-app border border-border-subtle space-y-1 text-center sm:text-right">
          <p className="text-xs text-text-muted font-medium">سلسلة الاستمرار</p>
          <p className="text-lg font-bold text-text-primary">
            {progress?.streak || 1} {progress?.streak === 1 ? 'يوم' : 'أيام'}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-bg-app border border-border-subtle space-y-1 text-center sm:text-right">
          <p className="text-xs text-text-muted font-medium">المسارات العلاجية</p>
          <p className="text-lg font-bold text-text-primary">
            {progress?.modulesCompleted || 0}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-bg-app border border-border-subtle space-y-1 text-center sm:text-right">
          <p className="text-xs text-text-muted font-medium">زمن الحضور والتأمل</p>
          <p className="text-lg font-bold text-text-primary">
            {hours > 0 ? `${hours}س ` : ''}{minutes}د
          </p>
        </div>
      </div>
    </div>
  );
}
