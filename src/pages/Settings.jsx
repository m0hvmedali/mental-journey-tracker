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
  const navigate = useNavigate()
  const username = localStorage.getItem('username')

  const handleLogout = () => {
    localStorage.removeItem('username')
    navigate('/')
  }
  return (
    <div className="flex min-h-screen flex-col justify-between bg-[#f9f8fc]  font-[Lexend, Noto Sans, sans-serif] transition-colors">
      <div>
        {/* Header */}
        <div className="flex justify-between items-center p-4 pb-2">
          <button onClick={() => nav(-1)} className="text-[#110e1b] ">
            <ArrowLeft size={24} />
          </button>
          <h2 className="flex-1 text-center pr-12 text-lg font-bold text-[#110e1b] ">
            {t('settings.title')}
          </h2>
        </div>


<Section title="Account">
<div className="p-6 border-b border-[#e0d6ff]">
          <div className="flex items-center space-x-4">
            <div className="bg-[#7e5bef] text-white rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-xl">{username?.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#4a2c82]">{username}</h2>
              <p className="text-sm text-[#6b7280]">Member {new Date().toLocaleDateString()}</p>
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
                      : 'bg-[#eae7f3] dark:bg-[#2a2a2a] text-[#604e97] dark:text-gray-300'
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
                {isDark ? <Moon size={20} className="text-[#6c42ea]" /> : <Sun size={20} className="text-[#6c42ea]" />}
              </div>
            }
            toggle
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
      <p className="text-sm text-[#604e97]">Now playing: <span className="font-semibold">{playlist[currentTrack]?.title}</span></p>

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
          className="text-sm px-3 py-1 bg-[#eae7f3] rounded-full text-[#6c42ea] hover:bg-[#d5c9f3] transition"
        >
           < SkipBack size={20} className="text-[#6c42ea]" />
        </button>

        <button
          onClick={nextTrack}
          className="text-sm px-3 py-1 bg-[#eae7f3] rounded-full text-[#6c42ea] hover:bg-[#d5c9f3] transition"
        >
          <SkipForward size={20} className="text-[#6c42ea]" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="volume" className="text-sm text-[#604e97]">
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

        {/* About Section */} 
<Section title="About Us">
  <Item
    label="About Project & Team"
    subtext="Learn more about the project & team"
    onClick={() => nav('/about')}
  />
</Section>


<Section title="sources" >
  <Item
    label="Sources"
    subtext="All sources used are archived here."
    onClick={() => nav('/sources')}
    />
</Section>
  

<Section title= "Logout">
<div className="p-6">
          <button
            onClick={handleLogout}
            className="w-full py-3 bg-red-100 text-red-600 rounded-xl font-medium hover:bg-red-200 transition-all"
          >
          Logout 
          </button>
        </div>
</Section>

      </div>

      {/* Bottom Part */}
      <div>
        {/* Chat Button */}
       

        <div className="h-5 bg-[#f9f8fc] " />
      </div>
    </div>
  );
}

const Section = ({ title, children }) => (
  <>
    <h2 className="text-[#110e1b] text-[22px] font-bold tracking-tight px-4 pb-3 pt-5">
      {title}
    </h2>
    {children}
  </>
);

const Item = ({
  label,
  subtext,
  action = <ChevronRight size={24} className="text-[#604e97] " />,
  toggle = false,
  checked,
  onToggle,
  onClick,
}) => (
  <div className="flex items-center justify-between gap-4 px-4 bg-[#f9f8fc]  min-h-[72px] py-2 border-b border-[#eae7f3]"
  onClick={onClick} // ← ضفنا دي
  >
    <div className="flex flex-col justify-center">
      <p className="text-[#110e1b] text-base font-medium">{label}</p>
      {subtext && <p className="text-[#604e97] text-sm">{subtext}</p>}
    </div>
    <div className="shrink-0">
      {toggle ? (
        <label className={`relative flex w-[51px] h-[31px] cursor-pointer items-center rounded-full p-0.5 transition-colors ${
          checked ? 'justify-end bg-[#6c42ea]' : 'bg-[#eae7f3]'
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