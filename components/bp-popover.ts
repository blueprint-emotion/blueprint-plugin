import { define, attr } from "./bp-core";

class BpPopover extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");

    // Capture children as DocumentFragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // PopoverContent: "z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden ..."
    const triggerHtml = trigger
      ? `<button data-slot="popover-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 hover:text-foreground dark:bg-input/30">${trigger}</button>`
      : "";

    this.setAttribute("data-slot", "popover");
    this.classList.add(..."relative inline-flex".split(" "));
    this.style.display = "inline-flex";

    this.innerHTML = `
        ${triggerHtml}
        <div data-slot="popover-content" class="absolute top-full left-0 mt-1 z-50 flex w-72 flex-col gap-4 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden" style="display:none"></div>`;

    this.querySelector('[data-slot="popover-content"]')!.appendChild(fragment);

    if (trigger) {
      const triggerBtn = this.querySelector("[data-slot=popover-trigger]")!;
      const content = this.querySelector("[data-slot=popover-content]")!;

      triggerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const el = content as HTMLElement;
        el.style.display = el.style.display === "none" ? "" : "none";
      });

      this._outsideClick = (e: Event) => {
        if (!this.contains(e.target as Node)) {
          (content as HTMLElement).style.display = "none";
        }
      };
      document.addEventListener("click", this._outsideClick);
    }
  }

  disconnectedCallback() {
    if (this._outsideClick) {
      document.removeEventListener("click", this._outsideClick);
      this._outsideClick = null;
    }
  }

  private _outsideClick: ((e: Event) => void) | null = null;
}

define("bp-popover", BpPopover);
