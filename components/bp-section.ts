import { define, attr } from "./bp-core";

class BpSection extends HTMLElement {
  connectedCallback() {
    const feature = attr(this, "data-feature");
    const label = attr(this, "data-label");

    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    this.style.display = "block";
    this.innerHTML = `
      <div data-slot="bp-section" class="relative flex flex-col gap-3">
        <div data-slot="bp-section-content"></div>
      </div>`;

    this.querySelector('[data-slot="bp-section-content"]')!.appendChild(fragment);

    if (feature) this.setAttribute("data-feature", feature);
    if (label) this.setAttribute("data-label", label);
  }
}

define("bp-section", BpSection);
