import { define, attr, cn } from "./bp-core";

/* ── Command (root) ── */
class BpCommand extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Search...");

    // Collect child elements before clearing DOM
    const groups = Array.from(this.querySelectorAll("bp-command-group"));
    const topLevelItems = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "bp-command-item"
    );

    let groupsHTML = "";

    // Render top-level items (not inside a group)
    if (topLevelItems.length > 0) {
      groupsHTML += renderItems(topLevelItems);
    }

    groups.forEach((group) => {
      const label = group.getAttribute("label") || "";
      const items = Array.from(group.querySelectorAll("bp-command-item"));
      // CommandGroup classes from shadcn
      const groupClasses = "overflow-hidden p-1 text-foreground";
      const headingClasses = "px-2.5 py-1.5 text-xs font-medium text-muted-foreground";

      groupsHTML += `
        <div data-slot="command-group" class="${groupClasses}">
          ${label ? `<div cmdk-group-heading="" class="${headingClasses}">${label}</div>` : ""}
          ${renderItems(items)}
        </div>`;
    });

    // Command root classes from shadcn
    const commandClasses = "flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground";

    // CommandInput wrapper classes from shadcn
    const inputWrapperClasses = "p-1 pb-0";

    // CommandInput classes from shadcn
    const inputClasses = "w-full text-xs/relaxed outline-hidden disabled:cursor-not-allowed disabled:opacity-50";

    // CommandList classes from shadcn
    const listClasses = "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none";

    // CommandEmpty classes from shadcn
    const emptyClasses = "py-6 text-center text-xs/relaxed";

    // Search icon (inline SVG matching lucide SearchIcon)
    const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;

    this.setAttribute("data-slot", "command");
    this.classList.add(...commandClasses.split(" "));
    this.style.display = "flex";

    this.innerHTML = `
        <div data-slot="command-input-wrapper" class="${inputWrapperClasses}">
          <div class="flex h-8 items-center gap-2 rounded-md bg-input/20 px-2 dark:bg-input/30">
            <input data-slot="command-input" placeholder="${placeholder}" class="${inputClasses}" />
            ${searchIcon}
          </div>
        </div>
        <div data-slot="command-list" class="${listClasses}">
          ${groupsHTML || `<div data-slot="command-empty" class="${emptyClasses}">No results found.</div>`}
        </div>`;
  }
}

function renderItems(items: Element[]): string {
  let out = "";
  // CommandItem classes from shadcn
  const itemClasses = "group/command-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-xs/relaxed outline-hidden select-none in-data-[slot=dialog-content]:rounded-md data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-selected:*:[svg]:text-foreground";

  items.forEach((item) => {
    const text = item.innerHTML.trim();
    const disabled = item.hasAttribute("disabled");

    out += `<div data-slot="command-item" role="option" ${disabled ? 'data-disabled="true"' : ""} class="${itemClasses}">${text}</div>`;
  });
  return out;
}

/* ── CommandGroup (child, parsed by parent) ── */
class BpCommandGroup extends HTMLElement {}

/* ── CommandItem (child, parsed by parent) ── */
class BpCommandItem extends HTMLElement {}

define("bp-command", BpCommand);
define("bp-command-group", BpCommandGroup);
define("bp-command-item", BpCommandItem);
