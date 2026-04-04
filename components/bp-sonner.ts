import { define, attr, cn } from "./bp-core";

const variantIcons: Record<string, string> = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
};

class BpSonner extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const variant = attr(this, "variant", "default");

    const icon = variantIcons[variant] || variantIcons.default;

    // Sonner toast CSS custom properties from shadcn source
    // --normal-bg: var(--popover)
    // --normal-text: var(--popover-foreground)
    // --normal-border: var(--border)
    // --border-radius: var(--radius)
    const toastClasses = "flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md";

    this.innerHTML = `
      <div data-slot="sonner" data-variant="${variant}" class="${toastClasses}">
        <span class="mt-0.5 shrink-0">${icon}</span>
        <div class="flex flex-col gap-0.5">
          ${title ? `<div class="text-sm font-medium">${title}</div>` : ""}
          ${description ? `<div class="text-xs text-muted-foreground">${description}</div>` : ""}
        </div>
      </div>`;
  }
}

define("bp-sonner", BpSonner);
