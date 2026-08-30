// src/components/content/TemplateRegistry.jsx
/**
 * ============================================================================
 * TEMPLATE REGISTRY (Content Type to View Mapping)
 * ============================================================================
 * Dispatches the appropriate layout template purely based on `content.content_type`.
 */

import React from 'react';
import ArticleTemplate from './templates/ArticleTemplate';
import ScientificPageTemplate from './templates/ScientificPageTemplate';
import LessonTemplate from './templates/LessonTemplate';
import ExerciseTemplate from './templates/ExerciseTemplate';
import MinimalTemplate from './templates/MinimalTemplate';
import ReferenceTemplate from './templates/ReferenceTemplate';
import DynamicPageTemplate from './templates/DynamicPageTemplate';

export const TEMPLATE_MAP = {
  article: ArticleTemplate,
  scientific_page: ScientificPageTemplate,
  lesson: LessonTemplate,
  exercise: ExerciseTemplate,
  about: MinimalTemplate,
  reference: ReferenceTemplate,
  dynamic_page: DynamicPageTemplate,
  insight: MinimalTemplate
};

export const templateRegistry = TEMPLATE_MAP;

/**
 * Helper to get the template component by content_type
 */
export function getTemplate(contentType) {
  return TEMPLATE_MAP[contentType] || ScientificPageTemplate;
}

/**
 * Universal component to render any CMS content item using its matching template
 */
export function RenderContentTemplate({ content, children }) {
  if (!content) return null;
  const TemplateComponent = getTemplate(content.content_type);
  return <TemplateComponent content={content}>{children}</TemplateComponent>;
}

export default RenderContentTemplate;
