import { define, attr, boolAttr } from "./bp-core";

class BpComboboxItem extends HTMLElement {
  connectedCallback() {
    // Just a data holder; rendering is done by BpCombobox parent
  }
}

class BpCombobox extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Select...");
    const disabled = boolAttr(this, "disabled");

    // Collect items from <bp-combobox-item> children
    const itemEls = Array.from(this.querySelectorAll("bp-combobox-item"));
    const items = itemEls.map((el) => ({
      value: attr(el, "value"),
      label: attr(el, "label") || el.textContent?.trim() || attr(el, "value"),
    }));

    // shadcn: ComboboxInput / InputGroup
    const inputGroupClasses = "w-auto";
    // shadcn: ComboboxTrigger
    const triggerClasses = "[&_svg:not([class*='size-'])]:size-3.5";
    // shadcn: ComboboxContent / Popup
    const contentClasses = "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100";
    // shadcn: ComboboxList
    const listClasses = "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0";
    // shadcn: ComboboxItem
    const itemClasses = "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";
    // shadcn: ComboboxEmpty
    const emptyClasses = "hidden w-full justify-center py-2 text-center text-xs/relaxed text-muted-foreground group-data-empty/combobox-content:flex";
    // shadcn: ComboboxItemIndicator wrapper
    const indicatorClasses = "pointer-events-none absolute right-2 flex items-center justify-center";

    const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none size-3.5 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>`;
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><path d="M20 6 9 17l-5-5"/></svg>`;

    const itemsHtml = items.map((item) =>
      `<div data-slot="combobox-item" data-value="${item.value}" class="${itemClasses}" role="option">
        <span>${item.label}</span>
        <span class="${indicatorClasses}" style="display:none">${checkIcon}</span>
      </div>`
    ).join("");

    this.innerHTML = `
      <div data-slot="combobox" class="relative inline-block w-full">
        <div data-slot="input-group" class="${inputGroupClasses} flex items-center">
          <input
            data-slot="input"
            type="text"
            placeholder="${placeholder}"
            ${disabled ? "disabled" : ""}
            class="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 pr-7"
            readonly
          />
          <button data-slot="combobox-trigger" class="${triggerClasses} absolute right-0 top-0 h-7 w-7 flex items-center justify-center" ${disabled ? "disabled" : ""}>
            ${chevronDown}
          </button>
        </div>
        <div data-slot="combobox-content" class="${contentClasses} absolute top-full left-0 mt-1.5 w-full z-50" style="display:none">
          <div data-slot="combobox-list" class="${listClasses}" role="listbox">
            ${itemsHtml || `<div data-slot="combobox-empty" class="${emptyClasses}" style="display:flex">No results</div>`}
          </div>
        </div>
      </div>`;

    // Toggle dropdown on trigger click
    const trigger = this.querySelector("[data-slot='combobox-trigger']") as HTMLElement;
    const content = this.querySelector("[data-slot='combobox-content']") as HTMLElement;
    const input = this.querySelector("input") as HTMLInputElement;

    if (trigger && content && !disabled) {
      const toggle = () => {
        const isOpen = content.style.display !== "none";
        content.style.display = isOpen ? "none" : "block";
      };
      trigger.addEventListener("click", toggle);
      input.addEventListener("click", toggle);

      // Item selection
      const comboboxItems = this.querySelectorAll("[data-slot='combobox-item']");
      comboboxItems.forEach((itemEl) => {
        itemEl.addEventListener("click", () => {
          const label = itemEl.querySelector("span")?.textContent || "";
          input.value = label;
          // Reset all indicators
          comboboxItems.forEach((el) => {
            const ind = el.querySelector("[class*='pointer-events-none absolute']") as HTMLElement;
            if (ind) ind.style.display = "none";
          });
          // Show selected indicator
          const indicator = itemEl.querySelector("[class*='pointer-events-none absolute']") as HTMLElement;
          if (indicator) indicator.style.display = "flex";
          content.style.display = "none";
        });
      });
    }
  }
}

define("bp-combobox-item", BpComboboxItem);
define("bp-combobox", BpCombobox);
