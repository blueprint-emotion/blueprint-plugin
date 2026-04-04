import { define, html } from "./bp-core";

interface BpElement {
  id: string;
  type: string;
  label: string;
  description: string;
}

interface BpFeature {
  featureId: string;
  label: string;
  elements?: BpElement[];
  features?: BpFeature[];
}

interface BlueprintMeta {
  version?: string;
  screenId?: string;
  title?: string;
  viewport?: string;
  purpose?: string;
  features?: BpFeature[];
}

function collectElements(
  features: BpFeature[],
  result: { featureLabel: string; el: BpElement }[] = [],
): { featureLabel: string; el: BpElement }[] {
  for (const f of features) {
    if (f.elements) {
      for (const el of f.elements) {
        result.push({ featureLabel: f.label, el });
      }
    }
    if (f.features) {
      collectElements(f.features, result);
    }
  }
  return result;
}

class BpPage extends HTMLElement {
  connectedCallback() {
    const body = html(this);

    const metaScript = document.getElementById("blueprint-meta");
    let meta: BlueprintMeta = {};
    if (metaScript) {
      try {
        meta = JSON.parse(metaScript.textContent || "{}");
      } catch {
        /* ignore parse errors */
      }
    }

    /* ── Left-top: metadata grid ── */
    const fields: [string, string | undefined][] = [
      ["version", meta.version],
      ["screenId", meta.screenId],
      ["title", meta.title],
      ["viewport", meta.viewport],
      ["purpose", meta.purpose],
    ];

    const metaRows = fields
      .filter(([, v]) => v)
      .map(
        ([k, v]) =>
          `<div class="text-muted-foreground text-[0.6875rem]">${k}</div>
           <div class="text-foreground text-xs font-medium">${v}</div>`,
      )
      .join("");

    const metaGridHtml = metaRows
      ? `<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-4 py-3 rounded-lg bg-muted/40 ring-1 ring-foreground/5">${metaRows}</div>`
      : "";

    /* ── Right panel: description list ── */
    const allElements = meta.features
      ? collectElements(meta.features)
      : [];

    let descListHtml = "";
    if (allElements.length > 0) {
      const items = allElements
        .map(
          ({ el }, i) =>
            `<li class="text-xs leading-relaxed">
              <span class="text-muted-foreground">${i + 1}.</span>
              <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">${el.type}</span>
              <span class="font-medium text-foreground">${el.label}</span>
              <span class="text-muted-foreground">&mdash; ${el.description}</span>
            </li>`,
        )
        .join("");

      descListHtml = `
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold text-foreground">요소 목록</div>
          <ol class="flex flex-col gap-1.5 list-none p-0 m-0">${items}</ol>
        </div>`;
    }

    this.innerHTML = `
      <div data-slot="bp-page" class="flex min-h-screen bg-background text-foreground">
        <div class="flex flex-1 flex-col gap-6 p-6 overflow-auto">
          ${metaGridHtml}
          <div data-slot="bp-page-content">${body}</div>
        </div>
        ${
          descListHtml
            ? `<aside data-slot="bp-page-aside" class="w-80 shrink-0 border-l border-border bg-card p-5 overflow-y-auto">${descListHtml}</aside>`
            : ""
        }
      </div>`;
  }
}

define("bp-page", BpPage);
