import { define, attr, boolAttr, cn } from "./bp-core";

class BpCheckbox extends HTMLElement {
  connectedCallback() {
    this.classList.add("inline-flex", "items-center", "gap-2");
    const label = attr(this, "label");
    const checked = boolAttr(this, "checked");
    const disabled = boolAttr(this, "disabled");

    const checkboxClasses = "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary";

    const indicatorClasses = "grid place-content-center text-current transition-none [&>svg]:size-3.5";

    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;

    this.innerHTML = `
      <button
        type="button"
        role="checkbox"
        aria-checked="${checked}"
        data-slot="checkbox"
        ${checked ? 'data-checked=""' : ""}
        ${disabled ? "disabled" : ""}
        class="${checkboxClasses}"
      >
        <span data-slot="checkbox-indicator" class="${indicatorClasses}" style="${checked ? "" : "display:none"}">
          ${checkSvg}
        </span>
      </button>
      ${label ? `<label class="text-sm">${label}</label>` : ""}
    `;

    const btn = this.querySelector("button")!;
    btn.addEventListener("click", () => {
      if (disabled) return;
      const isChecked = btn.getAttribute("aria-checked") === "true";
      const next = !isChecked;
      btn.setAttribute("aria-checked", String(next));
      if (next) {
        btn.setAttribute("data-checked", "");
      } else {
        btn.removeAttribute("data-checked");
      }
      const indicator = btn.querySelector("[data-slot='checkbox-indicator']") as HTMLElement;
      if (indicator) indicator.style.display = next ? "" : "none";
    });
  }
}

define("bp-checkbox", BpCheckbox);
