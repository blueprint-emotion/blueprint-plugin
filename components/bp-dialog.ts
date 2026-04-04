import { define, attr, html } from "./bp-core";

class BpDialog extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const body = html(this);

    const headerHtml =
      title || description
        ? `<div data-slot="dialog-header" class="flex flex-col gap-1">
            ${title ? `<div data-slot="dialog-title" class="text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="dialog-description" class="text-xs text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="dialog-body">${body}</div>`
      : "";

    this.innerHTML = `
      <div class="relative rounded-xl bg-muted/40 border border-dashed border-border p-8" style="min-height:200px">
        <span class="absolute top-2 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Dialog</span>
        <div class="flex items-center justify-center h-full">
          <div data-slot="dialog-content" class="w-full max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-4 text-xs">
            ${headerHtml}
            ${contentHtml}
          </div>
        </div>
      </div>`;
  }
}

define("bp-dialog", BpDialog);
