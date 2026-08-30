# FRONTEND ARCHITECTURE CONTRACT & SERVICE LAYER (CMS Integration)

> وثيقة العقد البرمجي للواجهة الأمامية (Frontend Service Layer Contract) التي تضمن الفصل التام بين المحتوى السحابي والتنفيذ التفاعلي في React.

---

## 1. مسار تدفق البيانات (Data & Component Pipeline)

```text
Supabase DB (PostgreSQL)
       │
       ▼
src/services/contentService.js  ── (جلب المحتوى، الفلترة حسب اللغة والموقع والـ Cache)
       │
       ▼
src/components/templates/TemplateRegistry.jsx  ── (اختيار القالب: Article / Module / Minimal)
       │
       ▼
src/components/content/ContentBlockRenderer.jsx  ── (تصيير الكتل: Markdown / Quotes / Interactive)
       │
       ▼
src/components/interactive/InteractiveRegistry.jsx  ── (ربط أسماء المكونات بالـ React Components الحقيقية)
       │
       ▼
React Interactive UI (State, Timers, SVGs, Forms, Calculations)
```

---

## 2. مواصفات طبقة الخدمة (`contentService.js`)

```javascript
// Example Contract: src/services/contentService.js
import { supabase } from '@/supabaseClient';

export const contentService = {
  // 1. جلب محتوى بالـ slug واللغة مع الكتل والمراجع والوسوم
  async getContentBySlug(slug, language = 'ar') {
    const { data, error } = await supabase
      .from('content')
      .select(`
        *,
        content_blocks (*),
        content_tags (tags (*)),
        content_references (citation_note, scientific_references (*)),
        content_relationships!parent_content_id (relationship_type, related_content:content!related_content_id (slug, title, featured_image))
      `)
      .eq('slug', slug)
      .eq('language', language)
      .eq('status', 'published')
      .order('position', { foreignTable: 'content_blocks', ascending: true })
      .single();

    if (error) throw error;
    return data;
  },

  // 2. جلب المحتويات المخصصة لمكان محدد في الصفحة (Slot Placement)
  async getContentByLocation(pageRoute, slot = 'main_body') {
    const { data, error } = await supabase
      .from('content_locations')
      .select(`
        order_index,
        content:content_id (
          id, slug, title, description, featured_image, content_type, metadata
        )
      `)
      .eq('page_route', pageRoute)
      .eq('slot', slot)
      .eq('is_visible', true)
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data?.map(item => item.content) || [];
  },

  // 3. جلب المسارات والدروس
  async getModulesWithLessons() {
    const { data, error } = await supabase
      .from('modules')
      .select(`
        *,
        module_lessons (
          id, order_index, section_name,
          content:content_id (id, slug, title, description)
        )
      `)
      .eq('status', 'published')
      .order('order_index', { ascending: true })
      .order('order_index', { foreignTable: 'module_lessons', ascending: true });

    if (error) throw error;
    return data;
  },

  // 4. البحث النصي السريع (Full Text Search)
  async searchContent(queryText, language = 'ar') {
    const { data, error } = await supabase
      .from('content')
      .select('id, slug, title, description, featured_image, content_type')
      .eq('language', language)
      .eq('status', 'published')
      .textSearch('search_vector', queryText, { type: 'websearch', config: 'simple' });

    if (error) throw error;
    return data;
  }
};
```

---

## 3. سجل المكونات التفاعلية (`InteractiveRegistry.jsx`)

قاعدة البيانات لا تحتوي على أي كود تنفيذي JavaScript. تحتوي فقط على اسم المكون والـ Props المطلوبة:

```javascript
// src/components/interactive/InteractiveRegistry.jsx
import React, { lazy, Suspense } from 'react';

// التحميل الكسول (Lazy Loading) للمكونات الثقيلة لضمان أداء وسرعة فائقة
const ColdWaterTimer = lazy(() => import('./ColdWaterTimer'));
const ThoughtRecordWizard = lazy(() => import('./ThoughtRecordWizard'));
const DefusionCardCreator = lazy(() => import('./DefusionCardCreator'));
const BreathingCircle = lazy(() => import('./BreathingCircle'));
const ScalingSlider = lazy(() => import('./ScalingSlider'));

export const INTERACTIVE_COMPONENTS = {
  'tipp-cold-water-timer': ColdWaterTimer,
  'thought-record-wizard': ThoughtRecordWizard,
  'defusion-card-creator': DefusionCardCreator,
  'breathing-circle': BreathingCircle,
  'scaling-slider': ScalingSlider
};

export function RenderInteractiveComponent({ componentKey, props, metadata }) {
  const Component = INTERACTIVE_COMPONENTS[componentKey];

  if (!Component) {
    console.warn(`Interactive component "${componentKey}" is not registered.`);
    return null;
  }

  return (
    <div className="my-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
      {metadata?.title && (
        <h4 className="text-lg font-semibold mb-3 text-neutral-800 dark:text-neutral-100">
          {metadata.title}
        </h4>
      )}
      <Suspense fallback={<div className="p-4 text-center text-sm text-neutral-400">جاري تحميل التمرين...</div>}>
        <Component {...(props || {})} />
      </Suspense>
    </div>
  );
}
```

---

## 4. محرك عزل التنسيقات (`Scoped CSS Isolation`)

يتم حقن الـ CSS المخصص الموجود في قاعدة البيانات داخل وسم `<style>` محصور فقط بنطاق بطاقة المحتوى:

```javascript
export function applyScopedCss(css, containerClass) {
  if (!css) return '';
  // استبدال المحددات العامة لتكون محصورة بـ containerClass
  return css.replace(/(^|})\s*([^{]+)/g, (match, prefix, selector) => {
    const trimmed = selector.trim();
    if (!trimmed || trimmed.startsWith('@')) return match;
    return `${prefix} .${containerClass} ${trimmed}`;
  });
}
```
