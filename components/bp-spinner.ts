import { define } from "./bp-core";

/**
 * <bp-spinner>
 *
 * Classes extracted from .shadcn/ui/spinner.tsx
 * Uses an inline SVG replica of Loader2Icon (lucide) since we cannot import lucide in a web component.
 */

class BpSpinner extends HTMLElement {
  connectedCallback() {
    // Loader2 SVG from lucide-react
    this.innerHTML = `<svg
      role="status"
      aria-label="Loading"
      class="size-4 animate-spin"
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
