import { define, attr } from "./bp-core";

class BpAlertDialog extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const confirmLabel = attr(this, "confirm-label", "확인");
    const cancelLabel = attr(this, "cancel-label", "취소");
    const trigger = attr(this, "trigger");

    // Capture children as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // AlertDialogHeader: "grid grid-rows-[auto_1fr] place-items-center gap-1 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]"
    // AlertDialogTitle: "font-heading text-sm font-medium sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2"
    // AlertDialogDescription: "text-xs/relaxed text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground"
    const headerHtml =
      title || description
        ? `<div data-slot="alert-dialog-header" class="grid grid-rows-[auto_1fr] place-items-center gap-1 text-center sm:place-items-start sm:text-left">
            ${title ? `<div data-slot="alert-dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="alert-dialog-description" class="text-xs/relaxed text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>`
        : "";

    // AlertDialogFooter: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end"
    const footerHtml = `
      <div data-slot="alert-dialog-footer" class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button data-slot="alert-dialog-cancel" class="inline-flex items-center justify-center rounded-md border border-border h-7 px-2 text-xs font-medium hover:bg-input/50 dark:bg-input/30">${cancelLabel}</button>
        <button data-slot="alert-dialog-action" class="inline-flex items-center justify-center rounded-md border h-7 px-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/80" style="border-color:transparent">${confirmLabel}</button>
      </div>`;

    // AlertDialogOverlay: "fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs ..."
    // AlertDialogContent: "group/alert-dialog-content fixed top-1/2 left-1/2 z-50 grid w-full -translate-x-1/2 -translate-y-1/2 gap-3 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:max-w-xs data-[size=default]:sm:max-w-sm ..."
    const overlayHtml = `
      <div data-slot="alert-dialog-overlay" class="fixed inset-0 isolate z-50 flex items-center justify-center bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
        <div data-slot="alert-dialog-content" data-size="default" class="group/alert-dialog-content w-full max-w-xs sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-3 text-popover-foreground outline-none">
          ${headerHtml}
          <div data-slot="alert-dialog-body"></div>
          ${footerHtml}
        </div>
      </div>`;

    if (trigger) {
      this.innerHTML = `
        <button data-slot="alert-dialog-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30" style="border-color:transparent">${trigger}</button>
        ${overlayHtml}`;

      this.querySelector('[data-slot="alert-dialog-body"]')!.appendChild(fragment);

      const triggerBtn = this.querySelector("[data-slot=alert-dialog-trigger]")!;
      const overlay = this.querySelector("[data-slot=alert-dialog-overlay]")!;
      const cancelBtn = this.querySelector("[data-slot=alert-dialog-cancel]")!;
      const actionBtn = this.querySelector("[data-slot=alert-dialog-action]")!;

      triggerBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "");
      cancelBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "none");
      actionBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "none");
    } else {
      this.innerHTML = `
        <div class="relative rounded-xl bg-muted/40 border border-dashed border-border p-8" style="min-height:180px">
          <span class="absolute top-2 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Alert Dialog</span>
          <div class="flex items-center justify-center h-full">
            <div data-slot="alert-dialog-content" data-size="default" class="group/alert-dialog-content w-full max-w-xs sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-3 text-popover-foreground outline-none">
              ${headerHtml}
              <div data-slot="alert-dialog-body"></div>
              ${footerHtml}
            </div>
          </div>
        </div>`;

      this.querySelector('[data-slot="alert-dialog-body"]')!.appendChild(fragment);
    }
  }
}

define("bp-alert-dialog", BpAlertDialog);
