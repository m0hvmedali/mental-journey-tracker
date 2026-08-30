// src/pages/Settings.jsx
import React from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Moon, 
  Sun, 
  Laptop, 
  SkipBack, 
  SkipForward, 
  User, 
  Palette, 
  Globe, 
  Music, 
  Bell, 
  ShieldCheck, 
  Info, 
  LogOut,
  ChevronLeft,
  Play,
  Pause,
  Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useMusic } from '@/contexts/MusicContext.jsx'; 
import { useNotification } from '@/contexts/NotificationContext.jsx';

export default function Settings() {
  const nav = useNavigate();
  const { theme, setTheme } = useTheme();
  const { language, changeLanguage, t, availableLanguages } = useLanguage();
  const { 
    isPlaying,
    isEnabled, 
    toggleMusic, 
    currentTrack, 
    playlist, 
    nextTrack, 
    prevTrack,
    playMusic, 
    pauseMusic
  } = useMusic();
  const {
    dailyReminder,
    gratitudeReminder,
    toggleDailyReminder,
    toggleGratitudeReminder,
  } = useNotification();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    window.location.href = '/';
  };

  const isRtl = language === 'ar';

  return (
    <div className="min-h-screen bg-bg-app text-text-primary pb-44 sm:pb-48 transition-colors">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-bg-surface/90 backdrop-blur-md border-b border-border-subtle px-4 sm:px-6 py-3.5 sm:py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => nav(-1)} 
            className="size-10 rounded-xl bg-bg-surface-elevated border border-border-subtle text-text-primary hover:bg-bg-surface-hover flex items-center justify-center transition-all shrink-0 active:scale-95"
            aria-label="رجوع"
          >
            {isRtl ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
          </button>
          
          <h1 className="text-base sm:text-lg font-bold text-text-primary tracking-tight">
            {t('settings.title')}
          </h1>

          <div className="size-10 shrink-0" /> {/* Spacer for symmetry */}
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Account Section */}
        <Section title={isRtl ? 'الحساب' : 'Account'} icon={<User size={18} />} className="mb-4">
          <div className="p-5 flex items-center gap-4">
            <div className="size-13 sm:size-14 bg-emerald-700 dark:bg-emerald-600 text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs shrink-0">
              {username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-text-primary">
                {username || 'مستخدم'}
              </h3>
              <p className="text-xs text-text-muted">
                عضو منذ {new Date().toLocaleDateString(isRtl ? 'ar-EG' : 'en-US')}
              </p>
            </div>
          </div>
        </Section>

        {/* Appearance / Theme Section */}
        <Section title={t('settings.theme')} icon={<Palette size={18} />} className="mb-4">
          <div className="p-5 space-y-3.5">
            <p className="text-xs font-medium text-text-muted">
              {isRtl ? 'اختر المظهر المفضل للتطبيق:' : 'Choose your preferred app theme:'}
            </p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'light', label: isRtl ? 'فاتح' : 'Light', icon: Sun },
                { id: 'dark', label: isRtl ? 'داكن' : 'Dark', icon: Moon },
                { id: 'system', label: isRtl ? 'تلقائي' : 'System', icon: Laptop }
              ].map((mode) => {
                const Icon = mode.icon;
                const isActive = theme === mode.id;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setTheme(mode.id)}
                    className={`flex flex-col items-center justify-center py-3.5 px-3 rounded-2xl border text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-emerald-500/15 border-2 border-emerald-600 dark:border-emerald-400 text-emerald-800 dark:text-emerald-300 shadow-2xs' 
                        : 'bg-bg-surface-elevated border-border-subtle text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary'
                    }`}
                  >
                    <Icon size={20} className={`mb-2 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : ''}`} />
                    <span>{mode.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Section>

        {/* Language Section */}
        <Section title={t('settings.language')} icon={<Globe size={18} />} className="mb-4">
          <div className="divide-y divide-border-subtle">
            {availableLanguages.map((lang) => (
              <Item
                key={lang.code}
                label={lang.name}
                onClick={() => changeLanguage(lang.code)}
                action={
                  <div className={`size-6 rounded-full border flex items-center justify-center text-xs font-bold transition-all ${
                    language === lang.code
                      ? 'bg-emerald-600 dark:bg-emerald-500 border-emerald-600 dark:border-emerald-500 text-white shadow-2xs'
                      : 'border-border-medium text-transparent'
                  }`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                }
              />
            ))}
          </div>
        </Section>

        {/* Music Settings */}
        <Section title={isRtl ? 'إعدادات الصوت والموسيقى' : 'Audio & Music'} icon={<Music size={18} />} className="mb-4">
          <div className="divide-y divide-border-subtle">
            <Item
              label={isRtl ? 'الموسيقى الخلفية' : 'Background Music'}
              subtext={isRtl ? 'تشغيل الموسيقى الهادئة أثناء التصفح' : 'Play calming music while browsing'}
              toggle
              checked={isEnabled}
              onToggle={toggleMusic}
              isRtl={isRtl}
            />

            {isEnabled && (
              <div className="p-5 bg-emerald-500/10 dark:bg-emerald-950/30 border-t border-border-subtle space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted font-medium">
                    {isRtl ? 'المقطع الحالي:' : 'Current track:'}
                  </span>
                  <span className="font-bold text-emerald-800 dark:text-emerald-300 truncate max-w-[200px]">
                    {playlist[currentTrack]?.title || (isRtl ? 'مقطع صوتي' : 'Audio Track')}
                  </span>
                </div>

                <div className="flex items-center justify-center gap-3 pt-1">
                  <button
                    onClick={prevTrack}
                    className="p-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover transition active:scale-95"
                    title={isRtl ? "السابق" : "Previous"}
                  >
                    <SkipForward size={18} />
                  </button>

                  <button
                    onClick={isPlaying ? pauseMusic : playMusic}
                    className="p-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white shadow-xs transition active:scale-95"
                    title={isPlaying ? (isRtl ? "إيقاف مؤقت" : "Pause") : (isRtl ? "تشغيل" : "Play")}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                  </button>

                  <button
                    onClick={nextTrack}
                    className="p-2.5 rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover transition active:scale-95"
                    title={isRtl ? "التالي" : "Next"}
                  >
                    <SkipBack size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Section>

        {/* Alerts Section */}
        <Section title={isRtl ? 'التنبيهات واليوميات' : 'Notifications'} icon={<Bell size={18} />} className="mb-4">
          <div className="divide-y divide-border-subtle">
            <Item
              label={isRtl ? 'تذكير التدوين اليومي' : 'Daily Journal Reminder'}
              subtext={isRtl ? 'تنبيه يومي لمتابعة مشاعرك وإنجازاتك' : 'Daily alert to reflect on your feelings'}
              toggle
              checked={dailyReminder}
              onToggle={toggleDailyReminder}
              isRtl={isRtl}
            />
            <Item
              label={isRtl ? 'تذكير كتابة الامتنان' : 'Gratitude Reminder'}
              subtext={isRtl ? 'تنبيه لكتابة رسائل الامتنان والأمل' : 'Reminder to write gratitude notes'}
              toggle
              checked={gratitudeReminder}
              onToggle={toggleGratitudeReminder}
              isRtl={isRtl}
            />
          </div>
        </Section>

        {/* Privacy Section */}
        <Section title={isRtl ? 'الخصوصية والأمان' : 'Privacy & Security'} icon={<ShieldCheck size={18} />} className="mb-4">
          <div className="p-5">
            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
              {isRtl 
                ? 'جميع بياناتك وملاحظاتك محفوظة بأمان وخاصة بك تماماً. لا يتم مشاركة بياناتك الشخصية مع أي طرف آخر.'
                : 'All your data and notes are securely stored and completely private. Your personal information is never shared.'}
            </p>
          </div>
        </Section>

        {/* About & Sources Section */} 
        <Section title={isRtl ? 'عن المشروع والمصادر' : 'About & Sources'} icon={<Info size={18} />} className="mb-6">
          <div className="divide-y divide-border-subtle">
            <Item
              label={isRtl ? 'عن الفريق والمشروع' : 'About the Project'}
              subtext={isRtl ? 'تعرف على رؤية المشروع وفريق العمل' : 'Learn more about our mission and team'}
              onClick={() => nav('/about')}
            />
            <Item
              label={isRtl ? 'المصادر والمرجعيات' : 'References & Sources'}
              subtext={isRtl ? 'جميع المصادر العلمية المستخدمة مؤرشفة هنا' : 'Scientific sources and references'}
              onClick={() => nav('/sources')}
            />
            <Item
              label={isRtl ? 'مشاهدة الجولة التعريفية والترحيبية' : 'View Welcome Tutorial'}
              subtext={isRtl ? 'إعادة تشغيل قصة الترحيب والإرشادات بمظهر إنستاجرام' : 'Replay the Instagram-style welcome and guidelines story'}
              onClick={() => {
                window.dispatchEvent(new CustomEvent('show-onboarding'));
              }}
            />
          </div>
        </Section>

        {/* Logout Section */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-4 px-5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl font-bold text-sm flex items-center justify-center gap-2.5 transition-all shadow-2xs active:scale-98 cursor-pointer"
          >
            <LogOut size={18} />
            <span>{isRtl ? 'تسجيل الخروج (Logout)' : 'Log Out'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

const Section = ({ title, icon, children, className = '' }) => (
  <div className={`bg-bg-surface rounded-2xl border border-border-subtle shadow-2xs overflow-hidden transition-colors ${className}`}>
    <div className="px-5 py-3.5 bg-bg-surface-elevated/70 border-b border-border-subtle flex items-center gap-3">
      <div className="size-8 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
        {icon}
      </div>
      <h2 className="text-sm font-bold text-text-primary">
        {title}
      </h2>
    </div>
    {children}
  </div>
);

const Item = ({
  label,
  subtext,
  action,
  toggle = false,
  checked = false,
  onToggle,
  onClick,
  isRtl = true,
}) => (
  <div 
    className={`flex items-center justify-between gap-4 px-5 py-4 min-h-[64px] ${
      onClick ? 'cursor-pointer hover:bg-bg-surface-hover transition-colors' : ''
    }`}
    onClick={onClick}
  >
    <div className="flex flex-col justify-center space-y-1">
      <p className="text-text-primary text-sm font-semibold leading-snug">{label}</p>
      {subtext && <p className="text-text-muted text-xs leading-relaxed">{subtext}</p>}
    </div>
    <div className="shrink-0">
      {toggle ? (
        <button 
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
          className={`relative flex h-7 w-12 cursor-pointer items-center rounded-full p-1 transition-colors duration-200 ${
            checked 
              ? 'bg-emerald-600 dark:bg-emerald-500' 
              : 'bg-bg-surface-elevated border border-border-medium'
          }`}
          aria-checked={checked}
        >
          <span
            className={`size-5 rounded-full bg-white shadow-xs transition-transform duration-200 ${
              checked 
                ? (isRtl ? '-translate-x-5' : 'translate-x-5') 
                : 'translate-x-0'
            }`}
          />
        </button>
      ) : action ? (
        action
      ) : (
        <ChevronLeft size={18} className="text-text-muted rtl:rotate-0 ltr:rotate-180" />
      )}
    </div>
  </div>
);
