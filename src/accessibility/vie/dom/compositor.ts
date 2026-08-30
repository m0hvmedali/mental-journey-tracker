import { RGB } from '../color/oklab';
export function parseRGB(colorStr: string): RGB {
  if (colorStr === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!match) return { r: 0, g: 0, b: 0, a: 0 };
  return { r: +match[1], g: +match[2], b: +match[3], a: match[4] ? +match[4] : 1 };
}
function blend(top: RGB, bottom: RGB): RGB {
  if (top.a === 1) return top;
  if (top.a === 0) return bottom;
  const alpha = top.a;
  return {
    r: Math.round(top.r * alpha + bottom.r * (1 - alpha)),
    g: Math.round(top.g * alpha + bottom.g * (1 - alpha)),
    b: Math.round(top.b * alpha + bottom.b * (1 - alpha)),
    a: Math.min(1, top.a + bottom.a * (1 - top.a))
  };
}
export function getEffectiveBackground(el: HTMLElement, stylesCache: WeakMap<HTMLElement, CSSStyleDeclaration>): { bg: RGB, isComplex: boolean } {
  if (el.closest('[data-vie-bg="media"]')) return { bg: { r: 0, g: 0, b: 0, a: 1 }, isComplex: true };
  let current: HTMLElement | null = el;
  let layers: RGB[] = [];
  let isComplex = false;
  let cumulativeOpacity = 1;
  while (current && current !== document.documentElement) {
    const style = stylesCache.get(current) || window.getComputedStyle(current);
    stylesCache.set(current, style);
    if ((style.backgroundImage !== 'none' && !style.backgroundImage.startsWith('linear-gradient')) || style.backdropFilter !== 'none') {
      isComplex = true; break;
    }
    const nodeOpacity = parseFloat(style.opacity || '1');
    cumulativeOpacity *= nodeOpacity;
    const bg = parseRGB(style.backgroundColor);
    if (bg.a > 0) {
      layers.push({ ...bg, a: bg.a * cumulativeOpacity });
      if (bg.a * cumulativeOpacity >= 0.98) break; 
    }
    current = current.parentElement;
  }
  let effectiveBg: RGB = document.documentElement.classList.contains('dark') ? { r: 15, g: 15, b: 15, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };
  for (let i = layers.length - 1; i >= 0; i--) effectiveBg = blend(layers[i], effectiveBg);
  return { bg: effectiveBg, isComplex };
}
