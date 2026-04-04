import { define, attr, cn } from "./bp-core";

/**
 * <bp-avatar src="" fallback="" size="sm|md|lg">
 *
 * Classes extracted from .shadcn/ui/avatar.tsx
 */

const sizes: Record<string, string> = {
  sm: "data-[size=sm]:size-6",
  md: "",
  lg: "data-[size=lg]:size-10",
};

class BpAvatar extends HTMLElement {
  connectedCallback() {
    const src = attr(this, "src");
    const fallback = attr(this, "fallback");
    const size = attr(this, "size", "md") as "sm" | "md" | "lg";

    // Avatar root: "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten"
    const rootClasses = "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten";

    // AvatarImage: "aspect-square size-full rounded-full object-cover"
    const imageClasses = "aspect-square size-full rounded-full object-cover";

    // AvatarFallback: "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs"
    const fallbackClasses = "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs";

    const sizeAttr = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";

    const imageHtml = src
      ? `<img data-slot="avatar-image" class="${imageClasses}" src="${src}" alt="${fallback || ""}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />`
      : "";

    const fallbackHtml = `<span data-slot="avatar-fallback" class="${fallbackClasses}" ${src ? 'style="display:none"' : ""}>${fallback || ""}</span>`;

    this.innerHTML = `<span data-slot="avatar" data-size="${sizeAttr}" class="${rootClasses}">${imageHtml}${fallbackHtml}</span>`;
  }
}

define("bp-avatar", BpAvatar);
