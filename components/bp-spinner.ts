import { define, attr, cn } from "./bp-core";

/**
 * <bp-spinner size="sm|md|lg">
 *
 * Classes extracted from .shadcn/ui/spinner.tsx
 * Uses an inline SVG replica of Loader2Icon (lucide) since we cannot import lucide in a web component.
 */

const sizes: Record<string, string> = {
  sm: "size-3",
  md: "size-4",
  lg: "size-6",
};

class BpSpinner extends HTMLElement {
  connectedCallback() {
    const size = attr(this, "size", "md");

    // Spinner: "size-4 animate-spin"
    const baseClasses = "animate-spin";
    const sizeClass = sizes[size] || sizes.md;

    // Loader2 SVG from lucide-react
    this.innerHTML = `<svg
      role="status"
      aria-label="Loading"
      class="${cn(baseClasses, sizeClass)}"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>`;
  }
}

define("bp-spinner", BpSpinner);
