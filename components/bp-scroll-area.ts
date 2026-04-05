import { define, attr } from "./bp-core";

/**
 * bp-scroll-area — shadcn scroll-area as a web component.
 *
 * Usage:
 *   <bp-scroll-area height="300px">
 *     Long content here...
 *   </bp-scroll-area>
 *
 * Tailwind classes copied from .shadcn/ui/scroll-area.tsx:
 *   ScrollArea root:      "relative"
 *   ScrollArea viewport:  "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
 *   ScrollBar:            "flex touch-none p-px transition-colors select-none" + orientation-specific classes
 *   ScrollBar thumb:      "relative flex-1 rounded-full bg-border"
 */

class BpScrollArea extends HTMLElement {
  connectedCallback() {
    const height = attr(this, "height", "auto");

    // Capture children into fragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // Apply data-slot and classes directly on the custom element (shadcn ScrollArea root)
    this.setAttribute("data-slot", "scroll-area");
    this.classList.add("relative");
    this.style.display = "block";
    this.style.height = height;
    this.style.overflow = "hidden";

    // shadcn ScrollArea.Viewport
    const viewportClass = "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1";

    // shadcn ScrollBar (vertical): border-t-transparent and border-l-transparent use inline style to avoid base.css override
    const scrollbarClass = "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l";

    // shadcn ScrollBar thumb
    const thumbClass = "relative flex-1 rounded-full bg-border";

    this.innerHTML = `
      <div data-slot="scroll-area-viewport" class="${viewportClass}" style="overflow:auto;height:100%" tabindex="0"></div>
      <div data-slot="scroll-area-scrollbar" data-orientation="vertical" class="${scrollbarClass}" style="position:absolute;right:0;top:0;bottom:0;border-color:transparent">
        <div data-slot="scroll-area-thumb" class="${thumbClass}"></div>
      </div>`;

    this.querySelector('[data-slot="scroll-area-viewport"]')!.appendChild(fragment);
  }
}

define("bp-scroll-area", BpScrollArea);
