/**
 * Blueprint Web Components — Core utilities
 */

export function define(tag: string, ctor: CustomElementConstructor) {
  if (!customElements.get(tag)) {
    customElements.define(tag, ctor);
  }
}

export function attr(el: Element, name: string, fallback = ""): string {
  return el.getAttribute(name) ?? fallback;
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
