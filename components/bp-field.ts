import { define, attr, html } from "./bp-core";

class BpField extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label");
    const description = attr(this, "description");
    const error = attr(this, "error");
    const body = html(this);

    const labelHtml = label
      ? `<label data-slot="field-label" class="flex w-fit items-center gap-2 text-xs font-medium leading-snug select-none">${label}</label>`
      : "";

    const descHtml = description
      ? `<p data-slot="field-description" class="text-xs font-normal text-muted-foreground">${description}</p>`
      : "";

    const errorHtml = error
      ? `<div role="alert" data-slot="field-error" class="text-xs font-normal text-destructive">${error}</div>`
      : "";

    this.innerHTML = `
      <div data-slot="field" role="group" class="flex w-full flex-col gap-2${error ? ' data-[invalid=true]' : ''}">
        ${labelHtml}
        ${body}
        ${descHtml}
        ${errorHtml}
      </div>`;
  }
}

define("bp-field", BpField);
