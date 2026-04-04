import { define, attr, html, cn } from "./bp-core";

const selectBase =
  "h-7 w-full min-w-0 appearance-none rounded-md border border-input bg-input/20 py-0.5 pr-6 pl-2 text-xs/relaxed transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=sm]:h-6 data-[size=sm]:text-[0.625rem] dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";

const iconBase =
  "pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 text-muted-foreground select-none group-data-[size=sm]/native-select:size-3 group-data-[size=sm]/native-select:-translate-y-[calc(--spacing(1.25))]";

const wrapperBase =
  "group/native-select relative w-fit has-[select:disabled]:opacity-50";

class BpNativeSelect extends HTMLElement {
  connectedCallback() {
    const size = attr(this, "size", "default") as "sm" | "default";
    const disabled = this.hasAttribute("disabled");
    const options = html(this);

    const chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cn(iconBase)}" aria-hidden="true" data-slot="native-select-icon"><path d="m6 9 6 6 6-6"/></svg>`;

    this.innerHTML = `<div
      class="${cn(wrapperBase)}"
      data-slot="native-select-wrapper"
      data-size="${size}"
    ><select
        data-slot="native-select"
        data-size="${size}"
        class="${cn(selectBase)}"
        ${disabled ? "disabled" : ""}
      >${options}</select>${chevronSvg}</div>`;
  }
}

define("bp-native-select", BpNativeSelect);
