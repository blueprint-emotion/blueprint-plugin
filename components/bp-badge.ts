import { define, attr, cn } from "./bp-core";

const variants: Record<string, string> = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  outline: "border-border bg-input/20 text-foreground dark:bg-input/30",
  ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
};

class BpBadge extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const text = this.textContent?.trim() || "";

    const base = "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap select-none";

    this.innerHTML = `<span data-slot="badge" class="${cn(base, variants[variant] || variants.default)}">${text}</span>`;
  }
}

define("bp-badge", BpBadge);
