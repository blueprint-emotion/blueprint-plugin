import { define, attr, html } from "./bp-core";

class BpSection extends HTMLElement {
  connectedCallback() {
    const feature = attr(this, "data-feature");
    const label = attr(this, "data-label");
    const body = html(this);

    this.innerHTML = `
      <div data-slot="bp-section" class="relative flex flex-col gap-3">
        ${
          label
            ? `<div class="text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">${label}</div>`
            : ""
        }
        <div data-slot="bp-section-content">${body}</div>
      </div>`;

    /* Re-apply data attributes on the host element after render */
    if (feature) this.setAttribute("data-feature", feature);
    if (label) this.setAttribute("data-label", label);
  }
}

define("bp-section", BpSection);
