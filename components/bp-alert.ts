import { define, attr, cn } from "./bp-core";

// alertVariants from shadcn alert.tsx — base + variant classes
const base = "group/alert relative grid w-full gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5";

const variants: Record<string, string> = {
  default: "bg-card text-card-foreground",
  destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
};

// AlertTitle classes from shadcn
const titleClasses = "font-heading font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground";

// AlertDescription classes from shadcn
const descriptionClasses = "text-xs/relaxed text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";

class BpAlert extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const variant = attr(this, "variant", "default");

    const variantClasses = variants[variant] || variants.default;

    this.innerHTML = `
      <div data-slot="alert" role="alert" class="${cn(base, variantClasses)}">
        ${title ? `<div data-slot="alert-title" class="${titleClasses}">${title}</div>` : ""}
        ${description ? `<div data-slot="alert-description" class="${descriptionClasses}">${description}</div>` : ""}
      </div>`;
  }
}

define("bp-alert", BpAlert);
