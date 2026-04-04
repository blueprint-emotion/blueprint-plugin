import { define, attr, boolAttr, cn, html } from "./bp-core";

/**
 * bp-accordion — shadcn accordion as web components.
 *
 * Usage:
 *   <bp-accordion>
 *     <bp-accordion-item title="Section 1" open>Content here</bp-accordion-item>
 *     <bp-accordion-item title="Section 2">More content</bp-accordion-item>
 *   </bp-accordion>
 *
 * Tailwind classes copied from .shadcn/ui/accordion.tsx
 */

/* ── Accordion (root) ── */

class BpAccordion extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    // AccordionPrimitive.Root: "flex w-full flex-col overflow-hidden rounded-md border"
    this.innerHTML = `<div data-slot="accordion" class="flex w-full flex-col overflow-hidden rounded-md border">${body}</div>`;
  }
}

define("bp-accordion", BpAccordion);

/* ── AccordionItem ── */

class BpAccordionItem extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const open = boolAttr(this, "open");
    const body = html(this);

    // AccordionItem: "not-last:border-b data-open:bg-muted/50"
    const itemClass = cn(
      "not-last:border-b",
      open && "bg-muted/50"
    );

    // AccordionTrigger header wrapper: "flex"
    // AccordionTrigger: "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-2 text-left text-xs/relaxed font-medium transition-all outline-none hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground"
    const triggerClass = "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-2 text-left text-xs/relaxed font-medium transition-all outline-none hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground";

    // Chevron icons: collapsed = ChevronDown visible, expanded = ChevronUp visible
    // ChevronDownIcon: "pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
    // ChevronUpIcon: "pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
    const chevronDown = `<svg data-slot="accordion-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none shrink-0 ${open ? "hidden" : ""}"><path d="m6 9 6 6 6-6"/></svg>`;
    const chevronUp = `<svg data-slot="accordion-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none shrink-0 ${open ? "" : "hidden"}"><path d="m18 15-6-6-6 6"/></svg>`;

    // AccordionContent panel: "overflow-hidden px-2 text-xs/relaxed data-open:animate-accordion-down data-closed:animate-accordion-up"
    const panelClass = "overflow-hidden px-2 text-xs/relaxed";

    // AccordionContent inner div: "h-(--accordion-panel-height) pt-0 pb-4 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4"
    const innerClass = "pt-0 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";

    const id = `bp-acc-${Math.random().toString(36).slice(2, 8)}`;

    this.innerHTML = `
      <div data-slot="accordion-item" class="${itemClass}">
        <div class="flex">
          <button
            data-slot="accordion-trigger"
            class="${triggerClass}"
            aria-expanded="${open}"
            aria-controls="${id}"
            onclick="this.closest('bp-accordion-item').toggle()"
          >
            <span>${title}</span>
            ${chevronDown}
            ${chevronUp}
          </button>
        </div>
        <div id="${id}" data-slot="accordion-content" class="${panelClass}" style="${open ? "" : "display:none"}">
          <div class="${innerClass}">${body}</div>
        </div>
      </div>`;
  }

  toggle() {
    const trigger = this.querySelector("[data-slot='accordion-trigger']") as HTMLElement;
    const content = this.querySelector("[data-slot='accordion-content']") as HTMLElement;
    if (!trigger || !content) return;

    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    content.style.display = expanded ? "none" : "";

    // Toggle bg-muted/50 on item wrapper
    const item = this.querySelector("[data-slot='accordion-item']") as HTMLElement;
    if (item) {
      item.classList.toggle("bg-muted/50", !expanded);
    }

    // Toggle chevron visibility
    const svgs = trigger.querySelectorAll("svg");
    if (svgs.length === 2) {
      svgs[0].classList.toggle("hidden", !expanded); // chevron-down
      svgs[1].classList.toggle("hidden", expanded);  // chevron-up
    }
  }
}

define("bp-accordion-item", BpAccordionItem);
