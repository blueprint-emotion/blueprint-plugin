import { define, attr, boolAttr, html, cn } from "./bp-core";

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
const tabsRootClasses =
  "group/tabs flex gap-2 data-horizontal:flex-col";

// From TabsList (default variant): cn(tabsListVariants({ variant }), ...)
// tabsListVariants base: "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none"
// tabsListVariants default variant: "bg-muted"
const tabsListClasses =
  "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none bg-muted";

// From TabsTrigger: cn(...)
const tabsTriggerBase =
  "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-[calc(--spacing(1.25))] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";

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
    const originalHTML = html(this);

    // Parse child bp-tab elements
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const tabs = temp.querySelectorAll("bp-tab");

    // Determine active index
    let activeIdx = 0;
    tabs.forEach((tab, i) => {
      if (tab.hasAttribute("active") && tab.getAttribute("active") !== "false") {
        activeIdx = i;
      }
    });

    // Build trigger buttons
    let triggersHTML = "";
    tabs.forEach((tab, i) => {
      const label = tab.getAttribute("label") || `Tab ${i + 1}`;
      const isActive = i === activeIdx;
      triggersHTML += `<button
        type="button"
        role="tab"
        data-slot="tabs-trigger"
        data-tab-index="${i}"
        ${isActive ? 'data-active=""' : ""}
        aria-selected="${isActive}"
        class="${tabsTriggerClasses}"
      >${label}</button>`;
    });

    // Build content panels
    let panelsHTML = "";
    tabs.forEach((tab, i) => {
      const isActive = i === activeIdx;
      panelsHTML += `<div
        data-slot="tabs-content"
        data-tab-index="${i}"
        role="tabpanel"
        class="${tabsContentClasses}"
        style="${isActive ? "" : "display:none"}"
      >${tab.innerHTML}</div>`;
    });

    this.innerHTML = `
      <div data-slot="tabs" data-orientation="horizontal" class="${tabsRootClasses}">
        <div data-slot="tabs-list" data-variant="default" role="tablist" class="${tabsListClasses}">
          ${triggersHTML}
        </div>
        ${panelsHTML}
      </div>
    `;

    // Click interaction
    this.querySelectorAll<HTMLButtonElement>("[data-slot='tabs-trigger']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-tab-index");

        // Update triggers
        this.querySelectorAll<HTMLButtonElement>("[data-slot='tabs-trigger']").forEach((t) => {
          t.removeAttribute("data-active");
          t.setAttribute("aria-selected", "false");
        });
        btn.setAttribute("data-active", "");
        btn.setAttribute("aria-selected", "true");

        // Update panels
        this.querySelectorAll<HTMLElement>("[data-slot='tabs-content']").forEach((p) => {
          p.style.display = p.getAttribute("data-tab-index") === idx ? "" : "none";
        });
      });
    });
  }
}

define("bp-tab", BpTab);
define("bp-tabs", BpTabs);
