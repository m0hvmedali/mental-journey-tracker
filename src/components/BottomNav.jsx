// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { BookHeart, Home, BrainCog, Library, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function BottomNav() {
  const { t } = useLanguage();

  const navItems = [
    {
      to: '/home',
      label: t('navigation.home') || 'Home',
      svg: <Home size={20} />,
    },
    {
      to: '/modules',
      label: t('navigation.modules') || 'Modules',
      svg: <Library size={20} />,
    },
    {
      to: '/modules/emotional-regulation',
      label: 'Skills',
      svg: <BrainCog size={20} />,
    },
    {
      to: '/progress',
      label: t('navigation.progress') || 'Progress',
      svg: <TrendingUp size={20} />,
    },
    {
      to: '/community',
      label: 'Gratitude',
      svg: <BookHeart size={20} />,
    },
  ];

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border-subtle bg-bg-surface/95 backdrop-blur-md px-3 pb-2 pt-1.5 flex gap-1 transition-colors">
      {navItems.map(({ to, label, svg }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-2xl py-1 text-[11px] font-semibold tracking-wide transition-all duration-200 ease-in-out ${
              isActive 
                ? 'text-emerald-800 dark:text-emerald-300 font-bold' 
                : 'text-text-muted hover:text-text-primary dark:hover:text-emerald-200'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`size-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 scale-105 shadow-2xs' 
                    : 'text-text-muted group-hover:text-text-primary'
                }`}
              >
                {svg}
              </div>
              <span className="truncate max-w-[64px] leading-tight">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
