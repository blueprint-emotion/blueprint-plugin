const TABLE_SECTION_TAG = "bp-table-section";

if (!customElements.get(TABLE_SECTION_TAG)) {
  class TableSectionElement extends HTMLElement {
    connectedCallback() {
      this.classList.add("block");
      const title = this.getAttribute("title") ?? "섹션";
      const description = this.getAttribute("description") ?? "";
      const body = this.innerHTML;

      this.innerHTML = `
        <section class="overflow-hidden rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <div class="border-b border-zinc-200 bg-zinc-50 px-6 py-5 dark:border-zinc-800 dark:bg-zinc-950/60">
            <div>
              <h2 class="text-base font-semibold text-zinc-950 dark:text-zinc-50">${title}</h2>
              ${description ? `<p class="mt-2 text-sm text-zinc-500 dark:text-zinc-400">${description}</p>` : ""}
            </div>
          </div>
          <div class="[&_table]:w-full [&_table]:border-collapse [&_th]:border-b [&_th]:border-zinc-200 [&_th]:bg-zinc-50 [&_th]:px-6 [&_th]:py-3.5 [&_th]:text-left [&_th]:text-xs [&_th]:font-semibold [&_th]:text-zinc-500 [&_td]:border-b [&_td]:border-zinc-200 [&_td]:px-6 [&_td]:py-3.5 [&_td]:text-sm [&_td]:text-zinc-700 dark:[&_th]:border-zinc-800 dark:[&_th]:bg-zinc-950 dark:[&_th]:text-zinc-400 dark:[&_td]:border-zinc-800 dark:[&_td]:text-zinc-200">${body}</div>
        </section>
      `;
    }
  }

  customElements.define(TABLE_SECTION_TAG, TableSectionElement);
}
