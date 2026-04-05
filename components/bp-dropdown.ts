import { define, attr, html } from "./bp-core";

/* ── Tailwind classes extracted from .shadcn/ui/dropdown-menu.tsx ── */

const triggerBase =
  "inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs outline-none hover:bg-accent hover:text-accent-foreground";

// DropdownMenuContent: "z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:overflow-hidden data-closed:fade-out-0 data-closed:zoom-out-95"
const contentBase =
  "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none";

const itemBase =
  "group/dropdown-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive";

const separatorBase = "-mx-1 my-1 h-px bg-border/50";

const labelBase =
  "px-2 py-1.5 text-xs text-muted-foreground data-inset:pl-7.5";

const shortcutBase =
  "ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground";

const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 opacity-60" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

/* ── Child elements ── */

class BpDropdownItem extends HTMLElement {}
class BpDropdownSeparator extends HTMLElement {}
class BpDropdownLabel extends HTMLElement {}

/* ── Main component ── */

class BpDropdown extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label", "Open");
    const originalHTML = html(this);

    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;

    const children = temp.children;
    let itemsHTML = "";

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const tag = child.tagName.toLowerCase();

      if (tag === "bp-dropdown-separator") {
        itemsHTML += `<div data-slot="dropdown-menu-separator" role="separator" class="${separatorBase}"></div>`;
      } else if (tag === "bp-dropdown-label") {
        const text = child.textContent?.trim() || "";
        itemsHTML += `<div data-slot="dropdown-menu-label" class="${labelBase}">${text}</div>`;
      } else if (tag === "bp-dropdown-item") {
        const text = child.textContent?.trim() || "";
        const shortcut = child.getAttribute("shortcut") || "";
        const disabled = child.hasAttribute("disabled");
        const variant = child.getAttribute("variant") || "default";

        const shortcutSpan = shortcut
          ? `<span data-slot="dropdown-menu-shortcut" class="${shortcutBase}">${shortcut}</span>`
          : "";

        itemsHTML += `<div
          data-slot="dropdown-menu-item"
          data-variant="${variant}"
          ${disabled ? 'data-disabled=""' : ""}
          role="menuitem"
          tabindex="-1"
          class="${itemBase}"
        >${text}${shortcutSpan}</div>`;
      }
    }

    this.setAttribute("data-slot", "dropdown-menu");
    this.classList.add(..."relative inline-block".split(" "));
    this.style.display = "inline-block";

    this.innerHTML = `
        <button data-slot="dropdown-menu-trigger" class="${triggerBase}" aria-expanded="false" type="button">
          ${label}${chevronSvg}
        </button>
        <div data-slot="dropdown-menu-content" role="menu" class="${contentBase}" style="margin-top:4px;display:none;position:absolute;left:0;top:100%">
          ${itemsHTML}
        </div>`;

    const trigger = this.querySelector<HTMLElement>('[data-slot="dropdown-menu-trigger"]')!;
    const content = this.querySelector<HTMLElement>('[data-slot="dropdown-menu-content"]')!;

    trigger.addEventListener("click", () => {
      const open = content.style.display !== "none";
      content.style.display = open ? "none" : "";
      trigger.setAttribute("aria-expanded", String(!open));
    });

    document.addEventListener("click", (e) => {
      if (!this.contains(e.target as Node)) {
        content.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
}

define("bp-dropdown", BpDropdown);
define("bp-dropdown-item", BpDropdownItem);
define("bp-dropdown-separator", BpDropdownSeparator);
define("bp-dropdown-label", BpDropdownLabel);
