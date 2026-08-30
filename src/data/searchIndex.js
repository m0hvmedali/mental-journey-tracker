import { MODULES_DATA } from './modulesData.js';

// Core standard pages
const corePages = [
  {
    id: 'core-home',
    title: 'الصفحة الرئيسية',
    description: 'الواجهة الرئيسية للتطبيق',
    path: '/home',
    keywords: ['الرئيسية', 'بداية', 'home', 'main']
  },
  {
    id: 'core-wheel',
    title: 'عجلة المشاعر',
    description: 'تحديد وتسمية مشاعرك بدقة',
    path: '/wheel',
    keywords: ['عجلة المشاعر', 'مشاعر', 'تحديد', 'غضب', 'حزن', 'فرح', 'خوف']
  },
  {
    id: 'core-diary',
    title: 'اليوميات والملاحظات',
    description: 'مساحة خاصة لتدوين أفكارك وملاحظاتك ومشاعرك',
    path: '/diary',
    keywords: ['يوميات', 'ملاحظات', 'خواطر', 'مذكرات', 'كتابة', 'تفريغ', 'مشاعر']
  },
  {
    id: 'core-progress',
    title: 'حديقة التقدم والإنجازات',
    description: 'تتبع تقدمك وإنجازاتك الشخصية',
    path: '/progress',
    keywords: ['تقدم', 'انجازات', 'حديقة', 'تطور', 'متابعة']
  },
  {
    id: 'core-community',
    title: 'مجتمع الامتنان',
    description: 'رسائل ملهمة وإيجابية من المجتمع',
    path: '/community',
    keywords: ['امتنان', 'رسائل', 'مجتمع', 'دعم', 'شكر']
  },
  {
    id: 'core-settings',
    title: 'الإعدادات',
    description: 'إعدادات الحساب والتطبيق',
    path: '/setting',
    keywords: ['اعدادات', 'تفضيلات', 'حساب', 'مظهر', 'داكن', 'مضيء']
  },
  {
    id: 'core-modules',
    title: 'مكتبة الوحدات والدروس',
    description: 'قائمة بجميع الوحدات التعليمية والعلاجية',
    path: '/modules',
    keywords: ['مكتبة', 'دروس', 'وحدات', 'تعليم', 'علاج']
  }
];

// Special standalone module pages that have their own routes in App.jsx
const specialRoutes = [
  { path: '/modules/thinking-errors', title: 'الأخطاء المعرفية' },
  { path: '/modules/defense-mechanisms', title: 'آليات الدفاع' },
  { path: '/modules/emotional-regulation', title: 'التنظيم الانفعالي' },
  { path: '/modules/relationship-dynamics', title: 'أنماط العلاقات' },
  { path: '/modules/self-compassion', title: 'التعاطف مع الذات' },
  { path: '/EmotionSelect', title: 'اختيار المشاعر' },
  { path: '/EmotionCBT', title: 'تمارين المشاعر (CBT)' },
  { path: '/ToleranceWindow', title: 'نافذة التحمل' },
  { path: '/SuppressionVsRegulation', title: 'الكبت مقابل التنظيم' },
  { path: '/JournalingExercise', title: 'تمرين التدوين' },
  { path: '/Breathing478', title: 'تمرين التنفس 4-7-8' },
  { path: '/DBTTipp', title: 'مهارات TIPP' },
  { path: '/ACTSkills', title: 'مهارات ACT' },
  { path: '/SFBTSkills', title: 'مهارات SFBT' },
  { path: '/PsychodynamicSkills', title: 'مهارات الديناميكية النفسية' },
  { path: '/CognitiveReappraisal', title: 'إعادة التقييم المعرفي' }
];

export const generateSearchIndex = () => {
  const index = [...corePages];
  
  // Add special routes with some derived info
  specialRoutes.forEach(sr => {
    index.push({
      id: `special-${sr.path}`,
      title: sr.title,
      description: `صفحة أداة تفاعلية: ${sr.title}`,
      path: sr.path,
      keywords: [sr.title.toLowerCase()]
    });
  });

  // Extract from MODULES_DATA
  MODULES_DATA.forEach(module => {
    // Add module itself
    index.push({
      id: `mod-${module.slug}`,
      title: `الوحدة: ${module.title}`,
      description: module.tagline,
      path: `/modules/${module.slug}`,
      keywords: [module.title, module.subtitle, ...module.learningObjectives.map(obj => obj.substring(0, 30))]
    });
    
    // Add internal pages
    module.pages.forEach(page => {
      index.push({
        id: `page-${page.slug}`,
        title: page.title,
        description: page.summary,
        path: `/modules/${module.slug}/${page.slug}`,
        keywords: [page.title, page.category, page.titleEn || '', page.summary]
      });
      
      // If page has specific sections or tools, add them too
      if (page.sections) {
        page.sections.forEach((section, idx) => {
          index.push({
            id: `section-${page.slug}-${idx}`,
            title: `${page.title} - ${section.title}`,
            description: section.content ? section.content.substring(0, 50) : '',
            path: `/modules/${module.slug}/${page.slug}`, // just goes to page
            keywords: [section.title, section.content || '']
          });
        });
      }
    });
  });

  return index;
};
