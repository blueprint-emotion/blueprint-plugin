import { define } from "./bp-core";

class BpStateTab extends HTMLElement {
  connectedCallback() {
    /* Collect children with slot attribute before overwriting innerHTML */
    const panels: { name: string; content: string }[] = [];
    const children = Array.from(this.children);

    for (const child of children) {
      const name = child.getAttribute("slot");
      if (name) {
        panels.push({ name, content: child.innerHTML });
      }
    }

    if (panels.length === 0) return;

    const tabButtons = panels
      .map(
        (p, i) =>
          `<button
            data-slot="state-tab-btn"
            data-tab-index="${i}"
            class="px-3 py-1 text-[0.6875rem] font-medium rounded-md transition-colors ${
              i === 0
                ? "bg-primary text-primary-foreground"
                : "bg-transparent text-muted-foreground hover:text-foreground"
            }"
          >${p.name}</button>`,
      )
      .join("");

    const tabPanels = panels
      .map(
        (p, i) =>
          `<div data-slot="state-tab-panel" data-tab-index="${i}" style="${i > 0 ? "display:none" : ""}">${p.content}</div>`,
      )
      .join("");

    this.innerHTML = `
      <div data-slot="bp-state-tab" class="flex flex-col gap-3">
        <div data-slot="state-tab-bar" class="flex gap-1 rounded-lg bg-muted p-1 w-fit">${tabButtons}</div>
        <div data-slot="state-tab-panels">${tabPanels}</div>
      </div>`;

    /* Wire up click handlers */
    const bar = this.querySelector("[data-slot='state-tab-bar']");
    if (bar) {
      bar.addEventListener("click", (e) => {
        const btn = (e.target as HTMLElement).closest(
          "[data-slot='state-tab-btn']",
        ) as HTMLElement | null;
        if (!btn) return;

        const idx = btn.dataset.tabIndex;

        /* Update button styles */
        const allBtns = this.querySelectorAll("[data-slot='state-tab-btn']");
        for (const b of allBtns) {
          const el = b as HTMLElement;
          if (el.dataset.tabIndex === idx) {
            el.classList.remove("bg-transparent", "text-muted-foreground", "hover:text-foreground");
            el.classList.add("bg-primary", "text-primary-foreground");
          } else {
            el.classList.remove("bg-primary", "text-primary-foreground");
            el.classList.add("bg-transparent", "text-muted-foreground", "hover:text-foreground");
          }
        }

        /* Show/hide panels */
        const allPanels = this.querySelectorAll("[data-slot='state-tab-panel']");
        for (const p of allPanels) {
          const el = p as HTMLElement;
          el.style.display = el.dataset.tabIndex === idx ? "" : "none";
        }
      });
    }
  }
}

define("bp-state-tab", BpStateTab);
