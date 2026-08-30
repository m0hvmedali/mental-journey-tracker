import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Settings, BookOpen, CheckSquare } from 'lucide-react';

import { contentService } from '../services/contentService';
import PsychologyInsightsBanner from '../components/PsychologyInsightsBanner';
import FloatingTasksPanel from '../components/wellness/FloatingTasksPanel';

export default function Home() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [showTasks, setShowTasks] = useState(false);

  const [shortcuts, setShortcuts] = useState([]);
  
  useEffect(() => {
    const fetchShortcuts = async () => {
      const data = await contentService.getHomepageShortcuts();
      setShortcuts(data || []);
    };
    fetchShortcuts();
  }, []);


  useEffect(() => {
    const userData = localStorage.getItem('username');
    if (!userData) {
      navigate('/');
    } else {
      setUsername(userData);
    }
  }, [navigate]);

  const quickActions = [
    {
      to: '/wheel',
      icon: BookOpen,
      title: 'عجلة المشاعر التفاعلية',
      subtitle: 'استكشف ما يدور بداخلك وسمِّ مشاعرك',
      badge: 'المشاعر'
    },
    {
      to: '/diary',
      icon: BookOpen,
      title: 'اليوميات والملاحظات',
      subtitle: 'دوّن أفكارك وملاحظاتك كتابةً أو تسجيلاً صوتياً',
      badge: 'التفريغ'
    },
    {
      to: '/Breathing478',
      icon: BookOpen,
      title: 'تمرين التنفس 4-7-8',
      subtitle: 'تهدئة فورية للجهاز العصبي في دقائق',
      badge: 'تخفيف التوتر'
    },
    {
      to: '/modules',
      icon: BookOpen,
      title: 'مكتبة المهارات والتعافي',
      subtitle: 'استراتيجيات CBT و DBT الموجهة للحلول',
      badge: 'أدوات'
    }
  ];

  return (
    <div dir="rtl" className="flex flex-col min-h-screen bg-bg-app text-text-primary overflow-x-hidden pb-28 sm:pb-32 transition-colors">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4 sm:px-8 py-4 border-b border-border-subtle bg-bg-app sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-sm overflow-hidden border border-border-subtle shrink-0 bg-bg-surface flex items-center justify-center">
            <img 
              src="/ChatGPT_Image_Jul_19_2025_06_34_59_PM.svg" 
              alt="Growth Tree Logo" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold tracking-tight text-text-primary leading-tight">
              مرحباً، {username || 'صديقي'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowTasks(!showTasks)}
              className={`flex size-10 items-center justify-center rounded-sm bg-bg-surface border border-border-subtle transition-all hover:bg-bg-surface-hover text-text-muted hover:text-text-primary ${
                showTasks ? 'text-emerald-500 border-emerald-500/50' : ''
              }`}
              aria-label="المهام"
            >
              <CheckSquare className="size-5" />
            </button>
            {showTasks && (
              <div className="absolute top-12 left-0 z-50">
                <FloatingTasksPanel onClose={() => setShowTasks(false)} />
              </div>
            )}
          </div>
          <NavLink
            to="/setting"
            className={({ isActive }) =>
              `flex size-10 items-center justify-center rounded-sm bg-bg-surface border border-border-subtle transition-all hover:bg-bg-surface-hover text-text-muted hover:text-text-primary ${
                isActive ? 'text-accent-primary font-bold border-accent-primary' : ''
              }`
            }
            aria-label="الإعدادات"
          >
            <Settings className="size-5" />
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl mx-auto w-full space-y-12">
        
        {/* Welcome Hero Image */}
        <div className="w-full h-48 md:h-64 rounded-xl overflow-hidden shadow-sm border border-border-medium relative group">
          <img 
            src="/image (4).png" 
            alt="Growth Tree Hero" 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            referrerPolicy="no-referrer"
            onError={(e) => {
              e.currentTarget.src = "/image (4).png"; // Fallback to another possible main image
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg-app/90 via-transparent to-transparent pointer-events-none flex flex-col justify-end p-6">
             <h2 className="text-2xl font-display font-bold text-text-primary">رحلتك نحو التوازن الداخلي</h2>
             <p className="text-text-secondary text-sm font-sans mt-1">خذ نفساً عميقاً، أنت في مساحة آمنة.</p>
          </div>
        </div>

        <PsychologyInsightsBanner />

        {shortcuts.length > 0 && (
          <div className="space-y-8">
            {shortcuts.map(sc => (
              <section key={sc.id} className="space-y-6">
                <div className="border-b border-border-medium pb-2">
                  <h3 className="font-display text-xl font-bold text-text-primary mt-4">
                    {sc.title}
                  </h3>
                  {sc.description && (
                    <p className="text-text-secondary text-sm mt-1 font-sans">
                      {sc.description}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {sc.items.map(item => {
                    const content = item.content;
                    if (!content) return null;
                    return (
                      <NavLink
                        key={item.id}
                        to={`/c/${content.slug}`}
                        className="group flex flex-col p-6 rounded-sm bg-bg-surface border border-border-medium hover:border-accent-primary shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="size-10 rounded-sm bg-bg-app border border-border-subtle flex items-center justify-center text-accent-primary shrink-0 transition-colors">
                            <BookOpen className="size-5" />
                          </div>
                          <span className="font-space-mono text-[10px] font-bold text-text-muted uppercase tracking-wider">
                            {content.content_type || 'مقال'}
                          </span>
                        </div>
                        <div className="space-y-2 mt-auto">
                          <h4 className="font-display text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                            {content.title}
                          </h4>
                          {content.description && (
                            <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
                              {content.description}
                            </p>
                          )}
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}


        {/* Core Mindful Action Cards Grid */}
        <section className="space-y-6">
          <div className="border-b border-border-medium pb-2">
            <h3 className="font-display text-xl font-bold text-text-primary mt-4">
              مساحة التعافي والتأمل
            </h3>
            <p className="text-text-secondary text-sm mt-1 font-sans">
              أدوات يومية لتعزيز وعيك الذاتي وتتبع نموك
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon || BookOpen;
              return (
                <NavLink
                  key={action.to}
                  to={action.to}
                  className="group flex flex-col p-6 rounded-sm bg-bg-surface border border-border-medium hover:border-accent-primary shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="size-10 rounded-sm bg-bg-app border border-border-subtle flex items-center justify-center text-accent-primary shrink-0 transition-colors">
                      <Icon className="size-5" />
                    </div>
                    <span className="font-space-mono text-[10px] font-bold text-text-muted uppercase tracking-wider">
                      {action.badge}
                    </span>
                  </div>

                  <div className="space-y-2 mt-auto">
                    <h4 className="font-display text-base font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                      {action.title}
                    </h4>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {action.subtitle}
                    </p>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </section>

      </main>
    </div>
  );
}
