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
    // Simplified for web-component context (no group-data):
    const classes = "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto";
    this.setAttribute("data-slot", "sidebar-content");
    this.classList.add(...classes.split(" "));
  }
}

/* ── bp-sidebar-main ── */
class BpSidebarMain extends HTMLElement {
  connectedCallback() {
    // SidebarInset: "relative flex w-full flex-1 flex-col bg-background"
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

    // SidebarProvider wrapper: "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar"
    const wrapperClasses = "group/sidebar-wrapper flex min-h-svh w-full";

    // Sidebar outer: "group peer hidden text-sidebar-foreground md:block"
    const outerClasses = "group peer text-sidebar-foreground";

    // Sidebar gap: "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear"
    const gapClasses = "relative bg-transparent transition-[width] duration-200 ease-linear";

    // Sidebar container: core fixed classes from the source
    const containerBase = cn(
      "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
      side === "left"
        ? "left-0 border-r"
        : "right-0 border-l"
    );

    // Sidebar inner: "flex size-full flex-col bg-sidebar"
    const innerClasses = "flex size-full flex-col bg-sidebar";

    const content = this.innerHTML;
    // Separate children
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    let sidebarContentHtml = "";
    let mainContentHtml = "";
    const children = Array.from(tempDiv.children);

    for (const child of children) {
      if (child.tagName.toLowerCase() === "bp-sidebar-content") {
        sidebarContentHtml = child.outerHTML;
      } else if (child.tagName.toLowerCase() === "bp-sidebar-main") {
        mainContentHtml = child.outerHTML;
      }
    }

    // If no explicit children found, put everything in sidebar content
    if (!sidebarContentHtml && !mainContentHtml) {
      sidebarContentHtml = content;
    }

    this.style.setProperty("--sidebar-width", width);
    this.setAttribute("data-slot", "sidebar-wrapper");
    this.setAttribute("data-side", side);

    this.innerHTML = `
      <div class="${wrapperClasses}" style="--sidebar-width: ${width}">
        <div class="${outerClasses}" data-slot="sidebar" data-side="${side}" data-state="expanded">
          <div data-slot="sidebar-gap" class="${gapClasses}" style="width: var(--sidebar-width)"></div>
          <div data-slot="sidebar-container" data-side="${side}" class="${containerBase}" style="width: var(--sidebar-width)">
            <div data-sidebar="sidebar" data-slot="sidebar-inner" class="${innerClasses}">
              ${sidebarContentHtml}
            </div>
          </div>
        </div>
        ${mainContentHtml}
      </div>`;
  }
}

define("bp-sidebar-content", BpSidebarContent);
define("bp-sidebar-main", BpSidebarMain);
define("bp-sidebar", BpSidebar);
