import { define, attr, html } from "./bp-core";

class BpSelect extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Select…");
    const originalHTML = html(this);

    // Parse child bp-select-item elements before overwriting
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-select-item");

    const triggerClasses = "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-7 data-[size=sm]:h-6 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";

    const contentClasses = "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95";

    const itemClasses = "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2";

    const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none size-3.5 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>`;

    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><path d="M20 6 9 17l-5-5"/></svg>`;

    let optionsHTML = "";
    items.forEach((item) => {
      const itemValue = item.getAttribute("value") || "";
      const itemLabel = item.getAttribute("label") || itemValue;
      optionsHTML += `
        <div
          role="option"
          data-slot="select-item"
          data-value="${itemValue}"
          tabindex="0"
          class="${itemClasses}"
        >
          <span class="flex flex-1 shrink-0 gap-2 whitespace-nowrap" data-slot="select-item-text">${itemLabel}</span>
          <span class="pointer-events-none absolute right-2 flex items-center justify-center" data-slot="select-indicator" style="display:none">
            ${checkSvg}
          </span>
        </div>
      `;
    });

    this.innerHTML = `
      <div class="relative inline-block">
        <button
          type="button"
          data-slot="select-trigger"
          data-size="default"
          data-placeholder
          class="${triggerClasses}"
        >
          <span data-slot="select-value" class="flex flex-1 text-left">${placeholder}</span>
          ${chevronSvg}
        </button>
        <div
          data-slot="select-content"
          role="listbox"
          class="${contentClasses}"
          style="display:none; position:absolute; top:100%; left:0; margin-top:4px; min-width:100%;"
        >
          ${optionsHTML}
        </div>
      </div>
    `;

    const trigger = this.querySelector("[data-slot='select-trigger']") as HTMLButtonElement;
    const content = this.querySelector("[data-slot='select-content']") as HTMLElement;
    const valueEl = this.querySelector("[data-slot='select-value']") as HTMLElement;

    // Toggle dropdown
    trigger.addEventListener("click", () => {
      const isOpen = content.style.display !== "none";
      content.style.display = isOpen ? "none" : "block";
    });

    // Item selection
    this.querySelectorAll<HTMLElement>("[data-slot='select-item']").forEach((item) => {
      item.addEventListener("click", () => {
        const val = item.getAttribute("data-value") || "";
        const label = item.querySelector("[data-slot='select-item-text']")?.textContent || val;

        // Update displayed value
        valueEl.textContent = label;
        trigger.removeAttribute("data-placeholder");

        // Update check indicators
        this.querySelectorAll<HTMLElement>("[data-slot='select-indicator']").forEach((ind) => {
          ind.style.display = "none";
        });
        const indicator = item.querySelector("[data-slot='select-indicator']") as HTMLElement;
        if (indicator) indicator.style.display = "";

        // Close dropdown
        content.style.display = "none";
      });
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target as Node)) {
        content.style.display = "none";
      }
    });
  }
}

class BpSelectItem extends HTMLElement {
  // Parsed by parent; no-op if rendered standalone
}

define("bp-select", BpSelect);
define("bp-select-item", BpSelectItem);
