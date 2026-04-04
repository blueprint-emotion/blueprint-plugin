import { define, attr, cn } from "./bp-core";

/**
 * <bp-skeleton width="" height="" variant="text|circular|rectangular">
 *
 * Classes extracted from .shadcn/ui/skeleton.tsx
 */

const variantClasses: Record<string, string> = {
  text: "rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-none",
};

class BpSkeleton extends HTMLElement {
  connectedCallback() {
    const width = attr(this, "width");
    const height = attr(this, "height");
    const variant = attr(this, "variant", "text");

    // Skeleton: "animate-pulse rounded-md bg-muted"
    const baseClasses = "animate-pulse bg-muted";
    const shape = variantClasses[variant] || variantClasses.text;

    const style = [
      width ? `width:${width}` : "",
      height ? `height:${height}` : "",
    ]
      .filter(Boolean)
      .join(";");

    this.innerHTML = `<div data-slot="skeleton" class="${cn(baseClasses, shape)}"${style ? ` style="${style}"` : ""}></div>`;
  }
}

define("bp-skeleton", BpSkeleton);
