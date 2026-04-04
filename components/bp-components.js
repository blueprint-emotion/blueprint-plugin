// components/bp-core.ts
function define(tag, ctor) {
  if (!customElements.get(tag)) {
    customElements.define(tag, ctor);
  }
}
function attr(el, name, fallback = "") {
  return el.getAttribute(name) ?? fallback;
}
function boolAttr(el, name) {
  const v = el.getAttribute(name);
  return v !== null && v !== "false";
}
function html(el) {
  return el.innerHTML;
}
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

// components/bp-input.ts
var BpInput = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("block");
    const placeholder = attr(this, "placeholder");
    const type = attr(this, "type", "text");
    const disabled = boolAttr(this, "disabled");
    const value = attr(this, "value");
    this.innerHTML = `<input
      type="${type}"
      data-slot="input"
      placeholder="${placeholder}"
      value="${value}"
      ${disabled ? "disabled" : ""}
      class="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
    />`;
  }
};
define("bp-input", BpInput);

// components/bp-textarea.ts
var BpTextarea = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("block");
    const placeholder = attr(this, "placeholder");
    const rows = attr(this, "rows", "3");
    const disabled = boolAttr(this, "disabled");
    const value = attr(this, "value");
    this.innerHTML = `<textarea
      data-slot="textarea"
      placeholder="${placeholder}"
      rows="${rows}"
      ${disabled ? "disabled" : ""}
      class="flex field-sizing-content min-h-16 w-full resize-none rounded-md border border-input bg-input/20 px-2 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
    >${value}</textarea>`;
  }
};
define("bp-textarea", BpTextarea);

// components/bp-checkbox.ts
var BpCheckbox = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("inline-flex", "items-center", "gap-2");
    const label = attr(this, "label");
    const checked = boolAttr(this, "checked");
    const disabled = boolAttr(this, "disabled");
    const checkboxClasses = "peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-shadow outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary";
    const indicatorClasses = "grid place-content-center text-current transition-none [&>svg]:size-3.5";
    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    this.innerHTML = `
      <button
        type="button"
        role="checkbox"
        aria-checked="${checked}"
        data-slot="checkbox"
        ${checked ? 'data-checked=""' : ""}
        ${disabled ? "disabled" : ""}
        class="${checkboxClasses}"
      >
        <span data-slot="checkbox-indicator" class="${indicatorClasses}" style="${checked ? "" : "display:none"}">
          ${checkSvg}
        </span>
      </button>
      ${label ? `<label class="text-sm">${label}</label>` : ""}
    `;
    const btn = this.querySelector("button");
    btn.addEventListener("click", () => {
      if (disabled) return;
      const isChecked = btn.getAttribute("aria-checked") === "true";
      const next = !isChecked;
      btn.setAttribute("aria-checked", String(next));
      if (next) {
        btn.setAttribute("data-checked", "");
      } else {
        btn.removeAttribute("data-checked");
      }
      const indicator = btn.querySelector("[data-slot='checkbox-indicator']");
      if (indicator) indicator.style.display = next ? "" : "none";
    });
  }
};
define("bp-checkbox", BpCheckbox);

// components/bp-radio-group.ts
var BpRadioGroup = class extends HTMLElement {
  connectedCallback() {
    const name = attr(this, "name");
    const value = attr(this, "value");
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-radio-item");
    const radioItemClasses = "group/radio-group-item peer relative flex aspect-square size-4 shrink-0 rounded-full border border-input outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary";
    const indicatorClasses = "flex size-4 items-center justify-center";
    const dotClasses = "absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-foreground";
    let itemsHTML = "";
    items.forEach((item) => {
      const itemValue = item.getAttribute("value") || "";
      const itemLabel = item.getAttribute("label") || "";
      const isChecked = itemValue === value;
      itemsHTML += `
        <label class="flex items-center gap-2 cursor-pointer">
          <button
            type="button"
            role="radio"
            aria-checked="${isChecked}"
            data-slot="radio-group-item"
            data-value="${itemValue}"
            ${isChecked ? 'data-checked=""' : ""}
            class="${radioItemClasses}"
          >
            <span data-slot="radio-group-indicator" class="${indicatorClasses}" style="${isChecked ? "" : "display:none"}">
              <span class="${dotClasses}"></span>
            </span>
          </button>
          ${itemLabel ? `<span class="text-sm">${itemLabel}</span>` : ""}
        </label>
      `;
    });
    this.innerHTML = `<div data-slot="radio-group" role="radiogroup" class="grid w-full gap-3">${itemsHTML}</div>`;
    this.querySelectorAll("[role='radio']").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.querySelectorAll("[role='radio']").forEach((b) => {
          b.setAttribute("aria-checked", "false");
          b.removeAttribute("data-checked");
          const ind = b.querySelector("[data-slot='radio-group-indicator']");
          if (ind) ind.style.display = "none";
        });
        btn.setAttribute("aria-checked", "true");
        btn.setAttribute("data-checked", "");
        const indicator = btn.querySelector("[data-slot='radio-group-indicator']");
        if (indicator) indicator.style.display = "";
      });
    });
  }
};
var BpRadioItem = class extends HTMLElement {
  // Parsed by parent; no-op if rendered standalone
};
define("bp-radio-group", BpRadioGroup);
define("bp-radio-item", BpRadioItem);

// components/bp-select.ts
var BpSelect = class extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Select\u2026");
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-select-item");
    const triggerClasses = "flex w-fit items-center justify-between gap-1.5 rounded-md border border-input bg-input/20 px-2 py-1.5 text-xs/relaxed whitespace-nowrap transition-colors outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-placeholder:text-muted-foreground data-[size=default]:h-7 data-[size=sm]:h-6 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-1.5 dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";
    const contentClasses = "relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95";
    const itemClasses = "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2";
    const chevronSvg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none size-3.5 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>`;
    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><path d="M20 6 9 17l-5-5"/></svg>`;
    let optionsHTML = "";
    items.forEach((item) => {
      const itemValue = item.getAttribute("value") || "";
      const itemLabel = item.getAttribute("label") || itemValue;
      optionsHTML += `
        <div
          role="option"
          data-slot="select-item"
          data-value="${itemValue}"
          tabindex="0"
          class="${itemClasses}"
        >
          <span class="flex flex-1 shrink-0 gap-2 whitespace-nowrap" data-slot="select-item-text">${itemLabel}</span>
          <span class="pointer-events-none absolute right-2 flex items-center justify-center" data-slot="select-indicator" style="display:none">
            ${checkSvg}
          </span>
        </div>
      `;
    });
    this.innerHTML = `
      <div class="relative inline-block">
        <button
          type="button"
          data-slot="select-trigger"
          data-size="default"
          data-placeholder
          class="${triggerClasses}"
        >
          <span data-slot="select-value" class="flex flex-1 text-left">${placeholder}</span>
          ${chevronSvg2}
        </button>
        <div
          data-slot="select-content"
          role="listbox"
          class="${contentClasses}"
          style="display:none; position:absolute; top:100%; left:0; margin-top:4px; min-width:100%;"
        >
          ${optionsHTML}
        </div>
      </div>
    `;
    const trigger = this.querySelector("[data-slot='select-trigger']");
    const content = this.querySelector("[data-slot='select-content']");
    const valueEl = this.querySelector("[data-slot='select-value']");
    trigger.addEventListener("click", () => {
      const isOpen = content.style.display !== "none";
      content.style.display = isOpen ? "none" : "block";
    });
    this.querySelectorAll("[data-slot='select-item']").forEach((item) => {
      item.addEventListener("click", () => {
        const val = item.getAttribute("data-value") || "";
        const label = item.querySelector("[data-slot='select-item-text']")?.textContent || val;
        valueEl.textContent = label;
        trigger.removeAttribute("data-placeholder");
        this.querySelectorAll("[data-slot='select-indicator']").forEach((ind) => {
          ind.style.display = "none";
        });
        const indicator = item.querySelector("[data-slot='select-indicator']");
        if (indicator) indicator.style.display = "";
        content.style.display = "none";
      });
    });
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        content.style.display = "none";
      }
    });
  }
};
var BpSelectItem = class extends HTMLElement {
  // Parsed by parent; no-op if rendered standalone
};
define("bp-select", BpSelect);
define("bp-select-item", BpSelectItem);

// components/bp-switch.ts
var BpSwitch = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("inline-flex", "items-center", "gap-2");
    const label = attr(this, "label");
    const checked = boolAttr(this, "checked");
    const disabled = boolAttr(this, "disabled");
    const switchClasses = "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=default]:h-[16.6px] data-[size=default]:w-[28px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50";
    const thumbClasses = "pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-3.5 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground";
    this.innerHTML = `
      <button
        type="button"
        role="switch"
        aria-checked="${checked}"
        data-slot="switch"
        data-size="default"
        ${checked ? 'data-checked=""' : 'data-unchecked=""'}
        ${disabled ? 'disabled data-disabled=""' : ""}
        class="${switchClasses}"
      >
        <span
          data-slot="switch-thumb"
          ${checked ? 'data-checked=""' : 'data-unchecked=""'}
          class="${thumbClasses}"
        ></span>
      </button>
      ${label ? `<label class="text-sm">${label}</label>` : ""}
    `;
    const btn = this.querySelector("button");
    btn.addEventListener("click", () => {
      if (disabled) return;
      const isChecked = btn.getAttribute("aria-checked") === "true";
      const next = !isChecked;
      btn.setAttribute("aria-checked", String(next));
      const thumb = btn.querySelector("[data-slot='switch-thumb']");
      if (next) {
        btn.setAttribute("data-checked", "");
        btn.removeAttribute("data-unchecked");
        thumb.setAttribute("data-checked", "");
        thumb.removeAttribute("data-unchecked");
      } else {
        btn.removeAttribute("data-checked");
        btn.setAttribute("data-unchecked", "");
        thumb.removeAttribute("data-checked");
        thumb.setAttribute("data-unchecked", "");
      }
    });
  }
};
define("bp-switch", BpSwitch);

// components/bp-slider.ts
var BpSlider = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("block");
    const min = Number(attr(this, "min", "0"));
    const max = Number(attr(this, "max", "100"));
    const value = Number(attr(this, "value", String(Math.round((min + max) / 2))));
    const step = Number(attr(this, "step", "1"));
    const disabled = this.hasAttribute("disabled");
    const rootClasses = "data-horizontal:w-full data-vertical:h-full";
    const controlClasses = "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col";
    const trackClasses = "relative grow overflow-hidden rounded-md bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1";
    const rangeClasses = "bg-primary select-none data-horizontal:h-full data-vertical:w-full";
    const thumbClasses = "relative block size-3 shrink-0 rounded-md border border-ring bg-white ring-ring/30 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden active:ring-2 disabled:pointer-events-none disabled:opacity-50";
    const pct = (value - min) / (max - min) * 100;
    this.innerHTML = `
      <div data-slot="slider" data-horizontal class="${rootClasses}">
        <div class="${controlClasses}" ${disabled ? 'data-disabled=""' : ""}>
          <div data-slot="slider-track" data-horizontal class="${trackClasses}" style="position:relative;">
            <div
              data-slot="slider-range"
              data-horizontal
              class="${rangeClasses}"
              style="position:absolute; left:0; top:0; bottom:0; width:${pct}%;"
            ></div>
          </div>
          <input
            type="range"
            min="${min}"
            max="${max}"
            value="${value}"
            step="${step}"
            ${disabled ? "disabled" : ""}
            style="position:absolute; width:100%; height:100%; opacity:0; cursor:pointer; margin:0;"
          />
          <div
            data-slot="slider-thumb"
            class="${thumbClasses}"
            tabindex="0"
            role="slider"
            aria-valuemin="${min}"
            aria-valuemax="${max}"
            aria-valuenow="${value}"
            style="position:absolute; left:${pct}%; transform:translateX(-50%);"
          ></div>
        </div>
      </div>
    `;
    const rangeInput = this.querySelector("input[type='range']");
    const rangeBar = this.querySelector("[data-slot='slider-range']");
    const thumb = this.querySelector("[data-slot='slider-thumb']");
    rangeInput.addEventListener("input", () => {
      const v = Number(rangeInput.value);
      const p = (v - min) / (max - min) * 100;
      rangeBar.style.width = `${p}%`;
      thumb.style.left = `${p}%`;
      thumb.setAttribute("aria-valuenow", String(v));
    });
  }
};
define("bp-slider", BpSlider);

// components/bp-field.ts
var BpField = class extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label");
    const description = attr(this, "description");
    const error = attr(this, "error");
    const body = html(this);
    const labelHtml = label ? `<label data-slot="field-label" class="flex w-fit items-center gap-2 text-xs font-medium leading-snug select-none">${label}</label>` : "";
    const descHtml = description ? `<p data-slot="field-description" class="text-xs font-normal text-muted-foreground">${description}</p>` : "";
    const errorHtml = error ? `<div role="alert" data-slot="field-error" class="text-xs font-normal text-destructive">${error}</div>` : "";
    this.innerHTML = `
      <div data-slot="field" role="group" class="flex w-full flex-col gap-2${error ? " data-[invalid=true]" : ""}">
        ${labelHtml}
        ${body}
        ${descHtml}
        ${errorHtml}
      </div>`;
  }
};
define("bp-field", BpField);

// components/bp-label.ts
var BpLabel = class extends HTMLElement {
  connectedCallback() {
    const text = this.textContent?.trim() || "";
    const base3 = "flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";
    this.innerHTML = `<label
      data-slot="label"
      class="${cn(base3)}"
    >${text}</label>`;
  }
};
define("bp-label", BpLabel);

// components/bp-input-otp.ts
var slotBase = "relative flex size-7 items-center justify-center border-y border-r border-input bg-input/20 text-xs/relaxed transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/30 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40";
var groupBase = "flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40";
var containerBase = "cn-input-otp flex items-center has-disabled:opacity-50";
var BpInputOtp = class extends HTMLElement {
  connectedCallback() {
    const length = parseInt(attr(this, "length", "6"), 10);
    const slots = Array.from({ length }, (_, i) => {
      const val = "";
      return `<div
        data-slot="input-otp-slot"
        class="${cn(slotBase)}"
      >${val}</div>`;
    }).join("");
    this.innerHTML = `<div
      data-slot="input-otp"
      class="${cn(containerBase)}"
    ><div
        data-slot="input-otp-group"
        class="${cn(groupBase)}"
      >${slots}</div></div>`;
  }
};
define("bp-input-otp", BpInputOtp);

// components/bp-native-select.ts
var selectBase = "h-7 w-full min-w-0 appearance-none rounded-md border border-input bg-input/20 py-0.5 pr-6 pl-2 text-xs/relaxed transition-colors outline-none select-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=sm]:h-6 data-[size=sm]:text-[0.625rem] dark:bg-input/30 dark:hover:bg-input/50 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40";
var iconBase = "pointer-events-none absolute top-1/2 right-1.5 size-3.5 -translate-y-1/2 text-muted-foreground select-none group-data-[size=sm]/native-select:size-3 group-data-[size=sm]/native-select:-translate-y-[calc(--spacing(1.25))]";
var wrapperBase = "group/native-select relative w-fit has-[select:disabled]:opacity-50";
var BpNativeSelect = class extends HTMLElement {
  connectedCallback() {
    const size = attr(this, "size", "default");
    const disabled = this.hasAttribute("disabled");
    const options = html(this);
    const chevronSvg2 = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${cn(iconBase)}" aria-hidden="true" data-slot="native-select-icon"><path d="m6 9 6 6 6-6"/></svg>`;
    this.innerHTML = `<div
      class="${cn(wrapperBase)}"
      data-slot="native-select-wrapper"
      data-size="${size}"
    ><select
        data-slot="native-select"
        data-size="${size}"
        class="${cn(selectBase)}"
        ${disabled ? "disabled" : ""}
      >${options}</select>${chevronSvg2}</div>`;
  }
};
define("bp-native-select", BpNativeSelect);

// components/bp-input-group.ts
var groupBase2 = "group/input-group relative flex h-7 w-full min-w-0 items-center rounded-md border border-input bg-input/20 transition-colors outline-none in-data-[slot=combobox-content]:focus-within:border-inherit in-data-[slot=combobox-content]:focus-within:ring-0 has-data-[align=block-end]:rounded-md has-data-[align=block-start]:rounded-md has-[[data-slot=input-group-control]:focus-visible]:border-ring has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/30 has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-2 has-[[data-slot][aria-invalid=true]]:ring-destructive/20 has-[textarea]:rounded-md has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>textarea]:h-auto dark:bg-input/30 dark:has-[[data-slot][aria-invalid=true]]:ring-destructive/40 has-[>[data-align=block-end]]:[&>input]:pt-3 has-[>[data-align=block-start]]:[&>input]:pb-3 has-[>[data-align=inline-end]]:[&>input]:pr-1.5 has-[>[data-align=inline-start]]:[&>input]:pl-1.5";
var addonAligns = {
  "inline-start": "order-first pl-2 has-[>button]:ml-[-0.275rem] has-[>kbd]:ml-[-0.275rem]",
  "inline-end": "order-last pr-2 has-[>button]:mr-[-0.275rem] has-[>kbd]:mr-[-0.275rem]",
  "block-start": "order-first w-full justify-start px-2 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
  "block-end": "order-last w-full justify-start px-2 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2"
};
var addonBase = "flex h-auto cursor-text items-center justify-center gap-1 py-2 text-xs/relaxed font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 **:data-[slot=kbd]:rounded-[calc(var(--radius-sm)-2px)] **:data-[slot=kbd]:bg-muted-foreground/10 **:data-[slot=kbd]:px-1 **:data-[slot=kbd]:text-[0.625rem] [&>svg:not([class*='size-'])]:size-3.5";
var inputControlBase = "flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 aria-invalid:ring-0 dark:bg-transparent";
var textBase = "flex items-center gap-2 text-xs/relaxed text-muted-foreground [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4";
var BpInputGroup = class extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    this.innerHTML = `<div
      data-slot="input-group"
      role="group"
      class="${cn(groupBase2)}"
    >${body}</div>`;
  }
};
var BpInputGroupAddon = class extends HTMLElement {
  connectedCallback() {
    const align = attr(this, "align", "inline-start");
    const body = html(this);
    this.innerHTML = `<div
      role="group"
      data-slot="input-group-addon"
      data-align="${align}"
      class="${cn(addonBase, addonAligns[align] || addonAligns["inline-start"])}"
    >${body}</div>`;
  }
};
var BpInputGroupInput = class extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder");
    const type = attr(this, "type", "text");
    const value = attr(this, "value");
    const disabled = this.hasAttribute("disabled");
    this.innerHTML = `<input
      type="${type}"
      data-slot="input-group-control"
      placeholder="${placeholder}"
      value="${value}"
      ${disabled ? "disabled" : ""}
      class="h-7 w-full min-w-0 px-2 py-0.5 text-sm outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 ${cn(inputControlBase)}"
    />`;
  }
};
var BpInputGroupText = class extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    this.innerHTML = `<span
      class="${cn(textBase)}"
    >${body}</span>`;
  }
};
define("bp-input-group", BpInputGroup);
define("bp-input-group-addon", BpInputGroupAddon);
define("bp-input-group-input", BpInputGroupInput);
define("bp-input-group-text", BpInputGroupText);

// components/bp-button.ts
var variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border-border hover:bg-input/50 hover:text-foreground dark:bg-input/30",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  ghost: "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30",
  link: "text-primary underline-offset-4 hover:underline"
};
var sizes = {
  default: "h-7 gap-1 px-2 text-xs",
  xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem]",
  sm: "h-6 gap-1 px-2 text-xs",
  lg: "h-8 gap-1 px-2.5 text-xs",
  icon: "size-7",
  "icon-xs": "size-5 rounded-sm",
  "icon-sm": "size-6",
  "icon-lg": "size-8"
};
var BpButton = class extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const disabled = boolAttr(this, "disabled");
    const label = attr(this, "label") || this.textContent?.trim() || "";
    const base3 = "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50";
    this.innerHTML = `<button
      data-slot="button"
      class="${cn(base3, variants[variant] || variants.default, sizes[size] || sizes.default, disabled && "pointer-events-none opacity-50")}"
      ${disabled ? "disabled" : ""}
    >${label}</button>`;
  }
};
define("bp-button", BpButton);

// components/bp-button-group.ts
var buttonGroupBase = "flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1";
var orientations = {
  horizontal: "*:data-slot:rounded-r-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-md! [&>[data-slot]~[data-slot]]:rounded-l-none [&>[data-slot]~[data-slot]]:border-l-0",
  // From buttonGroupVariants orientation.vertical:
  // "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0"
  vertical: "flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-md! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0"
};
var BpButtonGroup = class extends HTMLElement {
  connectedCallback() {
    const orientation = attr(this, "orientation", "horizontal");
    const children = html(this);
    const classes = cn(
      buttonGroupBase,
      orientations[orientation] || orientations.horizontal
    );
    this.innerHTML = `<div
      role="group"
      data-slot="button-group"
      data-orientation="${orientation}"
      class="${classes}"
    >${children}</div>`;
  }
};
define("bp-button-group", BpButtonGroup);

// components/bp-toggle.ts
var base = "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-xs font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
var variants2 = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent hover:bg-muted"
};
var sizes2 = {
  default: "h-7 min-w-7 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
  sm: "h-6 min-w-6 rounded-[min(var(--radius-md),8px)] px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  lg: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
};
var BpToggle = class extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const pressed = boolAttr(this, "pressed");
    const disabled = boolAttr(this, "disabled");
    const label = this.textContent?.trim() || "";
    this.innerHTML = `<button
      data-slot="toggle"
      type="button"
      role="button"
      aria-pressed="${pressed}"
      ${pressed ? 'data-state="on"' : 'data-state="off"'}
      class="${cn(base, variants2[variant] || variants2.default, sizes2[size] || sizes2.default, disabled && "pointer-events-none opacity-50")}"
      ${disabled ? "disabled" : ""}
    >${label}</button>`;
  }
};
define("bp-toggle", BpToggle);

// components/bp-toggle-group.ts
var groupBase3 = "group/toggle-group flex w-fit flex-row items-center gap-[--spacing(var(--gap))] rounded-md data-[size=sm]:rounded-[min(var(--radius-md),8px)] data-vertical:flex-col data-vertical:items-stretch";
var itemBase = "shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-md group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-md group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-md group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-md group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t";
var toggleBase = "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-xs font-medium whitespace-nowrap transition-all outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted data-[state=on]:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
var toggleVariants = {
  default: "bg-transparent",
  outline: "border border-input bg-transparent hover:bg-muted"
};
var toggleSizes = {
  default: "h-7 min-w-7 px-2 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
  sm: "h-6 min-w-6 rounded-[min(var(--radius-md),8px)] px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  lg: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
};
var BpToggleGroup = class extends HTMLElement {
  connectedCallback() {
    const type = attr(this, "type", "single");
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const spacing = attr(this, "spacing", "0");
    const orientation = attr(this, "orientation", "horizontal");
    const body = html(this);
    this.innerHTML = `<div
      data-slot="toggle-group"
      data-variant="${variant}"
      data-size="${size}"
      data-spacing="${spacing}"
      data-orientation="${orientation}"
      role="group"
      style="--gap: ${spacing}"
      class="${cn(groupBase3)}"
    >${body}</div>`;
    this.querySelectorAll(":scope > [data-slot=toggle], :scope bp-toggle").forEach(
      (child) => {
        const btn = child.querySelector("[data-slot=toggle]") || child;
        btn.setAttribute("data-slot", "toggle-group-item");
        btn.setAttribute("data-variant", variant);
        btn.setAttribute("data-size", size);
        btn.setAttribute("data-spacing", spacing);
        const existing = btn.getAttribute("class") || "";
        if (!existing.includes("shrink-0")) {
          btn.setAttribute(
            "class",
            cn(
              itemBase,
              toggleBase,
              toggleVariants[variant] || toggleVariants.default,
              toggleSizes[size] || toggleSizes.default
            )
          );
        }
      }
    );
    if (type === "single") {
      this.addEventListener("click", (e) => {
        const target = e.target.closest(
          "[data-slot=toggle-group-item]"
        );
        if (!target) return;
        this.querySelectorAll("[data-slot=toggle-group-item]").forEach(
          (item) => {
            if (item !== target) {
              item.setAttribute("aria-pressed", "false");
              item.setAttribute("data-state", "off");
            }
          }
        );
        const isPressed = target.getAttribute("aria-pressed") === "true";
        target.setAttribute("aria-pressed", String(!isPressed));
        target.setAttribute("data-state", !isPressed ? "on" : "off");
      });
    } else {
      this.addEventListener("click", (e) => {
        const target = e.target.closest(
          "[data-slot=toggle-group-item]"
        );
        if (!target) return;
        const isPressed = target.getAttribute("aria-pressed") === "true";
        target.setAttribute("aria-pressed", String(!isPressed));
        target.setAttribute("data-state", !isPressed ? "on" : "off");
      });
    }
  }
};
define("bp-toggle-group", BpToggleGroup);

// components/bp-dropdown.ts
var triggerBase = "inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs outline-none hover:bg-accent hover:text-accent-foreground";
var contentBase = "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";
var itemBase2 = "group/dropdown-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive";
var separatorBase = "-mx-1 my-1 h-px bg-border/50";
var labelBase = "px-2 py-1.5 text-xs text-muted-foreground data-inset:pl-7.5";
var shortcutBase = "ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-focus/dropdown-menu-item:text-accent-foreground";
var chevronSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-3.5 opacity-60" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;
var BpDropdownItem = class extends HTMLElement {
};
var BpDropdownSeparator = class extends HTMLElement {
};
var BpDropdownLabel = class extends HTMLElement {
};
var BpDropdown = class extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label", "Open");
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const children = temp.children;
    let itemsHTML = "";
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const tag = child.tagName.toLowerCase();
      if (tag === "bp-dropdown-separator") {
        itemsHTML += `<div data-slot="dropdown-menu-separator" role="separator" class="${separatorBase}"></div>`;
      } else if (tag === "bp-dropdown-label") {
        const text = child.textContent?.trim() || "";
        itemsHTML += `<div data-slot="dropdown-menu-label" class="${labelBase}">${text}</div>`;
      } else if (tag === "bp-dropdown-item") {
        const text = child.textContent?.trim() || "";
        const shortcut = child.getAttribute("shortcut") || "";
        const disabled = child.hasAttribute("disabled");
        const variant = child.getAttribute("variant") || "default";
        const shortcutSpan = shortcut ? `<span data-slot="dropdown-menu-shortcut" class="${shortcutBase}">${shortcut}</span>` : "";
        itemsHTML += `<div
          data-slot="dropdown-menu-item"
          data-variant="${variant}"
          ${disabled ? 'data-disabled=""' : ""}
          role="menuitem"
          tabindex="-1"
          class="${itemBase2}"
        >${text}${shortcutSpan}</div>`;
      }
    }
    this.innerHTML = `
      <div data-slot="dropdown-menu" class="relative inline-block">
        <button data-slot="dropdown-menu-trigger" class="${triggerBase}" aria-expanded="true" type="button">
          ${label}${chevronSvg}
        </button>
        <div data-slot="dropdown-menu-content" role="menu" class="${contentBase}" style="margin-top:4px">
          ${itemsHTML}
        </div>
      </div>`;
  }
};
define("bp-dropdown", BpDropdown);
define("bp-dropdown-item", BpDropdownItem);
define("bp-dropdown-separator", BpDropdownSeparator);
define("bp-dropdown-label", BpDropdownLabel);

// components/bp-context-menu.ts
var triggerBase2 = "select-none";
var contentBase2 = "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";
var itemBase3 = "group/context-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive";
var shortcutBase2 = "ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-focus/context-menu-item:text-accent-foreground";
var BpContextMenuItem = class extends HTMLElement {
};
var BpContextMenu = class extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label", "Right-click here");
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const children = temp.children;
    let itemsHTML = "";
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      const tag = child.tagName.toLowerCase();
      if (tag === "bp-context-menu-item") {
        const text = child.textContent?.trim() || "";
        const shortcut = child.getAttribute("shortcut") || "";
        const disabled = child.hasAttribute("disabled");
        const variant = child.getAttribute("variant") || "default";
        const shortcutSpan = shortcut ? `<span data-slot="context-menu-shortcut" class="${shortcutBase2}">${shortcut}</span>` : "";
        itemsHTML += `<div
          data-slot="context-menu-item"
          data-variant="${variant}"
          ${disabled ? 'data-disabled=""' : ""}
          role="menuitem"
          tabindex="-1"
          class="${itemBase3}"
        >${text}${shortcutSpan}</div>`;
      }
    }
    this.innerHTML = `
      <div data-slot="context-menu" class="inline-block">
        <div data-slot="context-menu-trigger" class="${triggerBase2} inline-flex items-center justify-center rounded-md border border-dashed border-input px-6 py-8 text-xs text-muted-foreground">
          ${label}
        </div>
        <div data-slot="context-menu-content" role="menu" class="${contentBase2}" style="margin-top:4px">
          ${itemsHTML}
        </div>
      </div>`;
  }
};
define("bp-context-menu", BpContextMenu);
define("bp-context-menu-item", BpContextMenuItem);

// components/bp-menubar.ts
var menubarBase = "flex h-9 items-center rounded-lg border p-1";
var triggerBase3 = "flex items-center rounded-[calc(var(--radius-md)-2px)] px-2 py-[calc(--spacing(0.85))] text-xs/relaxed font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted";
var contentBase3 = "min-w-32 rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10";
var itemBase4 = "group/menubar-item min-h-7 gap-2 rounded-md px-2 py-1 text-xs/relaxed focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive!";
var separatorBase2 = "-mx-1 my-1 h-px bg-border/50";
var labelBase2 = "px-2 py-1.5 text-xs text-muted-foreground data-inset:pl-7.5";
var shortcutBase3 = "ml-auto text-[0.625rem] tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground";
var BpMenubarMenu = class extends HTMLElement {
};
var BpMenubarItem = class extends HTMLElement {
};
var BpMenubarSeparator = class extends HTMLElement {
};
var BpMenubarLabel = class extends HTMLElement {
};
var BpMenubar = class extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const menus = temp.querySelectorAll("bp-menubar-menu");
    let menusHTML = "";
    menus.forEach((menu) => {
      const menuLabel = menu.getAttribute("label") || "Menu";
      const menuChildren = menu.children;
      let menuItemsHTML = "";
      for (let i = 0; i < menuChildren.length; i++) {
        const child = menuChildren[i];
        const tag = child.tagName.toLowerCase();
        if (tag === "bp-menubar-separator") {
          menuItemsHTML += `<div data-slot="menubar-separator" role="separator" class="${separatorBase2}"></div>`;
        } else if (tag === "bp-menubar-label") {
          const text = child.textContent?.trim() || "";
          menuItemsHTML += `<div data-slot="menubar-label" class="${labelBase2}">${text}</div>`;
        } else if (tag === "bp-menubar-item") {
          const text = child.textContent?.trim() || "";
          const shortcut = child.getAttribute("shortcut") || "";
          const disabled = child.hasAttribute("disabled");
          const variant = child.getAttribute("variant") || "default";
          const shortcutSpan = shortcut ? `<span data-slot="menubar-shortcut" class="${shortcutBase3}">${shortcut}</span>` : "";
          menuItemsHTML += `<div
            data-slot="menubar-item"
            data-variant="${variant}"
            ${disabled ? 'data-disabled=""' : ""}
            role="menuitem"
            tabindex="-1"
            class="relative flex cursor-default items-center select-none ${itemBase4}"
          >${text}${shortcutSpan}</div>`;
        }
      }
      menusHTML += `
        <div data-slot="menubar-menu" class="relative">
          <button data-slot="menubar-trigger" class="${triggerBase3}" aria-expanded="true" type="button">
            ${menuLabel}
          </button>
          <div data-slot="menubar-content" role="menu" class="${contentBase3}" style="position:absolute;top:100%;left:0;margin-top:8px">
            ${menuItemsHTML}
          </div>
        </div>`;
    });
    this.innerHTML = `<div data-slot="menubar" class="${menubarBase}">${menusHTML}</div>`;
  }
};
define("bp-menubar", BpMenubar);
define("bp-menubar-menu", BpMenubarMenu);
define("bp-menubar-item", BpMenubarItem);
define("bp-menubar-separator", BpMenubarSeparator);
define("bp-menubar-label", BpMenubarLabel);

// components/bp-card.ts
var BpCard = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const footer = attr(this, "footer");
    const body = html(this);
    const headerHtml = title || description ? `
      <div data-slot="card-header" class="grid auto-rows-min items-start gap-1 px-4">
        ${title ? `<div data-slot="card-title" class="text-sm font-medium">${title}</div>` : ""}
        ${description ? `<div data-slot="card-description" class="text-xs text-muted-foreground">${description}</div>` : ""}
      </div>` : "";
    const contentHtml = body ? `<div data-slot="card-content" class="px-4">${body}</div>` : "";
    const footerHtml = footer ? `
      <div data-slot="card-footer" class="flex items-center px-4">${footer}</div>` : "";
    this.innerHTML = `
      <div data-slot="card" class="flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs text-card-foreground ring-1 ring-foreground/10">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
};
define("bp-card", BpCard);

// components/bp-accordion.ts
var BpAccordion = class extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    this.innerHTML = `<div data-slot="accordion" class="flex w-full flex-col overflow-hidden rounded-md border">${body}</div>`;
  }
};
define("bp-accordion", BpAccordion);
var BpAccordionItem = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const open = boolAttr(this, "open");
    const body = html(this);
    const itemClass = cn(
      "not-last:border-b",
      open && "bg-muted/50"
    );
    const triggerClass = "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border border-transparent p-2 text-left text-xs/relaxed font-medium transition-all outline-none hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground";
    const chevronDown = `<svg data-slot="accordion-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none shrink-0 ${open ? "hidden" : ""}"><path d="m6 9 6 6 6-6"/></svg>`;
    const chevronUp = `<svg data-slot="accordion-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none shrink-0 ${open ? "" : "hidden"}"><path d="m18 15-6-6-6 6"/></svg>`;
    const panelClass = "overflow-hidden px-2 text-xs/relaxed";
    const innerClass = "pt-0 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";
    const id = `bp-acc-${Math.random().toString(36).slice(2, 8)}`;
    this.innerHTML = `
      <div data-slot="accordion-item" class="${itemClass}">
        <div class="flex">
          <button
            data-slot="accordion-trigger"
            class="${triggerClass}"
            aria-expanded="${open}"
            aria-controls="${id}"
            onclick="this.closest('bp-accordion-item').toggle()"
          >
            <span>${title}</span>
            ${chevronDown}
            ${chevronUp}
          </button>
        </div>
        <div id="${id}" data-slot="accordion-content" class="${panelClass}" style="${open ? "" : "display:none"}">
          <div class="${innerClass}">${body}</div>
        </div>
      </div>`;
  }
  toggle() {
    const trigger = this.querySelector("[data-slot='accordion-trigger']");
    const content = this.querySelector("[data-slot='accordion-content']");
    if (!trigger || !content) return;
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    content.style.display = expanded ? "none" : "";
    const item = this.querySelector("[data-slot='accordion-item']");
    if (item) {
      item.classList.toggle("bg-muted/50", !expanded);
    }
    const svgs = trigger.querySelectorAll("svg");
    if (svgs.length === 2) {
      svgs[0].classList.toggle("hidden", !expanded);
      svgs[1].classList.toggle("hidden", expanded);
    }
  }
};
define("bp-accordion-item", BpAccordionItem);

// components/bp-collapsible.ts
var BpCollapsible = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title", "Toggle");
    const open = boolAttr(this, "open");
    const body = html(this);
    const id = `bp-coll-${Math.random().toString(36).slice(2, 8)}`;
    this.innerHTML = `
      <div data-slot="collapsible">
        <button
          data-slot="collapsible-trigger"
          aria-expanded="${open}"
          aria-controls="${id}"
          onclick="this.closest('bp-collapsible').toggle()"
        >${title}</button>
        <div id="${id}" data-slot="collapsible-content" style="${open ? "" : "display:none"}">
          ${body}
        </div>
      </div>`;
  }
  toggle() {
    const trigger = this.querySelector("[data-slot='collapsible-trigger']");
    const content = this.querySelector("[data-slot='collapsible-content']");
    if (!trigger || !content) return;
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    content.style.display = expanded ? "none" : "";
  }
};
define("bp-collapsible", BpCollapsible);

// components/bp-aspect-ratio.ts
var BpAspectRatio = class extends HTMLElement {
  connectedCallback() {
    const ratioStr = attr(this, "ratio", "1/1");
    const body = html(this);
    let ratioValue;
    if (ratioStr.includes("/")) {
      const [w, h] = ratioStr.split("/").map(Number);
      ratioValue = h ? w / h : 1;
    } else {
      ratioValue = parseFloat(ratioStr) || 1;
    }
    this.innerHTML = `<div data-slot="aspect-ratio" style="--ratio:${ratioValue}" class="relative aspect-(--ratio)">${body}</div>`;
  }
};
define("bp-aspect-ratio", BpAspectRatio);

// components/bp-separator.ts
var BpSeparator = class extends HTMLElement {
  connectedCallback() {
    const orientation = attr(this, "orientation", "horizontal");
    const label = attr(this, "label");
    const base3 = "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch";
    if (label) {
      const flexDir = orientation === "vertical" ? "flex-col" : "";
      this.innerHTML = `
        <div class="flex items-center gap-2 ${flexDir}" role="none">
          <div data-slot="separator" data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${cn(base3, "flex-1")}"></div>
          <span class="text-xs text-muted-foreground">${label}</span>
          <div data-slot="separator" data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${cn(base3, "flex-1")}"></div>
        </div>`;
    } else {
      this.innerHTML = `<div data-slot="separator" data-orientation="${orientation}" role="separator" aria-orientation="${orientation}" class="${base3}"></div>`;
    }
  }
};
define("bp-separator", BpSeparator);

// components/bp-scroll-area.ts
var BpScrollArea = class extends HTMLElement {
  connectedCallback() {
    const height = attr(this, "height", "auto");
    const body = html(this);
    const rootClass = "relative";
    const viewportClass = "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1";
    const scrollbarClass = "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent";
    const thumbClass = "relative flex-1 rounded-full bg-border";
    this.innerHTML = `
      <div data-slot="scroll-area" class="${rootClass}" style="height:${height};overflow:hidden">
        <div data-slot="scroll-area-viewport" class="${viewportClass}" style="overflow:auto;height:100%" tabindex="0">
          ${body}
        </div>
        <div data-slot="scroll-area-scrollbar" data-orientation="vertical" class="${scrollbarClass}" style="position:absolute;right:0;top:0;bottom:0">
          <div data-slot="scroll-area-thumb" class="${thumbClass}"></div>
        </div>
      </div>`;
  }
};
define("bp-scroll-area", BpScrollArea);

// components/bp-resizable.ts
var BpResizable = class extends HTMLElement {
  connectedCallback() {
    const direction = attr(this, "direction", "horizontal");
    const body = html(this);
    const groupClass = "flex h-full w-full aria-[orientation=vertical]:flex-col";
    this.innerHTML = `<div data-slot="resizable-panel-group" aria-orientation="${direction}" class="${groupClass}">${body}</div>`;
  }
};
define("bp-resizable", BpResizable);
var BpResizablePanel = class extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    this.innerHTML = `<div data-slot="resizable-panel" style="flex:1;overflow:auto">${body}</div>`;
  }
};
define("bp-resizable-panel", BpResizablePanel);
var BpResizableHandle = class extends HTMLElement {
  connectedCallback() {
    const withHandle = boolAttr(this, "with-handle");
    const handleClass = "relative flex w-px items-center justify-center bg-border ring-offset-background after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden aria-[orientation=horizontal]:h-px aria-[orientation=horizontal]:w-full aria-[orientation=horizontal]:after:left-0 aria-[orientation=horizontal]:after:h-1 aria-[orientation=horizontal]:after:w-full aria-[orientation=horizontal]:after:translate-x-0 aria-[orientation=horizontal]:after:-translate-y-1/2 [&[aria-orientation=horizontal]>div]:rotate-90";
    const parent = this.closest("bp-resizable");
    const orientation = parent ? parent.getAttribute("direction") || "horizontal" : "horizontal";
    const handleInner = withHandle ? `<div class="z-10 flex h-6 w-1 shrink-0 rounded-lg bg-border"></div>` : "";
    this.innerHTML = `<div data-slot="resizable-handle" role="separator" aria-orientation="${orientation}" class="${handleClass}">${handleInner}</div>`;
  }
};
define("bp-resizable-handle", BpResizableHandle);

// components/bp-sidebar.ts
var BpSidebarContent = class extends HTMLElement {
  connectedCallback() {
    const classes = "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto";
    this.setAttribute("data-slot", "sidebar-content");
    this.classList.add(...classes.split(" "));
  }
};
var BpSidebarMain = class extends HTMLElement {
  connectedCallback() {
    const classes = "relative flex w-full flex-1 flex-col bg-background";
    this.setAttribute("data-slot", "sidebar-inset");
    this.classList.add(...classes.split(" "));
  }
};
var BpSidebar = class extends HTMLElement {
  connectedCallback() {
    const width = attr(this, "width", "16rem");
    const side = attr(this, "side", "left");
    const wrapperClasses = "group/sidebar-wrapper flex min-h-svh w-full";
    const outerClasses = "group peer text-sidebar-foreground";
    const gapClasses = "relative bg-transparent transition-[width] duration-200 ease-linear";
    const containerBase2 = cn(
      "fixed inset-y-0 z-10 hidden h-svh transition-[left,right,width] duration-200 ease-linear md:flex",
      side === "left" ? "left-0 border-r" : "right-0 border-l"
    );
    const innerClasses = "flex size-full flex-col bg-sidebar";
    const content = this.innerHTML;
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = content;
    let sidebarContentHtml = "";
    let mainContentHtml = "";
    const children = Array.from(tempDiv.children);
    for (const child of children) {
      if (child.tagName.toLowerCase() === "bp-sidebar-content") {
        sidebarContentHtml = child.outerHTML;
      } else if (child.tagName.toLowerCase() === "bp-sidebar-main") {
        mainContentHtml = child.outerHTML;
      }
    }
    if (!sidebarContentHtml && !mainContentHtml) {
      sidebarContentHtml = content;
    }
    this.style.setProperty("--sidebar-width", width);
    this.setAttribute("data-slot", "sidebar-wrapper");
    this.setAttribute("data-side", side);
    this.innerHTML = `
      <div class="${wrapperClasses}" style="--sidebar-width: ${width}">
        <div class="${outerClasses}" data-slot="sidebar" data-side="${side}" data-state="expanded">
          <div data-slot="sidebar-gap" class="${gapClasses}" style="width: var(--sidebar-width)"></div>
          <div data-slot="sidebar-container" data-side="${side}" class="${containerBase2}" style="width: var(--sidebar-width)">
            <div data-sidebar="sidebar" data-slot="sidebar-inner" class="${innerClasses}">
              ${sidebarContentHtml}
            </div>
          </div>
        </div>
        ${mainContentHtml}
      </div>`;
  }
};
define("bp-sidebar-content", BpSidebarContent);
define("bp-sidebar-main", BpSidebarMain);
define("bp-sidebar", BpSidebar);

// components/bp-table.ts
var TABLE_CLASSES = "w-full caption-bottom text-xs";
var THEAD_CLASSES = "[&_tr]:border-b";
var TBODY_CLASSES = "[&_tr:last-child]:border-0";
var TFOOT_CLASSES = "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0";
var TR_CLASSES = "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted";
var TH_CLASSES = "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0";
var TD_CLASSES = "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0";
var CAPTION_CLASSES = "mt-4 text-xs text-muted-foreground";
function addClasses(el, classes) {
  for (const cls of classes.split(" ")) {
    if (cls) el.classList.add(cls);
  }
}
var BpTable = class extends HTMLElement {
  connectedCallback() {
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
};
define("bp-table", BpTable);

// components/bp-badge.ts
var variants3 = {
  default: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  destructive: "bg-destructive/10 text-destructive dark:bg-destructive/20",
  outline: "border-border bg-input/20 text-foreground dark:bg-input/30",
  ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50"
};
var BpBadge = class extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const text = this.textContent?.trim() || "";
    const base3 = "inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap select-none";
    this.innerHTML = `<span data-slot="badge" class="${cn(base3, variants3[variant] || variants3.default)}">${text}</span>`;
  }
};
define("bp-badge", BpBadge);

// components/bp-avatar.ts
var BpAvatar = class extends HTMLElement {
  connectedCallback() {
    const src = attr(this, "src");
    const fallback = attr(this, "fallback");
    const size = attr(this, "size", "md");
    const rootClasses = "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten";
    const imageClasses = "aspect-square size-full rounded-full object-cover";
    const fallbackClasses = "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs";
    const sizeAttr = size === "sm" ? "sm" : size === "lg" ? "lg" : "default";
    const imageHtml = src ? `<img data-slot="avatar-image" class="${imageClasses}" src="${src}" alt="${fallback || ""}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : "";
    const fallbackHtml = `<span data-slot="avatar-fallback" class="${fallbackClasses}" ${src ? 'style="display:none"' : ""}>${fallback || ""}</span>`;
    this.innerHTML = `<span data-slot="avatar" data-size="${sizeAttr}" class="${rootClasses}">${imageHtml}${fallbackHtml}</span>`;
  }
};
define("bp-avatar", BpAvatar);

// components/bp-chart.ts
var BpChart = class extends HTMLElement {
  connectedCallback() {
    const type = attr(this, "type", "bar");
    const title = attr(this, "title");
    const height = attr(this, "height", "200");
    const containerClasses = "flex aspect-video justify-center text-xs [&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden";
    const tooltipClasses = "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs/relaxed shadow-xl";
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
      const circumference = 2 * Math.PI * r;
      const slices = [
        { pct: 0.4, opacity: "0.9" },
        { pct: 0.25, opacity: "0.7" },
        { pct: 0.2, opacity: "0.5" },
        { pct: 0.15, opacity: "0.3" }
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
    const legendItems = type === "pie" ? ["40%", "25%", "20%", "15%"].map(
      (pct, i) => `<div class="${legendClasses.replace("flex items-center justify-center gap-4 pt-3", "flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-muted-foreground")}">
            <div class="${legendDotClasses}" style="background-color:var(--color-primary, hsl(var(--primary)));opacity:${[0.9, 0.7, 0.5, 0.3][i]}"></div>
            <span class="text-xs text-muted-foreground">${pct}</span>
          </div>`
    ).join("") : "";
    this.innerHTML = `
      <div data-slot="chart" class="${containerClasses}" style="height:${height}px">
        <div class="flex flex-col w-full gap-2">
          ${title ? `<div class="text-sm font-medium">${title}</div>` : ""}
          ${chartSvg}
          ${legendItems ? `<div class="${legendClasses}">${legendItems}</div>` : ""}
        </div>
      </div>`;
  }
};
define("bp-chart", BpChart);

// components/bp-kbd.ts
var BpKbd = class extends HTMLElement {
  connectedCallback() {
    const text = this.textContent?.trim() || "";
    const classes = "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-xs bg-muted px-1 font-sans text-[0.625rem] font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3";
    this.innerHTML = `<kbd data-slot="kbd" class="${classes}">${text}</kbd>`;
  }
};
define("bp-kbd", BpKbd);

// components/bp-spinner.ts
var sizes3 = {
  sm: "size-3",
  md: "size-4",
  lg: "size-6"
};
var BpSpinner = class extends HTMLElement {
  connectedCallback() {
    const size = attr(this, "size", "md");
    const baseClasses = "animate-spin";
    const sizeClass = sizes3[size] || sizes3.md;
    this.innerHTML = `<svg
      role="status"
      aria-label="Loading"
      class="${cn(baseClasses, sizeClass)}"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>`;
  }
};
define("bp-spinner", BpSpinner);

// components/bp-skeleton.ts
var variantClasses = {
  text: "rounded-md",
  circular: "rounded-full",
  rectangular: "rounded-none"
};
var BpSkeleton = class extends HTMLElement {
  connectedCallback() {
    const width = attr(this, "width");
    const height = attr(this, "height");
    const variant = attr(this, "variant", "text");
    const baseClasses = "animate-pulse bg-muted";
    const shape = variantClasses[variant] || variantClasses.text;
    const style = [
      width ? `width:${width}` : "",
      height ? `height:${height}` : ""
    ].filter(Boolean).join(";");
    this.innerHTML = `<div data-slot="skeleton" class="${cn(baseClasses, shape)}"${style ? ` style="${style}"` : ""}></div>`;
  }
};
define("bp-skeleton", BpSkeleton);

// components/bp-progress.ts
var BpProgress = class extends HTMLElement {
  connectedCallback() {
    const value = Math.max(0, Math.min(100, Number(attr(this, "value", "0"))));
    const label = attr(this, "label");
    const rootClasses = "flex flex-wrap gap-3";
    const trackClasses = "relative flex h-1 w-full items-center overflow-x-hidden rounded-md bg-muted";
    const indicatorClasses = "h-full bg-primary transition-all";
    const labelClasses = "text-xs/relaxed font-medium";
    const valueClasses = "ml-auto text-xs/relaxed text-muted-foreground tabular-nums";
    this.innerHTML = `
      <div data-slot="progress" class="${rootClasses}">
        ${label ? `<span data-slot="progress-label" class="${labelClasses}">${label}</span>` : ""}
        <span data-slot="progress-value" class="${valueClasses}">${value}%</span>
        <div data-slot="progress-track" class="${trackClasses}">
          <div data-slot="progress-indicator" class="${indicatorClasses}" style="width:${value}%"></div>
        </div>
      </div>`;
  }
};
define("bp-progress", BpProgress);

// components/bp-carousel.ts
var BpCarousel = class extends HTMLElement {
  connectedCallback() {
    const slides = Array.from(this.children);
    const body = slides.map((child) => child.outerHTML).join("");
    const rootClasses = "relative";
    const overflowClasses = "overflow-hidden";
    const contentClasses = "flex -ml-4";
    const itemClasses = "min-w-0 shrink-0 grow-0 basis-full pl-4";
    const prevClasses = "absolute touch-manipulation rounded-full top-1/2 -left-12 -translate-y-1/2";
    const nextClasses = "absolute touch-manipulation rounded-full top-1/2 -right-12 -translate-y-1/2";
    const slideItems = slides.length > 0 ? slides.map(
      (child, i) => `<div role="group" aria-roledescription="slide" data-slot="carousel-item" class="${itemClasses}" ${i > 0 ? 'style="display:none"' : ""}>${child.outerHTML}</div>`
    ).join("") : `<div role="group" aria-roledescription="slide" data-slot="carousel-item" class="${itemClasses}"><div class="flex items-center justify-center h-32 bg-muted rounded-lg text-muted-foreground text-xs">Slide</div></div>`;
    const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>`;
    const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
    this.innerHTML = `
      <div data-slot="carousel" class="${rootClasses}" role="region" aria-roledescription="carousel">
        <div data-slot="carousel-content" class="${overflowClasses}">
          <div class="${contentClasses}">
            ${slideItems}
          </div>
        </div>
        <button data-slot="carousel-previous" class="${prevClasses} inline-flex items-center justify-center size-7 rounded-full border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
          ${chevronLeft}
          <span class="sr-only">Previous slide</span>
        </button>
        <button data-slot="carousel-next" class="${nextClasses} inline-flex items-center justify-center size-7 rounded-full border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground">
          ${chevronRight}
          <span class="sr-only">Next slide</span>
        </button>
      </div>`;
  }
};
define("bp-carousel", BpCarousel);

// components/bp-empty.ts
var icons = {
  inbox: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/></svg>`,
  file: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/></svg>`,
  search: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`
};
var BpEmpty = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const icon = attr(this, "icon", "inbox");
    const rootClasses = "flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-xl border-dashed p-6 text-center text-balance";
    const headerClasses = "flex max-w-sm flex-col items-center gap-1";
    const mediaClasses = "mb-2 flex shrink-0 items-center justify-center flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4";
    const titleClasses2 = "font-heading text-sm font-medium tracking-tight";
    const descClasses = "text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary";
    const iconSvg = icons[icon] || icons.inbox;
    this.innerHTML = `
      <div data-slot="empty" class="${rootClasses}">
        <div data-slot="empty-header" class="${headerClasses}">
          <div data-slot="empty-icon" data-variant="icon" class="${mediaClasses}">
            ${iconSvg}
          </div>
          ${title ? `<div data-slot="empty-title" class="${titleClasses2}">${title}</div>` : ""}
          ${description ? `<div data-slot="empty-description" class="${descClasses}">${description}</div>` : ""}
        </div>
      </div>`;
  }
};
define("bp-empty", BpEmpty);

// components/bp-calendar.ts
var BpCalendar = class extends HTMLElement {
  connectedCallback() {
    const rootClasses = "group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(6)]";
    const monthsClasses = "relative flex flex-col gap-4 md:flex-row";
    const monthClasses = "flex w-full flex-col gap-4";
    const navClasses = "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1";
    const navBtnClasses = "size-(--cell-size) p-0 select-none inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground";
    const captionClasses = "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)";
    const captionLabelClasses = "font-medium select-none text-sm";
    const weekdaysClasses = "flex";
    const weekdayClasses = "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none";
    const weekClasses = "mt-2 flex w-full";
    const dayClasses = "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none";
    const dayBtnClasses = "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal inline-flex items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground";
    const todayClasses = "rounded-(--cell-radius) bg-muted text-foreground";
    const outsideClasses = "text-muted-foreground";
    const now = /* @__PURE__ */ new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();
    const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m15 18-6-6 6-6"/></svg>`;
    const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m9 18 6-6-6-6"/></svg>`;
    const weekdayHeaders = dayNames.map((d) => `<th class="${weekdayClasses}" style="text-align:center;padding:4px 0">${d}</th>`).join("");
    const cells = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      cells.push(`<td class="${dayClasses}"><button class="${dayBtnClasses} ${outsideClasses}" tabindex="-1">${d}</button></td>`);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today;
      const extraClasses = isToday ? todayClasses : "";
      cells.push(`<td class="${dayClasses}${isToday ? " " + todayClasses : ""}"><button class="${dayBtnClasses}${isToday ? " " + todayClasses : ""}" tabindex="-1">${d}</button></td>`);
    }
    const remaining = 7 - cells.length % 7;
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        cells.push(`<td class="${dayClasses}"><button class="${dayBtnClasses} ${outsideClasses}" tabindex="-1">${d}</button></td>`);
      }
    }
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(`<tr class="${weekClasses}">${cells.slice(i, i + 7).join("")}</tr>`);
    }
    this.innerHTML = `
      <div data-slot="calendar" class="${rootClasses}">
        <div class="${monthsClasses}">
          <div class="${monthClasses}">
            <div class="${navClasses}">
              <button class="${navBtnClasses}" aria-label="Previous month">${chevronLeft}</button>
              <div class="${captionClasses}">
                <span class="${captionLabelClasses}">${monthName}</span>
              </div>
              <button class="${navBtnClasses}" aria-label="Next month">${chevronRight}</button>
            </div>
            <table class="w-full border-collapse" style="margin-top:28px">
              <thead>
                <tr class="${weekdaysClasses}">${weekdayHeaders}</tr>
              </thead>
              <tbody>
                ${weeks.join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;
  }
};
define("bp-calendar", BpCalendar);

// components/bp-combobox.ts
var BpComboboxItem = class extends HTMLElement {
  connectedCallback() {
  }
};
var BpCombobox = class extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Select...");
    const disabled = boolAttr(this, "disabled");
    const itemEls = Array.from(this.querySelectorAll("bp-combobox-item"));
    const items = itemEls.map((el) => ({
      value: attr(el, "value"),
      label: attr(el, "label") || el.textContent?.trim() || attr(el, "value")
    }));
    const inputGroupClasses = "w-auto";
    const triggerClasses = "[&_svg:not([class*='size-'])]:size-3.5";
    const contentClasses = "group/combobox-content relative max-h-(--available-height) w-(--anchor-width) max-w-(--available-width) min-w-[calc(var(--anchor-width)+--spacing(7))] origin-(--transform-origin) overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100";
    const listClasses = "no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0";
    const itemClasses = "relative flex min-h-7 w-full cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";
    const emptyClasses = "hidden w-full justify-center py-2 text-center text-xs/relaxed text-muted-foreground group-data-empty/combobox-content:flex";
    const indicatorClasses = "pointer-events-none absolute right-2 flex items-center justify-center";
    const chevronDown = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none size-3.5 text-muted-foreground"><path d="m6 9 6 6 6-6"/></svg>`;
    const checkIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none"><path d="M20 6 9 17l-5-5"/></svg>`;
    const itemsHtml = items.map(
      (item) => `<div data-slot="combobox-item" data-value="${item.value}" class="${itemClasses}" role="option">
        <span>${item.label}</span>
        <span class="${indicatorClasses}" style="display:none">${checkIcon}</span>
      </div>`
    ).join("");
    this.innerHTML = `
      <div data-slot="combobox" class="relative inline-block w-full">
        <div data-slot="input-group" class="${inputGroupClasses} flex items-center">
          <input
            data-slot="input"
            type="text"
            placeholder="${placeholder}"
            ${disabled ? "disabled" : ""}
            class="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30 pr-7"
            readonly
          />
          <button data-slot="combobox-trigger" class="${triggerClasses} absolute right-0 top-0 h-7 w-7 flex items-center justify-center" ${disabled ? "disabled" : ""}>
            ${chevronDown}
          </button>
        </div>
        <div data-slot="combobox-content" class="${contentClasses} absolute top-full left-0 mt-1.5 w-full z-50" style="display:none">
          <div data-slot="combobox-list" class="${listClasses}" role="listbox">
            ${itemsHtml || `<div data-slot="combobox-empty" class="${emptyClasses}" style="display:flex">No results</div>`}
          </div>
        </div>
      </div>`;
    const trigger = this.querySelector("[data-slot='combobox-trigger']");
    const content = this.querySelector("[data-slot='combobox-content']");
    const input = this.querySelector("input");
    if (trigger && content && !disabled) {
      const toggle = () => {
        const isOpen = content.style.display !== "none";
        content.style.display = isOpen ? "none" : "block";
      };
      trigger.addEventListener("click", toggle);
      input.addEventListener("click", toggle);
      const comboboxItems = this.querySelectorAll("[data-slot='combobox-item']");
      comboboxItems.forEach((itemEl) => {
        itemEl.addEventListener("click", () => {
          const label = itemEl.querySelector("span")?.textContent || "";
          input.value = label;
          comboboxItems.forEach((el) => {
            const ind = el.querySelector("[class*='pointer-events-none absolute']");
            if (ind) ind.style.display = "none";
          });
          const indicator = itemEl.querySelector("[class*='pointer-events-none absolute']");
          if (indicator) indicator.style.display = "flex";
          content.style.display = "none";
        });
      });
    }
  }
};
define("bp-combobox-item", BpComboboxItem);
define("bp-combobox", BpCombobox);

// components/bp-tabs.ts
var tabsRootClasses = "group/tabs flex gap-2 data-horizontal:flex-col";
var tabsListClasses = "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none bg-muted";
var tabsTriggerBase = "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-[calc(--spacing(1.25))] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";
var tabsTriggerLineVariant = "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent";
var tabsTriggerActiveClasses = "data-active:bg-background data-active:text-foreground dark:data-active:border-input dark:data-active:bg-input/30 dark:data-active:text-foreground";
var tabsTriggerAfterClasses = "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100";
var tabsTriggerClasses = cn(
  tabsTriggerBase,
  tabsTriggerLineVariant,
  tabsTriggerActiveClasses,
  tabsTriggerAfterClasses
);
var tabsContentClasses = "flex-1 text-xs/relaxed outline-none";
var BpTab = class extends HTMLElement {
  // Parsed by parent bp-tabs; no-op standalone
};
var BpTabs = class extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const tabs = temp.querySelectorAll("bp-tab");
    let activeIdx = 0;
    tabs.forEach((tab, i) => {
      if (tab.hasAttribute("active") && tab.getAttribute("active") !== "false") {
        activeIdx = i;
      }
    });
    let triggersHTML = "";
    tabs.forEach((tab, i) => {
      const label = tab.getAttribute("label") || `Tab ${i + 1}`;
      const isActive = i === activeIdx;
      triggersHTML += `<button
        type="button"
        role="tab"
        data-slot="tabs-trigger"
        data-tab-index="${i}"
        ${isActive ? 'data-active=""' : ""}
        aria-selected="${isActive}"
        class="${tabsTriggerClasses}"
      >${label}</button>`;
    });
    let panelsHTML = "";
    tabs.forEach((tab, i) => {
      const isActive = i === activeIdx;
      panelsHTML += `<div
        data-slot="tabs-content"
        data-tab-index="${i}"
        role="tabpanel"
        class="${tabsContentClasses}"
        style="${isActive ? "" : "display:none"}"
      >${tab.innerHTML}</div>`;
    });
    this.innerHTML = `
      <div data-slot="tabs" data-orientation="horizontal" class="${tabsRootClasses}">
        <div data-slot="tabs-list" data-variant="default" role="tablist" class="${tabsListClasses}">
          ${triggersHTML}
        </div>
        ${panelsHTML}
      </div>
    `;
    this.querySelectorAll("[data-slot='tabs-trigger']").forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-tab-index");
        this.querySelectorAll("[data-slot='tabs-trigger']").forEach((t) => {
          t.removeAttribute("data-active");
          t.setAttribute("aria-selected", "false");
        });
        btn.setAttribute("data-active", "");
        btn.setAttribute("aria-selected", "true");
        this.querySelectorAll("[data-slot='tabs-content']").forEach((p) => {
          p.style.display = p.getAttribute("data-tab-index") === idx ? "" : "none";
        });
      });
    });
  }
};
define("bp-tab", BpTab);
define("bp-tabs", BpTabs);

// components/bp-breadcrumb.ts
var breadcrumbListClasses = "flex flex-wrap items-center gap-1.5 text-xs/relaxed wrap-break-word text-muted-foreground";
var breadcrumbItemClasses = "inline-flex items-center gap-1";
var breadcrumbLinkClasses = "transition-colors hover:text-foreground";
var breadcrumbPageClasses = "font-normal text-foreground";
var breadcrumbSeparatorClasses = "[&>svg]:size-3.5";
var chevronRightSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>`;
var BpBreadcrumbItem = class extends HTMLElement {
  // Parsed by parent bp-breadcrumb; no-op standalone
};
var BpBreadcrumb = class extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-breadcrumb-item");
    let listHTML = "";
    items.forEach((item, i) => {
      const href = item.getAttribute("href");
      const text = item.textContent?.trim() || "";
      const isLast = i === items.length - 1;
      let contentHTML;
      if (isLast || !href) {
        contentHTML = `<span data-slot="breadcrumb-page" role="link" aria-disabled="true" aria-current="page" class="${breadcrumbPageClasses}">${text}</span>`;
      } else {
        contentHTML = `<a data-slot="breadcrumb-link" href="${href}" class="${breadcrumbLinkClasses}">${text}</a>`;
      }
      listHTML += `<li data-slot="breadcrumb-item" class="${breadcrumbItemClasses}">${contentHTML}</li>`;
      if (!isLast) {
        listHTML += `<li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" class="${breadcrumbSeparatorClasses}">${chevronRightSVG}</li>`;
      }
    });
    this.innerHTML = `
      <nav aria-label="breadcrumb" data-slot="breadcrumb">
        <ol data-slot="breadcrumb-list" class="${breadcrumbListClasses}">
          ${listHTML}
        </ol>
      </nav>
    `;
  }
};
define("bp-breadcrumb-item", BpBreadcrumbItem);
define("bp-breadcrumb", BpBreadcrumb);

// components/bp-pagination.ts
var paginationClasses = "mx-auto flex w-full justify-center";
var paginationContentClasses = "flex items-center gap-0.5";
var buttonBase = "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
var buttonGhost = "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50";
var buttonOutline = "border-border hover:bg-input/50 hover:text-foreground dark:bg-input/30";
var buttonSizeIcon = "size-7 [&_svg:not([class*='size-'])]:size-3.5";
var buttonSizeDefault = "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5";
var paginationPrevClasses = cn(buttonBase, buttonGhost, buttonSizeDefault, "pl-2!");
var paginationNextClasses = cn(buttonBase, buttonGhost, buttonSizeDefault, "pr-2!");
var paginationLinkActive = cn(buttonBase, buttonOutline, buttonSizeIcon);
var paginationLinkInactive = cn(buttonBase, buttonGhost, buttonSizeIcon);
var paginationEllipsisClasses = "flex size-7 items-center justify-center [&_svg:not([class*='size-'])]:size-3.5";
var chevronLeftSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-icon="inline-start"><path d="m15 18-6-6 6-6"/></svg>`;
var chevronRightSVG2 = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" data-icon="inline-end"><path d="m9 18 6-6-6-6"/></svg>`;
var moreHorizontalSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>`;
function buildPageRange(total, current, siblings) {
  const pages = [];
  const left = Math.max(1, current - siblings);
  const right = Math.min(total, current + siblings);
  if (left > 1) {
    pages.push(1);
    if (left > 2) pages.push("ellipsis");
  }
  for (let i = left; i <= right; i++) {
    pages.push(i);
  }
  if (right < total) {
    if (right < total - 1) pages.push("ellipsis");
    pages.push(total);
  }
  return pages;
}
var BpPagination = class extends HTMLElement {
  connectedCallback() {
    const total = parseInt(attr(this, "total", "1"), 10);
    const current = parseInt(attr(this, "current", "1"), 10);
    const siblings = parseInt(attr(this, "siblings", "1"), 10);
    this.render(total, current, siblings);
  }
  render(total, current, siblings) {
    const pages = buildPageRange(total, current, siblings);
    const prevDisabled = current <= 1;
    const prevHTML = `<li data-slot="pagination-item">
      <a aria-label="Go to previous page" data-slot="pagination-link" data-page="${current - 1}" class="${paginationPrevClasses}" ${prevDisabled ? 'aria-disabled="true" style="pointer-events:none;opacity:0.5"' : ""}>
        ${chevronLeftSVG}<span class="hidden sm:block">Previous</span>
      </a>
    </li>`;
    let pagesHTML = "";
    pages.forEach((p) => {
      if (p === "ellipsis") {
        pagesHTML += `<li data-slot="pagination-item">
          <span aria-hidden data-slot="pagination-ellipsis" class="${paginationEllipsisClasses}">
            ${moreHorizontalSVG}<span class="sr-only">More pages</span>
          </span>
        </li>`;
      } else {
        const isActive = p === current;
        pagesHTML += `<li data-slot="pagination-item">
          <a data-slot="pagination-link" data-page="${p}" data-active="${isActive}" ${isActive ? 'aria-current="page"' : ""} class="${isActive ? paginationLinkActive : paginationLinkInactive}">${p}</a>
        </li>`;
      }
    });
    const nextDisabled = current >= total;
    const nextHTML = `<li data-slot="pagination-item">
      <a aria-label="Go to next page" data-slot="pagination-link" data-page="${current + 1}" class="${paginationNextClasses}" ${nextDisabled ? 'aria-disabled="true" style="pointer-events:none;opacity:0.5"' : ""}>
        <span class="hidden sm:block">Next</span>${chevronRightSVG2}
      </a>
    </li>`;
    this.innerHTML = `
      <nav role="navigation" aria-label="pagination" data-slot="pagination" class="${paginationClasses}">
        <ul data-slot="pagination-content" class="${paginationContentClasses}">
          ${prevHTML}${pagesHTML}${nextHTML}
        </ul>
      </nav>
    `;
    this.querySelectorAll("a[data-slot='pagination-link']").forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const page = parseInt(link.getAttribute("data-page") || "1", 10);
        if (page < 1 || page > total) return;
        this.setAttribute("current", String(page));
        this.render(total, page, siblings);
        this.dispatchEvent(new CustomEvent("page-change", { detail: { page }, bubbles: true }));
      });
    });
  }
};
define("bp-pagination", BpPagination);

// components/bp-nav-menu.ts
var navMenuClasses = "group/navigation-menu relative flex max-w-max flex-1 items-center justify-center";
var navMenuListClasses = "group flex flex-1 list-none items-center justify-center gap-0";
var navMenuItemClasses = "relative";
var navMenuLinkClasses = "flex items-center gap-1.5 rounded-lg p-2 text-xs/relaxed transition-all outline-none hover:bg-muted focus:bg-muted focus-visible:ring-2 focus-visible:ring-ring/30 focus-visible:outline-1 in-data-[slot=navigation-menu-content]:rounded-md data-[active=true]:bg-muted/50 data-[active=true]:hover:bg-muted data-[active=true]:focus:bg-muted [&_svg:not([class*='size-'])]:size-4";
var BpNavItem = class extends HTMLElement {
  // Parsed by parent bp-nav-menu; no-op standalone
};
var BpNavMenu = class extends HTMLElement {
  connectedCallback() {
    const originalHTML = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = originalHTML;
    const items = temp.querySelectorAll("bp-nav-item");
    let itemsHTML = "";
    items.forEach((item) => {
      const label = item.getAttribute("label") || "";
      const href = item.getAttribute("href") || "#";
      const active = item.hasAttribute("active") && item.getAttribute("active") !== "false";
      itemsHTML += `
        <li data-slot="navigation-menu-item" class="${navMenuItemClasses}">
          <a
            data-slot="navigation-menu-link"
            href="${href}"
            data-active="${active}"
            class="${navMenuLinkClasses}"
          >${label}</a>
        </li>
      `;
    });
    this.innerHTML = `
      <nav data-slot="navigation-menu" class="${navMenuClasses}">
        <ul data-slot="navigation-menu-list" class="${navMenuListClasses}">
          ${itemsHTML}
        </ul>
      </nav>
    `;
  }
};
define("bp-nav-item", BpNavItem);
define("bp-nav-menu", BpNavMenu);

// components/bp-dialog.ts
var BpDialog = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const body = html(this);
    const headerHtml = title || description ? `<div data-slot="dialog-header" class="flex flex-col gap-1">
            ${title ? `<div data-slot="dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="dialog-description" class="text-xs/relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>` : "";
    const contentHtml = body ? `<div data-slot="dialog-body">${body}</div>` : "";
    const footerSlot = attr(this, "footer");
    const footerHtml = footerSlot ? `<div data-slot="dialog-footer" class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">${footerSlot}</div>` : "";
    this.innerHTML = `
      <div data-slot="dialog-content" class="${cn(
      "grid w-full max-w-[calc(100%-2rem)] gap-4 rounded-xl bg-popover p-4 text-xs/relaxed text-popover-foreground ring-1 ring-foreground/10 sm:max-w-sm"
    )}">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
};
define("bp-dialog", BpDialog);

// components/bp-alert-dialog.ts
var BpAlertDialog = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const confirmLabel = attr(this, "confirm-label", "Continue");
    const cancelLabel = attr(this, "cancel-label", "Cancel");
    const body = html(this);
    const headerHtml = title || description ? `<div data-slot="alert-dialog-header" class="grid grid-rows-[auto_1fr] place-items-center gap-1 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4 sm:place-items-start sm:text-left sm:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]">
            ${title ? `<div data-slot="alert-dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="alert-dialog-description" class="text-xs/relaxed text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>` : "";
    const contentHtml = body ? `<div data-slot="alert-dialog-body">${body}</div>` : "";
    const footerHtml = `
      <div data-slot="alert-dialog-footer" class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button data-slot="alert-dialog-cancel" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 hover:text-foreground dark:bg-input/30">${cancelLabel}</button>
        <button data-slot="alert-dialog-action" class="inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 bg-primary text-primary-foreground hover:bg-primary/80">${confirmLabel}</button>
      </div>`;
    this.innerHTML = `
      <div data-slot="alert-dialog-content" class="${cn(
      "group/alert-dialog-content grid w-full gap-3 rounded-xl bg-popover p-4 text-popover-foreground ring-1 ring-foreground/10 data-[size=default]:max-w-xs data-[size=sm]:max-w-64 data-[size=default]:sm:max-w-sm"
    )}" data-size="default">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
};
define("bp-alert-dialog", BpAlertDialog);

// components/bp-drawer.ts
var sideStyles = {
  bottom: "inset-x-0 bottom-0 mt-24 max-h-[80vh]",
  top: "inset-x-0 top-0 mb-24 max-h-[80vh]",
  left: "inset-y-0 left-0 w-3/4 sm:max-w-sm",
  right: "inset-y-0 right-0 w-3/4 sm:max-w-sm"
};
var BpDrawer = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "bottom");
    const body = html(this);
    const isVertical = side === "bottom" || side === "top";
    const handleHtml = side === "bottom" ? `<div class="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted"></div>` : "";
    const headerHtml = title || description ? `<div data-slot="drawer-header" class="${cn(
      "flex flex-col gap-1 p-4",
      isVertical && "text-center",
      "md:text-left"
    )}">
            ${title ? `<div data-slot="drawer-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="drawer-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>` : "";
    const contentHtml = body ? `<div data-slot="drawer-body" class="p-4">${body}</div>` : "";
    const footerSlot = attr(this, "footer");
    const footerHtml = footerSlot ? `<div data-slot="drawer-footer" class="mt-auto flex flex-col gap-2 p-4">${footerSlot}</div>` : "";
    this.innerHTML = `
      <div data-slot="drawer-content" class="${cn(
      "flex h-auto flex-col bg-transparent p-2 text-xs/relaxed text-popover-foreground before:absolute before:inset-2 before:-z-10 before:rounded-xl before:border before:border-border before:bg-popover",
      sideStyles[side] || sideStyles.bottom
    )}" style="position:relative;">
        ${handleHtml}
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
};
define("bp-drawer", BpDrawer);

// components/bp-sheet.ts
var sideStyles2 = {
  right: "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
  left: "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
  top: "inset-x-0 top-0 h-auto border-b",
  bottom: "inset-x-0 bottom-0 h-auto border-t"
};
var BpSheet = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "right");
    const body = html(this);
    const headerHtml = title || description ? `<div data-slot="sheet-header" class="flex flex-col gap-1.5 p-6">
            ${title ? `<div data-slot="sheet-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="sheet-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>` : "";
    const contentHtml = body ? `<div data-slot="sheet-body" class="p-6">${body}</div>` : "";
    const footerSlot = attr(this, "footer");
    const footerHtml = footerSlot ? `<div data-slot="sheet-footer" class="mt-auto flex flex-col gap-2 p-6">${footerSlot}</div>` : "";
    this.innerHTML = `
      <div data-slot="sheet-content" data-side="${side}" class="${cn(
      "flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg",
      sideStyles2[side] || sideStyles2.right
    )}">
        ${headerHtml}
        ${contentHtml}
        ${footerHtml}
      </div>`;
  }
};
define("bp-sheet", BpSheet);

// components/bp-popover.ts
var BpPopover = class extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");
    const body = html(this);
    const triggerHtml = trigger ? `<div data-slot="popover-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 hover:text-foreground dark:bg-input/30">${trigger}</div>` : "";
    const contentHtml = body ? `<div data-slot="popover-content" class="z-50 flex w-72 origin-(--transform-origin) flex-col gap-4 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden">${body}</div>` : "";
    this.innerHTML = `
      <div data-slot="popover" class="inline-flex flex-col items-start gap-1">
        ${triggerHtml}
        ${contentHtml}
      </div>`;
  }
};
define("bp-popover", BpPopover);

// components/bp-hover-card.ts
var BpHoverCard = class extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");
    const body = html(this);
    const positionerClasses = "isolate z-50";
    const contentClasses = "z-50 w-72 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-xs/relaxed text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden";
    this.innerHTML = `
      <div data-slot="hover-card">
        <span data-slot="hover-card-trigger" class="cursor-pointer underline decoration-dotted">${trigger}</span>
        <div class="${positionerClasses}">
          <div data-slot="hover-card-content" class="${contentClasses}">
            ${body}
          </div>
        </div>
      </div>`;
  }
};
define("bp-hover-card", BpHoverCard);

// components/bp-tooltip.ts
var BpTooltip = class extends HTMLElement {
  connectedCallback() {
    const content = attr(this, "content");
    const triggerHTML = html(this);
    const positionerClasses = "isolate z-50";
    const popupClasses = "z-50 inline-flex w-fit max-w-xs origin-(--transform-origin) items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background";
    const arrowClasses = "z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground";
    this.innerHTML = `
      <span data-slot="tooltip" class="inline-flex">
        <span data-slot="tooltip-trigger">${triggerHTML}</span>
        <span class="${positionerClasses}">
          <span data-slot="tooltip-content" class="${popupClasses}">
            ${content}
            <span class="${arrowClasses}"></span>
          </span>
        </span>
      </span>`;
  }
};
define("bp-tooltip", BpTooltip);

// components/bp-command.ts
var BpCommand = class extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Search...");
    const body = html(this);
    const temp = document.createElement("div");
    temp.innerHTML = body;
    let groupsHTML = "";
    const groups = temp.querySelectorAll("bp-command-group");
    const topLevelItems = temp.querySelectorAll(":scope > bp-command-item");
    if (topLevelItems.length > 0) {
      groupsHTML += renderItems(topLevelItems);
    }
    groups.forEach((group) => {
      const label = group.getAttribute("label") || "";
      const items = group.querySelectorAll("bp-command-item");
      const groupClasses = "overflow-hidden p-1 text-foreground";
      const headingClasses = "px-2.5 py-1.5 text-xs font-medium text-muted-foreground";
      groupsHTML += `
        <div data-slot="command-group" class="${groupClasses}">
          ${label ? `<div cmdk-group-heading="" class="${headingClasses}">${label}</div>` : ""}
          ${renderItems(items)}
        </div>`;
    });
    const commandClasses = "flex size-full flex-col overflow-hidden rounded-xl bg-popover p-1 text-popover-foreground";
    const inputWrapperClasses = "p-1 pb-0";
    const inputClasses = "w-full text-xs/relaxed outline-hidden disabled:cursor-not-allowed disabled:opacity-50";
    const listClasses = "no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none";
    const emptyClasses = "py-6 text-center text-xs/relaxed";
    const searchIcon = `<svg xmlns="http://www.w3.org/2000/svg" class="size-3.5 shrink-0 opacity-50" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`;
    this.innerHTML = `
      <div data-slot="command" class="${commandClasses}">
        <div data-slot="command-input-wrapper" class="${inputWrapperClasses}">
          <div class="flex h-8 items-center gap-2 rounded-md bg-input/20 px-2 dark:bg-input/30">
            <input data-slot="command-input" placeholder="${placeholder}" class="${inputClasses}" />
            ${searchIcon}
          </div>
        </div>
        <div data-slot="command-list" class="${listClasses}">
          ${groupsHTML || `<div data-slot="command-empty" class="${emptyClasses}">No results found.</div>`}
        </div>
      </div>`;
  }
};
function renderItems(items) {
  let out = "";
  const itemClasses = "group/command-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-xs/relaxed outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";
  items.forEach((item) => {
    const text = item.innerHTML.trim();
    const disabled = item.hasAttribute("disabled");
    out += `<div data-slot="command-item" role="option" ${disabled ? 'data-disabled="true"' : ""} class="${itemClasses}">${text}</div>`;
  });
  return out;
}
var BpCommandGroup = class extends HTMLElement {
};
var BpCommandItem = class extends HTMLElement {
};
define("bp-command", BpCommand);
define("bp-command-group", BpCommandGroup);
define("bp-command-item", BpCommandItem);

// components/bp-sonner.ts
var variantIcons = {
  default: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
};
var BpSonner = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const variant = attr(this, "variant", "default");
    const icon = variantIcons[variant] || variantIcons.default;
    const toastClasses = "flex w-full items-start gap-3 rounded-lg border bg-popover p-4 text-popover-foreground shadow-md";
    this.innerHTML = `
      <div data-slot="sonner" data-variant="${variant}" class="${toastClasses}">
        <span class="mt-0.5 shrink-0">${icon}</span>
        <div class="flex flex-col gap-0.5">
          ${title ? `<div class="text-sm font-medium">${title}</div>` : ""}
          ${description ? `<div class="text-xs text-muted-foreground">${description}</div>` : ""}
        </div>
      </div>`;
  }
};
define("bp-sonner", BpSonner);

// components/bp-alert.ts
var base2 = "group/alert relative grid w-full gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5";
var variants4 = {
  default: "bg-card text-card-foreground",
  destructive: "bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current"
};
var titleClasses = "font-heading font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground";
var descriptionClasses = "text-xs/relaxed text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";
var BpAlert = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const variant = attr(this, "variant", "default");
    const variantClasses2 = variants4[variant] || variants4.default;
    this.innerHTML = `
      <div data-slot="alert" role="alert" class="${cn(base2, variantClasses2)}">
        ${title ? `<div data-slot="alert-title" class="${titleClasses}">${title}</div>` : ""}
        ${description ? `<div data-slot="alert-description" class="${descriptionClasses}">${description}</div>` : ""}
      </div>`;
  }
};
define("bp-alert", BpAlert);

// components/bp-page.ts
function collectElements(features, result = []) {
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
var BpPage = class extends HTMLElement {
  connectedCallback() {
    const body = html(this);
    const metaScript = document.getElementById("blueprint-meta");
    let meta = {};
    if (metaScript) {
      try {
        meta = JSON.parse(metaScript.textContent || "{}");
      } catch {
      }
    }
    const fields = [
      ["version", meta.version],
      ["screenId", meta.screenId],
      ["title", meta.title],
      ["viewport", meta.viewport],
      ["purpose", meta.purpose]
    ];
    const metaRows = fields.filter(([, v]) => v).map(
      ([k, v]) => `<div class="text-muted-foreground text-[0.6875rem]">${k}</div>
           <div class="text-foreground text-xs font-medium">${v}</div>`
    ).join("");
    const metaGridHtml = metaRows ? `<div class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-4 py-3 rounded-lg bg-muted/40 ring-1 ring-foreground/5">${metaRows}</div>` : "";
    const allElements = meta.features ? collectElements(meta.features) : [];
    let descListHtml = "";
    if (allElements.length > 0) {
      const items = allElements.map(
        ({ el }, i) => `<li class="text-xs leading-relaxed">
              <span class="text-muted-foreground">${i + 1}.</span>
              <span class="inline-flex items-center rounded bg-muted px-1.5 py-0.5 text-[0.625rem] font-medium text-muted-foreground">${el.type}</span>
              <span class="font-medium text-foreground">${el.label}</span>
              <span class="text-muted-foreground">&mdash; ${el.description}</span>
            </li>`
      ).join("");
      descListHtml = `
        <div class="flex flex-col gap-2">
          <div class="text-xs font-semibold text-foreground">\uC694\uC18C \uBAA9\uB85D</div>
          <ol class="flex flex-col gap-1.5 list-none p-0 m-0">${items}</ol>
        </div>`;
    }
    this.innerHTML = `
      <div data-slot="bp-page" class="flex min-h-screen bg-background text-foreground">
        <div class="flex flex-1 flex-col gap-6 p-6 overflow-auto">
          ${metaGridHtml}
          <div data-slot="bp-page-content">${body}</div>
        </div>
        ${descListHtml ? `<aside data-slot="bp-page-aside" class="w-80 shrink-0 border-l border-border bg-card p-5 overflow-y-auto">${descListHtml}</aside>` : ""}
      </div>`;
  }
};
define("bp-page", BpPage);

// components/bp-section.ts
var BpSection = class extends HTMLElement {
  connectedCallback() {
    const feature = attr(this, "data-feature");
    const label = attr(this, "data-label");
    const body = html(this);
    this.innerHTML = `
      <div data-slot="bp-section" class="relative flex flex-col gap-3">
        ${label ? `<div class="text-[0.625rem] font-medium uppercase tracking-wide text-muted-foreground">${label}</div>` : ""}
        <div data-slot="bp-section-content">${body}</div>
      </div>`;
    if (feature) this.setAttribute("data-feature", feature);
    if (label) this.setAttribute("data-label", label);
  }
};
define("bp-section", BpSection);

// components/bp-state-tab.ts
var BpStateTab = class extends HTMLElement {
  connectedCallback() {
    const panels = [];
    const children = Array.from(this.children);
    for (const child of children) {
      const name = child.getAttribute("slot");
      if (name) {
        panels.push({ name, content: child.innerHTML });
      }
    }
    if (panels.length === 0) return;
    const tabButtons = panels.map(
      (p, i) => `<button
            data-slot="state-tab-btn"
            data-tab-index="${i}"
            class="px-3 py-1 text-[0.6875rem] font-medium rounded-md transition-colors ${i === 0 ? "bg-primary text-primary-foreground" : "bg-transparent text-muted-foreground hover:text-foreground"}"
          >${p.name}</button>`
    ).join("");
    const tabPanels = panels.map(
      (p, i) => `<div data-slot="state-tab-panel" data-tab-index="${i}" style="${i > 0 ? "display:none" : ""}">${p.content}</div>`
    ).join("");
    this.innerHTML = `
      <div data-slot="bp-state-tab" class="flex flex-col gap-3">
        <div data-slot="state-tab-bar" class="flex gap-1 rounded-lg bg-muted p-1 w-fit">${tabButtons}</div>
        <div data-slot="state-tab-panels">${tabPanels}</div>
      </div>`;
    const bar = this.querySelector("[data-slot='state-tab-bar']");
    if (bar) {
      bar.addEventListener("click", (e) => {
        const btn = e.target.closest(
          "[data-slot='state-tab-btn']"
        );
        if (!btn) return;
        const idx = btn.dataset.tabIndex;
        const allBtns = this.querySelectorAll("[data-slot='state-tab-btn']");
        for (const b of allBtns) {
          const el = b;
          if (el.dataset.tabIndex === idx) {
            el.classList.remove("bg-transparent", "text-muted-foreground", "hover:text-foreground");
            el.classList.add("bg-primary", "text-primary-foreground");
          } else {
            el.classList.remove("bg-primary", "text-primary-foreground");
            el.classList.add("bg-transparent", "text-muted-foreground", "hover:text-foreground");
          }
        }
        const allPanels = this.querySelectorAll("[data-slot='state-tab-panel']");
        for (const p of allPanels) {
          const el = p;
          el.style.display = el.dataset.tabIndex === idx ? "" : "none";
        }
      });
    }
  }
};
define("bp-state-tab", BpStateTab);

// components/bp-stat.ts
var trendColors = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-muted-foreground"
};
var trendIcons = {
  up: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 15-6-6-6 6"/></svg>`,
  down: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>`,
  neutral: `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>`
};
var BpStat = class extends HTMLElement {
  connectedCallback() {
    const label = attr(this, "label");
    const value = attr(this, "value");
    const description = attr(this, "description");
    const trend = attr(this, "trend", "neutral");
    const trendValue = attr(this, "trend-value");
    const trendColor = trendColors[trend] || trendColors.neutral;
    const trendIcon = trendIcons[trend] || trendIcons.neutral;
    const trendHtml = trendValue ? `<div class="${cn("flex items-center gap-0.5 text-xs font-medium", trendColor)}">
          ${trendIcon}
          <span>${trendValue}</span>
        </div>` : "";
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
};
define("bp-stat", BpStat);

// components/bp-image.ts
var IMAGE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="size-8 text-muted-foreground/50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>`;
var BpImage = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("block");
    const width = attr(this, "width");
    const height = attr(this, "height");
    const ratio = attr(this, "ratio", "16/9");
    const label = attr(this, "label");
    const styles = [];
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
};
define("bp-image", BpImage);
export {
  attr,
  boolAttr,
  cn,
  define,
  html
};
