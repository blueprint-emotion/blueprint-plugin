import { define, attr, boolAttr, html, cn } from "./bp-core";

/**
 * bp-nav-menu — Horizontal navigation menu.
 *
 * Tailwind classes extracted from .shadcn/ui/navigation-menu.tsx
 *
 * Usage:
 *   <bp-nav-menu>
 *     <bp-nav-item label="Home" href="/" active></bp-nav-item>
 *     <bp-nav-item label="About" href="/about"></bp-nav-item>
 *     <bp-nav-item label="Contact" href="/contact"></bp-nav-item>
 *   </bp-nav-menu>
 */

// From NavigationMenu root: cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", ...)
const navMenuClasses =
  "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center";

// From NavigationMenuList: cn("group flex flex-1 list-none items-center justify-center gap-0", ...)
const navMenuListClasses =
  "group flex flex-1 list-none items-center justify-center gap-0";

// From NavigationMenuItem: cn("relative", ...)
const navMenuItemClasses = "relative";

// From NavigationMenuLink: cn("flex items-center gap-1.5 rounded-lg p-2 text-xs/relaxed transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4", ...)
const navMenuLinkClasses =
  "flex items-center gap-1.5 rounded-lg p-2 text-xs/relaxed transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4";

class BpNavItem extends HTMLElement {
  // Parsed by parent bp-nav-menu; no-op standalone
}

class BpNavMenu extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);

    // Parse child bp-nav-item elements
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-nav-item");

    let itemsHTML = "";
    items.forEach((item) => {
      const label = item.getAttribute("label") || "";
      const href = item.getAttribute("href") || "#";
      const active = item.hasAttribute("active") && item.getAttribute("active") !== "false";

      itemsHTML += `
        <li data-slot="navigation-menu-item" class="${navMenuItemClasses}">
          <a
            data-slot="navigation-menu-link"
            href="${href}"
            data-active="${active}"
            class="${navMenuLinkClasses}"
          >${label}</a>
        </li>
      `;
    });

    this.innerHTML = `
      <nav data-slot="navigation-menu" class="${navMenuClasses}">
        <ul data-slot="navigation-menu-list" class="${navMenuListClasses}">
          ${itemsHTML}
        </ul>
      </nav>
    `;
  }
}

define("bp-nav-item", BpNavItem);
define("bp-nav-menu", BpNavMenu);
