import { define, attr, cn } from "./bp-core";

/**
 * <bp-skeleton width="" height="">
 *
 * Classes extracted from .shadcn/ui/skeleton.tsx
 */

class BpSkeleton extends HTMLElement {
  connectedCallback() {
    const width = attr(this, "width");
    const height = attr(this, "height");

    // Skeleton: "animate-pulse rounded-md bg-muted"
    const baseClasses = "animate-pulse rounded-md bg-muted";

    this.setAttribute("data-slot", "skeleton");
    this.classList.add(...baseClasses.split(" "));
    this.style.display = "block";
    if (width) this.style.width = width;
    if (height) this.style.height = height;
  }
}

define("bp-skeleton", BpSkeleton);
