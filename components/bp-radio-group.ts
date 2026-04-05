import { define, attr, html } from "./bp-core";

class BpRadioGroup extends HTMLElement {
  connectedCallback() {
    const name = attr(this, "name");
    const value = attr(this, "value");
    const originalHTML = html(this);

    // Parse child bp-radio-item elements before overwriting
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-radio-item");

    const radioItemClasses = "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary";

    const indicatorClasses = "flex size-4 items-center justify-center";
    const dotClasses = "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground";

    let itemsHTML = "";
    items.forEach((item) => {
      const itemValue = item.getAttribute("value") || "";
      const itemLabel = item.getAttribute("label") || "";
      const isChecked = itemValue === value;

      itemsHTML += `
        <label class="flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            role="radio"
            aria-checked="${isChecked}"
            data-slot="radio-group-item"
            data-value="${itemValue}"
            ${isChecked ? 'data-checked=""' : ""}
            class="${radioItemClasses}"
          >
            <span data-slot="radio-group-indicator" class="${indicatorClasses}" style="${isChecked ? "" : "display:none"}">
              <span class="${dotClasses}"></span>
            </span>
          </button>
          ${itemLabel ? `<span class="text-sm">${itemLabel}</span>` : ""}
        </label>
      `;
    });

    // Apply data-slot and classes directly on the custom element (Fix 1)
    this.setAttribute("data-slot", "radio-group");
    this.setAttribute("role", "radiogroup");
    this.classList.add(..."grid w-full gap-3".split(" "));
    this.style.display = "grid";
    this.innerHTML = itemsHTML;

    // Interaction
    this.querySelectorAll<HTMLButtonElement>("[role='radio']").forEach((btn) => {
      btn.addEventListener("click", () => {
        // Uncheck all
        this.querySelectorAll<HTMLButtonElement>("[role='radio']").forEach((b) => {
          b.setAttribute("aria-checked", "false");
          b.removeAttribute("data-checked");
          const ind = b.querySelector("[data-slot='radio-group-indicator']") as HTMLElement;
          if (ind) ind.style.display = "none";
        });
        // Check clicked
        btn.setAttribute("aria-checked", "true");
        btn.setAttribute("data-checked", "");
        const indicator = btn.querySelector("[data-slot='radio-group-indicator']") as HTMLElement;
        if (indicator) indicator.style.display = "";
      });
    });
  }
}

class BpRadioItem extends HTMLElement {
  // Parsed by parent; no-op if rendered standalone
}

define("bp-radio-group", BpRadioGroup);
define("bp-radio-item", BpRadioItem);
