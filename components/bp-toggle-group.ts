import { define, attr, html, cn } from "./bp-core";

const groupBase =
  "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-[size=sm]:rounded-[min(var(--radius-md),8px)] data-vertical:flex-col data-vertical:items-stretch";

const itemBase =
  "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t";

const toggleBase =
  "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-xs font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const toggleVariants: Record<string, string> = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent hover:bg-muted",
};

const toggleSizes: Record<string, string> = {
  default:
    "h-7 min-w-7 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
  sm: "h-6 min-w-6 rounded-[min(var(--radius-md),8px)] px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  lg: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
};

class BpToggleGroup extends HTMLElement {
  connectedCallback() {
    const type = attr(this, "type", "single") as "single" | "multiple";
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const spacing = attr(this, "spacing", "0");
    const orientation = attr(this, "orientation", "horizontal") as
      | "horizontal"
      | "vertical";
    const body = html(this);

    this.innerHTML = `<div
      data-slot="toggle-group"
      data-variant="${variant}"
      data-size="${size}"
      data-spacing="${spacing}"
      data-orientation="${orientation}"
      role="group"
      style="--gap: ${spacing}"
      class="${cn(groupBase)}"
    >${body}</div>`;

    // Apply group context to child bp-toggle items
    this.querySelectorAll(":scope > [data-slot=toggle], :scope bp-toggle").forEach(
      (child) => {
        const btn = child.querySelector("[data-slot=toggle]") || child;
        btn.setAttribute("data-slot", "toggle-group-item");
        btn.setAttribute("data-variant", variant);
        btn.setAttribute("data-size", size);
        btn.setAttribute("data-spacing", spacing);

        // Merge item classes with group context
        const existing = btn.getAttribute("class") || "";
        if (!existing.includes("shrink-0")) {
          btn.setAttribute(
            "class",
            cn(
              itemBase,
              toggleBase,
              toggleVariants[variant] || toggleVariants.default,
              toggleSizes[size] || toggleSizes.default
            )
          );
        }
      }
    );

    // Handle single-select behavior
    if (type === "single") {
      this.addEventListener("click", (e) => {
        const target = (e.target as HTMLElement).closest(
          "[data-slot=toggle-group-item]"
        );
        if (!target) return;

        this.querySelectorAll("[data-slot=toggle-group-item]").forEach(
          (item) => {
            if (item !== target) {
              item.setAttribute("aria-pressed", "false");
              item.setAttribute("data-state", "off");
            }
          }
        );

        const isPressed = target.getAttribute("aria-pressed") === "true";
        target.setAttribute("aria-pressed", String(!isPressed));
        target.setAttribute("data-state", !isPressed ? "on" : "off");
      });
    } else {
      this.addEventListener("click", (e) => {
        const target = (e.target as HTMLElement).closest(
          "[data-slot=toggle-group-item]"
        );
        if (!target) return;

        const isPressed = target.getAttribute("aria-pressed") === "true";
        target.setAttribute("aria-pressed", String(!isPressed));
        target.setAttribute("data-state", !isPressed ? "on" : "off");
      });
    }
  }
}

define("bp-toggle-group", BpToggleGroup);
