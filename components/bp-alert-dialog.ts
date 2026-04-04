import { define, attr, html, cn } from "./bp-core";

class BpAlertDialog extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const confirmLabel = attr(this, "confirm-label", "Continue");
    const cancelLabel = attr(this, "cancel-label", "Cancel");
    const body = html(this);

    const headerHtml =
      title || description
        ? `<div data-slot="alert-dialog-header" class="grid grid-rows-[auto_1fr] place-items-center gap-1 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:place-items-start sm:text-left sm:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]">
            ${title ? `<div data-slot="alert-dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="alert-dialog-description" class="text-xs/relaxed text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const contentHtml = body
      ? `<div data-slot="alert-dialog-body">${body}</div>`
      : "";

    const footerHtml = `
      <div data-slot="alert-dialog-footer" class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button data-slot="alert-dialog-cancel" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 hover:text-foreground dark:bg-input/30">${cancelLabel}</button>
        <button data-slot="alert-dialog-action" class="inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 bg-primary text-primary-foreground hover:bg-primary/80">${confirmLabel}</button>
      </div>`;

    this.innerHTML = `
      <div data-slot="alert-dialog-content" class="${cn(
        "group/alert-dialog-content grid w-full gap-3 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 data-[size=default]:max-w-xs data-[size=sm]:max-w-64 data-[size=default]:sm:max-w-sm"
      )}" data-size="default">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
}

define("bp-alert-dialog", BpAlertDialog);
