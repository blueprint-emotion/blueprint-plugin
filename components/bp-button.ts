import { define, attr, boolAttr, cn } from "./bp-core";

const variants: Record<string, string> = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border-border hover:bg-input/50 hover:text-foreground dark:bg-input/30",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
  link: "text-primary underline-offset-4 hover:underline",
};

const sizes: Record<string, string> = {
  default: "h-7 gap-1 px-2 text-xs",
  xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem]",
  sm: "h-6 gap-1 px-2 text-xs",
  lg: "h-8 gap-1 px-2.5 text-xs",
  icon: "size-7",
  "icon-xs": "size-5 rounded-sm",
  "icon-sm": "size-6",
  "icon-lg": "size-8",
};

class BpButton extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const disabled = boolAttr(this, "disabled");
    const label = attr(this, "label") || this.textContent?.trim() || "";

    const base = "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50";

    this.innerHTML = `<button
      data-slot="button"
      class="${cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, disabled && "pointer-events-none opacity-50")}"
      ${disabled ? "disabled" : ""}
    >${label}</button>`;
  }
}

define("bp-button", BpButton);
