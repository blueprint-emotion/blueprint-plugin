import { define, attr, boolAttr } from "./bp-core";

class BpTextarea extends HTMLElement {
  connectedCallback() {
    this.style.display = "contents";
    const placeholder = attr(this, "placeholder");
    const rows = attr(this, "rows", "3");
    const disabled = boolAttr(this, "disabled");
    const value = attr(this, "value");

    this.innerHTML = `<textarea
      data-slot="textarea"
      placeholder="${placeholder}"
      rows="${rows}"
      ${disabled ? "disabled" : ""}
      class="flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-input bg-input/20 px-2 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
    >${value}</textarea>`;
  }
}

define("bp-textarea", BpTextarea);
