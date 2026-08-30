// src/components/cms/ScopedCss.jsx
import React, { useId, useMemo } from 'react';
import { processScopedCss } from '@/utils/scopedCss';

/**
 * ScopedCss Wrapper Component
 * Encapsulates child elements with sanitized, strictly-scoped custom CSS
 */
export default function ScopedCss({ css, children, className = '', as = 'div' }) {
  const reactId = useId();
  const cleanId = useMemo(() => reactId.replace(/[^a-zA-Z0-9_-]/g, ''), [reactId]);

  const { scopedCss, scopeClass } = useMemo(() => {
    if (!css || typeof css !== 'string' || !css.trim()) {
      return { scopedCss: '', scopeClass: '' };
    }
    return processScopedCss(css, cleanId);
  }, [css, cleanId]);

  const Component = as;

  return (
    <Component className={`${scopeClass} ${className}`.trim()}>
      {scopedCss && (
        <style
          data-cms-scoped="true"
          data-scope-id={cleanId}
          dangerouslySetInnerHTML={{ __html: scopedCss }}
        />
      )}
      {children}
    </Component>
  );
}
