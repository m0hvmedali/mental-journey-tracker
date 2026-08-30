// src/pages/ModuleDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MODULES_DATA } from '@/data/modulesData.js';
import { contentService } from '@/services/contentService';
import { BookOpen, ChevronRight, CheckCircle2, ArrowLeft, FileText, Clock } from 'lucide-react';

export default function ModuleDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find initial fallback module
  const staticModule = MODULES_DATA.find((m) => m.slug === slug || m.id === slug);
  const [module, setModule] = useState(staticModule);
  const [cmsContent, setCmsContent] = useState([]);

  useEffect(() => {
    let isMounted = true;

    async function loadModuleData() {
      try {
        const [modData, attachedContent] = await Promise.all([
          contentService.getModule(slug),
          contentService.getModuleCMSContent(slug)
        ]);

        if (isMounted) {
          if (modData) {
            setModule(prev => ({ ...prev, ...modData }));
          }
          if (attachedContent && attachedContent.length > 0) {
            setCmsContent(attachedContent);
          } else if (modData?.module_content && modData.module_content.length > 0) {
            setCmsContent(modData.module_content);
          }
        }
      } catch (err) {
        console.warn('Failed to load module dynamic data:', err);
      }
    }

    loadModuleData();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (!module) {
    return (
      <div className="flex flex-col min-h-screen bg-bg-app font-sans items-center justify-center p-4">
        <h2 className="text-xl font-bold text-text-primary mb-2">Module not found</h2>
        <button
          onClick={() => navigate('/modules')}
          className="px-5 py-2.5 bg-bg-surface-hover text-text-primary rounded-xl font-bold hover:bg-bg-surface-elevated transition-colors cursor-pointer"
        >
          Return to Modules
        </button>
      </div>
    );
  }

  const getContentTypeLabel = (type) => {
    const map = {
      scientific_page: 'صفحة علمية',
      article: 'مقال تخصصي',
      lesson: 'درس منهجي',
      guide: 'دليل عملي',
      exercise: 'تمرين علاجي',
      worksheet: 'ورقة عمل'
    };
    return map[type] || 'محتوى تخصصي';
  };

  const pages = module.pages || [];

  return (
    <div className="flex flex-col min-h-screen bg-bg-app font-sans pb-24">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-3 bg-bg-app/95 backdrop-blur-sm sticky top-0 z-20 border-b border-border-subtle">
        <button 
          onClick={() => navigate('/modules')} 
          className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-bg-surface-hover active:scale-95 text-text-primary transition-all cursor-pointer"
          aria-label="Go back"
        >
          <ArrowLeft size={22} />
        </button>
        <h2 className="flex-1 text-center text-base sm:text-lg font-bold text-text-primary truncate px-2">{module.title}</h2>
        <div className="size-11 shrink-0" />
      </header>

      {/* Hero Image */}
      <div className="px-3.5 sm:px-6 py-2 max-w-3xl mx-auto w-full">
        <div
          className="w-full min-h-[200px] sm:min-h-[240px] bg-cover bg-center rounded-sm shadow-sm border border-border-subtle"
          style={{ backgroundImage: `url(${module.hero || module.background_image || '/article-by3DYy7JylaR.webp'})` }}
        />
      </div>

      <div className="px-3.5 sm:px-6 py-3 max-w-3xl mx-auto w-full space-y-6">
        {/* Overview */}
        <section className="space-y-1.5" dir="auto">
          <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-bg-surface-hover text-text-secondary">
            الوحدة {module.id} • Module {module.id}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary pt-1">{module.title}</h1>
          <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line pt-1">{module.overview || module.description}</p>
        </section>

        {/* Learning Objectives */}
        {module.learningObjectives && module.learningObjectives.length > 0 && (
          <section className="bg-bg-surface rounded-sm p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3.5" dir="auto">
            <h3 className="text-lg sm:text-xl font-bold text-text-primary flex items-center gap-2.5">
              <CheckCircle2 size={20} className="text-accent-primary shrink-0" />
              <span>الأهداف التعليمية والمهارات المكتسبة</span>
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base text-text-secondary">
              {module.learningObjectives.map((obj, i) => (
                <li key={i} className="flex items-start gap-2.5 leading-relaxed">
                  <span className="text-accent-primary font-bold shrink-0">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Internal Pages / Topics (Existing Core Lessons) */}
        {pages.length > 0 && (
          <section className="space-y-3.5">
            <div className="flex items-center justify-between" dir="auto">
              <h3 className="text-lg sm:text-xl font-bold text-text-primary">محتويات ومواضيع الوحدة</h3>
              <span className="text-xs sm:text-sm font-bold text-text-secondary bg-bg-surface-hover px-3 py-1 rounded-full border border-border-subtle">
                {pages.length} مواضيع
              </span>
            </div>

            <div className="space-y-3">
              {pages.map((p, idx) => (
                <Link
                  key={p.slug || idx}
                  to={`/modules/${module.slug}/${p.slug}`}
                  className="flex items-center gap-3.5 p-4 bg-bg-surface border border-border-subtle rounded-sm hover:bg-bg-surface-hover active:scale-[0.99] transition-all shadow-sm group"
                  dir="auto"
                >
                  <div className="size-11 shrink-0 flex items-center justify-center rounded-xl bg-bg-surface-hover text-text-secondary font-bold text-base group-hover:bg-accent-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base sm:text-lg font-bold text-text-primary leading-snug truncate">{p.title}</p>
                    <p className="text-xs sm:text-sm text-accent-primary font-medium truncate mt-0.5">{p.subtitle}</p>
                  </div>
                  <ChevronRight size={20} className="text-accent-primary shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Module CMS Content (Additional Specialized Pages & Reading) */}
        {cmsContent.length > 0 && (
          <section id="module-cms-content-section" className="space-y-3.5 pt-2">
            <div className="flex items-center justify-between" dir="auto">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
                <h3 className="text-lg sm:text-xl font-bold text-text-primary">
                  قراءات وتطبيقات تكميلية
                </h3>
              </div>
              <span className="text-xs sm:text-sm font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-full border border-indigo-200/50 dark:border-indigo-900/50">
                {cmsContent.length} مراجع إضافية
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {cmsContent.map((item, idx) => {
                const content = item.content || {};
                const slug = content.slug || item.content_id;
                const readingMinutes = content.metadata?.reading_time_minutes || content.reading_time_minutes || 5;

                return (
                  <Link
                    key={item.id || item.content_id || idx}
                    to={`/c/${slug}`}
                    id={`module-cms-item-${slug}`}
                    className="flex items-center gap-3.5 p-4 bg-bg-surface border border-border-subtle rounded-xl hover:border-indigo-500/40 hover:bg-bg-surface-hover active:scale-[0.99] transition-all shadow-2xs group"
                    dir="auto"
                  >
                    <div className="size-11 shrink-0 flex items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-bold text-base group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <FileText size={20} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-700 dark:text-indigo-300">
                          {getContentTypeLabel(content.content_type)}
                        </span>
                        <span className="text-[11px] text-text-muted flex items-center gap-1">
                          <Clock size={11} />
                          {readingMinutes} د دقائق قراءة
                        </span>
                      </div>

                      <p className="text-base font-bold text-text-primary leading-snug truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {content.title}
                      </p>

                      {content.description && (
                        <p className="text-xs text-text-secondary line-clamp-1 mt-0.5">
                          {content.description}
                        </p>
                      )}
                    </div>

                    <ChevronRight size={20} className="text-text-muted group-hover:text-indigo-600 dark:group-hover:text-indigo-400 shrink-0 transition-colors" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

