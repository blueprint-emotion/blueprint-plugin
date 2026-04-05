import { define, attr } from "./bp-core";

class BpField extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label");
    const description = attr(this, "description");
    const error = attr(this, "error");

    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    const labelHtml = label
      ? `<label data-slot="field-label" class="flex w-fit items-center gap-2 text-xs/relaxed font-medium leading-snug select-none group-data-[disabled=true]/field:opacity-50">${label}</label>`
      : "";

    const descHtml = description
      ? `<div data-slot="field-description" class="text-left text-xs/relaxed leading-normal font-normal text-muted-foreground">${description}</div>`
      : "";

    const errorHtml = error
      ? `<div role="alert" data-slot="field-error" class="text-xs/relaxed font-normal text-destructive">${error}</div>`
      : "";

    // Apply data-slot and classes directly on the custom element (Fix 1)
    this.setAttribute("data-slot", "field");
    this.setAttribute("role", "group");
    this.classList.add(..."group/field flex w-full flex-col gap-2".split(" "));
    this.style.display = "flex";
    if (error) {
      this.setAttribute("data-invalid", "true");
      this.classList.add("text-destructive");
    }

    this.innerHTML = `
        ${labelHtml}
        <div data-slot="field-control"></div>
        ${descHtml}
        ${errorHtml}`;

    this.querySelector('[data-slot="field-control"]')!.appendChild(fragment);
  }
}

define("bp-field", BpField);
