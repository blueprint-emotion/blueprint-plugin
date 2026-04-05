import { define } from "./bp-core";

class BpStateTab extends HTMLElement {
  connectedCallback() {
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
            class="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all ${
              i === 0
                ? "bg-background text-foreground dark:bg-input/30"
                : "text-foreground/60 hover:text-foreground"
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
      <div data-slot="bp-state-tab" class="relative flex flex-col rounded-md transition-all">
        <div data-slot="state-tab-bar" class="absolute -top-4 right-1 z-20 inline-flex items-center justify-center rounded-full p-[3px] text-muted-foreground bg-muted outline outline-1 outline-dashed outline-offset-0 outline-[color-mix(in_oklch,var(--muted-foreground)_40%,transparent)] opacity-0 transition-opacity">${tabButtons}</div>
        <div data-slot="state-tab-panels">${tabPanels}</div>
      </div>`;

    const root = this.querySelector<HTMLElement>('[data-slot="bp-state-tab"]')!;
    const tabBar = this.querySelector<HTMLElement>('[data-slot="state-tab-bar"]')!;

    const show = () => {
      tabBar.style.opacity = "1";
      root.style.outlineWidth = "1px";
      root.style.outlineStyle = "dashed";
      root.style.outlineColor = "color-mix(in oklch, var(--muted-foreground) 40%, transparent)";
      root.style.outlineOffset = "4px";
      root.style.borderRadius = "0.5rem";
    };
    const hide = () => {
      tabBar.style.opacity = "0";
      root.style.outlineWidth = "";
      root.style.outlineStyle = "";
      root.style.outlineColor = "";
      root.style.outlineOffset = "";
      root.style.borderRadius = "";
    };

    root.addEventListener("mouseenter", () => show());
    root.addEventListener("mouseleave", () => hide());

    const nestedTabs = root.querySelectorAll<HTMLElement>('[data-slot="bp-state-tab"] [data-slot="bp-state-tab"]');
    for (const nested of nestedTabs) {
      nested.addEventListener("mouseenter", () => hide());
      nested.addEventListener("mouseleave", () => show());
    }

    const bar = this.querySelector("[data-slot='state-tab-bar']");
    if (bar) {
      bar.addEventListener("click", (e) => {
        const btn = (e.target as HTMLElement).closest(
          "[data-slot='state-tab-btn']",
        ) as HTMLElement | null;
        if (!btn) return;

        const idx = btn.dataset.tabIndex;

        const allBtns = this.querySelectorAll("[data-slot='state-tab-btn']");
        for (const b of allBtns) {
          const el = b as HTMLElement;
          if (el.dataset.tabIndex === idx) {
            el.classList.remove("text-foreground/60", "hover:text-foreground");
            el.classList.add("bg-background", "text-foreground", "dark:bg-input/30");
          } else {
            el.classList.remove("bg-background", "text-foreground", "dark:bg-input/30");
            el.classList.add("text-foreground/60", "hover:text-foreground");
          }
        }

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
