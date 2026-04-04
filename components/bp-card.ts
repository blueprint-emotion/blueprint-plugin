import { define, attr, html } from "./bp-core";

class BpCard extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const footer = attr(this, "footer");
    const body = html(this);

    const headerHtml = (title || description) ? `
      <div data-slot="card-header" class="grid auto-rows-min items-start gap-1 px-4">
        ${title ? `<div data-slot="card-title" class="text-sm font-medium">${title}</div>` : ""}
        ${description ? `<div data-slot="card-description" class="text-xs text-muted-foreground">${description}</div>` : ""}
      </div>` : "";

    const contentHtml = body ? `<div data-slot="card-content" class="px-4">${body}</div>` : "";

    const footerHtml = footer ? `
      <div data-slot="card-footer" class="flex items-center px-4">${footer}</div>` : "";

    this.innerHTML = `
      <div data-slot="card" class="flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs text-card-foreground ring-1 ring-foreground/10">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
}

define("bp-card", BpCard);
