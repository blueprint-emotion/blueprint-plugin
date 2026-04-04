const PAGE_SHELL_TAG = "bp-page-shell";

if (!customElements.get(PAGE_SHELL_TAG)) {
  class PageShellElement extends HTMLElement {
    connectedCallback() {
      this.classList.add("block");
      const title = this.getAttribute("title") ?? "화면 제목";
      const description = this.getAttribute("description") ?? "";
      const body = this.innerHTML;

      this.innerHTML = `
        <section class="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_24px_48px_rgba(15,23,42,0.08)] dark:border-zinc-800 dark:bg-zinc-900">
          <header class="border-b border-zinc-200 bg-linear-to-br from-blue-50 to-white px-8 py-8 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-900">
            <div>
              <p class="mb-2 text-[12px] font-bold uppercase tracking-[0.08em] text-blue-700 dark:text-blue-300">Blueprint Preview</p>
              <h1 class="text-[32px] font-semibold leading-tight text-zinc-950 dark:text-zinc-50">${title}</h1>
              ${description ? `<p class="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">${description}</p>` : ""}
            </div>
          </header>
          <div class="grid gap-5 px-8 py-8">${body}</div>
        </section>
      `;
    }
  }

  customElements.define(PAGE_SHELL_TAG, PageShellElement);
}
