import { define, attr, html, cn } from "./bp-core";

/**
 * bp-breadcrumb — Breadcrumb navigation.
 *
 * Tailwind classes extracted from .shadcn/ui/breadcrumb.tsx
 *
 * Usage:
 *   <bp-breadcrumb>
 *     <bp-breadcrumb-item href="/">Home</bp-breadcrumb-item>
 *     <bp-breadcrumb-item href="/products">Products</bp-breadcrumb-item>
 *     <bp-breadcrumb-item>Current Page</bp-breadcrumb-item>
 *   </bp-breadcrumb>
 */

// From BreadcrumbList: cn("flex flex-wrap items-center gap-1.5 text-xs/relaxed wrap-break-word text-muted-foreground", ...)
const breadcrumbListClasses =
  "flex flex-wrap items-center gap-1.5 text-xs/relaxed wrap-break-word text-muted-foreground";

// From BreadcrumbItem: cn("inline-flex items-center gap-1", ...)
const breadcrumbItemClasses = "inline-flex items-center gap-1";

// From BreadcrumbLink: cn("transition-colors hover:text-foreground", ...)
const breadcrumbLinkClasses = "transition-colors hover:text-foreground";

// From BreadcrumbPage: cn("font-normal text-foreground", ...)
const breadcrumbPageClasses = "font-normal text-foreground";

// From BreadcrumbSeparator: cn("[&>svg]:size-3.5", ...)
const breadcrumbSeparatorClasses = "[&>svg]:size-3.5";

// ChevronRight SVG (from lucide-react ChevronRightIcon)
const chevronRightSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;

class BpBreadcrumbItem extends HTMLElement {
  // Parsed by parent bp-breadcrumb; no-op standalone
}

class BpBreadcrumb extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);

    // Parse child bp-breadcrumb-item elements
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-breadcrumb-item");

    let listHTML = "";
    items.forEach((item, i) => {
      const href = item.getAttribute("href");
      const text = item.textContent?.trim() || "";
      const isLast = i === items.length - 1;

      // Build item content — link or page
      let contentHTML: string;
      if (isLast || !href) {
        // BreadcrumbPage: current page (no link)
        contentHTML = `<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" class="${breadcrumbPageClasses}">${text}</span>`;
      } else {
        // BreadcrumbLink
        contentHTML = `<a data-slot="breadcrumb-link" href="${href}" class="${breadcrumbLinkClasses}">${text}</a>`;
      }

      // BreadcrumbItem wrapper
      listHTML += `<li data-slot="breadcrumb-item" class="${breadcrumbItemClasses}">${contentHTML}</li>`;

      // BreadcrumbSeparator (not after the last item)
      if (!isLast) {
        listHTML += `<li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" class="${breadcrumbSeparatorClasses}">${chevronRightSVG}</li>`;
      }
    });

    this.innerHTML = `
      <nav aria-label="breadcrumb" data-slot="breadcrumb">
        <ol data-slot="breadcrumb-list" class="${breadcrumbListClasses}">
          ${listHTML}
        </ol>
      </nav>
    `;
  }
}

define("bp-breadcrumb-item", BpBreadcrumbItem);
define("bp-breadcrumb", BpBreadcrumb);
