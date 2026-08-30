// src/components/interactive/InteractiveRegistry.jsx
/**
 * ============================================================================
 * INTERACTIVE COMPONENT REGISTRY (Secure React Component Whitelist)
 * ============================================================================
 * Maps database string keys to actual, vetted React interactive components.
 * 
 * SECURITY DIRECTIVE:
 * - NO arbitrary eval(), new Function(), or arbitrary dynamic code execution.
 * - Only components explicitly registered in INTERACTIVE_COMPONENTS can be rendered.
 * - Database stores only { "component": "thought-record-wizard", "props": {...} }
 */

import React, { Suspense, lazy } from 'react';

// Registered Whitelisted Components
import ThoughtRecordWizard from './ThoughtRecordWizard';
import ColdWaterTimer from './ColdWaterTimer';
import DefusionCardCreator from './DefusionCardCreator';
import BreathingCircle from './BreathingCircle';
import ScalingSlider from './ScalingSlider';
import DistortionQuiz from './DistortionQuiz';

export const INTERACTIVE_COMPONENTS = {
  'thought-record-wizard': ThoughtRecordWizard,
  'tipp-cold-water-timer': ColdWaterTimer,
  'defusion-card-creator': DefusionCardCreator,
  'breathing-circle': BreathingCircle,
  'scaling-slider': ScalingSlider,
  'distortion-quiz': DistortionQuiz,
};

/**
 * Render an interactive component by registered key
 */
export function RenderInteractiveComponent({ componentKey, props = {}, metadata = {} }) {
  if (!componentKey) return null;

  const Component = INTERACTIVE_COMPONENTS[componentKey];

  if (!Component) {
    console.warn(`[InteractiveRegistry] Security notice: Component "${componentKey}" is not in the approved whitelist.`);
    return (
      <div className="my-4 p-4 rounded-xl border border-amber-300 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 text-xs text-amber-800 dark:text-amber-300 text-right">
        عنصر تفاعلي قيد التجهيز: ({componentKey})
      </div>
    );
  }

  return (
    <div className="my-6">
      {metadata?.title && (
        <div className="mb-2 text-sm font-bold text-neutral-800 dark:text-neutral-200 text-right font-display">
          {metadata.title}
        </div>
      )}
      <Suspense fallback={<div className="p-6 text-center text-xs text-neutral-400">جاري تحميل الأداة التفاعلية...</div>}>
        <Component {...props} />
      </Suspense>
    </div>
  );
}

export default RenderInteractiveComponent;
