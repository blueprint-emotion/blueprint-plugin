import { define, attr, boolAttr, html } from "./bp-core";

/**
 * bp-resizable — shadcn resizable as web components.
 *
 * Usage:
 *   <bp-resizable direction="horizontal">
 *     <bp-resizable-panel>Panel 1</bp-resizable-panel>
 *     <bp-resizable-handle with-handle></bp-resizable-handle>
 *     <bp-resizable-panel>Panel 2</bp-resizable-panel>
 *   </bp-resizable>
 *
 * Tailwind classes copied from .shadcn/ui/resizable.tsx:
 *   ResizablePanelGroup: "flex h-full w-full aria-[orientation=vertical]:flex-col"
 *   ResizablePanel:      (no classes — just data-slot)
 *   ResizableHandle:     "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90"
 *   Handle inner div:    "z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border"
 */

/* ── ResizablePanelGroup (root) ── */

class BpResizable extends HTMLElement {
  connectedCallback() {
    const direction = attr(this, "direction", "horizontal");
    const body = html(this);

    // shadcn: "flex h-full w-full aria-[orientation=vertical]:flex-col"
    // We set aria-orientation to drive the flex direction via Tailwind
    const groupClass = "flex h-full w-full aria-[orientation=vertical]:flex-col";

    this.innerHTML = `<div data-slot="resizable-panel-group" aria-orientation="${direction}" class="${groupClass}">${body}</div>`;
  }
}

define("bp-resizable", BpResizable);

/* ── ResizablePanel ── */

class BpResizablePanel extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    // shadcn ResizablePanel: no className, just data-slot="resizable-panel"
    this.innerHTML = `<div data-slot="resizable-panel" style="flex:1;overflow:auto">${body}</div>`;
  }
}

define("bp-resizable-panel", BpResizablePanel);

/* ── ResizableHandle ── */

class BpResizableHandle extends HTMLElement {
  connectedCallback() {
    const withHandle = boolAttr(this, "with-handle");

    // shadcn: "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90"
    const handleClass = "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90";

    // Inherit orientation from parent bp-resizable
    const parent = this.closest("bp-resizable");
    const orientation = parent ? (parent.getAttribute("direction") || "horizontal") : "horizontal";

    // shadcn handle inner div: "z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border"
    const handleInner = withHandle
      ? `<div class="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border"></div>`
      : "";

    this.innerHTML = `<div data-slot="resizable-handle" role="separator" aria-orientation="${orientation}" class="${handleClass}">${handleInner}</div>`;
  }
}

define("bp-resizable-handle", BpResizableHandle);
