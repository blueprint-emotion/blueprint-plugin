import { define, attr, cn } from "./bp-core";

/**
 * bp-tabs — Tab container with click-to-switch behavior.
 *
 * Tailwind classes extracted from .shadcn/ui/tabs.tsx
 *
 * Usage:
 *   <bp-tabs>
 *     <bp-tab label="Tab 1" active>Content 1</bp-tab>
 *     <bp-tab label="Tab 2">Content 2</bp-tab>
 *   </bp-tabs>
 */

// From Tabs root: cn("group/tabs flex gap-2 data-horizontal:flex-col", ...)
const tabsRootClasses = "group/tabs flex gap-2 data-horizontal:flex-col";

// From TabsList (default variant): cn(tabsListVariants({ variant }), ...)
// tabsListVariants base: "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none"
// tabsListVariants default variant: "bg-muted"
const tabsListClasses =
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none bg-muted";

// From TabsTrigger: cn(...) — border-transparent removed, applied via inline style
const tabsTriggerBase =
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-[calc(--spacing(1.25))] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";

const tabsTriggerLineVariant =
  "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent";

const tabsTriggerActiveClasses =
  "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground";

const tabsTriggerAfterClasses =
  "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100";

const tabsTriggerClasses = cn(
  tabsTriggerBase,
  tabsTriggerLineVariant,
  tabsTriggerActiveClasses,
  tabsTriggerAfterClasses,
);

// From TabsContent: cn("flex-1 text-xs/relaxed outline-none", ...)
const tabsContentClasses = "flex-1 text-xs/relaxed outline-none";

class BpTab extends HTMLElement {
  // Parsed by parent bp-tabs; no-op standalone
}

class BpTabs extends HTMLElement {
  connectedCallback() {
    // Collect bp-tab children before clearing
    const tabs: {
      label: string;
      active: boolean;
      fragment: DocumentFragment;
    }[] = [];
    let activeIdx = 0;

    const children = Array.from(this.children);
    children.forEach((child, i) => {
      if (child.tagName.toLowerCase() === "bp-tab") {
        const label = child.getAttribute("label") || `Tab ${i + 1}`;
        const active =
          child.hasAttribute("active") &&
          child.getAttribute("active") !== "false";
        if (active) activeIdx = tabs.length;

        const fragment = document.createDocumentFragment();
        while (child.firstChild) fragment.appendChild(child.firstChild);
        tabs.push({ label, active, fragment });
      }
    });

    // Apply data-slot and classes directly on the custom element (shadcn Tabs root)
    this.setAttribute("data-slot", "tabs");
    this.setAttribute("data-orientation", "horizontal");
    this.setAttribute("data-horizontal", "");
    this.classList.add(...tabsRootClasses.split(" "));
    this.style.display = "flex";

    // Build trigger buttons
    let triggersHTML = "";
    tabs.forEach((tab, i) => {
      const isActive = i === activeIdx;
      triggersHTML += `<button
        type="button"
        role="tab"
        data-slot="tabs-trigger"
        data-tab-index="${i}"
        ${isActive ? 'data-active=""' : ""}
        aria-selected="${isActive}"
        class="${tabsTriggerClasses}"
        style="border-color:transparent"
      >${tab.label}</button>`;
    });

    // Build content panel placeholders
    let panelsHTML = "";
    tabs.forEach((_, i) => {
      const isActive = i === activeIdx;
      panelsHTML += `<div
        data-slot="tabs-content"
        data-tab-index="${i}"
        role="tabpanel"
        class="${tabsContentClasses}"
        style="${isActive ? "" : "display:none"}"
      ></div>`;
    });

    this.innerHTML = `
      <div data-slot="tabs-list" data-variant="default" role="tablist" class="${tabsListClasses}">
        ${triggersHTML}
      </div>
      ${panelsHTML}
    `;

    // Move fragment content into panels
    tabs.forEach((tab, i) => {
      const panel = this.querySelector(
        `[data-slot="tabs-content"][data-tab-index="${i}"]`,
      )!;
      panel.appendChild(tab.fragment);
    });

    // Click interaction
    this.querySelectorAll<HTMLButtonElement>(
      "[data-slot='tabs-trigger']",
    ).forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-tab-index");

        // Update triggers
        this.querySelectorAll<HTMLButtonElement>(
          "[data-slot='tabs-trigger']",
        ).forEach((t) => {
          t.removeAttribute("data-active");
          t.setAttribute("aria-selected", "false");
        });
        btn.setAttribute("data-active", "");
        btn.setAttribute("aria-selected", "true");

        // Update panels
        this.querySelectorAll<HTMLElement>(
          "[data-slot='tabs-content']",
        ).forEach((p) => {
          p.style.display =
            p.getAttribute("data-tab-index") === idx ? "" : "none";
        });
      });
    });
  }
}

define("bp-tab", BpTab);
define("bp-tabs", BpTabs);
