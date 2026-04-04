import { define, attr, cn } from "./bp-core";

const trendColors: Record<string, string> = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground",
};

const trendIcons: Record<string, string> = {
  up: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  down: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  neutral: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`,
};

class BpStat extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label");
    const value = attr(this, "value");
    const description = attr(this, "description");
    const trend = attr(this, "trend", "neutral") as "up" | "down" | "neutral";
    const trendValue = attr(this, "trend-value");

    const trendColor = trendColors[trend] || trendColors.neutral;
    const trendIcon = trendIcons[trend] || trendIcons.neutral;

    const trendHtml = trendValue
      ? `<div class="${cn("flex items-center gap-0.5 text-xs font-medium", trendColor)}">
          ${trendIcon}
          <span>${trendValue}</span>
        </div>`
      : "";

    this.innerHTML = `
      <div data-slot="bp-stat" class="flex flex-col gap-1 rounded-lg bg-card p-4 ring-1 ring-foreground/10">
        ${label ? `<div class="text-[0.6875rem] font-medium text-muted-foreground">${label}</div>` : ""}
        <div class="flex items-end justify-between gap-2">
          ${value ? `<div class="text-2xl font-bold tracking-tight text-card-foreground">${value}</div>` : ""}
          ${trendHtml}
        </div>
        ${description ? `<div class="text-[0.6875rem] text-muted-foreground">${description}</div>` : ""}
      </div>`;
  }
}

define("bp-stat", BpStat);
