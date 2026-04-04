import { define, attr, html, cn } from "./bp-core";

const sideStyles: Record<string, string> = {
  bottom: "inset-x-0 bottom-0 mt-24 max-h-[80vh]",
  top: "inset-x-0 top-0 mb-24 max-h-[80vh]",
  left: "inset-y-0 left-0 w-3/4 sm:max-w-sm",
  right: "inset-y-0 right-0 w-3/4 sm:max-w-sm",
};

class BpDrawer extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "bottom");
    const body = html(this);

    const isVertical = side === "bottom" || side === "top";

    const handleHtml =
      side === "bottom"
        ? `<div class="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted"></div>`
        : "";

    const headerHtml =
      title || description
        ? `<div data-slot="drawer-header" class="${cn(
            "flex flex-col gap-1 p-4",
            isVertical && "text-center",
            "md:text-left"
          )}">
            ${title ? `<div data-slot="drawer-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="drawer-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="drawer-body" class="p-4">${body}</div>`
      : "";

    const footerSlot = attr(this, "footer");
    const footerHtml = footerSlot
      ? `<div data-slot="drawer-footer" class="mt-auto flex flex-col gap-2 p-4">${footerSlot}</div>`
      : "";

    this.innerHTML = `
      <div data-slot="drawer-content" class="${cn(
        "flex h-auto flex-col bg-transparent p-2 text-xs/relaxed text-popover-foreground before:absolute before:inset-2 before:-z-10 before:rounded-xl before:border before:border-border before:bg-popover",
        sideStyles[side] || sideStyles.bottom
      )}" style="position:relative;">
        ${handleHtml}
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
}

define("bp-drawer", BpDrawer);
