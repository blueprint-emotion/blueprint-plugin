import { define, attr } from "./bp-core";

class BpTooltip extends HTMLElement {
  connectedCallback() {
    const content = attr(this, "content");

    // Capture children (trigger content) as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // TooltipContent: "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background ..."
    // TooltipArrow: "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground ..."
    this.setAttribute("data-slot", "tooltip");
    this.classList.add(..."relative inline-flex".split(" "));
    this.style.display = "inline-flex";

    this.innerHTML = `
        <span data-slot="tooltip-trigger"></span>
        <div data-slot="tooltip-content" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 inline-flex w-fit max-w-xs items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background whitespace-nowrap" style="display:none">
          ${content}
          <div class="absolute -bottom-[5px] left-1/2 -translate-x-1/2 size-2.5 rotate-45 rounded-[2px] bg-foreground"></div>
        </div>`;

    this.querySelector('[data-slot="tooltip-trigger"]')!.appendChild(fragment);

    const triggerEl = this.querySelector("[data-slot=tooltip-trigger]")!;
    const tooltipEl = this.querySelector("[data-slot=tooltip-content]") as HTMLElement;

    triggerEl.addEventListener("mouseenter", () => { tooltipEl.style.display = ""; });
    triggerEl.addEventListener("mouseleave", () => { tooltipEl.style.display = "none"; });
  }
}

define("bp-tooltip", BpTooltip);
