import { define, attr } from "./bp-core";

class BpHoverCard extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");

    // Capture children as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // HoverCardContent: "z-50 w-72 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-xs/relaxed text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden ..."
    this.setAttribute("data-slot", "hover-card");
    this.classList.add(..."relative inline-flex".split(" "));
    this.style.display = "inline-flex";

    this.innerHTML = `
        <button data-slot="hover-card-trigger" class="text-primary underline-offset-4 hover:underline text-xs font-medium cursor-pointer">${trigger}</button>
        <div data-slot="hover-card-content" class="absolute top-full left-0 mt-1 z-50 w-72 rounded-lg bg-popover p-2.5 text-xs/relaxed text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden" style="display:none"></div>`;

    this.querySelector('[data-slot="hover-card-content"]')!.appendChild(fragment);

    const triggerEl = this.querySelector("[data-slot=hover-card-trigger]")!;
    const content = this.querySelector("[data-slot=hover-card-content]") as HTMLElement;
    let timeout: ReturnType<typeof setTimeout>;

    triggerEl.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => { content.style.display = ""; }, 10);
    });
    triggerEl.addEventListener("mouseleave", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!content.matches(":hover")) content.style.display = "none";
      }, 100);
    });
    content.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => { content.style.display = "none"; }, 100);
    });
    content.addEventListener("mouseenter", () => { clearTimeout(timeout); });
  }
}

define("bp-hover-card", BpHoverCard);
