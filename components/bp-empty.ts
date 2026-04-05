import { define, attr, cn } from "./bp-core";

const icons: Record<string, string> = {
  inbox: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  file: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
};

class BpEmpty extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const icon = attr(this, "icon", "inbox");

    // shadcn: Empty root
    const rootClasses = "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance";
    // shadcn: EmptyHeader
    const headerClasses = "flex max-w-sm flex-col items-center gap-1";
    // shadcn: EmptyMedia base + variant="icon"
    const mediaClasses = "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4";
    // shadcn: EmptyTitle
    const titleClasses = "font-heading text-sm font-medium tracking-tight";
    // shadcn: EmptyDescription
    const descClasses = "text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary";

    const iconSvg = icons[icon] || icons.inbox;

    this.setAttribute("data-slot", "empty");
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "flex";

    this.innerHTML = `
        <div data-slot="empty-header" class="${headerClasses}">
          <div data-slot="empty-icon" data-variant="icon" class="${mediaClasses}">
            ${iconSvg}
          </div>
          ${title ? `<div data-slot="empty-title" class="${titleClasses}">${title}</div>` : ""}
          ${description ? `<div data-slot="empty-description" class="${descClasses}">${description}</div>` : ""}
        </div>`;
  }
}

define("bp-empty", BpEmpty);
