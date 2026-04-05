/**
 * Blueprint Web Components — Core utilities
 */

export function define(tag: string, ctor: CustomElementConstructor) {
  if (!customElements.get(tag)) {
    /* Guard: prevent double-rendering when a parent wrapper moves
       children via DocumentFragment (disconnect → reconnect cycle). */
    const orig = (ctor.prototype as any).connectedCallback;
    if (orig) {
      (ctor.prototype as any).connectedCallback = function (this: any) {
        if (this.__bp) return;
        this.__bp = true;
        orig.call(this);
      };
    }
    customElements.define(tag, ctor);
  }
}

export function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function attr(el: Element, name: string, fallback = ""): string {
  return el.getAttribute(name) ?? fallback;
}

/** Read attribute with HTML escaping */
export function safeAttr(el: Element, name: string, fallback = ""): string {
  return esc(el.getAttribute(name) ?? fallback);
}

export function boolAttr(el: Element, name: string): boolean {
  const v = el.getAttribute(name);
  return v !== null && v !== "false";
}

export function html(el: HTMLElement): string {
  return el.innerHTML;
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}
