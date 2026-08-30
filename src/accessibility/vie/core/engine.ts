import { parseRGB, getEffectiveBackground } from '../dom/compositor';
import { analyzeSemantics } from '../dom/semantics';
import { planCorrection, Decision } from './planner';
import { VIEDiagnostics } from '../diagnostics';
export class VIEEngine {
  private readQueue = new Set<HTMLElement>();
  private writeMap = new Map<HTMLElement, Decision>();
  private isProcessing = false;
  private observer: IntersectionObserver | null = null;
  private mutationObserver: MutationObserver | null = null;
  private correctedNodes = new WeakSet<HTMLElement>();
  start() {
    if (this.observer) return;
    this.observer = new IntersectionObserver((entries) => {
      for (const entry of entries) if (entry.isIntersecting) this.queueSubtree(entry.target as HTMLElement);
    }, { rootMargin: '300px' });
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldSchedule = false;
      for (const m of mutations) {
        if (m.type === 'childList') m.addedNodes.forEach(n => { if (n.nodeType === 1) this.observer?.observe(n as HTMLElement); });
        if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'style')) {
          if (m.target === document.documentElement) { this.resetAll(); shouldSchedule = true; }
        }
      }
      if (shouldSchedule) this.rescan();
    });
    document.querySelectorAll('main, section, article, div, p, span').forEach(el => this.observer?.observe(el));
    this.mutationObserver.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'data-theme'] });
    VIEDiagnostics.log('Started');
  }
  stop() {
    this.observer?.disconnect(); this.mutationObserver?.disconnect();
    this.observer = null; this.mutationObserver = null;
    this.resetAll(); VIEDiagnostics.log('Stopped');
  }
  private queueSubtree(root: HTMLElement) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement && node.nodeValue?.trim().length! > 0) this.readQueue.add(node.parentElement);
    }
    this.schedule();
  }
  private schedule() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    const requestIdle = window.requestIdleCallback || ((cb) => setTimeout(() => cb({ timeRemaining: () => 50 } as any), 1));
    requestIdle((deadline) => this.processReads(deadline));
  }
  private processReads(deadline: IdleDeadline) {
    const stylesCache = new WeakMap<HTMLElement, CSSStyleDeclaration>();
    for (const el of this.readQueue) {
      if (deadline.timeRemaining() < 5) break;
      this.readQueue.delete(el);
      const style = window.getComputedStyle(el);
      const semantics = analyzeSemantics(el, style);
      if (!semantics.safe) { this.revert(el); continue; }
      const fg = parseRGB(style.color);
      const { bg, isComplex } = getEffectiveBackground(el, stylesCache);
      this.writeMap.set(el, planCorrection(fg, bg, isComplex, semantics));
    }
    if (this.writeMap.size > 0) requestAnimationFrame(() => this.processWrites());
    else { this.isProcessing = false; if (this.readQueue.size > 0) this.schedule(); }
  }
  private processWrites() {
    for (const [el, decision] of this.writeMap.entries()) {
      if (decision.type === 'none') this.revert(el);
      else if (decision.type === 'color') {
        el.style.setProperty('--vie-adjusted-fg', decision.colorStr);
        el.classList.add('vie-corrected-fg'); el.classList.remove('vie-scrim-text');
        this.correctedNodes.add(el); VIEDiagnostics.record(el, decision);
      } else if (decision.type === 'scrim') {
        el.classList.add('vie-scrim-text'); el.classList.remove('vie-corrected-fg');
        el.style.removeProperty('--vie-adjusted-fg');
        this.correctedNodes.add(el); VIEDiagnostics.record(el, decision);
      }
    }
    this.writeMap.clear(); this.isProcessing = false;
    if (this.readQueue.size > 0) this.schedule();
  }
  private revert(el: HTMLElement) {
    if (this.correctedNodes.has(el)) {
      el.classList.remove('vie-corrected-fg', 'vie-scrim-text'); el.style.removeProperty('--vie-adjusted-fg');
      this.correctedNodes.delete(el);
    }
  }
  private resetAll() {
    document.querySelectorAll('.vie-corrected-fg, .vie-scrim-text').forEach(el => this.revert(el as HTMLElement));
    this.readQueue.clear(); this.writeMap.clear();
  }
  private rescan() { document.querySelectorAll('main, section, article, div').forEach(el => this.queueSubtree(el as HTMLElement)); }
}
