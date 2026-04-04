import { define, attr, html } from "./bp-core";

class BpPopover extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");
    const body = html(this);

    const triggerHtml = trigger
      ? `<div data-slot="popover-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 hover:text-foreground dark:bg-input/30">${trigger}</div>`
      : "";

    const contentHtml = body
      ? `<div data-slot="popover-content" class="z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden">${body}</div>`
      : "";

    this.innerHTML = `
      <div data-slot="popover" class="inline-flex flex-col items-start gap-1">
        ${triggerHtml}
        ${contentHtml}
      </div>`;
  }
}

define("bp-popover", BpPopover);
