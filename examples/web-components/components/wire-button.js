const BUTTON_TAG = "bp-wire-button";

if (!customElements.get(BUTTON_TAG)) {
  class WireButtonElement extends HTMLElement {
    connectedCallback() {
      this.classList.add("block");
      const label = this.getAttribute("label") ?? "버튼";
      const variant = this.getAttribute("variant") ?? "primary";
      const fullWidth = this.getAttribute("full-width") === "true";
      const variantClass =
        variant === "secondary"
          ? "rounded-xl bg-blue-50 px-4 py-3.5 text-sm font-bold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
          : "rounded-xl bg-blue-700 px-4 py-3.5 text-sm font-bold text-white dark:bg-blue-500";
      const widthClass = fullWidth ? " w-full" : "";

      this.innerHTML = `
        <button
          class="${variantClass}${widthClass}"
          type="button"
        >
          ${label}
        </button>
      `;
    }
  }

  customElements.define(BUTTON_TAG, WireButtonElement);
}
