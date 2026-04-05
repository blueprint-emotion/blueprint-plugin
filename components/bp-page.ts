import { define, esc, boolAttr } from "./bp-core";

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

function buildMetaBar(meta: BlueprintMeta): string {
  const fields: [string, string | undefined][] = [
    ["version", meta.version],
    ["screenId", meta.screenId],
    ["title", meta.title],
    ["viewport", meta.viewport],
    ["purpose", meta.purpose],
  ];

  const metaItems = fields
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<span class="text-muted-foreground text-[0.625rem]">${k}</span> <span class="text-foreground text-xs font-medium">${v}</span>`,
    )
    .join(`<span class="text-border">·</span>`);

  return metaItems
    ? `<div class="sticky top-0 z-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2 border-b border-border bg-background">${metaItems}</div>`
    : "";
}

function buildAside(meta: BlueprintMeta): string {
  const allElements = meta.features ? collectElements(meta.features) : [];
  if (allElements.length === 0) return "";

  const items = allElements
    .map(
      ({ el }, i) =>
        `<li data-target-el="${esc(el.id)}" class="flex flex-col gap-1.5 rounded-lg border border-border bg-background px-3 py-2.5 cursor-default transition-all hover:border-primary/40 hover:ring-1 hover:ring-primary/20">
          <div class="flex items-center gap-1.5">
            <span class="flex items-center justify-center size-4 rounded-full bg-muted text-[0.5625rem] font-medium text-muted-foreground">${i + 1}</span>
            <span class="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.5625rem] font-medium text-primary">${esc(el.type)}</span>
            <span class="font-semibold text-foreground text-xs">${esc(el.label)}</span>
          </div>
          <div class="text-[0.6875rem] leading-relaxed text-muted-foreground whitespace-pre-line pl-[1.375rem]">${esc(el.description)}</div>
        </li>`,
    )
    .join("");

  return `
    <aside data-slot="bp-page-aside" class="sticky top-0 h-screen w-80 shrink-0 border-l border-border bg-muted/30 overflow-y-auto">
      <ol class="flex flex-col gap-2 list-none p-3 m-0">${items}</ol>
    </aside>`;
}

function bindHoverHighlight(content: Element, aside: Element) {
  aside.addEventListener("mouseover", (e: Event) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("[data-target-el]");
    if (!li) return;
    const target = content.querySelector<HTMLElement>(`[data-el="${li.dataset.targetEl}"]`);
    if (target) target.setAttribute("data-highlight", "");
  });
  aside.addEventListener("mouseout", (e: Event) => {
    const li = (e.target as HTMLElement).closest<HTMLElement>("[data-target-el]");
    if (!li) return;
    const target = content.querySelector<HTMLElement>(`[data-el="${li.dataset.targetEl}"]`);
    if (target) target.removeAttribute("data-highlight");
  });
  content.addEventListener("mouseover", (e: Event) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-el]");
    if (!el) return;
    el.setAttribute("data-highlight", "");
    const li = aside.querySelector<HTMLElement>(`[data-target-el="${el.dataset.el}"]`);
    if (li) { li.classList.add("border-primary/40", "ring-1", "ring-primary/20"); }
  });
  content.addEventListener("mouseout", (e: Event) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-el]");
    if (!el) return;
    el.removeAttribute("data-highlight");
    const li = aside.querySelector<HTMLElement>(`[data-target-el="${el.dataset.el}"]`);
    if (li) { li.classList.remove("border-primary/40", "ring-1", "ring-primary/20"); }
  });
}

class BpPage extends HTMLElement {
  connectedCallback() {
    const showDescription = boolAttr(this, "description");

    const fragment = document.createDocumentFragment();
    while (this.firstChild) {
      fragment.appendChild(this.firstChild);
    }

    const metaScript = document.getElementById("blueprint-meta");
    let meta: BlueprintMeta = {};
    if (metaScript) {
      try {
        meta = JSON.parse(metaScript.textContent || "{}");
      } catch {
        /* ignore */
      }
    }

    const metaBarHtml = buildMetaBar(meta);
    const asideHtml = showDescription ? buildAside(meta) : "";

    this.innerHTML = `
      <div data-slot="bp-page" class="flex min-h-screen bg-background text-foreground">
        <div class="flex-1 min-w-0">
          ${metaBarHtml}
          <div data-slot="bp-page-content" class="p-6 bg-muted"></div>
        </div>
        ${asideHtml}
      </div>`;

    const content = this.querySelector('[data-slot="bp-page-content"]')!;

    /* Distribute children into header / main / footer slots */
    const headerSlot = document.createDocumentFragment();
    const mainSlot = document.createDocumentFragment();
    const footerSlot = document.createDocumentFragment();

    const children = Array.from(fragment.childNodes);
    for (const child of children) {
      const slot = (child as Element).getAttribute?.("slot");
      if (slot === "header") headerSlot.appendChild(child);
      else if (slot === "footer") footerSlot.appendChild(child);
      else mainSlot.appendChild(child);
    }

    content.innerHTML = `
      <div data-slot="bp-page-body" class="flex flex-col min-h-[calc(100vh-3rem)] rounded-lg ring-1 ring-border overflow-hidden bg-background">
        <header data-slot="bp-page-header" class="border-b border-border text-muted-foreground text-xs"></header>
        <main data-slot="bp-page-main" class="flex-1 p-6"></main>
        <footer data-slot="bp-page-footer" class="border-t border-border text-muted-foreground text-xs"></footer>
      </div>`;

    content.querySelector('[data-slot="bp-page-header"]')!.appendChild(headerSlot);
    content.querySelector('[data-slot="bp-page-main"]')!.appendChild(mainSlot);
    content.querySelector('[data-slot="bp-page-footer"]')!.appendChild(footerSlot);

    if (showDescription) {
      const aside = this.querySelector('[data-slot="bp-page-aside"]');
      if (aside) bindHoverHighlight(content, aside);
    }
  }
}

define("bp-page", BpPage);
