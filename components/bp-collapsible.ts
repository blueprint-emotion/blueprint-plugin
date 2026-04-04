import { define, attr, boolAttr, html } from "./bp-core";

/**
 * bp-collapsible — shadcn collapsible as a web component.
 *
 * Usage:
 *   <bp-collapsible title="Click to expand" open>
 *     Hidden content here
 *   </bp-collapsible>
 *
 * Tailwind classes copied from .shadcn/ui/collapsible.tsx
 * Note: shadcn collapsible has no styling classes — it is unstyled by design.
 * We add minimal trigger styling for usability while keeping the same data-slot structure.
 */

class BpCollapsible extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title", "Toggle");
    const open = boolAttr(this, "open");
    const body = html(this);

    const id = `bp-coll-${Math.random().toString(36).slice(2, 8)}`;

    // shadcn Collapsible.Root: data-slot="collapsible" (no classes)
    // shadcn CollapsibleTrigger: data-slot="collapsible-trigger" (no classes)
    // shadcn CollapsibleContent: data-slot="collapsible-content" (no classes)
    this.innerHTML = `
      <div data-slot="collapsible">
        <button
          data-slot="collapsible-trigger"
          aria-expanded="${open}"
          aria-controls="${id}"
          onclick="this.closest('bp-collapsible').toggle()"
        >${title}</button>
        <div id="${id}" data-slot="collapsible-content" style="${open ? "" : "display:none"}">
          ${body}
        </div>
      </div>`;
  }

  toggle() {
    const trigger = this.querySelector("[data-slot='collapsible-trigger']") as HTMLElement;
    const content = this.querySelector("[data-slot='collapsible-content']") as HTMLElement;
    if (!trigger || !content) return;

    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    content.style.display = expanded ? "none" : "";
  }
}

define("bp-collapsible", BpCollapsible);
