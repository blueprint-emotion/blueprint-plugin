import { define, attr, html, cn } from "./bp-core";

class BpHoverCard extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");
    const body = html(this);

    // Positioner classes from shadcn HoverCardContent
    const positionerClasses = "isolate z-50";

    // Popup classes from shadcn HoverCardContent
    const contentClasses = "z-50 w-72 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-xs/relaxed text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden";

    this.innerHTML = `
      <div data-slot="hover-card">
        <span data-slot="hover-card-trigger" class="cursor-pointer underline decoration-dotted">${trigger}</span>
        <div class="${positionerClasses}">
          <div data-slot="hover-card-content" class="${contentClasses}">
            ${body}
          </div>
        </div>
      </div>`;
  }
}

define("bp-hover-card", BpHoverCard);
