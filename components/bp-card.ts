import { define, attr } from "./bp-core";

class BpCard extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const footer = attr(this, "footer");

    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // Apply data-slot and classes directly on the custom element (shadcn Card root)
    this.setAttribute("data-slot", "card");
    this.classList.add(..."group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10".split(" "));
    this.style.display = "flex";

    const headerHtml = (title || description) ? `
      <div data-slot="card-header" class="grid auto-rows-min items-start gap-1 px-4">
        ${title ? `<div data-slot="card-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
        ${description ? `<div data-slot="card-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
      </div>` : "";

    const footerHtml = footer ? `
      <div data-slot="card-footer" class="flex items-center px-4">${footer}</div>` : "";

    this.innerHTML = `
      ${headerHtml}
      <div data-slot="card-content" class="px-4"></div>
      ${footerHtml}`;

    this.querySelector('[data-slot="card-content"]')!.appendChild(fragment);
  }
}

define("bp-card", BpCard);
