export interface ElementSemantics {
  safe: boolean; isLarge: boolean; requiredContrast: number; hierarchyWeight: number; reason?: string;
}
export function analyzeSemantics(el: HTMLElement, style: CSSStyleDeclaration): ElementSemantics {
  const tag = el.tagName.toLowerCase();
  if (['script', 'style', 'svg', 'canvas', 'video', 'img', 'code'].includes(tag) || el.closest('[data-vie-ignore]') || el.closest('.vie-ignore')) {
    return { safe: false, isLarge: false, requiredContrast: 0, hierarchyWeight: 0, reason: 'ignored' };
  }
  if (el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true' || el.classList.contains('disabled') || style.cursor === 'not-allowed') {
    return { safe: false, isLarge: false, requiredContrast: 0, hierarchyWeight: 0, reason: 'disabled' };
  }
  const isRTL = el.dir === 'rtl' || el.closest('[dir="rtl"]') !== null || el.closest('[lang="ar"]') !== null;
  const sizePx = parseFloat(style.fontSize);
  const weight = parseInt(style.fontWeight) || 400;
  const isLarge = isRTL ? (sizePx >= 32 || (sizePx >= 24 && weight >= 700)) : (sizePx >= 24 || (sizePx >= 18.66 && weight >= 700));
  let hierarchyWeight = 5;
  if (['h1', 'h2'].includes(tag)) hierarchyWeight = 10;
  else if (tag === 'h3') hierarchyWeight = 8;
  else if (tag === 'button' || el.getAttribute('role') === 'button') hierarchyWeight = 7;
  else if (['small', 'figcaption', 'cite'].includes(tag)) hierarchyWeight = 3;
  if (parseFloat(style.opacity) < 0.8) hierarchyWeight -= 2;
  return { safe: true, isLarge, requiredContrast: isLarge ? 3.0 : 4.5, hierarchyWeight: Math.max(1, Math.min(10, hierarchyWeight)) };
}
