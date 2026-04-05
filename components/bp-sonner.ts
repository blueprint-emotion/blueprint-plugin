import { define, attr } from "./bp-core";

const variantIcons: Record<string, string> = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
};

function toastHtml(title: string, description: string, icon: string): string {
  return `
    <div data-slot="sonner" class="flex w-full max-w-sm items-start gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
      <span class="mt-0.5 shrink-0">${icon}</span>
      <div class="flex-1 flex flex-col gap-0.5">
        ${title ? `<div class="text-xs font-medium">${title}</div>` : ""}
        ${description ? `<div class="text-xs text-muted-foreground">${description}</div>` : ""}
      </div>
      <button data-slot="sonner-close" class="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>`;
}

class BpSonner extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const variant = attr(this, "variant", "default");
    const trigger = attr(this, "trigger");

    const icon = variantIcons[variant] || variantIcons.default;
    const toast = toastHtml(title, description, icon);

    if (trigger) {
      this.innerHTML = `
        <button data-slot="sonner-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 dark:bg-input/30">${trigger}</button>
        <div data-slot="sonner-container" class="fixed bottom-4 right-4 z-50" style="display:none">${toast}</div>`;

      const triggerBtn = this.querySelector("[data-slot=sonner-trigger]")!;
      const container = this.querySelector("[data-slot=sonner-container]")!;
      const closeBtn = this.querySelector("[data-slot=sonner-close]")!;

      triggerBtn.addEventListener("click", () => {
        (container as HTMLElement).style.display = "";
        setTimeout(() => (container as HTMLElement).style.display = "none", 3000);
      });
      closeBtn.addEventListener("click", () => (container as HTMLElement).style.display = "none");
    } else {
      this.innerHTML = toast;
    }
  }
}

define("bp-sonner", BpSonner);
