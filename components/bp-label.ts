import { define, cn } from "./bp-core";

class BpLabel extends HTMLElement {
  connectedCallback() {
    const text = this.textContent?.trim() || "";

    const base =
      "flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";

    this.setAttribute("data-slot", "label");
    this.classList.add(...base.split(" "));
    this.style.display = "flex";

    this.textContent = text;
  }
}

define("bp-label", BpLabel);
