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

    const dataDir = orientation === "vertical" ? "data-vertical" : "data-horizontal";

    if (label) {
      // Label variant needs a wrapper for the two separator lines + label text
      if (orientation === "vertical") {
        this.classList.add("flex");
        const hasHeight = Array.from(this.classList).some(c => c.startsWith("h-"));
        if (!hasHeight) this.classList.add("h-full");
      }

      const flexDir = orientation === "vertical" ? "flex-col" : "";
      this.innerHTML = `
        <div class="flex items-center gap-2 ${flexDir}" role="none">
          <div data-slot="separator" ${dataDir} data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${cn(base, "flex-1")}"></div>
          <span class="text-xs text-muted-foreground">${label}</span>
          <div data-slot="separator" ${dataDir} data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${cn(base, "flex-1")}"></div>
        </div>`;
    } else {
      // Simple separator — apply directly on the custom element
      this.setAttribute("data-slot", "separator");
      this.setAttribute("role", "separator");
      this.setAttribute("aria-orientation", orientation);
      if (orientation === "vertical") {
        this.setAttribute("data-vertical", "");
      } else {
        this.setAttribute("data-horizontal", "");
      }
      this.classList.add(...base.split(" "));
      this.style.display = "block";

      if (orientation === "vertical") {
        const hasHeight = Array.from(this.classList).some(c => c.startsWith("h-"));
        if (!hasHeight) this.classList.add("h-full");
      }
    }
  }
}

define("bp-separator", BpSeparator);
