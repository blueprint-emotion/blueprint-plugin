import { define } from "./bp-core";

/**
 * <bp-table>
 *   <table>
 *     <thead><tr><th>...</th></tr></thead>
 *     <tbody><tr><td>...</td></tr></tbody>
 *   </table>
 * </bp-table>
 *
 * Applies shadcn classes from .shadcn/ui/table.tsx to child elements via DOM manipulation.
 * Does NOT replace innerHTML — only adds classes.
 */

// Exact class strings from shadcn source
const TABLE_CLASSES = "w-full caption-bottom text-xs";
const THEAD_CLASSES = "[&_tr]:border-b";
const TBODY_CLASSES = "[&_tr:last-child]:border-0";
const TFOOT_CLASSES = "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0";
const TR_CLASSES = "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted";
const TH_CLASSES = "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0";
const TD_CLASSES = "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0";
const CAPTION_CLASSES = "mt-4 text-xs text-muted-foreground";

function addClasses(el: Element, classes: string) {
  for (const cls of classes.split(" ")) {
    if (cls) el.classList.add(cls);
  }
}

class BpTable extends HTMLElement {
  connectedCallback() {
    // Wrap in container div: "relative w-full overflow-x-auto"
    this.setAttribute("data-slot", "table-container");
    this.classList.add("relative", "w-full", "overflow-x-auto");

    const table = this.querySelector("table");
    if (!table) return;

    table.setAttribute("data-slot", "table");
    addClasses(table, TABLE_CLASSES);

    for (const thead of Array.from(table.querySelectorAll("thead"))) {
      thead.setAttribute("data-slot", "table-header");
      addClasses(thead, THEAD_CLASSES);
    }

    for (const tbody of Array.from(table.querySelectorAll("tbody"))) {
      tbody.setAttribute("data-slot", "table-body");
      addClasses(tbody, TBODY_CLASSES);
    }

    for (const tfoot of Array.from(table.querySelectorAll("tfoot"))) {
      tfoot.setAttribute("data-slot", "table-footer");
      addClasses(tfoot, TFOOT_CLASSES);
    }

    for (const tr of Array.from(table.querySelectorAll("tr"))) {
      tr.setAttribute("data-slot", "table-row");
      addClasses(tr, TR_CLASSES);
    }

    for (const th of Array.from(table.querySelectorAll("th"))) {
      th.setAttribute("data-slot", "table-head");
      addClasses(th, TH_CLASSES);
    }

    for (const td of Array.from(table.querySelectorAll("td"))) {
      td.setAttribute("data-slot", "table-cell");
      addClasses(td, TD_CLASSES);
    }

    for (const caption of Array.from(table.querySelectorAll("caption"))) {
      caption.setAttribute("data-slot", "table-caption");
      addClasses(caption, CAPTION_CLASSES);
    }
  }
}

define("bp-table", BpTable);
