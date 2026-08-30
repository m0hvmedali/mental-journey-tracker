// src/pages/ModuleInternalPage.jsx
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MODULES_DATA } from '@/data/modulesData.js';
import { 
 ArrowLeft, 
 BookOpen, 
 HelpCircle, 
 Dumbbell, 
 Sparkles, 
 Info, 
 ChevronRight, 
 ChevronLeft,
 Quote,
 CheckCircle2,
 Clock,
 Tag,
 Heart,
 Brain,
 Calendar,
 BookMarked,
 MessageCircle,
 MessageSquare,
 AlertTriangle,
 Shield,
 ShieldAlert,
 ShieldCheck,
 Check,
 Lightbulb,
 Compass,
 AlertOctagon,
 XCircle,
 Moon,
 Sun,
 Flame,
 Apple,
 Droplet,
 Wind,
 Zap,
 Activity,
 Utensils,
 Anchor,
 Sliders,
 RefreshCw
} from 'lucide-react';

export default function ModuleInternalPage() {
 const { moduleSlug, pageSlug } = useParams();
 const navigate = useNavigate();

 // Find module
 const module = MODULES_DATA.find((m) => m.slug === moduleSlug || m.id === moduleSlug);

 // If not found by moduleSlug, also search directly across all modules for pageSlug or aliases
 let page = null;
 let currentModule = module;

 if (currentModule) {
 page = currentModule.pages.find((p) => 
 p.slug === pageSlug || 
 p.id === pageSlug || 
 (p.aliases && p.aliases.includes(pageSlug))
 );
 } else {
 for (const mod of MODULES_DATA) {
 const found = mod.pages.find((p) => 
 p.slug === pageSlug || 
 p.slug === moduleSlug || 
 p.id === pageSlug ||
 (p.aliases && (p.aliases.includes(pageSlug) || p.aliases.includes(moduleSlug)))
 );
 if (found) {
 page = found;
 currentModule = mod;
 break;
 }
 }
 }

 if (!page || !currentModule) {
 return (
 <div className="flex flex-col min-h-screen bg-bg-app font-sans items-center justify-center p-4 text-center">
 <h2 className="text-xl font-bold text-text-primary mb-2">Topic not found</h2>
 <p className="text-sm text-text-secondary mb-4">The requested module content could not be located.</p>
 <button
 onClick={() => navigate('/modules')}
 className="px-5 py-2.5 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl font-bold hover:bg-emerald-700 dark:bg-emerald-800 transition-all"
 >
 Return to Modules
 </button>
 </div>
 );
 }

 // Find index for next/prev navigation
 const currentIndex = currentModule.pages.findIndex((p) => p.slug === page.slug || p.id === page.id);
 const prevPage = currentIndex > 0 ? currentModule.pages[currentIndex - 1] : null;
 const nextPage = currentIndex >= 0 && currentIndex < currentModule.pages.length - 1 ? currentModule.pages[currentIndex + 1] : null;

 return (
 <div className="flex flex-col min-h-screen bg-bg-app font-sans text-text-primary pb-24">
 {/* Header */}
 <header className="flex justify-between items-center px-4 py-3 border-b border-border-subtle bg-bg-app/95 backdrop-blur-sm sticky top-0 z-20">
 <button 
 onClick={() => navigate(`/modules/${currentModule.slug}`)} 
 className="flex size-11 shrink-0 items-center justify-center rounded-xl hover:bg-bg-surface-hover active:scale-95 text-text-primary transition-all"
 aria-label="Go back"
 >
 <ArrowLeft size={22} />
 </button>
 <div className="flex-1 text-center px-2 min-w-0">
 <p className="text-xs font-bold uppercase tracking-wider text-[#3d7a61] truncate">{currentModule.title}</p>
 <h2 className="text-sm sm:text-base font-bold text-text-primary truncate" dir="auto">{page.title}</h2>
 </div>
 <div className="size-11 shrink-0" />
 </header>

 <main className="px-3.5 sm:px-6 py-5 max-w-3xl mx-auto w-full space-y-6">
 
 {/* Top Header & Badges */}
 <section className="space-y-2.5">
 <div className="flex flex-wrap items-center gap-2">
 {(page.badge || page.category) && (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-bg-surface-hover text-text-secondary border border-border-medium">
 <Tag size={14} className="shrink-0" />
 <span>{page.badge || page.category}</span>
 </span>
 )}
 {page.difficulty && (
 <span className="inline-block px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-bg-surface border border-border-medium text-text-primary">
 {page.difficulty}
 </span>
 )}
 {page.read_time && (
 <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-bg-surface border border-border-subtle text-text-secondary">
 <Clock size={14} className="shrink-0 text-emerald-600" />
 <span>{page.read_time} min read</span>
 </span>
 )}
 </div>
 
 <h1 className="text-2xl sm:text-3xl font-bold text-text-primary leading-tight pt-1" dir="auto">{page.title}</h1>
 {(page.titleEn || page.subtitle) && (
 <p className="text-base sm:text-lg text-emerald-700 dark:text-emerald-400 font-medium leading-snug" dir="auto">
 {page.titleEn && page.titleEn !== page.title ? page.titleEn : page.subtitle}
 </p>
 )}
 {page.summary && page.summary !== page.subtitle && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-1" dir="auto">{page.summary}</p>
 )}
 </section>

 {/* Intro Block */}
 {page.intro && (
 <section className="space-y-4">
 {page.intro.quote && (
 <div className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm">
 <div className="flex items-start gap-3.5">
 <Quote className="w-6 h-6 text-text-secondary shrink-0 mt-0.5" />
 <div className="space-y-2.5 text-text-primary" dir="auto">
 <p className="font-bold text-base sm:text-lg leading-relaxed italic">"{page.intro.quote}"</p>
 {page.intro.author && (
 <p className="text-xs sm:text-sm font-bold text-text-secondary pt-1">— {page.intro.author}</p>
 )}
 {page.intro.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-2 border-t border-border-medium/80 mt-2">
 {page.intro.description}
 </p>
 )}
 </div>
 </div>
 </div>
 )}
 {page.intro.personalMessage && (
 <div className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <div className="flex items-start gap-3.5" dir="auto">
 <Heart className="w-6 h-6 text-[#ec4899] shrink-0 mt-0.5" />
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed italic font-medium">
 {page.intro.personalMessage}
 </p>
 </div>
 </div>
 )}
 {page.intro.personalNote && (
 <div className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <div className="flex items-start gap-3.5" dir="auto">
 <Heart className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed italic font-medium">
 {page.intro.personalNote}
 </p>
 </div>
 </div>
 )}

 {page.intro.whatAreDistortions && (
 <div className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3.5" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <Brain className="w-6 h-6 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.intro.whatAreDistortions.title}</h3>
 </div>
 {page.intro.whatAreDistortions.definition && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 {page.intro.whatAreDistortions.definition}
 </p>
 )}
 {page.intro.whatAreDistortions.analogy && (
 <div className="p-3.5 bg-bg-app rounded-xl border border-border-subtle space-y-1">
 <p className="text-sm sm:text-base font-bold text-text-secondary">{page.intro.whatAreDistortions.analogy.title}</p>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.intro.whatAreDistortions.analogy.description}</p>
 </div>
 )}
 {page.intro.whatAreDistortions.keyPoints && page.intro.whatAreDistortions.keyPoints.length > 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
 {page.intro.whatAreDistortions.keyPoints.map((kp, kpIdx) => (
 <div key={kpIdx} className="flex items-start gap-2 p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
 <span>{kp}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {page.intro.researchBackground && (
 <div className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <BookMarked className="w-5 h-5 text-emerald-600 shrink-0" />
 <h4 className="text-base sm:text-lg font-bold">{page.intro.researchBackground.title}</h4>
 </div>
 {page.intro.researchBackground.beck1963 && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">أبحاث بيك (1963): </span>{page.intro.researchBackground.beck1963}
 </p>
 )}
 {page.intro.researchBackground.burns1980 && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">ديفيد بيرنز (1980): </span>{page.intro.researchBackground.burns1980}
 </p>
 )}
 {page.intro.researchBackground.significance && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold leading-relaxed">
 💡 {page.intro.researchBackground.significance}
 </div>
 )}
 </div>
 )}

 {page.intro.scientificContext && (
 <div className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <Brain className="w-5 h-5 text-emerald-600 shrink-0" />
 <h4 className="text-base sm:text-lg font-bold">{page.intro.scientificContext.title || 'السياق العلمي والتأثير البيولوجي'}</h4>
 </div>
 {page.intro.scientificContext.why && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">السياق والأسباب: </span>{page.intro.scientificContext.why}
 </p>
 )}
 {page.intro.scientificContext.content && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.intro.scientificContext.content}</p>
 )}
 {page.intro.scientificContext.impact && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 ⚡ {page.intro.scientificContext.impact}
 </div>
 )}
 {page.intro.scientificContext.combination && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold leading-relaxed">
 ✨ {page.intro.scientificContext.combination}
 </div>
 )}
 {page.intro.scientificContext.research && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 🔬 {page.intro.scientificContext.research}
 </div>
 )}
 </div>
 )}
 </section>
 )}

 {/* Emotional Opening */}
 {page.emotionalOpening && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm space-y-3.5" dir="auto">
 {page.emotionalOpening.eyebrow && (
 <p className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider">{page.emotionalOpening.eyebrow}</p>
 )}
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">{page.emotionalOpening.title}</h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.emotionalOpening.body}</p>
 {page.emotionalOpening.reassurance && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold">
 💚 {page.emotionalOpening.reassurance}
 </div>
 )}
 </section>
 )}

 {/* Important Notice */}
 {page.importantNotice && (
 <section className="bg-amber-50/80 rounded-2xl p-5 sm:p-6 border border-amber-200 shadow-sm space-y-3.5" dir="auto">
 <div className="flex items-center gap-2.5 text-amber-900">
 <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.importantNotice.title}</h3>
 </div>
 {page.importantNotice.points && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
 {page.importantNotice.points.map((pt, idx) => (
 <div key={idx} className="flex items-start gap-2 text-sm sm:text-base text-amber-950 font-medium leading-relaxed bg-bg-surface/70 p-3 rounded-xl border border-amber-200/60">
 <span className="text-amber-600 font-bold shrink-0">•</span>
 <span>{pt}</span>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Quick Definition */}
 {page.quickDefinition && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3.5" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.quickDefinition.question}</h3>
 </div>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.quickDefinition.answer}</p>
 {page.quickDefinition.metaphor && (
 <div className="p-3.5 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 💡 <span className="font-bold">تشبيه مقرب: </span>{page.quickDefinition.metaphor}
 </div>
 )}
 </section>
 )}

 {/* Classification Guide (DSM-5-TR vs ICD-11) */}
 {page.classificationGuide && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.classificationGuide.title}</h3>
 {page.classificationGuide.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.classificationGuide.description}</p>
 )}
 {page.classificationGuide.systems && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
 {page.classificationGuide.systems.map((sys, sIdx) => (
 <div key={sIdx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border-subtle pb-2">
 <h4 className="font-bold text-base text-text-primary">{sys.name}</h4>
 {sys.issuer && (
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-surface-hover text-text-secondary font-semibold">
 {sys.issuer}
 </span>
 )}
 </div>
 <p className="text-sm text-text-secondary leading-relaxed">{sys.purpose}</p>
 </div>
 ))}
 </div>
 )}
 {page.classificationGuide.note && (
 <p className="text-xs sm:text-sm text-text-muted italic pt-1">{page.classificationGuide.note}</p>
 )}
 </section>
 )}

 {/* How Diagnosis Works */}
 {page.howDiagnosisWorks && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <Brain className="w-5 h-5 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.howDiagnosisWorks.title}</h3>
 </div>
 {page.howDiagnosisWorks.intro && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.howDiagnosisWorks.intro}</p>
 )}
 {page.howDiagnosisWorks.steps && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
 {page.howDiagnosisWorks.steps.map((st, idx) => (
 <div key={idx} className="flex items-start gap-3 p-4 bg-bg-app rounded-xl border border-border-subtle">
 <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-bold mt-0.5">
 {st.number || idx + 1}
 </span>
 <div className="space-y-1">
 <h4 className="font-bold text-base text-text-primary">{st.title}</h4>
 {st.description && <p className="text-sm text-text-secondary leading-relaxed">{st.description}</p>}
 </div>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Clinical Significance */}
 {page.clinicalSignificance && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.clinicalSignificance.title}</h3>
 {page.clinicalSignificance.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.clinicalSignificance.description}</p>
 )}
 {page.clinicalSignificance.factors && (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-1">
 {page.clinicalSignificance.factors.map((fac, fIdx) => (
 <div key={fIdx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-1.5">
 <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-bg-surface-hover text-text-secondary">
 {fac.name}
 </span>
 <p className="text-sm text-text-secondary leading-relaxed pt-1 font-medium">{fac.question}</p>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Symptom Dimensions */}
 {page.symptomDimensions && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.symptomDimensions.title}</h3>
 {page.symptomDimensions.dimensions && (
 <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
 {page.symptomDimensions.dimensions.map((dim, dIdx) => (
 <div key={dIdx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-1.5">
 <h4 className="font-bold text-base text-text-secondary">{dim.name}</h4>
 <p className="text-sm text-text-secondary leading-relaxed">{dim.examples}</p>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Before Self Diagnosis */}
 {page.beforeSelfDiagnosis && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm space-y-3.5" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.beforeSelfDiagnosis.title}</h3>
 {page.beforeSelfDiagnosis.questions && (
 <div className="space-y-2 pt-1">
 {page.beforeSelfDiagnosis.questions.map((q, idx) => (
 <div key={idx} className="flex items-start gap-2.5 p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-primary font-medium">
 <span className="text-emerald-600 font-bold shrink-0">❓</span>
 <span>{q}</span>
 </div>
 ))}
 </div>
 )}
 {page.beforeSelfDiagnosis.reminder && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold">
 💡 {page.beforeSelfDiagnosis.reminder}
 </div>
 )}
 </section>
 )}

 {/* Direct items list (e.g. 20 diagnostic categories or 9 explanatory models) */}
 {page.items && page.items.length > 0 && (
 <section className="space-y-4" dir="auto">
 <div className="flex items-center justify-between">
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
 {page.itemsTitle || (page.slug === 'mental-disorders-classification' ? 'الفئات التشخيصية العشرين' : page.slug === 'explanatory-models' ? 'النماذج والمدارس النفسية الكبرى' : (page.slug === 'psychological-screening-tests' || page.slug === 'psychological-tests') ? 'أشهر المقاييس واختبارات الفحص النفسي' : 'المحاور والنماذج الرئيسية')}
 </h3>
 <span className="text-xs sm:text-sm font-bold text-text-secondary bg-bg-surface-hover px-3 py-1 rounded-full border border-border-medium">
 {page.items.length} {page.itemsUnit || (page.slug === 'explanatory-models' ? 'نماذج' : (page.slug === 'psychological-screening-tests' || page.slug === 'psychological-tests') ? 'مقاييس' : 'فئة')}
 </span>
 </div>
 <div className="grid grid-cols-1 gap-4">
 {page.items.map((item, idx) => (
 <div key={item.id || idx} className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3 hover:border-teal-300 transition-all">
 <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
 <div className="flex items-center gap-2.5">
 <span className="flex size-7 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold">
 {item.number || idx + 1}
 </span>
 <h4 className="text-base sm:text-lg font-bold text-text-primary">{item.name}</h4>
 </div>
 {item.badge && (
 <span className={`text-xs px-3 py-1 rounded-full font-bold border ${item.badgeBg || 'bg-bg-surface-hover text-text-secondary border-border-medium'}`}>
 {item.badge}
 </span>
 )}
 </div>
 {item.nameEn && <p className="text-xs font-mono text-text-muted">{item.nameEn}</p>}
 {item.scaleCode && (
 <div className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-lg inline-block border border-teal-200">
 رمز المقياس: {item.scaleCode}
 </div>
 )}
 {item.target && (
 <div className="p-3 bg-teal-50/70 rounded-xl border border-teal-100 text-xs sm:text-sm text-teal-900 font-semibold leading-relaxed">
 🎯 <span className="font-bold">الغرض والنطاق المستهدف: </span>
 {item.target}
 </div>
 )}
 {item.itemsCount && (
 <p className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed">
 <span className="font-bold text-text-primary">📝 عدد البنود والأسئلة: </span>
 {item.itemsCount}
 </p>
 )}
 {item.scoring && (
 <p className="text-xs sm:text-sm text-text-secondary font-medium leading-relaxed">
 <span className="font-bold text-text-primary">📊 آلية التقدير والنقاط: </span>
 {item.scoring}
 </p>
 )}
 {item.coreQuestion && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 <span className="text-text-primary font-bold">❓ السؤال الجوهري: </span>
 {item.coreQuestion}
 </div>
 )}
 {item.founder && (
 <div className="text-xs font-bold text-text-secondary bg-bg-surface-hover px-3 py-1 rounded-lg inline-block border border-border-medium">
 المؤسس / الرائد: {item.founder}
 </div>
 )}
 {item.mechanism && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">الآلية وطريقة العمل: </span>
 {item.mechanism}
 </p>
 )}
 {item.bestFor && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-medium text-xs sm:text-sm text-text-secondary font-semibold leading-relaxed">
 🎯 <span className="font-bold">الحالات والأعراض المستهدفة: </span>
 {item.bestFor}
 </div>
 )}
 {(item.id === 'cbt' || item.linkToSkills) && (
 <div className="pt-2">
 <Link 
 to="/modules/how-will-we-fix-it/practical-therapeutic-skills"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 dark:bg-emerald-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-emerald-700 dark:bg-emerald-800 transition-all"
 >
 <span>عرض دليل الـ 19 مهارة علاجية وتطبيقية لـ CBT</span>
 <ArrowLeft size={16} />
 </Link>
 </div>
 )}
 {item.id === 'dbt' && (
 <div className="pt-2">
 <Link 
 to="/DBTTipp"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2563eb] text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-[#1d4ed8] transition-all"
 >
 <span>عرض الدليل الشامل لمهارات العلاج الجدلي السلوكي DBT (24 مهارة)</span>
 <ArrowLeft size={16} />
 </Link>
 </div>
 )}
 {item.id === 'act' && (
 <div className="pt-2">
 <Link 
 to="/ACTSkills"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-purple-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-purple-700 transition-all"
 >
 <span>عرض الدليل العملي لتمارين واستعارات العلاج بالقبول والالتزام (ACT)</span>
 <ArrowLeft size={16} />
 </Link>
 </div>
 )}
 {item.id === 'sfbt' && (
 <div className="pt-2">
 <Link 
 to="/SFBTSkills"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-cyan-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-cyan-700 transition-all"
 >
 <span>عرض دليل العلاج المركّز على الحلول قصير المدى (SFBT) وحزمة تمارين MECSTAT</span>
 <ArrowLeft size={16} />
 </Link>
 </div>
 )}
 {item.id === 'psychodynamic' && (
 <div className="pt-2">
 <Link 
 to="/PsychodynamicSkills"
 className="inline-flex items-center gap-2 px-4 py-2.5 bg-amber-600 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm hover:bg-amber-700 transition-all"
 >
 <span>عرض دليل العلاج النفسي الديناميكي الحديث وتمارين الاستبصار</span>
 <ArrowLeft size={16} />
 </Link>
 </div>
 )}
 {item.explanation && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{item.explanation}</p>
 )}
 {item.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{item.description}</p>
 )}
 {item.clinicalApplication && (
 <div className="p-3.5 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">🩺 التطبيق السريري والعلاجي: </span>
 {item.clinicalApplication}
 </div>
 )}
 {item.examples && (
 <div className="p-3.5 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">أمثلة رئيسية: </span>
 {item.examples}
 </div>
 )}
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Custom Somatic & Nervous System Skills List */}
 {page.skills && page.skills.length > 0 && (
 <section className="space-y-6" dir="auto">
 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
 <div>
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
 البروتوكولات السريرية والمهارات العملية
 </h3>
 <p className="text-sm text-text-secondary mt-1">
 تقنيات مبنية على علم الأعصاب واستجابات العصب الحائر لتهدئة الجسد فورياً
 </p>
 </div>
 <span className="text-xs sm:text-sm font-bold text-cyan-800 bg-cyan-50 px-3.5 py-1.5 rounded-full border border-cyan-200">
 {page.skills.length} مهارات تنظيميّة
 </span>
 </div>

 <div className="grid grid-cols-1 gap-5">
 {page.skills.map((skill, sIdx) => {
 const IconComponent = skill.icon === 'Anchor' ? Anchor : skill.icon === 'Zap' ? Zap : skill.icon === 'Wind' ? Wind : skill.icon === 'Sliders' ? Sliders : Activity;
 return (
 <div
 key={skill.id || sIdx}
 id={skill.id}
 className="bg-bg-surface rounded-2xl p-5 sm:p-7 border border-border-subtle shadow-sm space-y-4 hover:border-cyan-300 transition-all"
 >
 <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="flex size-7 items-center justify-center rounded-full text-white text-xs font-bold" style={{ backgroundColor: skill.color || '#06b6d4' }}>
 {skill.number || sIdx + 1}
 </span>
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-50 text-cyan-800 font-semibold border border-cyan-100">
 مهارة تنظيميّة #{skill.number || sIdx + 1}
 </span>
 </div>
 <h4 className="text-lg sm:text-xl font-bold text-text-primary pt-1">
 {skill.name}
 </h4>
 </div>
 <div className="p-3 bg-cyan-50 rounded-xl border border-cyan-100 text-cyan-700">
 <IconComponent className="w-5 h-5" />
 </div>
 </div>

 {skill.target && (
 <div className="p-3.5 bg-cyan-50/60 rounded-xl border border-cyan-100 text-sm sm:text-base text-cyan-900 font-semibold leading-relaxed">
 🎯 <span className="font-bold">الهدف والمؤشر: </span>
 {skill.target}
 </div>
 )}

 {skill.steps && skill.steps.length > 0 && (
 <div className="space-y-2.5 pt-1">
 <h5 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-cyan-600" />
 خطوات ومراحل التطبيق:
 </h5>
 <div className="space-y-2">
 {skill.steps.map((step, stIdx) => (
 <div key={stIdx} className="p-3.5 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary font-medium leading-relaxed flex items-start gap-2.5">
 <span>{step}</span>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 );
 })}
 </div>
 </section>
 )}

 {/* Skills Catalog Section (e.g. 19 CBT & Practical Psychological Skills) */}
 {page.skillsCatalog && page.skillsCatalog.length > 0 && (
 <section className="space-y-6" dir="auto">
 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
 <div>
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
 {page.skillsCatalogTitle || 'دليل المهارات والتقنيات العلاجية التطبيقية'}
 </h3>
 <p className="text-sm text-text-secondary mt-1">
 دليل إرشادي عملي يتضمن الشرح التفصيلي والتمارين التطبيقية لكل مهارة
 </p>
 </div>
 <span className="text-xs sm:text-sm font-bold text-text-secondary bg-bg-surface-hover px-3.5 py-1.5 rounded-full border border-border-medium">
 {page.skillsCatalog.length} مهارة تطبيقية
 </span>
 </div>

 <div className="space-y-6">
 {page.skillsCatalog.map((skill, sIdx) => (
 <div 
 key={skill.id || sIdx} 
 id={skill.id}
 className="bg-bg-surface rounded-2xl p-5 sm:p-7 border border-border-subtle shadow-sm space-y-5"
 >
 {/* Header */}
 <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="flex size-7 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold">
 {skill.number || sIdx + 1}
 </span>
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-surface-hover text-text-secondary font-semibold">
 مهارة علاجية #{skill.number || sIdx + 1}
 </span>
 </div>
 <h4 className="text-lg sm:text-xl font-bold text-text-primary pt-1">
 {skill.title}
 </h4>
 </div>
 <div className="p-2.5 bg-bg-app rounded-xl border border-border-subtle">
 <Dumbbell className="w-5 h-5 text-text-secondary" />
 </div>
 </div>

 {/* Detailed Explanation */}
 {skill.explanation && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <h5 className="font-bold text-sm sm:text-base text-text-secondary flex items-center gap-2">
 <Brain className="w-4 h-4 text-emerald-600" />
 الشرح التفصيلي للمهارة:
 </h5>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 {skill.explanation}
 </p>
 </div>
 )}

 {/* Exercises */}
 {skill.exercises && skill.exercises.length > 0 && (
 <div className="space-y-3 pt-1">
 <h5 className="font-bold text-base text-text-primary flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-emerald-600" />
 التمارين التطبيقية (4 تمارين عملية):
 </h5>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {skill.exercises.map((ex, exIdx) => (
 <div key={exIdx} className="p-4 bg-bg-surface rounded-xl border border-border-subtle shadow-2xs space-y-2 hover:border-border-medium transition-all">
 <div className="flex items-center gap-2">
 <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-surface-hover text-text-secondary text-xs font-bold">
 {exIdx + 1}
 </span>
 <h6 className="font-bold text-sm sm:text-base text-text-primary">{ex.title}</h6>
 </div>
 <p className="text-xs sm:text-sm text-text-secondary leading-relaxed pt-1 border-t border-[#f2f8f5]">
 {ex.description}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Core Principles */}
 {page.corePrinciples && page.corePrinciples.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <Compass className="w-5 h-5 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">المبادئ والمفاهيم الأساسية</h3>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {page.corePrinciples.map((cp, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-1.5">
 <h4 className="font-bold text-base text-text-primary">{cp.title}</h4>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{cp.description}</p>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* How It Works */}
 {page.howItWorks && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <Brain className="w-5 h-5 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.howItWorks.title}</h3>
 </div>
 {page.howItWorks.steps && (
 <div className="space-y-3">
 {page.howItWorks.steps.map((st, idx) => (
 <div key={idx} className="flex items-start gap-3.5 p-4 bg-bg-app rounded-xl border border-border-subtle">
 <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-bold mt-0.5">
 {st.number || idx + 1}
 </span>
 <div className="space-y-1">
 <h4 className="font-bold text-base text-text-primary">{st.title}</h4>
 {st.example && <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{st.example}</p>}
 </div>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Spectrum */}
 {page.spectrum && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.spectrum.title}</h3>
 {page.spectrum.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.spectrum.description}</p>
 )}
 {page.spectrum.levels && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
 {page.spectrum.levels.map((lvl, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-1.5">
 <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-bg-surface-hover text-text-secondary">
 {lvl.label}
 </span>
 <p className="text-sm text-text-secondary leading-relaxed pt-1">{lvl.description}</p>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Categories (e.g. Primitive, Neurotic, Mature) */}
 {page.categories && page.categories.length > 0 && (
 <section className="space-y-6" dir="auto">
 {page.categories.map((cat, cIdx) => {
 const introObj = page.categoryIntroductions && page.categoryIntroductions[cat.id];
 return (
 <div key={cat.id || cIdx} className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4">
 <div className="border-b border-border-subtle pb-4 space-y-2">
 <div className="flex flex-wrap items-center justify-between gap-2">
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary">{cat.name}</h3>
 {cat.badge && (
 <span className={`text-xs px-3 py-1 rounded-full font-bold border ${cat.badgeColor || 'bg-bg-surface-hover text-text-secondary border-border-medium'}`}>
 {cat.badge}
 </span>
 )}
 </div>
 {cat.nameEn && <p className="text-sm text-text-secondary font-medium">{cat.nameEn}</p>}
 
 {introObj && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2 mt-2">
 {introObj.friendlyTitle && (
 <h4 className="font-bold text-base text-text-secondary">{introObj.friendlyTitle}</h4>
 )}
 {introObj.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{introObj.description}</p>
 )}
 {introObj.compassionMessage && (
 <p className="text-xs sm:text-sm text-emerald-600 font-semibold italic pt-1">{introObj.compassionMessage}</p>
 )}
 </div>
 )}
 </div>

 {cat.items && (
 <div className="grid grid-cols-1 gap-4 pt-1">
 {cat.items.map((item, iIdx) => (
 <div key={iIdx} className="p-4 sm:p-5 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border-subtle pb-2">
 <h4 className="text-base sm:text-lg font-bold text-text-primary">{item.name}</h4>
 {item.nameEn && <span className="text-xs text-text-muted font-mono">{item.nameEn}</span>}
 </div>
 {item.definition && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">التعريف: </span>{item.definition}
 </p>
 )}
 {item.example && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-secondary">مثال واقعي: </span>{item.example}
 </p>
 )}
 {item.insight && (
 <div className="p-3 bg-bg-surface rounded-lg border border-border-subtle text-xs sm:text-sm text-text-secondary font-semibold">
 💡 {item.insight}
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 );
 })}
 </section>
 )}

 {/* Psychotic Level Note */}
 {page.psychoticLevelNote && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.psychoticLevelNote.title}</h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.psychoticLevelNote.body}</p>
 {page.psychoticLevelNote.safety && (
 <div className="p-3.5 bg-red-50 rounded-xl border border-red-200 text-sm sm:text-base text-red-900 font-semibold leading-relaxed">
 🚨 {page.psychoticLevelNote.safety}
 </div>
 )}
 </section>
 )}

 {/* Defense vs Coping */}
 {page.defenseVsCoping && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.defenseVsCoping.title}</h3>
 {page.defenseVsCoping.columns && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {page.defenseVsCoping.columns.map((col, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <h4 className="font-bold text-base text-text-secondary border-b border-border-subtle pb-2">{col.name}</h4>
 <ul className="space-y-1.5 text-sm sm:text-base text-text-secondary">
 {col.features.map((f, fIdx) => (
 <li key={fIdx} className="flex items-start gap-2">
 <span className="text-emerald-600 font-bold shrink-0">•</span>
 <span>{f}</span>
 </li>
 ))}
 </ul>
 </div>
 ))}
 </div>
 )}
 {page.defenseVsCoping.note && (
 <p className="text-xs sm:text-sm text-text-secondary pt-1">{page.defenseVsCoping.note}</p>
 )}
 </section>
 )}

 {/* Common Confusions */}
 {page.commonConfusions && page.commonConfusions.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">فروق مهمة تزيل اللبس والخلط</h3>
 <div className="space-y-3">
 {page.commonConfusions.map((cc, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <h4 className="font-bold text-base text-text-primary">{cc.title}</h4>
 {cc.explanation && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{cc.explanation}</p>
 )}
 {cc.left && cc.right && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm sm:text-base text-text-secondary">
 <div className="p-3 bg-bg-surface rounded-lg border border-border-subtle">
 <span className="font-bold text-red-700 block mb-1">الجانب الأول:</span>
 {cc.left}
 </div>
 <div className="p-3 bg-bg-surface rounded-lg border border-border-subtle">
 <span className="font-bold text-text-secondary block mb-1">الجانب المقابل:</span>
 {cc.right}
 </div>
 </div>
 )}
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Personal Reflection */}
 {page.personalReflection && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm space-y-3.5" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.personalReflection.title}</h3>
 {page.personalReflection.subtitle && (
 <p className="text-sm sm:text-base font-bold text-text-secondary">{page.personalReflection.subtitle}</p>
 )}
 {page.personalReflection.questions && (
 <div className="space-y-2 pt-1">
 {page.personalReflection.questions.map((q, idx) => (
 <div key={idx} className="flex items-start gap-2.5 p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-primary font-medium">
 <span className="text-emerald-600 font-bold shrink-0">❓</span>
 <span>{q}</span>
 </div>
 ))}
 </div>
 )}
 {page.personalReflection.gentleReminder && (
 <p className="text-xs sm:text-sm text-text-secondary italic pt-1">{page.personalReflection.gentleReminder}</p>
 )}
 </section>
 )}

 {/* Interactive Scenario */}
 {page.interactiveScenario && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <MessageSquare className="w-5 h-5 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.interactiveScenario.title}</h3>
 </div>
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle">
 <p className="text-sm sm:text-base text-text-primary font-semibold leading-relaxed">
 <span className="font-bold text-text-secondary">الموقف: </span>
 {page.interactiveScenario.scenario}
 </p>
 </div>
 {page.interactiveScenario.options && (
 <div className="space-y-3">
 {page.interactiveScenario.options.map((opt, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <p className="font-bold text-base text-text-primary">الاستجابة {idx + 1}:"{opt.response}"</p>
 {opt.possibleMechanism && (
 <p className="text-xs sm:text-sm text-text-muted">
 <span className="font-bold">الآلية المحتملة: </span>{opt.possibleMechanism}
 </p>
 )}
 {opt.healthierAlternative && (
 <div className="p-3 bg-bg-surface rounded-lg border border-border-subtle text-sm sm:text-base text-text-secondary font-medium">
 ✨ <span className="font-bold">البديل الصحي: </span>{opt.healthierAlternative}
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 {page.interactiveScenario.disclaimer && (
 <p className="text-xs text-text-muted">{page.interactiveScenario.disclaimer}</p>
 )}
 </section>
 )}

 {/* 3 Step Practice */}
 {page.threeStepPractice && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center justify-between border-b border-border-subtle pb-3">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.threeStepPractice.title}</h3>
 {page.threeStepPractice.duration && (
 <span className="text-xs px-2.5 py-1 rounded-full bg-bg-surface-hover text-text-secondary font-bold">
 ⏱️ {page.threeStepPractice.duration}
 </span>
 )}
 </div>
 {page.threeStepPractice.steps && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
 {page.threeStepPractice.steps.map((st, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <div className="flex items-center gap-2">
 <span className="size-6 flex items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold">
 {idx + 1}
 </span>
 <h4 className="font-bold text-base text-text-primary">{st.title}</h4>
 </div>
 <p className="text-sm text-text-secondary leading-relaxed">{st.instruction}</p>
 </div>
 ))}
 </div>
 )}
 {page.threeStepPractice.example && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold">
 💡 مثال:"{page.threeStepPractice.example}"
 </div>
 )}
 </section>
 )}

 {/* Healthier Alternatives */}
 {page.healthierAlternatives && page.healthierAlternatives.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">جسور التحول إلى استجابات أكثر مرونة</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {page.healthierAlternatives.map((alt, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
 <span className="text-red-700">من: {alt.from}</span>
 <span className="text-text-secondary">← {alt.bridge}</span>
 </div>
 <p className="text-sm sm:text-base text-text-secondary italic leading-relaxed bg-bg-surface p-2.5 rounded-lg border border-border-subtle">"{alt.phrase}"
 </p>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Language With Others / Supportive Language */}
 {(page.languageWithOthers || page.supportiveLanguage) && (() => {
 const langData = page.supportiveLanguage || page.languageWithOthers;
 return (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{langData.title}</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {langData.avoid && (
 <div className="p-4 bg-red-50/70 rounded-xl border border-red-200 space-y-2">
 <p className="font-bold text-sm sm:text-base text-red-800 flex items-center gap-1.5">
 <XCircle size={18} className="text-red-600 shrink-0" /> عبارات يُفضل تجنبها:
 </p>
 <ul className="space-y-1.5 text-sm sm:text-base text-red-950">
 {langData.avoid.map((av, idx) => (
 <li key={idx} className="leading-relaxed">• {av}</li>
 ))}
 </ul>
 </div>
 )}
 {(langData.useInstead || langData.tryInstead) && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-medium space-y-2">
 <p className="font-bold text-sm sm:text-base text-text-secondary flex items-center gap-1.5">
 <CheckCircle2 size={18} className="text-emerald-600 shrink-0" /> بدائل أكثر نضجًا وتواصلًا:
 </p>
 <ul className="space-y-1.5 text-sm sm:text-base text-text-primary">
 {(langData.useInstead || langData.tryInstead).map((ti, idx) => (
 <li key={idx} className="leading-relaxed">• {ti}</li>
 ))}
 </ul>
 </div>
 )}
 </div>
 </section>
 );
 })()}

 {/* How To Support Someone */}
 {page.howToSupportSomeone && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.howToSupportSomeone.title}</h3>
 {page.howToSupportSomeone.steps && (
 <div className="space-y-2">
 {page.howToSupportSomeone.steps.map((st, idx) => (
 <div key={idx} className="flex items-start gap-2.5 p-3 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary">
 <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
 <span>{st}</span>
 </div>
 ))}
 </div>
 )}
 {page.howToSupportSomeone.samplePhrase && (
 <div className="p-4 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 💬"{page.howToSupportSomeone.samplePhrase}"
 </div>
 )}
 </section>
 )}

 {/* First Appointment Guide */}
 {page.firstAppointment && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.firstAppointment.title}</h3>
 {page.firstAppointment.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.firstAppointment.description}</p>
 )}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
 {page.firstAppointment.possibleTopics && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <h4 className="font-bold text-base text-text-primary border-b border-border-subtle pb-2">مواضيع قد تُناقش:</h4>
 <ul className="space-y-1.5 text-sm text-text-secondary">
 {page.firstAppointment.possibleTopics.map((top, idx) => (
 <li key={idx} className="flex items-start gap-2 leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">•</span>
 <span>{top}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 {page.firstAppointment.patientRights && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <h4 className="font-bold text-base text-text-secondary border-b border-border-subtle pb-2">حقوقك كمراجع:</h4>
 <ul className="space-y-1.5 text-sm text-text-secondary">
 {page.firstAppointment.patientRights.map((rt, idx) => (
 <li key={idx} className="flex items-start gap-2 leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">✓</span>
 <span>{rt}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 </div>
 </section>
 )}

 {/* Questions for Clinician */}
 {page.questionsForClinician && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.questionsForClinician.title}</h3>
 {page.questionsForClinician.questions && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {page.questionsForClinician.questions.map((q, idx) => (
 <div key={idx} className="flex items-start gap-2 p-3 bg-bg-app rounded-xl border border-border-subtle text-sm text-text-primary font-medium leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">❓</span>
 <span>{q}</span>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Special Clinical Notes */}
 {page.specialNotes && page.specialNotes.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">ملاحظات واعتبارات سريرية خاصة</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {page.specialNotes.map((sn, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-1.5">
 <h4 className="font-bold text-base text-text-secondary">{sn.title}</h4>
 <p className="text-sm text-text-secondary leading-relaxed">{sn.body}</p>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Recovery Message */}
 {page.recoveryMessage && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm space-y-3" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.recoveryMessage.title}</h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.recoveryMessage.body}</p>
 {page.recoveryMessage.reminder && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 🌱 {page.recoveryMessage.reminder}
 </div>
 )}
 </section>
 )}

 {/* Somatic Clarification */}
 {page.somaticClarification && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.somaticClarification.title}</h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.somaticClarification.body}</p>
 {page.somaticClarification.action && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold">
 🩺 {page.somaticClarification.action}
 </div>
 )}
 </section>
 )}

 {/* When To Seek Help */}
 {page.whenToSeekHelp && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.whenToSeekHelp.title}</h3>
 {page.whenToSeekHelp.signs && (
 <div className="space-y-2">
 {page.whenToSeekHelp.signs.map((sign, idx) => (
 <div key={idx} className="flex items-start gap-2.5 p-3 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary">
 <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
 <span>{sign}</span>
 </div>
 ))}
 </div>
 )}
 {page.whenToSeekHelp.therapyMessage && (
 <div className="p-4 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 💚 {page.whenToSeekHelp.therapyMessage}
 </div>
 )}
 </section>
 )}

 {/* Urgent Support */}
 {page.urgentSupport && (
 <section className="bg-red-50 rounded-2xl p-5 sm:p-6 border border-red-200 shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2 text-red-800">
 <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.urgentSupport.title}</h3>
 </div>
 {page.urgentSupport.body && (
 <p className="text-sm sm:text-base text-red-950 leading-relaxed font-medium">{page.urgentSupport.body}</p>
 )}
 {page.urgentSupport.warningSigns && (
 <div className="space-y-2">
 <p className="font-bold text-sm text-red-900">علامات تتطلب تدخلاً عاجلاً:</p>
 <ul className="space-y-1 text-sm text-red-950">
 {page.urgentSupport.warningSigns.map((ws, idx) => (
 <li key={idx} className="flex items-start gap-2 leading-relaxed">
 <span className="text-red-600 font-bold shrink-0">•</span>
 <span>{ws}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 {page.urgentSupport.actionSteps && (
 <div className="space-y-2 pt-1">
 <p className="font-bold text-sm text-red-900">خطوات العمل الفورية:</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {page.urgentSupport.actionSteps.map((act, idx) => (
 <div key={idx} className="p-2.5 bg-bg-surface/80 rounded-xl border border-red-200 text-xs sm:text-sm text-red-950 font-medium">
 {idx + 1}. {act}
 </div>
 ))}
 </div>
 </div>
 )}
 {page.urgentSupport.reminder && (
 <p className="text-xs sm:text-sm text-red-900 italic font-semibold">{page.urgentSupport.reminder}</p>
 )}
 {page.urgentSupport.button && (
 <button 
 onClick={() => navigate('/crisis')}
 className="px-4 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 active:scale-98 transition-all"
 >
 {page.urgentSupport.button}
 </button>
 )}
 </section>
 )}

 {/* Myth vs Fact */}
 {page.mythVsFact && page.mythVsFact.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">خرافات وحقائق شائعة</h3>
 <div className="space-y-3">
 {page.mythVsFact.map((mf, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base">
 <div className="p-2.5 bg-red-50/80 rounded-lg text-red-900 leading-relaxed">
 <span className="font-bold text-red-700">❌ خرافة: </span>{mf.myth}
 </div>
 <div className="p-2.5 bg-bg-surface rounded-lg text-text-primary font-medium leading-relaxed">
 <span className="font-bold text-text-secondary">✔️ الحقيقة: </span>{mf.fact}
 </div>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Takeaway */}
 {page.takeaway && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm space-y-3" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.takeaway.title}</h3>
 <p className="text-base sm:text-lg font-bold text-text-secondary leading-relaxed">{page.takeaway.message}</p>
 {page.takeaway.shortMessage && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-primary font-semibold">
 ✨ {page.takeaway.shortMessage}
 </div>
 )}
 {page.takeaway.closing && (
 <p className="text-xs sm:text-sm text-text-secondary pt-1 font-medium">{page.takeaway.closing}</p>
 )}
 </section>
 )}

 {/* Glossary */}
 {page.glossary && page.glossary.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">معجم المصطلحات الرئيسية</h3>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {page.glossary.map((glo, idx) => (
 <div key={idx} className="p-3.5 bg-bg-app rounded-xl border border-border-subtle space-y-1 text-sm sm:text-base">
 <div className="flex items-center justify-between gap-1 border-b border-border-subtle pb-1">
 <span className="font-bold text-text-primary">{glo.arabic}</span>
 <span className="text-xs font-mono text-text-muted">{glo.term}</span>
 </div>
 <p className="text-xs sm:text-sm text-text-secondary pt-1 leading-relaxed">{glo.meaning}</p>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Sources */}
 {page.sources && page.sources.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3" dir="auto">
 <div className="flex items-center gap-2 text-text-primary">
 <BookMarked size={20} className="text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">المصادر والمراجع العلمية</h3>
 </div>
 <div className="space-y-2 pt-1" dir="auto">
 {page.sources.map((src, sIdx) => (
 <div key={sIdx} className="p-3 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-1">
 <span className="font-bold text-text-primary">{src.title}</span>
 {src.type && <span className="text-text-secondary font-semibold text-xs">{src.type}</span>}
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Footer Disclaimer */}
 {page.footerDisclaimer && (
 <section className="p-4 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-muted leading-relaxed text-center" dir="auto">
 {page.footerDisclaimer}
 </section>
 )}

 {/* Legacy Opening block */}
 {page.opening && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium shadow-sm">
 <div className="flex items-start gap-3.5">
 <Info className="w-6 h-6 text-text-secondary shrink-0 mt-0.5" />
 <div className="space-y-1.5 text-text-primary" dir="auto">
 <p className="font-bold text-base sm:text-lg leading-snug">{page.opening.highlight}</p>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-1">{page.opening.summary}</p>
 </div>
 </div>
 </section>
 )}

 {/* Legacy Body block */}
 {page.body && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <h3 className="text-lg sm:text-xl font-bold mb-3 text-text-primary flex items-center gap-2">
 <BookOpen size={20} className="text-emerald-600" />
 Foundation & Core Context
 </h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line" dir="auto">{page.body}</p>
 </section>
 )}

 {/* Dynamic Rich Sections (JSON schema) */}
 {page.sections && page.sections.length > 0 && (
 <section className="space-y-6">
 {page.sections.map((section, sIdx) => (
 <div key={section.id || sIdx} className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-5">
 
 {/* Section Header */}
 <div className="border-b border-border-subtle pb-4 space-y-2.5" dir="auto">
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">{section.title}</h3>
 {section.keyMessage && (
 <div className="p-3 sm:p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base font-bold text-text-secondary leading-relaxed">
 💡 {section.keyMessage}
 </div>
 )}
 {section.keyInsight && (
 <div className="p-3 sm:p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base font-bold text-text-secondary leading-relaxed">
 💡 {section.keyInsight}
 </div>
 )}
 {section.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{section.description}</p>
 )}
 {section.description_detailed && (
 <p className="text-sm sm:text-base text-emerald-700 dark:text-emerald-400 font-semibold leading-relaxed">{section.description_detailed}</p>
 )}
 {section.science && (
 <div className="p-3 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed flex items-start gap-2.5">
 <Brain size={18} className="text-emerald-600 shrink-0 mt-0.5" />
 <span>{section.science}</span>
 </div>
 )}
 </div>

 {/* Section Triad Items (e.g. Beck's Cognitive Triad) */}
 {section.triadItems && section.triadItems.length > 0 && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1" dir="auto">
 {section.triadItems.map((triad, tIdx) => (
 <div key={tIdx} className="p-4 bg-fuchsia-50/70 rounded-xl border border-fuchsia-200/80 space-y-2 text-sm sm:text-base shadow-2xs">
 <div className="font-bold text-fuchsia-950 flex items-center gap-2">
 <span className="size-2.5 rounded-full bg-fuchsia-600 shrink-0" />
 <span>{triad.axis}</span>
 </div>
 {triad.distortion && (
 <p className="text-fuchsia-900 italic font-medium leading-relaxed bg-bg-surface/90 p-3 rounded-lg border border-fuchsia-100 text-xs sm:text-sm">
 {triad.distortion}
 </p>
 )}
 </div>
 ))}
 </div>
 )}

 {/* Section Schema Domains (e.g. Young 5 Domains & 18 Schemas) */}
 {section.domains && section.domains.length > 0 && (
 <div className="space-y-4 pt-1" dir="auto">
 {section.domains.map((dom, dIdx) => (
 <div key={dIdx} className="p-4 sm:p-5 bg-fuchsia-50/40 rounded-2xl border border-fuchsia-100 space-y-3.5">
 <div className="border-b border-fuchsia-100 pb-2.5">
 <h4 className="text-base sm:text-lg font-bold text-fuchsia-950 flex items-center gap-2">
 <Sparkles className="w-4 h-4 text-fuchsia-600 shrink-0" />
 <span>{dom.domainName}</span>
 </h4>
 {dom.domainDesc && (
 <p className="text-xs sm:text-sm text-fuchsia-900/80 mt-1 font-medium">{dom.domainDesc}</p>
 )}
 </div>
 {dom.schemas && dom.schemas.length > 0 && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {dom.schemas.map((sch, schIdx) => (
 <div key={schIdx} className="p-3.5 bg-bg-surface rounded-xl border border-fuchsia-100/80 space-y-2 shadow-2xs">
 <p className="font-bold text-fuchsia-950 text-sm sm:text-base">{sch.name}</p>
 {sch.belief && (
 <p className="text-xs sm:text-sm text-text-secondary leading-relaxed bg-fuchsia-50/50 p-2.5 rounded-lg border border-fuchsia-100/50">
 <span className="font-semibold text-fuchsia-900">💬 المعتقد الجوهري: </span>
 {sch.belief}
 </p>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 )}

 {/* Section Categories (e.g. Substance vs Process Addictions) */}
 {section.categories && section.categories.length > 0 && (
 <div className="space-y-4">
 {section.categories.map((cat, cIdx) => (
 <div key={cat.id || cIdx} className="p-4 sm:p-5 bg-bg-app rounded-xl sm:rounded-2xl border border-border-subtle space-y-3.5" dir="auto">
 <div className="flex items-center gap-2">
 <span className="size-3 rounded-full" style={{ backgroundColor: cat.color || '#4e9778' }} />
 <h4 className="text-base sm:text-lg font-bold text-text-primary">{cat.name}</h4>
 </div>
 {cat.description && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{cat.description}</p>
 )}
 {cat.examples && (
 <div className="grid grid-cols-1 gap-3 pt-1">
 {cat.examples.map((ex, exIdx) => (
 <div key={exIdx} className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base text-text-secondary">
 {ex.substance && (
 <div className="flex flex-wrap items-center justify-between gap-1.5 border-b border-border-subtle pb-1.5">
 <span className="font-bold text-text-primary text-base">{ex.substance}</span>
 {ex.prevalence && (
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-surface-hover text-text-secondary font-semibold">
 {ex.prevalence}
 </span>
 )}
 </div>
 )}
 {ex.behavior && (
 <div className="border-b border-border-subtle pb-1.5">
 <span className="font-bold text-text-primary text-base">{ex.behavior}</span>
 </div>
 )}
 {ex.pathway && (
 <p className="leading-relaxed"><span className="font-bold text-text-secondary">آلية العمل: </span>{ex.pathway}</p>
 )}
 {ex.withdrawal && (
 <p className="leading-relaxed"><span className="font-bold text-red-600">أعراض الانسحاب: </span>{ex.withdrawal}</p>
 )}
 {ex.howItWorks && (
 <p className="leading-relaxed"><span className="font-bold text-text-secondary">كيف يعمل: </span>{ex.howItWorks}</p>
 )}
 {ex.redFlags && (
 <p className="leading-relaxed"><span className="font-bold text-amber-700">علامات الخطر: </span>{ex.redFlags}</p>
 )}
 {ex.consequence && (
 <p className="leading-relaxed"><span className="font-bold text-red-600">العواقب: </span>{ex.consequence}</p>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </div>
 )}

 {/* Section Stages (e.g. Prochaska Stages of Change) */}
 {section.stages && (
 <div className="space-y-4">
 {section.stages.map((stg, stgIdx) => (
 <div key={stg.id || stgIdx} className="p-4 sm:p-5 bg-bg-app rounded-xl sm:rounded-2xl border border-border-subtle space-y-3" dir="auto">
 <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2">
 <h4 className="text-base sm:text-lg font-bold text-text-primary">{stg.stage}</h4>
 {stg.duration && (
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-surface-hover text-text-secondary font-semibold">
 ⏳ {stg.duration}
 </span>
 )}
 </div>
 {stg.mindset && (
 <p className="text-sm sm:text-base text-text-secondary"><span className="font-bold text-text-primary">الحالة الذهنية: </span>{stg.mindset}</p>
 )}
 {stg.internalDialogue && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary italic font-medium">
 💬 الحوار الداخلي:"{stg.internalDialogue}"
 </div>
 )}
 {stg.behaviors && (
 <div className="space-y-1.5 text-sm sm:text-base">
 <p className="font-bold text-text-primary">السلوكيات الشائعة:</p>
 {stg.behaviors.map((b, bIdx) => (
 <div key={bIdx} className="flex items-start gap-2 text-text-secondary">
 <span className="text-emerald-600 font-bold shrink-0">•</span>
 <span>{b}</span>
 </div>
 ))}
 </div>
 )}
 {stg.actions && (
 <div className="space-y-1.5 text-sm sm:text-base">
 <p className="font-bold text-text-primary">الخطوات والإجراءات:</p>
 {stg.actions.map((a, aIdx) => (
 <div key={aIdx} className="flex items-start gap-2 text-text-secondary">
 <span className="text-emerald-600 font-bold shrink-0">✓</span>
 <span>{a}</span>
 </div>
 ))}
 </div>
 )}
 {stg.challenges && (
 <div className="space-y-1.5 text-sm sm:text-base">
 <p className="font-bold text-amber-700">التحديات والمصاعب:</p>
 {stg.challenges.map((c, cIdx) => (
 <div key={cIdx} className="flex items-start gap-2 text-text-secondary">
 <span className="text-amber-600 font-bold shrink-0">•</span>
 <span>{c}</span>
 </div>
 ))}
 </div>
 )}
 {stg.criticalSupport && (
 <div className="space-y-1.5 text-sm sm:text-base">
 <p className="font-bold text-text-secondary">الدعم الحاسم والموصى به:</p>
 {stg.criticalSupport.map((cs, csIdx) => (
 <div key={csIdx} className="flex items-start gap-2 text-text-secondary">
 <span className="text-emerald-600 font-bold shrink-0">★</span>
 <span>{cs}</span>
 </div>
 ))}
 </div>
 )}
 {stg.milestones && (
 <div className="space-y-1.5 text-sm sm:text-base">
 <p className="font-bold text-text-primary">المعالم والتحولات:</p>
 {stg.milestones.map((m, mIdx) => (
 <div key={mIdx} className="p-2 bg-bg-surface rounded-lg border border-border-subtle text-text-secondary font-medium">
 🎯 {m}
 </div>
 ))}
 </div>
 )}
 {stg.whyHappens && (
 <div className="space-y-1.5 text-sm sm:text-base">
 <p className="font-bold text-text-primary">لماذا تحدث:</p>
 {stg.whyHappens.map((w, wIdx) => (
 <div key={wIdx} className="flex items-start gap-2 text-text-secondary">
 <span className="text-red-500 font-bold shrink-0">•</span>
 <span>{w}</span>
 </div>
 ))}
 </div>
 )}
 {stg.what_to_do && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base">
 <p className="font-bold text-text-primary">ماذا تفعل:</p>
 {Object.entries(stg.what_to_do).map(([stepKey, stepText], sidx) => (
 <div key={stepKey} className="flex items-start gap-2 text-text-secondary">
 <span className="font-bold text-emerald-600 shrink-0">{sidx + 1}.</span>
 <span>{stepText}</span>
 </div>
 ))}
 </div>
 )}
 {stg.criticalTruth && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold whitespace-pre-line">
 ✨ {stg.criticalTruth}
 </div>
 )}
 {stg.whatHelps && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary">
 <span className="font-bold text-text-secondary">ما الذي يساعد: </span>
 {stg.whatHelps}
 </div>
 )}
 {stg.danger && (
 <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-sm sm:text-base text-amber-900">
 ⚠️ <span className="font-bold">منطقة الخطر: </span>{stg.danger}
 </div>
 )}
 {stg.redFlag && (
 <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-sm sm:text-base text-red-900">
 🚩 <span className="font-bold">مؤشر انتقال / علامة: </span>{stg.redFlag}
 </div>
 )}
 {stg.reminder && (
 <p className="text-xs sm:text-sm text-text-secondary italic pt-1">💡 {stg.reminder}</p>
 )}
 </div>
 ))}
 </div>
 )}

 {/* Section Pattern Callout */}
 {section.thePattern && (
 <div className="p-4 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base font-semibold text-text-secondary leading-relaxed" dir="auto">
 🔄 {section.thePattern}
 </div>
 )}

 {/* Section Items */}
 {section.items && (
 <div className="space-y-4 sm:space-y-5">
 {section.items.map((item, iIdx) => (
 <div key={item.id || iIdx} className="p-4 sm:p-5 bg-bg-app rounded-xl sm:rounded-2xl border border-border-subtle space-y-3.5" dir="auto">
 {(item.title || item.name) && (
 <h4 className="text-base sm:text-lg font-bold text-text-primary leading-snug">{item.title || item.name}</h4>
 )}
 
 {item.desc && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{item.desc}</p>
 )}

 {item.whyMatters && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">لماذا هذا مهم: </span>
 {item.whyMatters}
 </div>
 )}

 {item.physicalCue && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-primary leading-relaxed">
 <span className="font-bold text-text-secondary">إشارة الجسد: </span>
 {item.physicalCue}
 </div>
 )}

 {item.theIllusion && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">الخدعة النفسية: </span>
 {item.theIllusion}
 </div>
 )}

 {item.statistics && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary leading-relaxed font-semibold">
 📊 {item.statistics}
 </div>
 )}

 {item.wisdom && (
 <p className="text-sm sm:text-base text-text-secondary italic leading-relaxed">💡 {item.wisdom}</p>
 )}

 {item.theBalance && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed">
 {item.theBalance}
 </div>
 )}

 {item.explanation && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base">
 {item.explanation.misconception && (
 <div className="p-2.5 bg-red-50/70 rounded-lg text-red-800">
 <span className="font-bold">المفهوم الخاطئ: </span>{item.explanation.misconception}
 </div>
 )}
 {item.explanation.reality && (
 <div className="p-2.5 bg-bg-surface rounded-lg text-text-secondary font-semibold">
 <span className="font-bold">الحقيقة العلمية: </span>{item.explanation.reality}
 </div>
 )}
 {item.explanation.why_matters && (
 <p className="text-text-secondary pt-1 leading-relaxed"><span className="font-bold text-text-primary">لماذا هذا مهم: </span>{item.explanation.why_matters}</p>
 )}
 </div>
 )}

 {item.lifecycle && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base text-text-secondary">
 <p className="font-bold text-text-primary">دورة الحياة الإدمانية:</p>
 {item.lifecycle.early_stage && <p><span className="font-bold text-text-secondary">المرحلة المبكرة: </span>{item.lifecycle.early_stage}</p>}
 {item.lifecycle.middle_stage && <p><span className="font-bold text-amber-700">المرحلة المتوسطة: </span>{item.lifecycle.middle_stage}</p>}
 {item.lifecycle.late_stage && <p><span className="font-bold text-red-600">المرحلة المتقدمة: </span>{item.lifecycle.late_stage}</p>}
 </div>
 )}

 {item.understanding && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 🧠 {item.understanding}
 </div>
 )}

 {item.recovery_timeline && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base text-text-secondary">
 <p className="font-bold text-text-primary">الجدول الزمني للتعافي العصبي:</p>
 {Object.entries(item.recovery_timeline).map(([tKey, tVal]) => {
 if (tKey === 'important_note') return null;
 return (
 <div key={tKey} className="flex items-start gap-2 leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">✦</span>
 <span>{tVal}</span>
 </div>
 );
 })}
 {item.recovery_timeline.important_note && (
 <p className="text-xs sm:text-sm text-text-secondary italic pt-1 border-t border-border-subtle">
 💡 {item.recovery_timeline.important_note}
 </p>
 )}
 </div>
 )}

 {item.pathway && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base text-text-secondary">
 <p className="font-bold text-text-primary">خطوات المسار العصبي:</p>
 {Object.entries(item.pathway).map(([pKey, pVal], pidx) => {
 if (pKey === 'how_cycle_strengthens') return null;
 return (
 <div key={pKey} className="flex items-start gap-2.5">
 <span className="size-6 shrink-0 flex items-center justify-center rounded-full bg-bg-surface-hover text-text-secondary text-xs font-bold mt-0.5">
 {pidx + 1}
 </span>
 <span className="font-medium text-text-primary">{pVal}</span>
 </div>
 );
 })}
 {item.pathway.how_cycle_strengthens && (
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle text-xs sm:text-sm text-text-secondary leading-relaxed mt-2">
 <span className="font-bold text-text-secondary">كيف تقوى الحلقة: </span>{item.pathway.how_cycle_strengthens}
 </div>
 )}
 </div>
 )}

 {item.triggers && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
 {item.triggers.map((trg, trgIdx) => (
 <div key={trgIdx} className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base text-text-secondary">
 <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-bg-surface-hover text-text-secondary">
 {trg.type}
 </span>
 {trg.examples && <p className="text-xs sm:text-sm text-text-secondary"><span className="font-bold text-text-primary">أمثلة: </span>{trg.examples}</p>}
 {trg.howWorks && <p className="text-xs sm:text-sm leading-relaxed"><span className="font-bold text-text-secondary">كيف يعمل: </span>{trg.howWorks}</p>}
 {trg.identification && <p className="text-xs sm:text-sm text-text-secondary italic"><span className="font-bold text-text-primary">كيف تلاحظه: </span>{trg.identification}</p>}
 {trg.healthy_alternative && (
 <div className="p-2 bg-bg-surface rounded-lg text-xs sm:text-sm text-text-secondary font-semibold mt-1">
 بديل صحي: {trg.healthy_alternative}
 </div>
 )}
 </div>
 ))}
 </div>
 )}

 {item.steps && (
 <div className="space-y-2.5 pt-1">
 {item.steps.map((st, stIdx) => (
 <div key={stIdx} className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-1.5 text-sm sm:text-base text-text-secondary">
 <p className="font-bold text-text-primary">{st.step}</p>
 {st.action && <p className="leading-relaxed whitespace-pre-line"><span className="font-bold text-text-secondary">الإجراء: </span>{st.action}</p>}
 {st.benefit && <p className="text-xs sm:text-sm text-text-secondary"><span className="font-bold text-text-secondary">الفائدة: </span>{st.benefit}</p>}
 </div>
 ))}
 </div>
 )}

 {item.behaviors && (
 <div className="space-y-2.5 pt-1">
 {item.behaviors.map((beh, bIdx) => (
 <div key={bIdx} className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle space-y-1 text-sm sm:text-base text-text-secondary">
 <p className="font-bold text-text-primary">{beh.behavior}</p>
 {beh.example && <p className="text-xs sm:text-sm text-text-secondary italic"><span className="font-bold text-text-secondary">مثال: </span>"{beh.example}"</p>}
 {beh.consequence && <p className="text-xs sm:text-sm text-red-700 leading-relaxed"><span className="font-bold">النتيجة: </span>{beh.consequence}</p>}
 </div>
 ))}
 </div>
 )}

 {item.recognition && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary whitespace-pre-line leading-relaxed">
 {item.recognition}
 </div>
 )}

 {item.message && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 💡 {item.message}
 </div>
 )}

 {item.practicalExample && (
 <div className="p-3.5 sm:p-4 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
 <span className="font-bold text-text-primary block mb-1.5 text-base">مثال عملي:</span>
 {item.practicalExample}
 </div>
 )}

 {item.example && typeof item.example === 'string' && (
 <div className="p-3.5 sm:p-4 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
 <span className="font-bold text-text-primary block mb-1.5 text-base">مثال توضيحي:</span>
 {item.example}
 </div>
 )}

 {item.example && typeof item.example === 'object' && (
 <div className="p-3.5 sm:p-4 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-sm sm:text-base text-text-secondary">
 <span className="font-bold text-text-primary block mb-1 text-base">خريطة المثال:</span>
 {Object.entries(item.example).map(([exK, exV]) => (
 <div key={exK} className="leading-relaxed">
 <span className="font-bold text-text-secondary">{exK}: </span>
 <span>{exV}</span>
 </div>
 ))}
 </div>
 )}

 {/* Stages list */}
 {item.stages && (
 <div className="space-y-2.5 pt-1">
 {item.stages.map((stg, sIdx2) => (
 <div key={sIdx2} className="p-3 bg-bg-surface rounded-xl border border-border-subtle space-y-1">
 <div className="flex items-start gap-3">
 <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-surface-hover text-text-secondary text-xs sm:text-sm font-bold mt-0.5">
 {sIdx2 + 1}
 </span>
 <div className="text-sm sm:text-base flex-1">
 <p className="font-bold text-text-primary">{stg.stage}</p>
 {stg.description && <p className="text-text-secondary mt-0.5 leading-relaxed">{stg.description}</p>}
 {stg.dopamine_level && <p className="text-xs text-text-secondary font-semibold mt-1">مستوى الدوبامين: {stg.dopamine_level}</p>}
 {stg.feeling && <p className="text-xs text-text-secondary mt-0.5">الشعور: {stg.feeling}</p>}
 {stg.brain_response && <p className="text-xs text-text-secondary mt-0.5">استجابة الدماغ: {stg.brain_response}</p>}
 </div>
 </div>
 </div>
 ))}
 </div>
 )}

 {/* Comparison (e.g. willfulness vs willingness) */}
 {item.comparison && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
 {item.comparison.willfulness && (
 <div className="p-4 bg-bg-surface rounded-xl border border-red-200 space-y-2.5">
 <p className="text-sm sm:text-base font-bold text-red-700">{item.comparison.willfulness.title}</p>
 <ul className="space-y-1.5 text-sm sm:text-base text-text-secondary">
 {item.comparison.willfulness.traits.map((t, tidx) => (
 <li key={tidx} className="flex items-start gap-2 leading-relaxed">
 <span className="text-red-500 font-bold shrink-0">•</span>
 <span>{t}</span>
 </li>
 ))}
 </ul>
 {item.comparison.willfulness.example && (
 <p className="text-xs sm:text-sm text-text-muted italic pt-2 border-t border-red-100 leading-relaxed">"{item.comparison.willfulness.example}"
 </p>
 )}
 </div>
 )}

 {item.comparison.willingness && (
 <div className="p-4 bg-bg-surface rounded-xl border border-emerald-600/50 space-y-2.5">
 <p className="text-sm sm:text-base font-bold text-text-secondary">{item.comparison.willingness.title}</p>
 <ul className="space-y-1.5 text-sm sm:text-base text-text-secondary">
 {item.comparison.willingness.traits.map((t, tidx) => (
 <li key={tidx} className="flex items-start gap-2 leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">•</span>
 <span>{t}</span>
 </li>
 ))}
 </ul>
 {item.comparison.willingness.example && (
 <p className="text-xs sm:text-sm text-text-muted italic pt-2 border-t border-border-subtle leading-relaxed">"{item.comparison.willingness.example}"
 </p>
 )}
 </div>
 )}
 </div>
 )}

 {item.practicalDifference && (
 <div className="p-3 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">الفرق العملي: </span>
 {item.practicalDifference}
 </div>
 )}

 {/* Internal Dialogue */}
 {item.internalDialogue && (
 <div className="space-y-2.5 pt-1">
 <div className="p-3.5 bg-bg-surface rounded-xl border border-red-100 text-sm sm:text-base text-red-900 leading-relaxed">
 {item.internalDialogue.harsh}
 </div>
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary leading-relaxed font-medium">
 {item.internalDialogue.compassionate}
 </div>
 </div>
 )}

 {/* How to steps (object or string) */}
 {item.howto && typeof item.howto === 'object' && (
 <div className="space-y-2 p-3.5 sm:p-4 bg-bg-surface rounded-xl border border-border-subtle">
 <p className="text-sm sm:text-base font-bold text-text-primary mb-1">خطوات التطبيق:</p>
 {Object.entries(item.howto).map(([key, val], hIdx) => (
 <div key={key} className="flex items-start gap-2.5 text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-emerald-600 shrink-0">{hIdx + 1}.</span>
 <span className="whitespace-pre-line">{val}</span>
 </div>
 ))}
 </div>
 )}

 {/* Examples array */}
 {item.examples && item.examples.length > 0 && (
 <div className="p-3.5 sm:p-4 bg-bg-surface rounded-xl border border-border-subtle space-y-2">
 <p className="text-sm sm:text-base font-bold text-text-primary">أمثلة عملية:</p>
 {item.examples.map((ex, exIdx) => (
 <div key={exIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">✦</span>
 <span>{ex}</span>
 </div>
 ))}
 </div>
 )}

 {/* Practices list */}
 {item.practices && item.practices.length > 0 && (
 <div className="space-y-3 pt-1">
 <p className="text-sm sm:text-base font-bold text-text-primary">تمارين وتطبيقات عملية:</p>
 {item.practices.map((pr, pIdx) => (
 <div key={pIdx} className="p-3.5 sm:p-4 bg-bg-surface rounded-xl border border-border-subtle space-y-1.5 text-sm sm:text-base text-text-secondary">
 <p className="font-bold text-text-primary flex items-center gap-2 text-base">
 <Sparkles size={16} className="text-emerald-600 shrink-0" />
 {pr.practice}
 </p>
 {pr.howto && <p className="leading-relaxed whitespace-pre-line"><span className="font-bold text-text-secondary">الكيفية: </span>{pr.howto}</p>}
 {pr.why && <p className="leading-relaxed"><span className="font-bold text-text-secondary">السبب: </span>{pr.why}</p>}
 {pr.benefit && <p className="leading-relaxed"><span className="font-bold text-text-secondary">الفائدة: </span>{pr.benefit}</p>}
 {pr.technique && <p className="leading-relaxed"><span className="font-bold text-text-secondary">التقنية: </span>{pr.technique}</p>}
 {pr.duration && <p className="leading-relaxed"><span className="font-bold text-text-secondary">المدة: </span>{pr.duration}</p>}
 {pr.goal && <p className="leading-relaxed"><span className="font-bold text-text-secondary">الهدف: </span>{pr.goal}</p>}
 {pr.outcome && <p className="leading-relaxed"><span className="font-bold text-text-secondary">النتيجة: </span>{pr.outcome}</p>}
 {pr.result && <p className="leading-relaxed"><span className="font-bold text-text-secondary">الأثر: </span>{pr.result}</p>}
 {pr.empowerment && <p className="leading-relaxed font-bold text-text-secondary">{pr.empowerment}</p>}
 </div>
 ))}
 </div>
 )}

 {item.timing && (
 <p className="text-xs sm:text-sm text-text-secondary pt-1">⏳ <span className="font-bold">التدرج الزمني: </span>{item.timing}</p>
 )}
 {item.resistance && (
 <p className="text-xs sm:text-sm text-text-secondary pt-1">🛡️ <span className="font-bold">لو واجهت مقاومة: </span>{item.resistance}</p>
 )}
 {item.themindtrap && (
 <p className="text-xs sm:text-sm text-text-secondary">⚠️ <span className="font-bold">فخ التفكير: </span>{item.themindtrap}</p>
 )}
 {item.theStruggle && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{item.theStruggle}</p>
 )}
 {item.acceptance && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold">
 {item.acceptance}
 </div>
 )}
 {item.integration && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed italic">{item.integration}</p>
 )}
 {item.practice && typeof item.practice === 'string' && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">
 <span className="font-bold text-text-primary block mb-1 text-base">التطبيق:</span>
 {item.practice}
 </div>
 )}
 </div>
 ))}
 </div>
 )}
 </div>
 ))}
 </section>
 )}

 {/* Biological Pillars (Lifestyle Psychiatry) */}
 {page.pillars && page.pillars.length > 0 && (
 <section className="space-y-6" dir="auto">
 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-subtle pb-4">
 <div>
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
 الركائز البيولوجية الخمس الأساسية
 </h3>
 <p className="text-sm text-text-secondary mt-1">
 الأسس العضوية الحيوية لاستقرار كيمياء الدماغ والنواقل العصبية
 </p>
 </div>
 <span className="text-xs sm:text-sm font-bold text-text-secondary bg-bg-surface-hover px-3.5 py-1.5 rounded-full border border-border-medium">
 5 ركائز متكاملة
 </span>
 </div>

 <div className="space-y-6">
 {page.pillars.map((pillar, pIdx) => {
 const getIcon = (iconName) => {
 switch (iconName) {
 case 'Moon': return <Moon className="w-5 h-5 text-text-secondary" />;
 case 'Sun': return <Sun className="w-5 h-5 text-text-secondary" />;
 case 'Apple': return <Apple className="w-5 h-5 text-text-secondary" />;
 case 'Flame': return <Flame className="w-5 h-5 text-text-secondary" />;
 case 'Droplet': return <Droplet className="w-5 h-5 text-text-secondary" />;
 default: return <Sparkles className="w-5 h-5 text-text-secondary" />;
 }
 };

 const scienceLabels = {
 circadianRhythm: 'الساعة البيولوجية 24 ساعية',
 sleepStages: 'مراحل ودورات النوم (NREM & REM)',
 glymphaticSystem: 'الجهاز الغليمفاوي وتنظيف سموم الدماغ',
 emotionalProcessing: 'معالجة العواطف والصدمات في نوم REM',
 ipRGCCells: 'خلايا الشبكية الحساسة للضوء (ipRGCs)',
 dopamineBoost: 'تعزيز الدوبامين والطاقة الفورية',
 melatoninClock: 'ضبط مؤقت الميلاتونين الليلي',
 serotonin: 'رفع السيروتونين الطبيعي (هرمون السعادة)',
 microbiome: 'ميكروبيوم الأمعاء (38 تريليون بكتيريا نافعة)',
 inflammation: 'الالتهاب المزمن ومحور الأمعاء والمخ',
 bloodBrainBarrier: 'الحاجز الدموي الدماغي وبطانة الأمعاء',
 bdnf: 'عامل نمو الأعصاب BDNF (سماد الدماغ)',
 neurogenesis: 'تخليق الخلايا العصبية في الحصين',
 dopamine: 'رفع الدوبامين وتحفيز المكافأة والدافعية'
 };

 return (
 <div 
 key={pillar.id || pIdx} 
 id={pillar.id}
 className="bg-bg-surface rounded-2xl p-5 sm:p-7 border border-border-subtle shadow-sm space-y-5"
 >
 {/* Header */}
 <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border-subtle pb-4">
 <div className="space-y-1">
 <div className="flex items-center gap-2 flex-wrap">
 <span className="flex size-7 items-center justify-center rounded-full bg-emerald-600 dark:bg-emerald-700 text-white text-xs font-bold">
 {pillar.number || pIdx + 1}
 </span>
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-surface-hover text-text-secondary font-semibold">
 الركيزة {pillar.number}
 </span>
 {pillar.priority && (
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
 الأهمية: {pillar.importanceScore || pillar.priority}
 </span>
 )}
 </div>
 <h4 className="text-lg sm:text-xl font-bold text-text-primary pt-1">
 {pillar.name}
 </h4>
 {pillar.nameEn && (
 <p className="text-xs sm:text-sm text-emerald-600 font-medium" dir="ltr">
 {pillar.nameEn}
 </p>
 )}
 </div>
 <div className="p-2.5 bg-bg-app rounded-xl border border-border-subtle">
 {getIcon(pillar.icon)}
 </div>
 </div>

 {/* Why It Matters */}
 {pillar.whyItMatters && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
 💡 <span className="font-bold text-text-primary">لماذا تعد ركيزة أساسية: </span>{pillar.whyItMatters}
 </div>
 )}

 {/* Deep Science */}
 {pillar.scienceDeep && (
 <div className="space-y-3 pt-1">
 <div className="flex items-center gap-2 text-text-primary">
 <Brain className="w-5 h-5 text-emerald-600 shrink-0" />
 <h5 className="font-bold text-base sm:text-lg">الأساس العلمي والبيولوجي المتعمق</h5>
 </div>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {Object.entries(pillar.scienceDeep).map(([key, value]) => (
 <div key={key} className="p-3.5 bg-bg-app rounded-xl border border-border-subtle space-y-1">
 <h6 className="font-bold text-sm text-text-secondary">
 {scienceLabels[key] || key}
 </h6>
 <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
 {value}
 </p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Protocol */}
 {pillar.protocol && (
 <div className="p-4 sm:p-5 bg-bg-surface rounded-xl border border-border-subtle space-y-2.5">
 <h5 className="font-bold text-base text-text-primary flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600" />
 {pillar.protocol.title || 'بروتوكول التطبيق العملي'}
 </h5>
 {pillar.protocol.consistency && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">قاعدة الانتظام: </span>{pillar.protocol.consistency}
 </p>
 )}
 {pillar.protocol.whyConsistency && (
 <p className="text-xs sm:text-sm text-text-secondary bg-bg-app p-2.5 rounded-lg border border-border-subtle">
 ⚙️ <span className="font-bold">التفسير: </span>{pillar.protocol.whyConsistency}
 </p>
 )}
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1">
 {pillar.protocol.timing && (
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle text-xs sm:text-sm text-text-secondary">
 <span className="font-bold text-text-primary block">التوقيت:</span>
 {pillar.protocol.timing}
 </div>
 )}
 {pillar.protocol.duration && (
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle text-xs sm:text-sm text-text-secondary">
 <span className="font-bold text-text-primary block">المدة:</span>
 {pillar.protocol.duration}
 </div>
 )}
 {pillar.protocol.requirement && (
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle text-xs sm:text-sm text-text-secondary">
 <span className="font-bold text-text-primary block">الشرط الأساسي:</span>
 {pillar.protocol.requirement}
 </div>
 )}
 </div>
 </div>
 )}

 {/* Action Plan */}
 {pillar.actionPlan && pillar.actionPlan.length > 0 && (
 <div className="space-y-3 pt-1">
 <h5 className="font-bold text-base text-text-primary">خطة الخطوات والجدول الزمني</h5>
 <div className="grid grid-cols-1 gap-2.5">
 {pillar.actionPlan.map((act, aIdx) => (
 <div key={aIdx} className="p-3.5 bg-bg-app rounded-xl border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
 <div className="space-y-1">
 <div className="flex items-center gap-2">
 {act.time && (
 <span className="text-xs px-2.5 py-0.5 rounded-md bg-bg-surface-hover text-text-secondary font-bold">
 {act.time}
 </span>
 )}
 <span className="font-bold text-sm sm:text-base text-text-primary">
 {act.action || act.step}
 </span>
 </div>
 </div>
 {act.why && (
 <p className="text-xs sm:text-sm text-text-secondary sm:text-left sm:max-w-md">
 <span className="font-bold text-text-secondary">السبب: </span>{act.why}
 </p>
 )}
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Bedtime Routine */}
 {pillar.bedtimeRoutine && (
 <div className="p-4 sm:p-5 bg-bg-app rounded-xl border border-border-subtle space-y-3">
 <h5 className="font-bold text-base text-text-primary flex items-center gap-2">
 <Moon className="w-4 h-4 text-emerald-600" />
 {pillar.bedtimeRoutine.title}
 </h5>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {pillar.bedtimeRoutine.steps.map((st, sIdx) => (
 <div key={sIdx} className="p-3 bg-bg-surface rounded-lg border border-border-subtle space-y-1">
 <p className="font-bold text-sm text-text-secondary">{st.step}</p>
 <p className="text-xs text-text-secondary">{st.details}</p>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* What to Eat (Gut-Brain) */}
 {pillar.whatToEat && (
 <div className="space-y-4 pt-1">
 <h5 className="font-bold text-base text-text-primary flex items-center gap-2">
 <Apple className="w-4 h-4 text-emerald-600" />
 دليل الأطعمة الصديقة للأمعاء والمخ
 </h5>
 {pillar.whatToEat.increase && (
 <div className="space-y-2">
 <h6 className="text-xs sm:text-sm font-bold text-emerald-800 uppercase tracking-wider">
 ✅ أطعمة يُنصح بزيادتها:
 </h6>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {pillar.whatToEat.increase.map((inc, iIdx) => (
 <div key={iIdx} className="p-3 bg-bg-app rounded-xl border border-border-subtle space-y-1">
 <p className="font-bold text-sm text-text-primary">{inc.category}</p>
 <p className="text-xs text-text-secondary font-semibold">{inc.examples}</p>
 <p className="text-xs text-text-secondary">{inc.why}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 {pillar.whatToEat.reduce && (
 <div className="space-y-2">
 <h6 className="text-xs sm:text-sm font-bold text-rose-800 uppercase tracking-wider">
 ⚠️ أطعمة ومواد يُنصح بتقليلها:
 </h6>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
 {pillar.whatToEat.reduce.map((red, rIdx) => (
 <div key={rIdx} className="p-3 bg-rose-50/60 rounded-xl border border-rose-100 space-y-1">
 <p className="font-bold text-sm text-rose-950">{red.culprit}</p>
 <p className="text-xs text-rose-800">{red.why}</p>
 </div>
 ))}
 </div>
 </div>
 )}
 </div>
 )}

 {/* Meal Ideas & Supplements */}
 {pillar.mealIdea && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-subtle space-y-2.5">
 <h5 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
 <Utensils className="w-4 h-4 text-emerald-600" />
 نموذج وجبات يومية متوازنة
 </h5>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle">
 <span className="font-bold text-text-secondary">الفطور: </span>{pillar.mealIdea.breakfast}
 </div>
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle">
 <span className="font-bold text-text-secondary">الغداء: </span>{pillar.mealIdea.lunch}
 </div>
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle">
 <span className="font-bold text-text-secondary">سناك: </span>{pillar.mealIdea.snack}
 </div>
 <div className="p-2.5 bg-bg-app rounded-lg border border-border-subtle">
 <span className="font-bold text-text-secondary">العشاء: </span>{pillar.mealIdea.dinner}
 </div>
 </div>
 </div>
 )}

 {pillar.supplements && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <h5 className="font-bold text-sm text-text-primary">المكملات الغذائية الداعمة (اختيارية)</h5>
 <ul className="space-y-1 text-xs sm:text-sm text-text-secondary">
 {pillar.supplements.consider?.map((sup, sIdx) => (
 <li key={sIdx} className="flex items-center gap-2">
 <span className="text-emerald-600 font-bold">•</span>
 <span>{sup}</span>
 </li>
 ))}
 </ul>
 {pillar.supplements.notReplace && (
 <p className="text-xs text-text-secondary font-semibold pt-1 border-t border-border-subtle">
 💡 {pillar.supplements.notReplace}
 </p>
 )}
 </div>
 )}

 {/* Exercise Types */}
 {pillar.exerciseTypes && (
 <div className="space-y-3 pt-1">
 <h5 className="font-bold text-base text-text-primary flex items-center gap-2">
 <Activity className="w-4 h-4 text-emerald-600" />
 أنواع التمارين الرياضية وفوائدها العصبية
 </h5>
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {['aerobic', 'resistance', 'flexibility'].map((typeKey) => {
 const ex = pillar.exerciseTypes[typeKey];
 if (!ex) return null;
 return (
 <div key={typeKey} className="p-3.5 bg-bg-app rounded-xl border border-border-subtle space-y-1.5">
 <h6 className="font-bold text-sm text-text-secondary">{ex.name}</h6>
 <p className="text-xs text-text-primary font-semibold">{ex.examples}</p>
 <p className="text-xs text-text-secondary"><span className="font-bold">المثالي: </span>{ex.optimal}</p>
 <p className="text-xs text-text-secondary"><span className="font-bold">التوقيت: </span>{ex.when}</p>
 <p className="text-xs text-emerald-800 font-medium pt-1 border-t border-border-subtle">{ex.benefit}</p>
 </div>
 );
 })}
 </div>
 {pillar.exerciseTypes.combined && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-medium text-xs sm:text-sm text-text-secondary font-semibold">
 ✨ <span className="font-bold">الدمج المثالي: </span>{pillar.exerciseTypes.combined.ideal} — {pillar.exerciseTypes.combined.example}
 </div>
 )}
 </div>
 )}

 {/* Starting Slow & Timing & Research */}
 {pillar.startingSlow && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-subtle space-y-2 text-xs sm:text-sm text-text-secondary">
 <h5 className="font-bold text-text-primary text-sm sm:text-base">بروتوكول البداية التدريجية</h5>
 <p><span className="font-bold text-text-secondary">لغير المعتادين: </span>{pillar.startingSlow.ifYoureUnfit}</p>
 <p><span className="font-bold text-text-secondary">التدرج: </span>{pillar.startingSlow.progression}</p>
 <p className="text-xs text-text-muted italic">{pillar.startingSlow.barrier}</p>
 </div>
 )}

 {pillar.researchFinding && (
 <div className="p-3.5 bg-bg-surface-hover rounded-xl border border-border-medium text-xs sm:text-sm text-text-secondary font-bold">
 🔬 حقيقة علمية: {pillar.researchFinding}
 </div>
 )}

 {/* Hydration & Breathing Guide */}
 {pillar.hydration && (
 <div className="p-4 sm:p-5 bg-cyan-50/50 rounded-xl border border-cyan-100 space-y-3 text-xs sm:text-sm text-cyan-950">
 <h5 className="font-bold text-sm sm:text-base text-cyan-950 flex items-center gap-2">
 <Droplet className="w-4 h-4 text-cyan-700" />
 علم الترطيب وصحة الدماغ
 </h5>
 <p>{pillar.hydration.science}</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
 <div className="p-2.5 bg-bg-surface rounded-lg border border-cyan-100">
 <span className="font-bold text-cyan-900 block">المعادلة الدقيقة:</span>
 {pillar.hydration.formula}
 </div>
 <div className="p-2.5 bg-bg-surface rounded-lg border border-cyan-100">
 <span className="font-bold text-cyan-900 block">دليل البول:</span>
 {pillar.hydration.hydrationSigns?.good} مقابل {pillar.hydration.hydrationSigns?.bad}
 </div>
 </div>
 </div>
 )}

 {pillar.drinkingProtocol && (
 <div className="space-y-2 pt-1">
 <h5 className="font-bold text-sm sm:text-base text-text-primary">بروتوكول شرب الماء اليومي</h5>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {pillar.drinkingProtocol.map((dp, dIdx) => (
 <div key={dIdx} className="p-3 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm space-y-0.5">
 <div className="flex items-center justify-between font-bold text-text-primary">
 <span>{dp.time}</span>
 <span className="text-text-secondary">{dp.amount}</span>
 </div>
 <p className="text-text-secondary text-xs">{dp.why}</p>
 </div>
 ))}
 </div>
 </div>
 )}

 {pillar.breathing && (
 <div className="p-4 sm:p-5 bg-bg-surface rounded-xl border border-border-subtle space-y-3">
 <h5 className="font-bold text-sm sm:text-base text-text-primary flex items-center gap-2">
 <Wind className="w-4 h-4 text-emerald-600" />
 التنفس الأنفي العميق وتنشيط العصب الحائر
 </h5>
 <p className="text-xs sm:text-sm text-text-secondary">{pillar.breathing.science}</p>
 {pillar.breathing.benefits && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {pillar.breathing.benefits.map((b, bIdx) => (
 <div key={bIdx} className="flex items-center gap-2 p-2 bg-bg-app rounded-lg border border-border-subtle text-xs text-text-primary font-medium">
 <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
 <span>{b}</span>
 </div>
 ))}
 </div>
 )}
 </div>
 )}

 {pillar.breathingExercise && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-medium space-y-2.5">
 <h5 className="font-bold text-sm sm:text-base text-text-secondary">
 🧘 {pillar.breathingExercise.name}
 </h5>
 <div className="space-y-1.5 text-xs sm:text-sm text-text-primary">
 {pillar.breathingExercise.steps.map((step, sIdx) => (
 <div key={sIdx} className="flex items-start gap-2">
 <span className="font-bold text-text-secondary">{sIdx + 1}.</span>
 <span>{step}</span>
 </div>
 ))}
 </div>
 <p className="text-xs text-text-secondary pt-1 border-t border-border-medium">
 <span className="font-bold text-text-secondary">التفسير العصبي: </span>{pillar.breathingExercise.science}
 </p>
 </div>
 )}

 {/* Troubleshooting / Weather / Mistakes */}
 {pillar.troubleShooting && (
 <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200/70 space-y-2">
 <h5 className="font-bold text-sm text-amber-950 flex items-center gap-2">
 <AlertTriangle className="w-4 h-4 text-amber-600" />
 حل المشكلات الشائعة
 </h5>
 <div className="space-y-1.5 text-xs sm:text-sm text-amber-900">
 {Object.entries(pillar.troubleShooting).map(([tKey, tVal]) => (
 <p key={tKey}>
 <span className="font-bold">• </span>{tVal}
 </p>
 ))}
 </div>
 </div>
 )}

 {pillar.commonMistakes && pillar.commonMistakes.length > 0 && (
 <div className="p-4 bg-rose-50/60 rounded-xl border border-rose-100 space-y-2">
 <h5 className="font-bold text-sm text-rose-950 flex items-center gap-2">
 <AlertOctagon className="w-4 h-4 text-rose-600" />
 أخطاء شائعة يجب تجنبها
 </h5>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-rose-900">
 {pillar.commonMistakes.map((mis, mIdx) => (
 <div key={mIdx} className="flex items-start gap-2">
 <XCircle className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
 <span>{mis}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {pillar.weatherProblem && (
 <div className="p-3.5 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-secondary space-y-1">
 <p className="font-bold text-text-primary">❓ {pillar.weatherProblem.issue}</p>
 <p className="text-text-secondary font-medium">💡 {pillar.weatherProblem.solution}</p>
 </div>
 )}

 {/* Benefits & Timeline */}
 {pillar.benefits && pillar.benefits.length > 0 && (
 <div className="space-y-2 pt-2 border-t border-border-subtle">
 <h5 className="font-bold text-sm sm:text-base text-text-primary">المكاسب الحيوية المباشرة</h5>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
 {pillar.benefits.map((ben, bIdx) => (
 <div key={bIdx} className="flex items-center gap-2 p-2.5 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-primary font-medium">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>{ben}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {pillar.timeline && (
 <div className="p-3 bg-bg-surface-hover rounded-xl border border-border-medium text-xs sm:text-sm text-text-secondary font-bold">
 ⏱️ المدى الزمني للنتائج: {pillar.timeline}
 </div>
 )}
 </div>
 );
 })}
 </div>
 </section>
 )}

 {/* Integration Guide (Roadmap across weeks) */}
 {page.integrationGuide && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-7 border border-border-subtle shadow-sm space-y-5" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary border-b border-border-subtle pb-4">
 <Calendar className="w-5 h-5 text-emerald-600 shrink-0" />
 <div>
 <h3 className="text-lg sm:text-xl font-bold">{page.integrationGuide.title}</h3>
 <p className="text-xs sm:text-sm text-text-secondary mt-0.5">خطة التدرج العملي لبناء العادات البيولوجية المستدامة</p>
 </div>
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {page.integrationGuide.section1 && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-bg-surface-hover text-text-secondary">
 {page.integrationGuide.section1.when || 'من اليوم الأول'}
 </span>
 <ul className="space-y-1.5 text-xs sm:text-sm text-text-primary">
 {page.integrationGuide.section1.actions?.map((act, aIdx) => (
 <li key={aIdx} className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>{act}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {page.integrationGuide.week1 && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-bg-surface-hover text-text-secondary">
 الأسبوع الأول
 </span>
 <ul className="space-y-1.5 text-xs sm:text-sm text-text-primary">
 {page.integrationGuide.week1.add?.map((act, aIdx) => (
 <li key={aIdx} className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>{act}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {page.integrationGuide.week2_3 && (
 <div className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5">
 <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-bg-surface-hover text-text-secondary">
 الأسابيع 2 إلى 3
 </span>
 <ul className="space-y-1.5 text-xs sm:text-sm text-text-primary">
 {page.integrationGuide.week2_3.add?.map((act, aIdx) => (
 <li key={aIdx} className="flex items-center gap-2">
 <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
 <span>{act}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {page.integrationGuide.week4_plus && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-medium space-y-2">
 <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 dark:bg-emerald-700 text-white">
 الأسبوع 4 وما بعده
 </span>
 <p className="text-xs sm:text-sm font-bold text-text-primary">{page.integrationGuide.week4_plus.stable}</p>
 <p className="text-xs sm:text-sm text-text-secondary font-semibold">{page.integrationGuide.week4_plus.impact}</p>
 </div>
 )}
 </div>
 </section>
 )}

 {/* Page Troubleshooting */}
 {page.troubleshooting && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2.5 text-text-primary">
 <HelpCircle className="w-5 h-5 text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">{page.troubleshooting.title}</h3>
 </div>
 {page.troubleshooting.check && (
 <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
 {page.troubleshooting.check.map((chk, cIdx) => (
 <div key={cIdx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <h4 className="font-bold text-sm text-text-primary">{chk.issue}</h4>
 <p className="text-xs text-text-muted"><span className="font-bold text-text-secondary">السبب المحتمل: </span>{chk.reason}</p>
 <p className="text-xs text-text-secondary font-semibold bg-bg-surface p-2.5 rounded-lg border border-border-subtle">
 💡 <span className="font-bold">الحل: </span>{chk.solution}
 </p>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Motivational Message */}
 {page.motivationalMessage && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-7 border border-border-medium shadow-sm space-y-3.5" dir="auto">
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary leading-snug">
 {page.motivationalMessage.headline}
 </h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
 {page.motivationalMessage.message}
 </p>
 {page.motivationalMessage.commitment && (
 <div className="p-4 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold leading-relaxed">
 🎯 {page.motivationalMessage.commitment}
 </div>
 )}
 {page.motivationalMessage.timeline && (
 <p className="text-xs sm:text-sm text-text-secondary font-semibold">
 ⏳ {page.motivationalMessage.timeline}
 </p>
 )}
 </section>
 )}

 {/* Recovery Roadmap (e.g. Addiction Recovery Roadmap) */}
 {page.recovery_roadmap && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4">
 <div className="flex items-center gap-2.5" dir="auto">
 <Calendar size={20} className="text-emerald-600" />
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.recovery_roadmap.title}</h3>
 </div>
 {page.recovery_roadmap.phases && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
 {page.recovery_roadmap.phases.map((ph, phIdx) => (
 <div key={phIdx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2.5" dir="auto">
 <div className="flex items-center justify-between">
 <span className="font-bold text-text-primary text-base">{ph.phase}</span>
 <span className="text-xs px-2.5 py-0.5 rounded-full bg-bg-surface-hover text-text-secondary font-semibold">
 {ph.focus}
 </span>
 </div>
 {ph.actions && (
 <ul className="space-y-1.5 text-sm sm:text-base text-text-secondary">
 {ph.actions.map((act, actIdx) => (
 <li key={actIdx} className="flex items-start gap-2 leading-relaxed">
 <span className="text-emerald-600 font-bold shrink-0">•</span>
 <span>{act}</span>
 </li>
 ))}
 </ul>
 )}
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Integration Plan (e.g. 4 Weeks Roadmap) */}
 {page.integration_section && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4">
 <div className="flex items-center gap-2.5" dir="auto">
 <Calendar size={20} className="text-emerald-600" />
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.integration_section.title}</h3>
 </div>
 {page.integration_section.weeks && (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
 {page.integration_section.weeks.map((wk) => (
 <div key={wk.week} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2" dir="auto">
 <span className="inline-block px-2.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-bg-surface-hover text-text-secondary">
 الأسبوع {wk.week}: {wk.focus}
 </span>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed pt-1">
 <span className="font-bold text-text-primary">الممارسة اليومية: </span>
 {wk.daily_practice}
 </p>
 <p className="text-xs sm:text-sm text-text-secondary pt-0.5">
 <span className="font-bold text-text-secondary">الهدف: </span>
 {wk.goal}
 </p>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Testimonials / Real Experiences */}
 {page.testimonial_section && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4">
 <div className="flex items-center gap-2.5" dir="auto">
 <MessageCircle size={20} className="text-emerald-600" />
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.testimonial_section.title}</h3>
 </div>
 {page.testimonial_section.testimonials && (
 <div className="space-y-3.5">
 {page.testimonial_section.testimonials.map((t, idx) => (
 <div key={idx} className="p-4 sm:p-5 bg-bg-app rounded-xl border border-border-subtle space-y-2.5" dir="auto">
 <p className="text-sm sm:text-base font-bold text-text-secondary">{t.name}</p>
 <p className="text-sm sm:text-base text-text-secondary italic leading-relaxed">"{t.story}"</p>
 {t.practice && (
 <p className="text-xs sm:text-sm text-text-muted font-medium pt-1.5 border-t border-border-subtle">
 الممارسة المتبعة: {t.practice}
 </p>
 )}
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Resources & Support */}
 {page.resources && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4">
 <div className="flex items-center gap-2.5" dir="auto">
 <BookMarked size={20} className="text-emerald-600" />
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">مصادر ودعم مقترح</h3>
 </div>
 
 {page.resources.books && (
 <div className="space-y-3">
 <p className="text-sm sm:text-base font-bold text-text-secondary">كتب موصى بها:</p>
 {page.resources.books.map((b, idx) => (
 <div key={idx} className="p-3.5 sm:p-4 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary" dir="auto">
 <p className="font-bold text-text-primary text-base">{b.title} {b.ar_title && `(${b.ar_title})`}</p>
 <p className="text-xs sm:text-sm text-text-muted">المؤلف: {b.author}</p>
 <p className="text-sm text-text-secondary mt-1.5 leading-relaxed">{b.why}</p>
 </div>
 ))}
 </div>
 )}

 {page.resources.support_groups && (
 <div className="space-y-3 pt-3 border-t border-border-subtle">
 <p className="text-sm sm:text-base font-bold text-text-secondary">مجموعات الدعم العالمية والمجانية:</p>
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {page.resources.support_groups.map((sg, sgIdx) => (
 <div key={sgIdx} className="p-3.5 bg-bg-app rounded-xl border border-border-subtle space-y-1 text-sm sm:text-base text-text-secondary" dir="auto">
 <p className="font-bold text-text-primary">{sg.name}</p>
 <p className="text-xs text-text-secondary"><span className="font-bold text-text-secondary">التركيز: </span>{sg.focus}</p>
 <p className="text-xs text-text-secondary"><span className="font-bold">المنهج: </span>{sg.principle}</p>
 {sg.availability && <p className="text-xs text-emerald-600 font-medium">{sg.availability}</p>}
 {sg.advantage && <p className="text-xs text-text-secondary font-semibold">{sg.advantage}</p>}
 </div>
 ))}
 </div>
 </div>
 )}

 {page.resources.medications && (
 <div className="space-y-3 pt-3 border-t border-border-subtle">
 <p className="text-sm sm:text-base font-bold text-text-secondary">العلاجات الدوائية المعتمدة (تحت إشراف طبي متخصص):</p>
 <div className="space-y-2">
 {page.resources.medications.map((med, medIdx) => (
 <div key={medIdx} className="p-3 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary flex flex-col sm:flex-row sm:items-center justify-between gap-1" dir="auto">
 <span className="font-bold text-text-primary">{med.condition}:</span>
 <span className="text-text-secondary font-semibold text-xs sm:text-sm">{med.medications}</span>
 </div>
 ))}
 </div>
 </div>
 )}

 {page.resources.exercises && (
 <div className="space-y-2.5 pt-3 border-t border-border-subtle">
 <p className="text-sm sm:text-base font-bold text-text-secondary">تطبيقات وأدوات مساعدة:</p>
 {page.resources.exercises.map((ex, idx) => (
 <div key={idx} className="p-3 bg-bg-app rounded-xl border border-border-subtle text-sm sm:text-base text-text-secondary" dir="auto">
 <p className="font-bold text-text-primary">{ex.name}</p>
 <p className="text-xs sm:text-sm text-text-muted mt-0.5">{ex.description}</p>
 </div>
 ))}
 </div>
 )}
 </section>
 )}

 {/* Crisis / Emergency Section */}
 {page.crisis && (
 <section className="bg-red-50/80 rounded-2xl p-5 sm:p-6 border border-red-200 shadow-sm space-y-3" dir="auto">
 <div className="flex items-center gap-2 text-red-800">
 <AlertTriangle size={22} className="shrink-0 text-red-600" />
 <h3 className="text-lg sm:text-xl font-bold">{page.crisis.title}</h3>
 </div>
 <p className="text-sm sm:text-base text-red-950 font-medium leading-relaxed">{page.crisis.message}</p>
 {page.crisis.actions && (
 <ul className="space-y-2 pt-1 text-sm sm:text-base text-red-900 font-semibold">
 {page.crisis.actions.map((act, actIdx) => (
 <li key={actIdx} className="flex items-center gap-2.5">
 <span className="size-2 rounded-full bg-red-600 shrink-0" />
 <span>{act}</span>
 </li>
 ))}
 </ul>
 )}
 </section>
 )}

 {/* Closing Message */}
 {page.closing && (
 <section className="bg-bg-surface-hover rounded-2xl p-5 sm:p-6 border border-border-medium space-y-3 shadow-sm" dir="auto">
 <p className="text-xs sm:text-sm font-bold text-text-secondary uppercase tracking-wider">رسالة ختامية</p>
 <p className="text-base sm:text-lg font-bold text-text-primary leading-relaxed">{page.closing.message}</p>
 {page.closing.reminder && (
 <p className="text-sm sm:text-base text-text-secondary italic font-medium">{page.closing.reminder}</p>
 )}
 {page.closing.cta && (
 <div className="pt-2.5 border-t border-border-medium">
 <p className="text-sm sm:text-base font-bold text-text-primary">{page.closing.cta}</p>
 </div>
 )}
 {page.closing.signature && (
 <p className="text-sm sm:text-base text-text-secondary font-bold pt-1 text-left">{page.closing.signature}</p>
 )}
 </section>
 )}

 {/* Legacy Main Topic */}
 {page.mainTopic && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <div className="mb-3.5">
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">{page.mainTopic.heading}</h3>
 {page.mainTopic.description && (
 <p className="text-sm text-emerald-600 mt-1">{page.mainTopic.description}</p>
 )}
 </div>
 <div className="space-y-3">
 {page.mainTopic.items.map((item, idx) => (
 <div key={idx} className="p-3.5 sm:p-4 bg-bg-app rounded-xl border border-border-subtle">
 <p className="text-base font-bold text-text-primary">{item.name}</p>
 <p className="text-sm sm:text-base text-text-secondary mt-1 leading-relaxed">{item.detail}</p>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Legacy Questions */}
 {page.questions && page.questions.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <h3 className="text-lg sm:text-xl font-bold mb-3.5 text-text-primary flex items-center gap-2">
 <HelpCircle size={20} className="text-emerald-600" />
 Reflective Questions inside the Topic
 </h3>
 <div className="space-y-2.5">
 {page.questions.map((q, idx) => (
 <div key={idx} className="flex items-start gap-3 p-3.5 bg-bg-app rounded-xl border border-border-subtle">
 <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-bg-surface-hover text-text-secondary text-xs sm:text-sm font-bold mt-0.5">
 {idx + 1}
 </span>
 <p className="text-sm sm:text-base text-text-primary leading-relaxed">{q}</p>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Legacy Exercise */}
 {page.exercise && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <div className="flex items-center gap-2 mb-3.5">
 <Dumbbell size={20} className="text-emerald-600" />
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">Practical Exercise</h3>
 </div>
 <div className="bg-bg-surface rounded-xl p-4 border border-border-medium mb-3.5">
 <p className="text-base sm:text-lg font-bold text-text-primary">{page.exercise.title}</p>
 </div>
 <div className="space-y-2.5">
 {page.exercise.steps.map((step, idx) => (
 <div key={idx} className="flex items-start gap-3 text-sm sm:text-base text-text-secondary leading-relaxed">
 <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
 <span>{step}</span>
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Legacy Story */}
 {page.story && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <div className="flex items-center gap-2 mb-3.5">
 <Quote size={20} className="text-emerald-600" />
 <h3 className="text-lg sm:text-xl font-bold text-text-primary">Illustrative Story / Case Study</h3>
 </div>
 <div className="bg-[#fafbfb] rounded-xl p-4 sm:p-5 border border-border-subtle">
 <p className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text-secondary mb-2">{page.story.character}</p>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed italic whitespace-pre-line">"{page.story.narrative}"</p>
 </div>
 </section>
 )}

 {/* Legacy Additional sections */}
 {page.additionalSections && page.additionalSections.length > 0 && (
 <section className="space-y-3.5">
 {page.additionalSections.map((sec, idx) => (
 <div key={idx} className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm">
 <h3 className="text-lg sm:text-xl font-bold mb-2.5 text-text-primary flex items-center gap-2">
 <Sparkles size={20} className="text-emerald-600" />
 {sec.title}
 </h3>
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed whitespace-pre-line">{sec.content}</p>
 </div>
 ))}
 </section>
 )}

 {/* Conclusion / Takeaways Block */}
 {page.conclusion && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-4" dir="auto">
 <div className="flex items-center gap-2.5">
 <Sparkles size={22} className="text-emerald-600 shrink-0" />
 <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
 {page.conclusion.title || 'الخلاصة وخطة العمل'}
 </h3>
 </div>

 {page.conclusion.summary && (
 <p className="text-sm sm:text-base text-text-secondary leading-relaxed">{page.conclusion.summary}</p>
 )}

 {page.conclusion.steps && (
 <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
 {Object.values(page.conclusion.steps).map((step, idx) => (
 <div key={idx} className="p-4 bg-bg-app rounded-xl border border-border-subtle space-y-2">
 <div className="flex items-center gap-2">
 <span className="flex size-6 items-center justify-center rounded-full bg-[#285d47] text-white text-xs font-bold shrink-0">
 {step.number || idx + 1}
 </span>
 <h4 className="font-bold text-sm sm:text-base text-text-primary">{step.title}</h4>
 </div>
 <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">{step.description}</p>
 </div>
 ))}
 </div>
 )}

 {page.conclusion.finalMessage && (
 <div className="p-4 sm:p-5 bg-bg-surface-hover rounded-xl border border-border-medium space-y-3">
 <p className="font-bold text-base sm:text-lg text-text-secondary">{page.conclusion.finalMessage.title}</p>
 {page.conclusion.finalMessage.points && (
 <div className="space-y-1.5">
 {page.conclusion.finalMessage.points.map((pt, pIdx) => (
 <div key={pIdx} className="flex items-start gap-2 text-sm sm:text-base text-text-primary font-medium">
 <CheckCircle2 size={18} className="text-text-secondary shrink-0 mt-0.5" />
 <span>{pt}</span>
 </div>
 ))}
 </div>
 )}
 {page.conclusion.finalMessage.inspiration && (
 <p className="text-sm sm:text-base text-text-secondary italic font-semibold pt-2 border-t border-border-medium">"{page.conclusion.finalMessage.inspiration}"
 </p>
 )}
 </div>
 )}

 {page.conclusion.actionPlan && (
 <div className="p-3.5 bg-bg-surface rounded-xl border border-border-medium text-sm sm:text-base text-text-secondary font-bold">
 🎯 خطة الانطلاق: {page.conclusion.actionPlan}
 </div>
 )}
 </section>
 )}

 {/* References / Bibliography */}
 {page.references && page.references.length > 0 && (
 <section className="bg-bg-surface rounded-2xl p-5 sm:p-6 border border-border-subtle shadow-sm space-y-3" dir="auto">
 <div className="flex items-center gap-2 text-text-primary">
 <BookMarked size={20} className="text-emerald-600 shrink-0" />
 <h3 className="text-lg sm:text-xl font-bold">المراجع العلمية والمصادر</h3>
 </div>
 <div className="space-y-2 pt-1" dir="ltr">
 {page.references.map((ref, rIdx) => (
 <div key={rIdx} className="p-3 bg-bg-app rounded-xl border border-border-subtle text-xs sm:text-sm text-text-secondary leading-relaxed">
 <span className="font-bold text-text-primary">{ref.author}</span> {ref.year ? `(${ref.year}). ` : ''}
 <span className="italic">{ref.title}</span>.{' '}
 {ref.journal && <span>{ref.journal}, {ref.volume}({ref.issue}), {ref.pages}.</span>}
 {ref.publisher && <span>{ref.publisher}.</span>}
 {ref.relevance && <p className="text-xs text-text-secondary font-semibold mt-1" dir="rtl">{ref.relevance}</p>}
 </div>
 ))}
 </div>
 </section>
 )}

 {/* Under Update Notice if present */}
 {(page.underUpdateNotice || page.underUpdateMessage) && (
 <section className="bg-amber-50/90 rounded-2xl p-5 sm:p-6 border border-amber-200/80 shadow-sm space-y-2 text-center" dir="auto">
 <div className="flex items-center justify-center gap-2 text-amber-900 font-bold text-base sm:text-lg">
 <RefreshCw className="w-5 h-5 text-amber-600 animate-spin" />
 <span>{page.underUpdateMessage || 'الصفحة مازالت تحت التحديث'}</span>
 </div>
 <p className="text-xs sm:text-sm text-amber-800">
 نعمل باستمرار على إغناء المحتوى بالبروتوكولات السريرية والتمارين الصوتية والتفاعلية.
 </p>
 </section>
 )}

 {/* Previous / Next Topic Navigation */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-5 border-t border-border-subtle">
 {prevPage ? (
 <Link
 to={`/modules/${currentModule.slug}/${prevPage.slug}`}
 className="flex items-center justify-center sm:justify-start gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-bg-surface border border-border-subtle text-sm font-bold text-text-primary hover:bg-bg-surface-hover active:scale-98 transition-all shadow-sm"
 >
 <ChevronLeft size={18} className="shrink-0" />
 <span className="truncate">{prevPage.title}</span>
 </Link>
 ) : <div className="hidden sm:block" />}

 {nextPage ? (
 <Link
 to={`/modules/${currentModule.slug}/${nextPage.slug}`}
 className="flex items-center justify-center sm:justify-end gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-emerald-600 dark:bg-emerald-700 text-white text-sm font-bold hover:bg-emerald-700 dark:bg-emerald-800 active:scale-98 transition-all shadow-sm"
 >
 <span className="truncate">{nextPage.title}</span>
 <ChevronRight size={18} className="shrink-0" />
 </Link>
 ) : (
 <Link
 to={`/modules/${currentModule.slug}`}
 className="flex items-center justify-center gap-2 px-4 py-3 min-h-[48px] rounded-xl bg-bg-surface-hover text-text-primary text-sm font-bold hover:bg-[#d6ebe2] active:scale-98 transition-all shadow-sm"
 >
 <span>Back to {currentModule.title}</span>
 </Link>
 )}
 </div>
 </main>
 </div>
 );
}


