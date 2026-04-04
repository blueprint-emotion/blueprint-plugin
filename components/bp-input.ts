import { define, attr, boolAttr } from "./bp-core";

class BpInput extends HTMLElement {
  connectedCallback() {
    this.classList.add("block");
    const placeholder = attr(this, "placeholder");
    const type = attr(this, "type", "text");
    const disabled = boolAttr(this, "disabled");
    const value = attr(this, "value");

    this.innerHTML = `<input
      type="${type}"
      data-slot="input"
      placeholder="${placeholder}"
      value="${value}"
      ${disabled ? "disabled" : ""}
      class="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
    />`;
  }
}

define("bp-input", BpInput);
