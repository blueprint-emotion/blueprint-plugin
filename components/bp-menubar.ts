import { define, attr, html, cn } from "./bp-core";

/* ── Tailwind classes extracted from .shadcn/ui/menubar.tsx ── */

const menubarBase = "flex h-9 items-center rounded-lg border p-1";

const triggerBase =
  "flex items-center rounded-[calc(var(--radius-md)-2px)] px-2 py-[calc(--spacing(0.85))] text-xs/relaxed font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted";

const contentBase =
  "min-w-32 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";

const itemBase =
  "group/menubar-item min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive!";

const separatorBase = "-mx-1 my-1 h-px bg-border/50";

const labelBase =
  "px-2 py-1.5 text-xs text-muted-foreground data-inset:pl-7.5";

const shortcutBase =
  "ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground";

/* ── Child elements ── */

class BpMenubarMenu extends HTMLElement {}
class BpMenubarItem extends HTMLElement {}
class BpMenubarSeparator extends HTMLElement {}
class BpMenubarLabel extends HTMLElement {}

/* ── Main component ── */

class BpMenubar extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);

    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;

    const menus = temp.querySelectorAll("bp-menubar-menu");
    let menusHTML = "";

    menus.forEach((menu) => {
      const menuLabel = menu.getAttribute("label") || "Menu";
      const menuChildren = menu.children;
      let menuItemsHTML = "";

      for (let i = 0; i < menuChildren.length; i++) {
        const child = menuChildren[i] as HTMLElement;
        const tag = child.tagName.toLowerCase();

        if (tag === "bp-menubar-separator") {
          menuItemsHTML += `<div data-slot="menubar-separator" role="separator" class="${separatorBase}"></div>`;
        } else if (tag === "bp-menubar-label") {
          const text = child.textContent?.trim() || "";
          menuItemsHTML += `<div data-slot="menubar-label" class="${labelBase}">${text}</div>`;
        } else if (tag === "bp-menubar-item") {
          const text = child.textContent?.trim() || "";
          const shortcut = child.getAttribute("shortcut") || "";
          const disabled = child.hasAttribute("disabled");
          const variant = child.getAttribute("variant") || "default";

          const shortcutSpan = shortcut
            ? `<span data-slot="menubar-shortcut" class="${shortcutBase}">${shortcut}</span>`
            : "";

          menuItemsHTML += `<div
            data-slot="menubar-item"
            data-variant="${variant}"
            ${disabled ? 'data-disabled=""' : ""}
            role="menuitem"
            tabindex="-1"
            class="relative flex cursor-default items-center select-none ${itemBase}"
          >${text}${shortcutSpan}</div>`;
        }
      }

      menusHTML += `
        <div data-slot="menubar-menu" class="relative">
          <button data-slot="menubar-trigger" class="${triggerBase}" aria-expanded="true" type="button">
            ${menuLabel}
          </button>
          <div data-slot="menubar-content" role="menu" class="${contentBase}" style="position:absolute;top:100%;left:0;margin-top:8px">
            ${menuItemsHTML}
          </div>
        </div>`;
    });

    this.innerHTML = `<div data-slot="menubar" class="${menubarBase}">${menusHTML}</div>`;
  }
}

define("bp-menubar", BpMenubar);
define("bp-menubar-menu", BpMenubarMenu);
define("bp-menubar-item", BpMenubarItem);
define("bp-menubar-separator", BpMenubarSeparator);
define("bp-menubar-label", BpMenubarLabel);
