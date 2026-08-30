// src/pages/Progress.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Settings } from 'lucide-react';
import { getUserProgress, getUserProfile } from '../utils/progress';
import InteractiveGarden from '../components/garden/InteractiveGarden';
import DailyProgress from '../components/garden/DailyProgress';
import GardenTimeline from '../components/garden/GardenTimeline';
import GardenMilestones from '../components/garden/GardenMilestones';
import UserProfileCard from '../components/garden/UserProfileCard';
import SettingsModal from '../components/garden/SettingsModal';

export default function Progress() {
  const nav = useNavigate();
  const [progress, setProgress] = useState(() => getUserProgress());
  const [profile, setProfile] = useState(() => getUserProfile());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Sync state when progress or profile changes anywhere in the app
  useEffect(() => {
    const handleProgressUpdate = (e) => {
      setProgress(e.detail || getUserProgress());
    };
    const handleProfileUpdate = (e) => {
      setProfile(e.detail || getUserProfile());
    };

    window.addEventListener('userProgressUpdated', handleProgressUpdate);
    window.addEventListener('userProfileUpdated', handleProfileUpdate);

    // Refresh state on mount
    setProgress(getUserProgress());
    setProfile(getUserProfile());

    return () => {
      window.removeEventListener('userProgressUpdated', handleProgressUpdate);
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  return (
    <div
      dir="rtl"
      className="relative flex min-h-screen flex-col justify-between bg-bg-app text-text-primary overflow-x-hidden pb-28 sm:pb-32 transition-colors"
      style={{ fontFamily: 'var(--font-body)' }}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 py-3 bg-bg-app/90 backdrop-blur-md border-b border-border-subtle gap-2">
        <button
          type="button"
          onClick={() => nav(-1)}
          className="flex size-10 items-center justify-center rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover transition-colors shrink-0 cursor-pointer"
          aria-label="الرجوع"
        >
          <ArrowRight size={20} className="shrink-0" />
        </button>

        <div className="flex-1 min-w-0 text-center px-1">
          <h2
            className="text-sm sm:text-base font-bold text-text-primary truncate"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            حديقة نموّك
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setIsSettingsOpen(true)}
          className="flex size-10 items-center justify-center rounded-xl bg-bg-surface border border-border-subtle text-text-primary hover:bg-bg-surface-hover transition-colors shrink-0 cursor-pointer"
          aria-label="الإعدادات"
        >
          <Settings size={20} className="shrink-0" />
        </button>
      </header>

      {/* Hero: the garden is the signature element on this screen —
          full-bleed canvas, not another card in an equal-weight stack. */}
      <section className="relative w-full">
        <InteractiveGarden progress={progress} />
      </section>

      {/* Secondary content — deliberately quieter and more tightly spaced
          than the garden above, so the hierarchy reads at a glance. */}
      <main className="flex-1 px-4 sm:px-6 md:px-8 pt-6 pb-2 space-y-5 max-w-4xl mx-auto w-full">
        <section>
          <DailyProgress timeline={progress?.timeline} />
        </section>

        <section>
          <GardenTimeline timeline={progress?.timeline} />
        </section>

        <section>
          <GardenMilestones progress={progress} />
        </section>

        <section>
          <UserProfileCard
            profile={profile}
            progress={progress}
            onOpenSettings={() => setIsSettingsOpen(true)}
          />
        </section>
      </main>

      {/* Settings Modal Drawer */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        profile={profile}
        onProfileUpdated={(newProfile) => setProfile(newProfile)}
      />
    </div>
  );
}