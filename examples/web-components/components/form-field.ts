const FORM_FIELD_TAG = "bp-form-field";

if (!customElements.get(FORM_FIELD_TAG)) {
  class FormFieldElement extends HTMLElement {
    connectedCallback() {
      this.classList.add("block");
      const label = this.getAttribute("label") ?? "라벨";
      const hint = this.getAttribute("hint") ?? "";
      const required = this.getAttribute("required") === "true";
      const body = this.innerHTML;

      this.innerHTML = `
        <label class="grid gap-2">
          <span class="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            ${label}
            ${required ? '<span class="rounded-full bg-red-50 px-2 py-0.5 text-[12px] font-bold text-red-700 dark:bg-red-950/50 dark:text-red-300">필수</span>' : ""}
          </span>
          <span class="block [&_input]:w-full [&_input]:rounded-xl [&_input]:border [&_input]:border-zinc-300 [&_input]:bg-white [&_input]:px-4 [&_input]:py-3.5 [&_input]:text-sm [&_input]:text-zinc-900 [&_input]:outline-none [&_input]:placeholder:text-zinc-400 dark:[&_input]:border-zinc-700 dark:[&_input]:bg-zinc-950 dark:[&_input]:text-zinc-100">${body}</span>
          ${hint ? `<span class="text-sm text-zinc-500 dark:text-zinc-400">${hint}</span>` : ""}
        </label>
      `;
    }
  }

  customElements.define(FORM_FIELD_TAG, FormFieldElement);
}

export {};
