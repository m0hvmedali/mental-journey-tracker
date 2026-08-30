export class VIEDiagnostics {
  private static isEnabled = false;
  static enable() { this.isEnabled = true; }
  static disable() { this.isEnabled = false; }
  static log(message: string) { if (this.isEnabled) console.log(`[VIE] ${message}`); }
  static record(el: HTMLElement, decision: any) {
    if (!this.isEnabled) return;
    el.setAttribute('data-vie-debug', JSON.stringify(decision));
    console.log('[VIE] Corrected:', { el, decision });
  }
}
