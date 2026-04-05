import { define, attr } from "./bp-core";

class BpDialog extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const trigger = attr(this, "trigger");

    // Capture children as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    const headerHtml =
      title || description
        ? `<div data-slot="dialog-header" class="flex flex-col gap-1">
            ${title ? `<div data-slot="dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="dialog-description" class="text-xs/relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>`
        : "";

    const closeBtnHtml = `<button data-slot="dialog-close" class="absolute top-3 right-3 rounded-md p-1 text-muted-foreground hover:text-foreground">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`;

    // DialogContent: "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none sm:max-w-sm ..."
    // DialogOverlay: "fixed inset-0 isolate z-50 bg-black/80 duration-100 supports-backdrop-filter:backdrop-blur-xs ..."
    const overlayHtml = `
      <div data-slot="dialog-overlay" class="fixed inset-0 isolate z-50 flex items-center justify-center bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
        <div data-slot="dialog-content" class="relative w-full max-w-[calc(100%-2rem)] sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-4 text-xs/relaxed text-popover-foreground outline-none">
          ${closeBtnHtml}
          ${headerHtml}
          <div data-slot="dialog-body"></div>
        </div>
      </div>`;

    if (trigger) {
      this.innerHTML = `
        <button data-slot="dialog-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 bg-primary text-primary-foreground hover:bg-primary/80" style="border-color:transparent">${trigger}</button>
        ${overlayHtml}`;

      this.querySelector('[data-slot="dialog-body"]')!.appendChild(fragment);

      const triggerBtn = this.querySelector("[data-slot=dialog-trigger]")!;
      const overlay = this.querySelector("[data-slot=dialog-overlay]")!;
      const closeBtn = this.querySelector("[data-slot=dialog-close]")!;

      triggerBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "");
      closeBtn.addEventListener("click", () => (overlay as HTMLElement).style.display = "none");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) (overlay as HTMLElement).style.display = "none";
      });
    } else {
      // No trigger: inline preview mode
      this.innerHTML = `
        <div class="relative rounded-xl bg-muted/40 border border-dashed border-border p-8" style="min-height:200px">
          <span class="absolute top-2 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Dialog</span>
          <div class="flex items-center justify-center h-full">
            <div data-slot="dialog-content" class="w-full max-w-[calc(100%-2rem)] sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-4 text-xs/relaxed text-popover-foreground outline-none">
              ${headerHtml}
              <div data-slot="dialog-body"></div>
            </div>
          </div>
        </div>`;

      this.querySelector('[data-slot="dialog-body"]')!.appendChild(fragment);
    }
  }
}

define("bp-dialog", BpDialog);
