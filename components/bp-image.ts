import { define, attr } from "./bp-core";

const IMAGE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-8 text-muted-foreground/50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;

class BpImage extends HTMLElement {
  connectedCallback() {
    this.classList.add("block");
    const width = attr(this, "width");
    const height = attr(this, "height");
    const ratio = attr(this, "ratio", "16/9");
    const label = attr(this, "label");

    const styles: string[] = [];
    if (width) styles.push(`width:${width}`);
    if (height) styles.push(`height:${height}`);
    if (!height && ratio) {
      const parts = ratio.split("/");
      if (parts.length === 2) {
        styles.push(`aspect-ratio:${parts[0]}/${parts[1]}`);
      }
    }

    this.innerHTML = `
      <div class="flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/50" style="${styles.join(";")}">
        <div class="flex flex-col items-center gap-1.5">
          ${IMAGE_ICON}
          ${label ? `<span class="text-xs text-muted-foreground">${label}</span>` : ""}
        </div>
      </div>`;
  }
}

define("bp-image", BpImage);
