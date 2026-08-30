/**
 * Contrast Guardian - SmartReadingEngine
 * JS-assisted WCAG AA contrast verification & minimal correction layer.
 * 
 * Strict safety rules:
 * - Default mode: "safe"
 * - Does not touch logos, SVG, icons, images, syntax highlighting, or explicit exceptions.
 * - Respects forced-colors and prefers-reduced-motion.
 * - High-performance: IntersectionObserver + Batched MutationObserver + WeakCache.
 */

// Color Parsing and WCAG Math Helpers
function parseRgba(colorStr) {
  if (!colorStr || colorStr === 'transparent' || colorStr === 'inherit') {
    return { r: 0, g: 0, b: 0, a: 0 };
  }

  // Handle rgb / rgba
  const rgbaMatch = colorStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)/i);
  if (rgbaMatch) {
    return {
      r: Math.min(255, Math.max(0, parseFloat(rgbaMatch[1]))),
      g: Math.min(255, Math.max(0, parseFloat(rgbaMatch[2]))),
      b: Math.min(255, Math.max(0, parseFloat(rgbaMatch[3]))),
      a: rgbaMatch[4] !== undefined ? Math.min(1, Math.max(0, parseFloat(rgbaMatch[4]))) : 1
    };
  }

  // Handle Hex
  if (colorStr.startsWith('#')) {
    const hex = colorStr.slice(1);
    if (hex.length === 3) {
      return {
        r: parseInt(hex[0] + hex[0], 16),
        g: parseInt(hex[1] + hex[1], 16),
        b: parseInt(hex[2] + hex[2], 16),
        a: 1
      };
    }
    if (hex.length === 6) {
      return {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a: 1
      };
    }
  }

  return null;
}

// Convert sRGB channel to linear value
function channelToLinear(c) {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
}

// Calculate relative luminance per WCAG 2.1
function getLuminance({ r, g, b }) {
  const R = channelToLinear(r);
  const G = channelToLinear(g);
  const B = channelToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

// Calculate contrast ratio between two luminances
function getContrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// RGB to HSL conversion
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, l };
}

// HSL to RGB conversion
function hslToRgb(h, s, l) {
  h = (h % 360) / 360;
  if (s === 0) {
    const v = Math.round(l * 255);
    return { r: v, g: v, b: v, a: 1 };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  return {
    r: Math.round(hue2rgb(p, q, h + 1/3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1/3) * 255),
    a: 1
  };
}

// Alpha composite color over background
function compositeRgba(fg, bg) {
  const a = fg.a + bg.a * (1 - fg.a);
  if (a === 0) return { r: 255, g: 255, b: 255, a: 1 };
  return {
    r: Math.round((fg.r * fg.a + bg.r * bg.a * (1 - fg.a)) / a),
    g: Math.round((fg.g * fg.a + bg.g * bg.a * (1 - fg.a)) / a),
    b: Math.round((fg.b * fg.a + bg.b * bg.a * (1 - fg.a)) / a),
    a: 1
  };
}

export class ContrastGuardian {
  constructor(options = {}) {
    this.mode = options.mode || 'safe';
    this.processedElements = new WeakSet();
    this.modifiedElements = new Set();
    this.intersectionObserver = null;
    this.mutationObserver = null;
    this.pendingQueue = new Set();
    this.isScheduled = false;
    this.isReducedMotion = false;
    this.isForcedColors = false;

    this.checkMediaQueries();
    this.initObservers();
  }

  checkMediaQueries() {
    if (typeof window === 'undefined') return;
    this.isReducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches || false;
    this.isForcedColors = window.matchMedia?.('(forced-colors: active)')?.matches || false;
  }

  initObservers() {
    if (typeof window === 'undefined') return;

    // IntersectionObserver for elements entering viewport
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.target) {
          this.scheduleElement(entry.target);
          this.intersectionObserver.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '100px 0px',
      threshold: 0.05
    });

    // MutationObserver to observe DOM changes safely
    this.mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === 1) { // ELEMENT_NODE
              this.observeElement(node);
            }
          }
        }
      }
    });

    try {
      this.mutationObserver.observe(document.body, {
        childList: true,
        subtree: true
      });
    } catch {
      // Body not ready yet
    }
  }

  observeElement(el) {
    if (!el || typeof el.querySelectorAll !== 'function') return;
    if (this.shouldIgnoreElement(el)) return;

    if (this.intersectionObserver) {
      this.intersectionObserver.observe(el);
      const textNodes = el.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6, li, a, label, figcaption');
      const count = Math.min(textNodes.length, 30); // Cap per subtree to avoid overhead
      for (let i = 0; i < count; i++) {
        this.intersectionObserver.observe(textNodes[i]);
      }
    }
  }

  scheduleElement(el) {
    if (!el || this.processedElements.has(el)) return;
    this.pendingQueue.add(el);

    if (!this.isScheduled) {
      this.isScheduled = true;
      const scheduleCallback = typeof window.requestIdleCallback === 'function'
        ? window.requestIdleCallback
        : (cb) => setTimeout(cb, 16);

      scheduleCallback(() => {
        this.processQueue();
        this.isScheduled = false;
      });
    }
  }

  processQueue() {
    const elements = Array.from(this.pendingQueue);
    this.pendingQueue.clear();

    for (const el of elements) {
      this.evaluateElement(el);
    }
  }

  shouldIgnoreElement(el) {
    if (!el || el.nodeType !== 1) return true;
    if (this.isForcedColors) return true;

    // Check explicit exemptions
    if (el.closest('[data-no-readability]') || el.hasAttribute('data-no-readability')) {
      return true;
    }

    const tagName = el.tagName.toLowerCase();
    const ignoredTags = ['svg', 'path', 'img', 'video', 'canvas', 'audio', 'script', 'style', 'code', 'pre'];
    if (ignoredTags.includes(tagName)) return true;

    // Ignore icons, brand logos, code blocks
    if (
      el.classList?.contains('lucide') ||
      el.classList?.contains('icon') ||
      el.closest('pre') ||
      el.closest('code') ||
      el.getAttribute('role') === 'img'
    ) {
      return true;
    }

    return false;
  }

  resolveEffectiveBackground(el) {
    let current = el;
    let accumulatedBg = { r: 255, g: 255, b: 255, a: 0 };
    const isDarkMode = document.documentElement.classList.contains('dark') || document.body.classList.contains('dark');
    const defaultSolid = isDarkMode ? { r: 15, g: 23, b: 42, a: 1 } : { r: 255, g: 255, b: 255, a: 1 };

    while (current && current !== document.documentElement) {
      const style = window.getComputedStyle(current);
      const parsed = parseRgba(style.backgroundColor);
      if (parsed && parsed.a > 0) {
        accumulatedBg = compositeRgba(parsed, accumulatedBg);
        if (accumulatedBg.a >= 0.95) {
          return accumulatedBg;
        }
      }
      current = current.parentElement;
    }

    return compositeRgba(accumulatedBg, defaultSolid);
  }

  evaluateElement(el) {
    if (!el || !el.isConnected || this.shouldIgnoreElement(el)) return;
    this.processedElements.add(el);

    // Only inspect elements with direct or meaningful text content
    const text = el.textContent?.trim();
    if (!text || text.length === 0) return;

    // Avoid running on elements whose children contain text nodes
    if (el.childElementCount > 3 && el.tagName !== 'BUTTON' && el.tagName !== 'A') return;

    try {
      const style = window.getComputedStyle(el);
      const fgColor = parseRgba(style.color);
      if (!fgColor || fgColor.a < 0.1) return;

      const bgColor = this.resolveEffectiveBackground(el);
      const fgLuminance = getLuminance(fgColor);
      const bgLuminance = getLuminance(bgColor);
      const currentRatio = getContrastRatio(fgLuminance, bgLuminance);

      // Determine required threshold
      const fontSize = parseFloat(style.fontSize) || 16;
      const fontWeight = parseInt(style.fontWeight, 10) || 400;
      const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const requiredThreshold = isLargeText ? 3.0 : 4.5;

      // If contrast is satisfactory, do nothing!
      if (currentRatio >= requiredThreshold) {
        return;
      }

      // Minimal Non-destructive Correction:
      // Adjust Lightness in HSL towards readable threshold while preserving Hue & Saturation
      const bgIsDark = bgLuminance < 0.5;
      const { h, s, l } = rgbToHsl(fgColor.r, fgColor.g, fgColor.b);

      let adjustedL = l;
      let step = bgIsDark ? 0.05 : -0.05;
      let finalRgb = fgColor;

      for (let i = 0; i < 15; i++) {
        adjustedL = Math.min(0.98, Math.max(0.02, adjustedL + step));
        const candidate = hslToRgb(h, s, adjustedL);
        const candidateLum = getLuminance(candidate);
        const ratio = getContrastRatio(candidateLum, bgLuminance);
        finalRgb = candidate;
        if (ratio >= requiredThreshold) break;
      }

      // Apply minimal inline style with soft transition
      const correctedColor = `rgb(${finalRgb.r}, ${finalRgb.g}, ${finalRgb.b})`;
      el.style.setProperty('color', correctedColor, 'important');
      if (!this.isReducedMotion) {
        el.style.setProperty('transition', 'color 220ms ease');
      }
      el.setAttribute('data-contrast-corrected', 'true');
      this.modifiedElements.add(el);
    } catch {
      // Graceful fallback on compute style errors
    }
  }

  rescan() {
    this.checkMediaQueries();
    this.processedElements = new WeakSet();

    // Re-evaluate elements in visible viewport
    if (typeof document !== 'undefined' && document.body) {
      const candidates = document.querySelectorAll(
        'p, span, h1, h2, h3, h4, h5, h6, li, a, label, figcaption, button'
      );
      const limit = Math.min(candidates.length, 120);
      for (let i = 0; i < limit; i++) {
        this.observeElement(candidates[i]);
      }
    }
  }

  cleanup() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
    }
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
    }
    this.pendingQueue.clear();

    // Revert modified elements if needed
    for (const el of this.modifiedElements) {
      if (el && el.isConnected) {
        el.style.removeProperty('color');
        el.style.removeProperty('transition');
        el.removeAttribute('data-contrast-corrected');
      }
    }
    this.modifiedElements.clear();
  }
}

// Global Singleton Instance
let guardianInstance = null;

export function getContrastGuardian(options) {
  if (!guardianInstance) {
    guardianInstance = new ContrastGuardian(options);
  }
  return guardianInstance;
}
