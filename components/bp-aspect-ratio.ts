import { define, attr, html } from "./bp-core";

/**
 * bp-aspect-ratio — shadcn aspect-ratio as a web component.
 *
 * Usage:
 *   <bp-aspect-ratio ratio="16/9">
 *     <img src="photo.jpg" style="object-fit:cover;width:100%;height:100%;" />
 *   </bp-aspect-ratio>
 *
 * Tailwind classes copied from .shadcn/ui/aspect-ratio.tsx:
 *   AspectRatio div: "relative aspect-(--ratio)"
 *   CSS variable: --ratio
 */

class BpAspectRatio extends HTMLElement {
  connectedCallback() {
    const ratioStr = attr(this, "ratio", "1/1");
    const body = html(this);

    // Parse ratio: accept "16/9" or "1.778"
    let ratioValue: number;
    if (ratioStr.includes("/")) {
      const [w, h] = ratioStr.split("/").map(Number);
      ratioValue = h ? w / h : 1;
    } else {
      ratioValue = parseFloat(ratioStr) || 1;
    }

    // shadcn: style={{ "--ratio": ratio }} + className="relative aspect-(--ratio)"
    this.innerHTML = `<div data-slot="aspect-ratio" style="--ratio:${ratioValue}" class="relative aspect-(--ratio)">${body}</div>`;
  }
}

define("bp-aspect-ratio", BpAspectRatio);
