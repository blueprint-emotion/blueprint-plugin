import { define, attr, html, cn } from "./bp-core";

class BpDialog extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const body = html(this);

    const headerHtml =
      title || description
        ? `<div data-slot="dialog-header" class="flex flex-col gap-1">
            ${title ? `<div data-slot="dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="dialog-description" class="text-xs/relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="dialog-body">${body}</div>`
      : "";

    const footerSlot = attr(this, "footer");
    const footerHtml = footerSlot
      ? `<div data-slot="dialog-footer" class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">${footerSlot}</div>`
      : "";

    this.innerHTML = `
      <div data-slot="dialog-content" class="${cn(
        "grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-xl bg-popover p-4 text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 sm:max-w-sm"
      )}">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
}

define("bp-dialog", BpDialog);
