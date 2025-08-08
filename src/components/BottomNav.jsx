// src/components/BottomNav.jsx
import { NavLink } from 'react-router-dom';
import { BookHeart, Home, BrainCog } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.jsx';

export default function BottomNav() {
  const { t } = useLanguage();

  const navItems = [
    {
      to: '/',
      label: t('navigation.home'),
      svg: <Home />,
    },
    {
      to: '/modules',
      label: t('navigation.modules'),
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
          <path d="M80 64a8 8 0 0 1 8-8h128a8 8 0 0 1 0 16H88a8 8 0 0 1-8-8Zm136 56H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16Zm0 64H88a8 8 0 0 0 0 16h128a8 8 0 0 0 0-16ZM44 52a12 12 0 1 0 12 12 12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12 12 12 0 0 0-12-12Zm0 64a12 12 0 1 0 12 12 12 12 0 0 0-12-12Z"/>
        </svg>
      ),
    },
    {
      to: 'modules/emotional-regulation',
      label: 'Skills',
      svg: <BrainCog />,
    },

    {
      to: '/progress',
      label: t('navigation.progress'),
      svg: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" width="24" height="24" fill="currentColor">
          <path d="M232 208a8 8 0 0 1-8 8H32a8 8 0 0 1-8-8V48a8 8 0 0 1 16 0v94.37L90.73 98a8 8 0 0 1 10.07-.38l58.81 44.11L218.73 90a8 8 0 1 1 10.54 12l-64 56a8 8 0 0 1-10.07.38L96.39 114.29 40 163.63V200h184a8 8 0 0 1 8 8Z"/>
        </svg>
      ),
    },
    {
      to: '/community',
      label: t('Gratitude'),
      svg: <BookHeart />,
    },
  ];

  return (
    <nav className="border-t border-[#e7f3ee]  bg-[#f8fcfa]  px-4 pb-3 pt-2 flex gap-2 transition-colors">
      {navItems.map(({ to, label, svg }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-1 rounded-full text-xs font-medium tracking-[0.015em] transition-all duration-200 ease-in-out ${
              isActive 
                ? 'text-[#0e1b15]'
                : 'text-[#4e9778]'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`h-8 w-8 flex items-center justify-center transition-all duration-300 ease-in-out ${
                  isActive ? 'scale-125 -translate-y-1' : 'scale-100'
                }`}
              >
                {svg}
              </div>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}