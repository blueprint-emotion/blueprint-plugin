import { define, attr, boolAttr, cn } from "./bp-core";

const base =
  "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-xs font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const variants: Record<string, string> = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent hover:bg-muted",
};

const sizes: Record<string, string> = {
  default:
    "h-7 min-w-7 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
  sm: "h-6 min-w-6 rounded-[min(var(--radius-md),8px)] px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  lg: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
};

class BpToggle extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const pressed = boolAttr(this, "pressed");
    const disabled = boolAttr(this, "disabled");
    const label = this.textContent?.trim() || "";

    this.innerHTML = `<button
      data-slot="toggle"
      type="button"
      role="button"
      aria-pressed="${pressed}"
      ${pressed ? 'data-state="on"' : 'data-state="off"'}
      class="${cn(base, variants[variant] || variants.default, sizes[size] || sizes.default, disabled && "pointer-events-none opacity-50")}"
      ${disabled ? "disabled" : ""}
    >${label}</button>`;
  }
}

define("bp-toggle", BpToggle);
