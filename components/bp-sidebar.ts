import { define, attr, cn } from "./bp-core";

/**
 * <bp-sidebar width="280px" side="left|right">
 *   <bp-sidebar-content>...</bp-sidebar-content>
 *   <bp-sidebar-main>...</bp-sidebar-main>
 * </bp-sidebar>
 *
 * Classes extracted from .shadcn/ui/sidebar.tsx
 */

/* ── bp-sidebar-content ── */
class BpSidebarContent extends HTMLElement {
  connectedCallback() {
    // SidebarContent: "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden"
    const classes = "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden";
    this.setAttribute("data-slot", "sidebar-content");
    this.setAttribute("data-sidebar", "content");
    this.classList.add(...classes.split(" "));
  }
}

/* ── bp-sidebar-main ── */
class BpSidebarMain extends HTMLElement {
  connectedCallback() {
    // SidebarInset: "relative flex w-full flex-1 flex-col bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2"
    const classes = "relative flex w-full flex-1 flex-col bg-background";
    this.setAttribute("data-slot", "sidebar-inset");
    this.classList.add(...classes.split(" "));
  }
}

/* ── bp-sidebar ── */
class BpSidebar extends HTMLElement {
  connectedCallback() {
    const width = attr(this, "width", "16rem");
    const side = attr(this, "side", "left") as "left" | "right";

    // Capture children into fragment
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);

    // Separate sidebar-content and sidebar-main children from fragment
    const tempHolder = document.createElement("div");
    tempHolder.appendChild(fragment);

    let sidebarContentEl: Element | null = null;
    let mainContentEl: Element | null = null;
    const otherChildren: Node[] = [];

    for (const child of Array.from(tempHolder.childNodes)) {
      if (child instanceof Element) {
        if (child.tagName.toLowerCase() === "bp-sidebar-content") {
          sidebarContentEl = child;
        } else if (child.tagName.toLowerCase() === "bp-sidebar-main") {
          mainContentEl = child;
        } else {
          otherChildren.push(child);
        }
      } else {
        otherChildren.push(child);
      }
    }

    // SidebarProvider wrapper: "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar"
    const wrapperClasses = "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar";

    // Sidebar outer: "group peer hidden text-sidebar-foreground md:block"
    const outerClasses = "group peer text-sidebar-foreground";

    // Sidebar gap: "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear"
    const gapClasses = "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear";

    // Sidebar container: core fixed classes from shadcn
    const containerBase = cn(
      "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=right]:right-0 md:flex",
      side === "left"
        ? "border-r"
        : "border-l"
    );

    // Sidebar inner: "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border"
    const innerClasses = "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border";

    // Fix 1: Apply data-slot and classes directly on the custom element
    this.setAttribute("data-slot", "sidebar-wrapper");
    this.setAttribute("data-side", side);
    this.classList.add(...wrapperClasses.split(" "));
    this.style.setProperty("--sidebar-width", width);
    this.style.display = "flex";

    this.innerHTML = `
        <div class="${outerClasses}" data-slot="sidebar" data-side="${side}" data-state="expanded">
          <div data-slot="sidebar-gap" class="${gapClasses}"></div>
          <div data-slot="sidebar-container" data-side="${side}" class="${containerBase}">
            <div data-sidebar="sidebar" data-slot="sidebar-inner" class="${innerClasses}">
              <div data-slot="sidebar-children"></div>
            </div>
          </div>
        </div>
        <div data-slot="sidebar-main-slot"></div>`;

    // Place sidebar content
    const sidebarSlot = this.querySelector('[data-slot="sidebar-children"]')!;
    if (sidebarContentEl) {
      sidebarSlot.appendChild(sidebarContentEl);
    } else if (!mainContentEl) {
      // If no explicit children found, put everything in sidebar content
      otherChildren.forEach((child) => sidebarSlot.appendChild(child));
    }

    // Place main content
    const mainSlot = this.querySelector('[data-slot="sidebar-main-slot"]')!;
    if (mainContentEl) {
      mainSlot.parentNode!.replaceChild(mainContentEl, mainSlot);
    } else {
      mainSlot.remove();
    }

    // Remove the temporary wrapper div
    const sidebarChildrenWrapper = this.querySelector('[data-slot="sidebar-children"]');
    if (sidebarChildrenWrapper) {
      while (sidebarChildrenWrapper.firstChild) {
        sidebarChildrenWrapper.parentNode!.insertBefore(sidebarChildrenWrapper.firstChild, sidebarChildrenWrapper);
      }
      sidebarChildrenWrapper.remove();
    }
  }
}

define("bp-sidebar-content", BpSidebarContent);
define("bp-sidebar-main", BpSidebarMain);
define("bp-sidebar", BpSidebar);
