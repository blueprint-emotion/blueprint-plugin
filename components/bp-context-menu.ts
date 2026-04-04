import { define, attr, html, cn } from "./bp-core";

/* ── Tailwind classes extracted from .shadcn/ui/context-menu.tsx ── */

const triggerBase = "select-none";

const contentBase =
  "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";

const itemBase =
  "group/context-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive";

const separatorBase = "-mx-1 my-1 h-px bg-border/50";

const shortcutBase =
  "ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground";

/* ── Child element ── */

class BpContextMenuItem extends HTMLElement {}

/* ── Main component ── */

class BpContextMenu extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label", "Right-click here");
    const originalHTML = html(this);

    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;

    const children = temp.children;
    let itemsHTML = "";

    for (let i = 0; i < children.length; i++) {
      const child = children[i] as HTMLElement;
      const tag = child.tagName.toLowerCase();

      if (tag === "bp-context-menu-item") {
        const text = child.textContent?.trim() || "";
        const shortcut = child.getAttribute("shortcut") || "";
        const disabled = child.hasAttribute("disabled");
        const variant = child.getAttribute("variant") || "default";

        const shortcutSpan = shortcut
          ? `<span data-slot="context-menu-shortcut" class="${shortcutBase}">${shortcut}</span>`
          : "";

        itemsHTML += `<div
          data-slot="context-menu-item"
          data-variant="${variant}"
          ${disabled ? 'data-disabled=""' : ""}
          role="menuitem"
          tabindex="-1"
          class="${itemBase}"
        >${text}${shortcutSpan}</div>`;
      }
    }

    this.innerHTML = `
      <div data-slot="context-menu" class="inline-block">
        <div data-slot="context-menu-trigger" class="${triggerBase} inline-flex items-center justify-center rounded-md border border-dashed border-input px-6 py-8 text-xs text-muted-foreground">
          ${label}
        </div>
        <div data-slot="context-menu-content" role="menu" class="${contentBase}" style="margin-top:4px">
          ${itemsHTML}
        </div>
      </div>`;
  }
}

define("bp-context-menu", BpContextMenu);
define("bp-context-menu-item", BpContextMenuItem);
