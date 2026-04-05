import { define, attr, cn } from "./bp-core";

/**
 * <bp-avatar src="" fallback="" size="sm|md|lg">
 *
 * Classes extracted from .shadcn/ui/avatar.tsx
 */

class BpAvatar extends HTMLElement {
  connectedCallback() {
    const src = attr(this, "src");
    const fallback = attr(this, "fallback");
    const size = attr(this, "size", "default") as "sm" | "default" | "lg";

    // Avatar root: "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten"
    const rootClasses = "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten";

    // AvatarImage: "aspect-square size-full rounded-full object-cover"
    const imageClasses = "aspect-square size-full rounded-full object-cover";

    // AvatarFallback: "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs"
    const fallbackClasses = "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs";

    this.setAttribute("data-slot", "avatar");
    this.setAttribute("data-size", size);
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "flex";

    const imageHtml = src
      ? `<img data-slot="avatar-image" class="${imageClasses}" src="${src}" alt="${fallback || ""}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`
      : "";

    const fallbackHtml = `<span data-slot="avatar-fallback" class="${fallbackClasses}" ${src ? 'style="display:none"' : ""}>${fallback || ""}</span>`;

    this.innerHTML = `${imageHtml}${fallbackHtml}`;
  }
}

define("bp-avatar", BpAvatar);
