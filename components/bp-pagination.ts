import { define, attr, cn } from "./bp-core";

/**
 * bp-pagination — Page navigation with previous/next and numbered pages.
 *
 * Tailwind classes extracted from .shadcn/ui/pagination.tsx and .shadcn/ui/button.tsx
 *
 * Usage:
 *   <bp-pagination total="10" current="1" siblings="1"></bp-pagination>
 */

// From Pagination: cn("mx-auto flex w-full justify-center", ...)
const paginationClasses = "mx-auto flex w-full justify-center";

// From PaginationContent: cn("flex items-center gap-0.5", ...)
const paginationContentClasses = "flex items-center gap-0.5";

// Button base from .shadcn/ui/button.tsx buttonVariants base (without border-transparent — applied via inline style)
const buttonBase =
  "inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

// Button variant=ghost from .shadcn/ui/button.tsx
const buttonGhost =
  "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50";

// Button variant=outline from .shadcn/ui/button.tsx
const buttonOutline =
  "border-border hover:bg-input/50 hover:text-foreground dark:bg-input/30";

// Button size=icon from .shadcn/ui/button.tsx
const buttonSizeIcon = "size-7 [&_svg:not([class*='size-'])]:size-3.5";

// Button size=default from .shadcn/ui/button.tsx
const buttonSizeDefault =
  "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5";

// PaginationPrevious: cn("pl-2!", ...) with size="default"
const paginationPrevClasses = cn(buttonBase, buttonGhost, buttonSizeDefault, "pl-2!");

// PaginationNext: cn("pr-2!", ...) with size="default"
const paginationNextClasses = cn(buttonBase, buttonGhost, buttonSizeDefault, "pr-2!");

// PaginationLink active (variant=outline, size=icon) — outline has its own border-border so no transparent needed
const paginationLinkActive = cn(buttonBase, buttonOutline, buttonSizeIcon);

// PaginationLink inactive (variant=ghost, size=icon)
const paginationLinkInactive = cn(buttonBase, buttonGhost, buttonSizeIcon);

// PaginationEllipsis: cn("flex size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5", ...)
const paginationEllipsisClasses =
  "flex size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5";

// Lucide SVGs
const chevronLeftSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-icon="inline-start"><path d="m15 18-6-6 6-6"/></svg>`;
const chevronRightSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-icon="inline-end"><path d="m9 18 6-6-6-6"/></svg>`;
const moreHorizontalSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;

function buildPageRange(total: number, current: number, siblings: number): (number | "ellipsis")[] {
  const pages: (number | "ellipsis")[] = [];
  const left = Math.max(1, current - siblings);
  const right = Math.min(total, current + siblings);

  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("ellipsis");
  }

  for (let i = left; i <= right; i++) {
    pages.push(i);
  }

  if (right < total) {
    if (right < total - 1) pages.push("ellipsis");
    pages.push(total);
  }

  return pages;
}

class BpPagination extends HTMLElement {
  connectedCallback() {
    const total = parseInt(attr(this, "total", "1"), 10);
    const current = parseInt(attr(this, "current", "1"), 10);
    const siblings = parseInt(attr(this, "siblings", "1"), 10);

    // Apply data-slot and classes directly on the custom element (shadcn Pagination is a <nav>)
    this.setAttribute("data-slot", "pagination");
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "pagination");
    this.classList.add(...paginationClasses.split(" "));

    this.render(total, current, siblings);
  }

  private render(total: number, current: number, siblings: number) {
    const pages = buildPageRange(total, current, siblings);

    // Previous button — from PaginationPrevious (ghost variant, needs border-color:transparent)
    const prevDisabled = current <= 1;
    const prevHTML = `<li data-slot="pagination-item">
      <a aria-label="Go to previous page" data-slot="pagination-link" data-page="${current - 1}" class="${paginationPrevClasses}" style="border-color:transparent" ${prevDisabled ? 'aria-disabled="true" style="border-color:transparent;pointer-events:none;opacity:0.5"' : ""}>
        ${chevronLeftSVG}<span class="hidden sm:block">Previous</span>
      </a>
    </li>`;

    // Page items
    let pagesHTML = "";
    pages.forEach((p) => {
      if (p === "ellipsis") {
        pagesHTML += `<li data-slot="pagination-item">
          <span aria-hidden data-slot="pagination-ellipsis" class="${paginationEllipsisClasses}">
            ${moreHorizontalSVG}<span class="sr-only">More pages</span>
          </span>
        </li>`;
      } else {
        const isActive = p === current;
        // Active uses outline variant (has border-border in class, no transparent needed)
        // Inactive uses ghost variant (needs border-color:transparent)
        const styleAttr = isActive ? "" : ' style="border-color:transparent"';
        pagesHTML += `<li data-slot="pagination-item">
          <a data-slot="pagination-link" data-page="${p}" data-active="${isActive}" ${isActive ? 'aria-current="page"' : ""} class="${isActive ? paginationLinkActive : paginationLinkInactive}"${styleAttr}>${p}</a>
        </li>`;
      }
    });

    // Next button — from PaginationNext (ghost variant, needs border-color:transparent)
    const nextDisabled = current >= total;
    const nextHTML = `<li data-slot="pagination-item">
      <a aria-label="Go to next page" data-slot="pagination-link" data-page="${current + 1}" class="${paginationNextClasses}" style="border-color:transparent" ${nextDisabled ? 'aria-disabled="true" style="border-color:transparent;pointer-events:none;opacity:0.5"' : ""}>
        <span class="hidden sm:block">Next</span>${chevronRightSVG}
      </a>
    </li>`;

    this.innerHTML = `
      <ul data-slot="pagination-content" class="${paginationContentClasses}">
        ${prevHTML}${pagesHTML}${nextHTML}
      </ul>
    `;

    // Click interaction
    this.querySelectorAll<HTMLAnchorElement>("a[data-slot='pagination-link']").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = parseInt(link.getAttribute("data-page") || "1", 10);
        if (page < 1 || page > total) return;
        this.setAttribute("current", String(page));
        this.render(total, page, siblings);
        this.dispatchEvent(new CustomEvent("page-change", { detail: { page }, bubbles: true }));
      });
    });
  }
}

define("bp-pagination", BpPagination);
