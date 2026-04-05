import { define, attr, cn } from "./bp-core";

class BpSheet extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "right");
    const trigger = attr(this, "trigger");

    // Capture children as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    const isHorizontal = side === "left" || side === "right";

    // SheetHeader: "flex flex-col gap-1.5 p-6"
    // SheetTitle: "font-heading text-sm font-medium text-foreground"
    // SheetDescription: "text-xs/relaxed text-muted-foreground"
    const headerHtml =
      title || description
        ? `<div data-slot="sheet-header" class="flex flex-col gap-1.5 p-6">
            ${title ? `<div data-slot="sheet-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="sheet-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const closeBtnHtml = `<button data-slot="sheet-close" class="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:text-foreground z-10">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`;

    const panelPositionClasses: Record<string, string> = {
      right: "right-0 top-0 h-full w-3/4 sm:max-w-sm border-l",
      left: "left-0 top-0 h-full w-3/4 sm:max-w-sm border-r",
      top: "top-0 left-0 w-full border-b",
      bottom: "bottom-0 left-0 w-full border-t",
    };

    // SheetOverlay: "fixed inset-0 z-50 bg-black/80 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 supports-backdrop-filter:backdrop-blur-xs"
    // SheetContent: "fixed z-50 flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg transition duration-200 ease-in-out ..."
    if (trigger) {
      this.innerHTML = `
        <button data-slot="sheet-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 dark:bg-input/30">${trigger}</button>
        <div data-slot="sheet-overlay" class="fixed inset-0 z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
          <div data-slot="sheet-content" data-side="${side}" class="fixed ${panelPositionClasses[side] || panelPositionClasses.right} flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg">
            ${closeBtnHtml}
            ${headerHtml}
            <div data-slot="sheet-body" class="flex-1 p-6 overflow-y-auto"></div>
          </div>
        </div>`;

      this.querySelector('[data-slot="sheet-body"]')!.appendChild(fragment);

      const triggerBtn = this.querySelector("[data-slot=sheet-trigger]")!;
      const overlay = this.querySelector("[data-slot=sheet-overlay]")!;
      const closeBtn = this.querySelector("[data-slot=sheet-close]")!;

      triggerBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "");
      closeBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "none");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) (overlay as HTMLElement).style.display = "none";
      });
    } else {
      // Inline preview
      const panelClasses = cn(
        "flex flex-col bg-popover text-xs/relaxed text-popover-foreground shadow-lg",
        isHorizontal ? "w-64 h-full border-l border-border" : "w-full border-t border-border"
      );
      const containerClasses = cn(
        "relative rounded-xl bg-muted/40 border border-dashed border-border overflow-hidden",
        isHorizontal ? "flex" : "flex flex-col"
      );
      const mainArea = `<div class="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground/50">페이지 영역</div>`;
      const panel = `<div data-slot="sheet-content" data-side="${side}" class="${panelClasses}">${headerHtml}<div data-slot="sheet-body" class="flex-1 p-6 overflow-y-auto"></div></div>`;
      const layout = (side === "left" || side === "top") ? `${panel}${mainArea}` : `${mainArea}${panel}`;

      this.innerHTML = `
        <div class="${containerClasses}" style="${isHorizontal ? 'height:240px' : 'min-height:200px'}">
          <span class="absolute top-2 left-3 z-10 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Sheet (${side})</span>
          ${layout}
        </div>`;

      this.querySelector('[data-slot="sheet-body"]')!.appendChild(fragment);
    }
  }
}

define("bp-sheet", BpSheet);
