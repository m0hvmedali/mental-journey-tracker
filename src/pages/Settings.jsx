// src/pages/Settings.jsx
import { ArrowLeft, ChevronRight, Moon, Sun, Globe, SkipBack, SkipForward } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext.jsx';
import { useLanguage } from '../contexts/LanguageContext.jsx';
import { useMusic } from '@/contexts/MusicContext.jsx';
import { useNotification } from '@/contexts/NotificationContext.jsx';

export default function Settings() {
  const nav = useNavigate();
  const { theme, toggleTheme, isDark } = useTheme();
  const { language, changeLanguage, t, availableLanguages } = useLanguage();
  const {
    isEnabled, toggleMusic,
    currentTrack, playlist,
    nextTrack, setCurrentTrack,
    playMusic, pauseMusic
  } = useMusic();
  const {
    dailyReminder,
    gratitudeReminder,
    toggleDailyReminder,
    toggleGratitudeReminder,
  } = useNotification();
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col justify-between themed-bg-muted font-[Lexend,Noto_Sans,sans-serif] transition-colors duration-300">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center p-4 pb-2">
          <button onClick={() => nav(-1)} className="themed-text">
            <ArrowLeft size={24} />
          </button>
          <h2 className="flex-1 text-center pr-12 text-lg font-bold themed-text-heading">
            {t('settings.title')}
          </h2>
        </div>

        <Section title="Account">
          <div className="p-6 border-b themed-border-subtle">
            <div className="flex items-center space-x-4">
              <div className="bg-[#7e5bef] text-white rounded-full w-12 h-12 flex items-center justify-center">
                <span className="text-xl">{username?.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-[#7e5bef]">{username}</h2>
                <p className="text-sm themed-text-muted">Member {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </Section>

        {/* Language Section */}
        <Section title={t('settings.language')}>
          {availableLanguages.map((lang) => (
            <Item
              key={lang.code}
              label={lang.name}
              action={
                <button
                  onClick={() => changeLanguage(lang.code)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    language === lang.code
                      ? 'bg-[#6c42ea] text-white'
                      : 'themed-bg-subtle themed-text-muted'
                  }`}
                >
                  {language === lang.code ? '✓' : ''}
                </button>
              }
            />
          ))}
        </Section>

        {/* Appearance Section */}
        <Section title={t('settings.theme')}>
          <Item
            label={t('settings.darkMode')}
            subtext={isDark ? t('settings.darkMode') : t('settings.lightMode')}
            action={
              <div className="flex gap-2 items-center">
                {isDark ? <Moon size={20} className="text-[#9b72ff]" /> : <Sun size={20} className="text-[#6c42ea]" />}
              </div>
            }
            toggle
            checked={isDark}
            onToggle={toggleTheme}
          />
        </Section>

        <Section title="Music Settings">
          <Item
            label="Background Music"
            subtext="Enable background music during app use"
            toggle
            checked={isEnabled}
            onToggle={toggleMusic}
          />
          {isEnabled && (
            <div className="px-4 py-3 flex flex-col gap-3">
              <p className="text-sm themed-text-muted">Now playing: <span className="font-semibold themed-text">{playlist[currentTrack]?.title}</span></p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    const prev = (currentTrack - 1 + playlist.length) % playlist.length;
                    pauseMusic();
                    setTimeout(() => {
                      setCurrentTrack(prev);
                      playMusic();
                    }, 100);
                  }}
                  className="text-sm px-3 py-1 themed-bg-subtle rounded-full text-[#6c42ea] hover:opacity-80 transition"
                >
                  <SkipBack size={20} className="text-[#6c42ea]" />
                </button>
                <button
                  onClick={nextTrack}
                  className="text-sm px-3 py-1 themed-bg-subtle rounded-full text-[#6c42ea] hover:opacity-80 transition"
                >
                  <SkipForward size={20} className="text-[#6c42ea]" />
                </button>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="volume" className="text-sm themed-text-muted">
                  الصوت:
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  defaultValue="0.3"
                  onChange={(e) => {
                    const audio = document.querySelector("audio");
                    if (audio) audio.volume = parseFloat(e.target.value);
                  }}
                  className="w-full"
                />
              </div>
            </div>
          )}
        </Section>

        <Section title="Privacy">
          <p className='text-sm text-[#e04343] ml-3'>
            All your rights and our rights are reserved according to applicable international laws.
            <br />
            Your data is not shared and no one knows your data, not even us.
          </p>
        </Section>

        <Section title="Alerts">
          <Item
            label="Daily Entry Reminder"
            subtext="Set preferred time for daily entry reminders"
            toggle
            checked={dailyReminder}
            onToggle={toggleDailyReminder}
          />
          <Item
            label="Gratitude Writing Reminder"
            subtext="Set preferred time for gratitude writing reminders"
            toggle
            checked={gratitudeReminder}
            onToggle={toggleGratitudeReminder}
          />
        </Section>

        <Section title="About Us">
          <Item
            label="About Project & Team"
            subtext="Learn more about the project & team"
            onClick={() => nav('/about')}
          />
        </Section>

        <Section title="sources">
          <Item
            label="Sources"
            subtext="All sources used are archived here."
            onClick={() => nav('/sources')}
          />
        </Section>

        <Section title="Logout">
          <div className="p-6">
            <button
              onClick={handleLogout}
              className="w-full py-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl font-medium hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
            >
              Logout
            </button>
          </div>
        </Section>
      </div>

      <div>
        <div className="h-5 themed-bg-muted" />
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <>
    <h2 className="themed-text-heading text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
      {title}
    </h2>
    {children}
  </>
);

const Item = ({
  label,
  subtext,
  action = <ChevronRight size={24} className="themed-text-secondary" />,
  toggle = false,
  checked,
  onToggle,
  onClick,
}) => (
  <div
    className="flex items-center justify-between gap-4 px-4 themed-bg-muted min-h-[72px] py-2 border-b themed-border-subtle cursor-pointer"
    onClick={onClick}
  >
    <div className="flex flex-col justify-center">
      <p className="themed-text text-base font-medium">{label}</p>
      {subtext && <p className="themed-text-muted text-sm">{subtext}</p>}
    </div>
    <div className="shrink-0">
      {toggle ? (
        <label className={`relative flex w-[51px] h-[31px] cursor-pointer items-center rounded-full p-0.5 transition-colors ${
          checked ? 'justify-end bg-[#6c42ea]' : 'justify-start themed-bg-subtle'
        }`}>
          <div className="h-full w-[27px] rounded-full bg-white shadow-md transition-all"></div>
          <input
            type="checkbox"
            className="absolute invisible"
            checked={checked}
            onChange={onToggle}
          />
        </label>
      ) : (
        action
      )}
    </div>
  </div>
);