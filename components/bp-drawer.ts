import { define, attr, html, cn } from "./bp-core";

class BpDrawer extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "bottom");
    const body = html(this);

    const isVertical = side === "bottom" || side === "top";

    const handleHtml = side === "bottom"
      ? `<div class="mx-auto mt-2 h-1.5 w-[100px] shrink-0 rounded-full bg-muted"></div>`
      : "";

    const headerHtml =
      title || description
        ? `<div data-slot="drawer-header" class="${cn("flex flex-col gap-1 p-4", isVertical && "text-center")}">
            ${title ? `<div data-slot="drawer-title" class="text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="drawer-description" class="text-xs text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="drawer-body" class="p-4">${body}</div>`
      : "";

    const panelClasses = cn(
      "flex flex-col bg-popover text-xs text-popover-foreground rounded-t-xl border-t border-border",
      isVertical ? "w-full" : "w-64 h-full border-l border-border rounded-none"
    );

    const containerClasses = cn(
      "relative rounded-xl bg-muted/40 border border-dashed border-border overflow-hidden",
      isVertical ? "flex flex-col" : "flex"
    );

    const mainArea = `<div class="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground/50">페이지 영역</div>`;

    const panel = `<div data-slot="drawer-content" class="${panelClasses}">${handleHtml}${headerHtml}${contentHtml}</div>`;

    const layout = (side === "top" || side === "left")
      ? `${panel}${mainArea}`
      : `${mainArea}${panel}`;

    this.innerHTML = `
      <div class="${containerClasses}" style="${isVertical ? 'min-height:240px' : 'height:240px'}">
        <span class="absolute top-2 left-3 z-10 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Drawer (${side})</span>
        ${layout}
      </div>`;
  }
}

define("bp-drawer", BpDrawer);
