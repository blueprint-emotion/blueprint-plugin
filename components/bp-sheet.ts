import { define, attr, html, cn } from "./bp-core";

class BpSheet extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "right");
    const body = html(this);

    const isHorizontal = side === "left" || side === "right";

    const headerHtml =
      title || description
        ? `<div data-slot="sheet-header" class="flex flex-col gap-1.5 p-4">
            ${title ? `<div data-slot="sheet-title" class="text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="sheet-description" class="text-xs text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="sheet-body" class="flex-1 p-4">${body}</div>`
      : "";

    // Wireframe representation: show a container with the panel on the correct side
    const panelClasses = cn(
      "flex flex-col bg-popover text-xs text-popover-foreground shadow-lg",
      isHorizontal ? "w-64 h-full border-l border-border" : "w-full border-t border-border"
    );

    const containerClasses = cn(
      "relative rounded-xl bg-muted/40 border border-dashed border-border overflow-hidden",
      isHorizontal ? "flex" : "flex flex-col"
    );

    const mainArea = `<div class="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground/50">페이지 영역</div>`;

    const panel = `<div data-slot="sheet-content" data-side="${side}" class="${panelClasses}">${headerHtml}${contentHtml}</div>`;

    const layout = (side === "left" || side === "top")
      ? `${panel}${mainArea}`
      : `${mainArea}${panel}`;

    this.innerHTML = `
      <div class="${containerClasses}" style="${isHorizontal ? 'height:240px' : 'min-height:200px'}">
        <span class="absolute top-2 left-3 z-10 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Sheet (${side})</span>
        ${layout}
      </div>`;
  }
}

define("bp-sheet", BpSheet);
