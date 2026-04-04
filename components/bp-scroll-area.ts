import { define, attr, html } from "./bp-core";

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
 *   ScrollBar:            "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
 *   ScrollBar thumb:      "relative flex-1 rounded-full bg-border"
 */

class BpScrollArea extends HTMLElement {
  connectedCallback() {
    const height = attr(this, "height", "auto");
    const body = html(this);

    // shadcn ScrollArea.Root: "relative"
    const rootClass = "relative";

    // shadcn ScrollArea.Viewport: "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1"
    const viewportClass = "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1";

    // shadcn ScrollBar (vertical): "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent"
    const scrollbarClass = "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent";

    // shadcn ScrollBar thumb: "relative flex-1 rounded-full bg-border"
    const thumbClass = "relative flex-1 rounded-full bg-border";

    this.innerHTML = `
      <div data-slot="scroll-area" class="${rootClass}" style="height:${height};overflow:hidden">
        <div data-slot="scroll-area-viewport" class="${viewportClass}" style="overflow:auto;height:100%" tabindex="0">
          ${body}
        </div>
        <div data-slot="scroll-area-scrollbar" data-orientation="vertical" class="${scrollbarClass}" style="position:absolute;right:0;top:0;bottom:0">
          <div data-slot="scroll-area-thumb" class="${thumbClass}"></div>
        </div>
      </div>`;
  }
}

define("bp-scroll-area", BpScrollArea);
