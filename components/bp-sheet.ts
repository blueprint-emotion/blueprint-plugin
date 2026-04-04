import { define, attr, html, cn } from "./bp-core";

const sideStyles: Record<string, string> = {
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  top: "inset-x-0 top-0 h-auto border-b",
  bottom: "inset-x-0 bottom-0 h-auto border-t",
};

class BpSheet extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "right");
    const body = html(this);

    const headerHtml =
      title || description
        ? `<div data-slot="sheet-header" class="flex flex-col gap-1.5 p-6">
            ${title ? `<div data-slot="sheet-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="sheet-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="sheet-body" class="p-6">${body}</div>`
      : "";

    const footerSlot = attr(this, "footer");
    const footerHtml = footerSlot
      ? `<div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2 p-6">${footerSlot}</div>`
      : "";

    this.innerHTML = `
      <div data-slot="sheet-content" data-side="${side}" class="${cn(
        "flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg",
        sideStyles[side] || sideStyles.right
      )}">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
}

define("bp-sheet", BpSheet);
