import { define, attr, html } from "./bp-core";

class BpAlertDialog extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const confirmLabel = attr(this, "confirm-label", "확인");
    const cancelLabel = attr(this, "cancel-label", "취소");
    const body = html(this);

    const headerHtml =
      title || description
        ? `<div data-slot="alert-dialog-header" class="grid gap-1">
            ${title ? `<div data-slot="alert-dialog-title" class="text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="alert-dialog-description" class="text-xs text-muted-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="alert-dialog-body">${body}</div>`
      : "";

    this.innerHTML = `
      <div class="relative rounded-xl bg-muted/40 border border-dashed border-border p-8" style="min-height:180px">
        <span class="absolute top-2 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Alert Dialog</span>
        <div class="flex items-center justify-center h-full">
          <div data-slot="alert-dialog-content" class="w-full max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-3 text-xs">
            ${headerHtml}
            ${contentHtml}
            <div data-slot="alert-dialog-footer" class="flex justify-end gap-2">
              <button class="inline-flex items-center justify-center rounded-md border border-border h-7 px-2 text-xs font-medium hover:bg-input/50 dark:bg-input/30">${cancelLabel}</button>
              <button class="inline-flex items-center justify-center rounded-md border border-transparent h-7 px-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/80">${confirmLabel}</button>
            </div>
          </div>
        </div>
      </div>`;
  }
}

define("bp-alert-dialog", BpAlertDialog);
