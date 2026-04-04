import { define, attr, boolAttr } from "./bp-core";

class BpSwitch extends HTMLElement {
  connectedCallback() {
    this.classList.add("inline-flex", "items-center", "gap-2");
    const label = attr(this, "label");
    const checked = boolAttr(this, "checked");
    const disabled = boolAttr(this, "disabled");

    const switchClasses = "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=default]:h-[16.6px] data-[size=default]:w-[28px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50";

    const thumbClasses = "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground";

    this.innerHTML = `
      <button
        type="button"
        role="switch"
        aria-checked="${checked}"
        data-slot="switch"
        data-size="default"
        ${checked ? 'data-checked=""' : 'data-unchecked=""'}
        ${disabled ? 'disabled data-disabled=""' : ""}
        class="${switchClasses}"
      >
        <span
          data-slot="switch-thumb"
          ${checked ? 'data-checked=""' : 'data-unchecked=""'}
          class="${thumbClasses}"
        ></span>
      </button>
      ${label ? `<label class="text-sm">${label}</label>` : ""}
    `;

    const btn = this.querySelector("button")!;
    btn.addEventListener("click", () => {
      if (disabled) return;
      const isChecked = btn.getAttribute("aria-checked") === "true";
      const next = !isChecked;
      btn.setAttribute("aria-checked", String(next));

      const thumb = btn.querySelector("[data-slot='switch-thumb']") as HTMLElement;

      if (next) {
        btn.setAttribute("data-checked", "");
        btn.removeAttribute("data-unchecked");
        thumb.setAttribute("data-checked", "");
        thumb.removeAttribute("data-unchecked");
      } else {
        btn.removeAttribute("data-checked");
        btn.setAttribute("data-unchecked", "");
        thumb.removeAttribute("data-checked");
        thumb.setAttribute("data-unchecked", "");
      }
    });
  }
}

define("bp-switch", BpSwitch);
