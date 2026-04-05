import { define } from "./bp-core";

/**
 * <bp-kbd>Ctrl+K</bp-kbd>
 *
 * Classes extracted from .shadcn/ui/kbd.tsx
 */

class BpKbd extends HTMLElement {
  connectedCallback() {
    const text = this.textContent?.trim() || "";

    // Kbd: "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-xs bg-muted px-1 font-sans text-[0.625rem] font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3"
    const classes = "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-xs bg-muted px-1 font-sans text-[0.625rem] font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3";

    this.setAttribute("data-slot", "kbd");
    this.classList.add(...classes.split(" "));
    this.style.display = "inline-flex";

    this.innerHTML = text;
  }
}

define("bp-kbd", BpKbd);
