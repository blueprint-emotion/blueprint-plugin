import { define, attr, cn } from "./bp-core";

/**
 * bp-separator — shadcn separator as a web component.
 *
 * Usage:
 *   <bp-separator></bp-separator>
 *   <bp-separator orientation="vertical"></bp-separator>
 *   <bp-separator label="OR"></bp-separator>
 *
 * Tailwind classes copied from .shadcn/ui/separator.tsx:
 *   Separator: "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"
 */

class BpSeparator extends HTMLElement {
  connectedCallback() {
    const orientation = attr(this, "orientation", "horizontal") as "horizontal" | "vertical";
    const label = attr(this, "label");

    // shadcn: "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch"
    const base = "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch";

    if (label) {
      // Labeled separator: wrap with flex container and text
      const flexDir = orientation === "vertical" ? "flex-col" : "";
      this.innerHTML = `
        <div class="flex items-center gap-2 ${flexDir}" role="none">
          <div data-slot="separator" data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${cn(base, "flex-1")}"></div>
          <span class="text-xs text-muted-foreground">${label}</span>
          <div data-slot="separator" data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${cn(base, "flex-1")}"></div>
        </div>`;
    } else {
      this.innerHTML = `<div data-slot="separator" data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${base}"></div>`;
    }
  }
}

define("bp-separator", BpSeparator);
