import { define, attr, cn } from "./bp-core";

class BpDrawer extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "bottom");
    const trigger = attr(this, "trigger");

    // Capture children as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    const isVertical = side === "bottom" || side === "top";

    // DrawerContent handle: "mx-auto mt-4 hidden h-1.5 w-[100px] shrink-0 rounded-full bg-muted group-data-[vaul-drawer-direction=bottom]/drawer-content:block"
    const handleHtml = side === "bottom"
      ? `<div class="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted"></div>`
      : "";

    // DrawerHeader: "flex flex-col gap-1 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:text-left"
    // DrawerTitle: "font-heading text-sm font-medium text-foreground"
    // DrawerDescription: "text-xs/relaxed text-muted-foreground"
    const headerHtml =
      title || description
        ? `<div data-slot="drawer-header" class="${cn("flex flex-col gap-1 p-4", isVertical && "text-center", "md:text-left")}">
            ${title ? `<div data-slot="drawer-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="drawer-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const panelPositionClasses: Record<string, string> = {
      bottom: "bottom-0 left-0 w-full rounded-t-xl border-t max-h-[80vh]",
      top: "top-0 left-0 w-full rounded-b-xl border-b max-h-[80vh]",
      left: "left-0 top-0 h-full w-80 max-w-[80vw] border-r",
      right: "right-0 top-0 h-full w-80 max-w-[80vw] border-l",
    };

    // DrawerOverlay: "fixed inset-0 z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs ..."
    // DrawerContent: "group/drawer-content fixed z-50 flex h-auto flex-col bg-transparent p-2 text-xs/relaxed text-popover-foreground ..."
    if (trigger) {
      this.innerHTML = `
        <button data-slot="drawer-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 dark:bg-input/30">${trigger}</button>
        <div data-slot="drawer-overlay" class="fixed inset-0 z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
          <div data-slot="drawer-content" class="group/drawer-content fixed ${panelPositionClasses[side] || panelPositionClasses.bottom} flex flex-col bg-popover text-xs/relaxed text-popover-foreground shadow-lg">
            ${handleHtml}
            ${headerHtml}
            <div data-slot="drawer-body" class="p-4 overflow-y-auto"></div>
          </div>
        </div>`;

      this.querySelector('[data-slot="drawer-body"]')!.appendChild(fragment);

      const triggerBtn = this.querySelector("[data-slot=drawer-trigger]")!;
      const overlay = this.querySelector("[data-slot=drawer-overlay]")!;

      triggerBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) (overlay as HTMLElement).style.display = "none";
      });
    } else {
      // Inline preview
      const panelClasses = cn(
        "flex flex-col bg-popover text-xs/relaxed text-popover-foreground rounded-t-xl border-t border-border",
        isVertical ? "w-full" : "w-64 h-full border-l border-border rounded-none"
      );
      const containerClasses = cn(
        "relative rounded-xl bg-muted/40 border border-dashed border-border overflow-hidden",
        isVertical ? "flex flex-col" : "flex"
      );
      const mainArea = `<div class="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground/50">페이지 영역</div>`;
      const panel = `<div data-slot="drawer-content" class="${panelClasses}">${handleHtml}${headerHtml}<div data-slot="drawer-body" class="p-4 overflow-y-auto"></div></div>`;
      const layout = (side === "top" || side === "left") ? `${panel}${mainArea}` : `${mainArea}${panel}`;

      this.innerHTML = `
        <div class="${containerClasses}" style="${isVertical ? 'min-height:240px' : 'height:240px'}">
          <span class="absolute top-2 left-3 z-10 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Drawer (${side})</span>
          ${layout}
        </div>`;

      this.querySelector('[data-slot="drawer-body"]')!.appendChild(fragment);
    }
  }
}

define("bp-drawer", BpDrawer);
