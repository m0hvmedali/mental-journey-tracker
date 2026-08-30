import { RGB, adjustLightness } from '../color/oklab';
import { getContrast, getLuminance } from '../color/contrast';
import { ElementSemantics } from '../dom/semantics';
export type Decision = { type: 'none'; reason: string } | { type: 'scrim'; reason: string } | { type: 'color'; colorStr: string; reason: string; delta: number };
export function planCorrection(fg: RGB, bg: RGB, isComplexBg: boolean, semantics: ElementSemantics): Decision {
  if (isComplexBg) {
    if (getContrast(fg, bg) > semantics.requiredContrast + 1) return { type: 'none', reason: 'high_contrast_media' };
    return { type: 'scrim', reason: 'complex_surface' };
  }
  if (getContrast(fg, bg) >= semantics.requiredContrast) return { type: 'none', reason: 'passes' };
  const candidates: { rgb: RGB, contrast: number, lDelta: number }[] = [];
  for (let step = 0.05; step <= 0.8; step += 0.05) {
    const light = adjustLightness(fg, step);
    if (getContrast(light, bg) >= semantics.requiredContrast) candidates.push({ rgb: light, contrast: getContrast(light, bg), lDelta: step });
    const dark = adjustLightness(fg, -step);
    if (getContrast(dark, bg) >= semantics.requiredContrast) candidates.push({ rgb: dark, contrast: getContrast(dark, bg), lDelta: step });
  }
  if (candidates.length === 0) return { type: 'color', colorStr: getLuminance(bg.r, bg.g, bg.b) > 0.5 ? 'rgb(0,0,0)' : 'rgb(255,255,255)', reason: 'fallback', delta: 1 };
  candidates.sort((a, b) => a.lDelta - b.lDelta);
  let best = candidates[0];
  if (getLuminance(bg.r, bg.g, bg.b) < 0.3 && semantics.hierarchyWeight <= 3) {
    if (getLuminance(best.rgb.r, best.rgb.g, best.rgb.b) > 0.6) {
      const softer = candidates.find(c => getLuminance(c.rgb.r, c.rgb.g, c.rgb.b) <= 0.6);
      if (softer) best = softer; else return { type: 'none', reason: 'hierarchy_preservation' };
    }
  }
  return { type: 'color', colorStr: `rgb(${best.rgb.r}, ${best.rgb.g}, ${best.rgb.b})`, reason: 'optimal', delta: best.lDelta };
}
