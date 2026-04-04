import { define, attr, html, cn } from "./bp-core";

/**
 * bp-button-group — Groups bp-button children with merged borders.
 *
 * Tailwind classes extracted from .shadcn/ui/button-group.tsx
 *
 * Usage:
 *   <bp-button-group orientation="horizontal">
 *     <bp-button label="Left"></bp-button>
 *     <bp-button label="Center"></bp-button>
 *     <bp-button label="Right"></bp-button>
 *   </bp-button-group>
 *
 *   <bp-button-group orientation="vertical">
 *     <bp-button label="Top"></bp-button>
 *     <bp-button label="Bottom"></bp-button>
 *   </bp-button-group>
 */

// From buttonGroupVariants base:
// "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1"
const buttonGroupBase =
  "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1";

// From buttonGroupVariants orientation.horizontal:
// "*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0"
const orientations: Record<string, string> = {
  horizontal:
    "*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
  // From buttonGroupVariants orientation.vertical:
  // "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0"
  vertical:
    "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
};

class BpButtonGroup extends HTMLElement {
  connectedCallback() {
    const orientation = attr(this, "orientation", "horizontal");
    const children = html(this);

    const classes = cn(
      buttonGroupBase,
      orientations[orientation] || orientations.horizontal,
    );

    this.innerHTML = `<div
      role="group"
      data-slot="button-group"
      data-orientation="${orientation}"
      class="${classes}"
    >${children}</div>`;
  }
}

define("bp-button-group", BpButtonGroup);
