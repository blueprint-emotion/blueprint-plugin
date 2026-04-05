import { define, attr } from "./bp-core";

class BpChart extends HTMLElement {
  connectedCallback() {
    const type = attr(this, "type", "bar");
    const title = attr(this, "title");
    const height = attr(this, "height", "200");

    // shadcn: ChartContainer
    const containerClasses = "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden";

    // shadcn: ChartTooltipContent wrapper
    const tooltipClasses = "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs/relaxed shadow-xl";

    // shadcn: ChartLegendContent
    const legendClasses = "flex items-center justify-center gap-4 pt-3";
    const legendDotClasses = "h-2 w-2 shrink-0 rounded-[2px]";

    let chartSvg = "";

    if (type === "bar") {
      chartSvg = `
        <svg viewBox="0 0 300 ${height}" class="w-full" style="height:${height}px">
          <line x1="40" y1="10" x2="40" y2="${Number(height) - 30}" stroke="currentColor" opacity="0.15" />
          <line x1="40" y1="${Number(height) - 30}" x2="290" y2="${Number(height) - 30}" stroke="currentColor" opacity="0.15" />
          <rect x="60"  y="${Number(height) - 130}" width="30" height="100" rx="2" fill="var(--color-primary, hsl(var(--primary)))" opacity="0.9" />
          <rect x="110" y="${Number(height) - 100}" width="30" height="70"  rx="2" fill="var(--color-primary, hsl(var(--primary)))" opacity="0.7" />
          <rect x="160" y="${Number(height) - 160}" width="30" height="130" rx="2" fill="var(--color-primary, hsl(var(--primary)))" opacity="0.9" />
          <rect x="210" y="${Number(height) - 80}"  width="30" height="50"  rx="2" fill="var(--color-primary, hsl(var(--primary)))" opacity="0.6" />
          <rect x="260" y="${Number(height) - 120}" width="30" height="90"  rx="2" fill="var(--color-primary, hsl(var(--primary)))" opacity="0.8" />
          <text x="75"  y="${Number(height) - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">A</text>
          <text x="125" y="${Number(height) - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">B</text>
          <text x="175" y="${Number(height) - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">C</text>
          <text x="225" y="${Number(height) - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">D</text>
          <text x="275" y="${Number(height) - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">E</text>
        </svg>`;
    } else if (type === "line") {
      const h = Number(height);
      chartSvg = `
        <svg viewBox="0 0 300 ${h}" class="w-full" style="height:${h}px">
          <line x1="40" y1="10" x2="40" y2="${h - 30}" stroke="currentColor" opacity="0.15" />
          <line x1="40" y1="${h - 30}" x2="290" y2="${h - 30}" stroke="currentColor" opacity="0.15" />
          <polyline fill="none" stroke="var(--color-primary, hsl(var(--primary)))" stroke-width="2"
            points="60,${h - 80} 110,${h - 130} 160,${h - 100} 210,${h - 150} 260,${h - 120}" />
          <circle cx="60"  cy="${h - 80}"  r="3" fill="var(--color-primary, hsl(var(--primary)))" />
          <circle cx="110" cy="${h - 130}" r="3" fill="var(--color-primary, hsl(var(--primary)))" />
          <circle cx="160" cy="${h - 100}" r="3" fill="var(--color-primary, hsl(var(--primary)))" />
          <circle cx="210" cy="${h - 150}" r="3" fill="var(--color-primary, hsl(var(--primary)))" />
          <circle cx="260" cy="${h - 120}" r="3" fill="var(--color-primary, hsl(var(--primary)))" />
          <text x="60"  y="${h - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">Jan</text>
          <text x="110" y="${h - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">Feb</text>
          <text x="160" y="${h - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">Mar</text>
          <text x="210" y="${h - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">Apr</text>
          <text x="260" y="${h - 15}" text-anchor="middle" fill="currentColor" opacity="0.5" font-size="10">May</text>
        </svg>`;
    } else if (type === "pie") {
      const cx = 150, cy = Number(height) / 2, r = Math.min(Number(height) / 2 - 20, 70);
      // Static pie wedges using stroke-dasharray
      const circumference = 2 * Math.PI * r;
      const slices = [
        { pct: 0.4, opacity: "0.9" },
        { pct: 0.25, opacity: "0.7" },
        { pct: 0.2, opacity: "0.5" },
        { pct: 0.15, opacity: "0.3" },
      ];
      let offset = 0;
      const pieSlices = slices.map((s) => {
        const dash = s.pct * circumference;
        const gap = circumference - dash;
        const svg = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--color-primary, hsl(var(--primary)))" stroke-width="${r}" opacity="${s.opacity}" stroke-dasharray="${dash} ${gap}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" />`;
        offset += dash;
        return svg;
      }).join("");
      chartSvg = `
        <svg viewBox="0 0 300 ${height}" class="w-full" style="height:${height}px">
          ${pieSlices}
        </svg>`;
    }

    // Legend items
    const legendItems = type === "pie"
      ? ["40%", "25%", "20%", "15%"].map((pct, i) =>
          `<div class="${legendClasses.replace("flex items-center justify-center gap-4 pt-3", "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}">
            <div class="${legendDotClasses}" style="background-color:var(--color-primary, hsl(var(--primary)));opacity:${[0.9, 0.7, 0.5, 0.3][i]}"></div>
            <span class="text-xs text-muted-foreground">${pct}</span>
          </div>`
        ).join("")
      : "";

    // Fix 1: Apply data-slot and classes directly on the custom element
    this.setAttribute("data-slot", "chart");
    this.classList.add(...containerClasses.split(" "));
    this.style.display = "flex";
    this.style.height = `${height}px`;

    this.innerHTML = `
        <div class="flex flex-col w-full gap-2">
          ${title ? `<div class="text-sm font-medium">${title}</div>` : ""}
          ${chartSvg}
          ${legendItems ? `<div class="${legendClasses}">${legendItems}</div>` : ""}
        </div>`;
  }
}

define("bp-chart", BpChart);
