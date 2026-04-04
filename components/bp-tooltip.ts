import { define, attr, html, cn } from "./bp-core";

class BpTooltip extends HTMLElement {
  connectedCallback() {
    const content = attr(this, "content");
    const triggerHTML = html(this);

    // Positioner classes from shadcn TooltipContent
    const positionerClasses = "isolate z-50";

    // Popup classes from shadcn TooltipContent
    const popupClasses = "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background";

    // Arrow classes from shadcn TooltipContent
    const arrowClasses = "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground";

    this.innerHTML = `
      <span data-slot="tooltip" class="inline-flex">
        <span data-slot="tooltip-trigger">${triggerHTML}</span>
        <span class="${positionerClasses}">
          <span data-slot="tooltip-content" class="${popupClasses}">
            ${content}
            <span class="${arrowClasses}"></span>
          </span>
        </span>
      </span>`;
  }
}

define("bp-tooltip", BpTooltip);
