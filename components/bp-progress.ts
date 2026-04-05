import { define, attr, cn } from "./bp-core";

class BpProgress extends HTMLElement {
  connectedCallback() {
    const value = Math.max(0, Math.min(100, Number(attr(this, "value", "0"))));
    const label = attr(this, "label");

    const rootClasses = "flex flex-wrap gap-3";
    const trackClasses = "relative flex h-1 w-full items-center overflow-x-hidden rounded-md bg-muted";
    const indicatorClasses = "h-full bg-primary transition-all";
    const labelClasses = "text-xs/relaxed font-medium";
    const valueClasses = "ml-auto text-xs/relaxed text-muted-foreground tabular-nums";

    this.setAttribute("data-slot", "progress");
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "flex";

    this.innerHTML =
      `${label ? `<span data-slot="progress-label" class="${labelClasses}">${label}</span>` : ""}<span data-slot="progress-value" class="${valueClasses}">${value}%</span><div data-slot="progress-track" class="${trackClasses}"><div data-slot="progress-indicator" class="${indicatorClasses}" style="width:${value}%"></div></div>`;
  }
}

define("bp-progress", BpProgress);
