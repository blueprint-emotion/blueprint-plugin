// components/bp-core.ts
function define(tag, ctor) {
  if (!customElements.get(tag)) {
    const orig = ctor.prototype.connectedCallback;
    if (orig) {
      ctor.prototype.connectedCallback = function() {
        if (this.__bp) return;
        this.__bp = true;
        orig.call(this);
      };
    }
    customElements.define(tag, ctor);
  }
}
function esc(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function attr(el, name, fallback = "") {
  return el.getAttribute(name) ?? fallback;
}
function safeAttr(el, name, fallback = "") {
  return esc(el.getAttribute(name) ?? fallback);
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
    this.style.display = "contents";
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
      class="h-7 w-full min-w-0 rounded-md border border-input bg-input/20 px-2 py-0.5 text-sm transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-xs/relaxed file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 md:text-xs/relaxed dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
    />`;
  }
};
define("bp-input", BpInput);

// components/bp-textarea.ts
var BpTextarea = class extends HTMLElement {
  connectedCallback() {
    this.style.display = "contents";
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
    this.setAttribute("data-slot", "radio-group");
    this.setAttribute("role", "radiogroup");
    this.classList.add(..."grid w-full gap-3".split(" "));
    this.style.display = "grid";
    this.innerHTML = itemsHTML;
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

// components/bp-switch.ts
var BpSwitch = class extends HTMLElement {
  connectedCallback() {
    this.classList.add("inline-flex", "items-center", "gap-2");
    const label = attr(this, "label");
    const checked = boolAttr(this, "checked");
    const disabled = boolAttr(this, "disabled");
    const switchClasses = "peer group/switch relative inline-flex shrink-0 items-center rounded-full border transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 data-[size=default]:h-[16.6px] data-[size=default]:w-[28px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50";
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
        style="border-color:transparent"
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
    const min = Number(attr(this, "min", "0"));
    const max = Number(attr(this, "max", "100"));
    const value = Number(attr(this, "value", String(Math.round((min + max) / 2))));
    const step = Number(attr(this, "step", "1"));
    const disabled = this.hasAttribute("disabled");
    const controlClasses = "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col";
    const trackClasses = "relative grow overflow-hidden rounded-md bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1";
    const rangeClasses = "bg-primary select-none data-horizontal:h-full data-vertical:w-full";
    const thumbClasses = "relative block size-3 shrink-0 rounded-md border border-ring bg-white ring-ring/30 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-2 focus-visible:ring-2 focus-visible:outline-hidden active:ring-2 disabled:pointer-events-none disabled:opacity-50";
    const pct = (value - min) / (max - min) * 100;
    this.setAttribute("data-slot", "slider");
    this.setAttribute("data-horizontal", "");
    this.classList.add(..."data-horizontal:w-full data-vertical:h-full".split(" "));
    this.style.display = "block";
    this.innerHTML = `
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
    if (this.querySelector('[data-slot="field-control"]')) return;
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const labelHtml = label ? `<label data-slot="field-label" class="flex w-fit items-center gap-2 text-xs/relaxed font-medium leading-snug select-none group-data-[disabled=true]/field:opacity-50">${label}</label>` : "";
    const descHtml = description ? `<div data-slot="field-description" class="text-left text-xs/relaxed leading-normal font-normal text-muted-foreground">${description}</div>` : "";
    const errorHtml = error ? `<div role="alert" data-slot="field-error" class="text-xs/relaxed font-normal text-destructive">${error}</div>` : "";
    this.setAttribute("data-slot", "field");
    this.setAttribute("role", "group");
    this.classList.add(..."group/field flex w-full flex-col gap-2".split(" "));
    this.style.display = "flex";
    if (error) {
      this.setAttribute("data-invalid", "true");
      this.classList.add("text-destructive");
    }
    this.innerHTML = `
        ${labelHtml}
        <div data-slot="field-control"></div>
        ${descHtml}
        ${errorHtml}`;
    this.querySelector('[data-slot="field-control"]').appendChild(fragment);
  }
};
define("bp-field", BpField);

// components/bp-label.ts
var BpLabel = class extends HTMLElement {
  connectedCallback() {
    const text = this.textContent?.trim() || "";
    const base2 = "flex items-center gap-2 text-xs/relaxed leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50";
    this.setAttribute("data-slot", "label");
    this.classList.add(...base2.split(" "));
    this.style.display = "flex";
    this.textContent = text;
  }
};
define("bp-label", BpLabel);

// components/bp-input-otp.ts
var slotBase = "relative flex size-7 items-center justify-center border-y border-r border-input bg-input/20 text-xs/relaxed transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/30 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40";
var groupBase = "flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40";
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
    this.setAttribute("data-slot", "input-otp");
    this.classList.add(..."cn-input-otp flex items-center has-disabled:opacity-50".split(" "));
    this.style.display = "flex";
    this.innerHTML = `<div
        data-slot="input-otp-group"
        class="${cn(groupBase)}"
      >${slots}</div>`;
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

// components/bp-button.ts
var variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/80",
  outline: "border-border hover:bg-input/50 hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:bg-input/30",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 aria-expanded:bg-secondary aria-expanded:text-secondary-foreground",
  ghost: "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
  destructive: "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40",
  link: "text-primary underline-offset-4 hover:underline"
};
var sizes = {
  default: "h-7 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
  xs: "h-5 gap-1 rounded-sm px-2 text-[0.625rem] has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-2.5",
  sm: "h-6 gap-1 px-2 text-xs/relaxed has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
  lg: "h-8 gap-1 px-2.5 text-xs/relaxed has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-4",
  icon: "size-7 [&_svg:not([class*='size-'])]:size-3.5",
  "icon-xs": "size-5 rounded-sm [&_svg:not([class*='size-'])]:size-2.5",
  "icon-sm": "size-6 [&_svg:not([class*='size-'])]:size-3",
  "icon-lg": "size-8 [&_svg:not([class*='size-'])]:size-4"
};
var BpButton = class extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const size = attr(this, "size", "default");
    const disabled = boolAttr(this, "disabled");
    const label = attr(this, "label") || this.textContent?.trim() || "";
    this.setAttribute("data-slot", "button");
    this.setAttribute("role", "button");
    if (disabled) {
      this.setAttribute("aria-disabled", "true");
    }
    const base2 = "group/button inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
    this.classList.add(...cn(base2, variants[variant] || variants.default, sizes[size] || sizes.default, disabled && "pointer-events-none opacity-50").split(" "));
    if (variant !== "outline") {
      this.style.borderColor = "transparent";
    }
    this.style.display = "inline-flex";
    this.innerHTML = label;
  }
};
define("bp-button", BpButton);

// components/bp-dropdown.ts
var triggerBase = "inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-1.5 text-xs font-medium shadow-xs outline-none hover:bg-accent hover:text-accent-foreground";
var contentBase = "z-50 max-h-(--available-height) min-w-32 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none";
var itemBase = "group/dropdown-menu-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2 py-1 text-xs/relaxed outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7.5 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-[variant=destructive]:*:[svg]:text-destructive";
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
          class="${itemBase}"
        >${text}${shortcutSpan}</div>`;
      }
    }
    this.setAttribute("data-slot", "dropdown-menu");
    this.classList.add(..."relative inline-block".split(" "));
    this.style.display = "inline-block";
    this.innerHTML = `
        <button data-slot="dropdown-menu-trigger" class="${triggerBase}" aria-expanded="false" type="button">
          ${label}${chevronSvg}
        </button>
        <div data-slot="dropdown-menu-content" role="menu" class="${contentBase}" style="margin-top:4px;display:none;position:absolute;left:0;top:100%">
          ${itemsHTML}
        </div>`;
    const trigger = this.querySelector('[data-slot="dropdown-menu-trigger"]');
    const content = this.querySelector('[data-slot="dropdown-menu-content"]');
    trigger.addEventListener("click", () => {
      const open = content.style.display !== "none";
      content.style.display = open ? "none" : "";
      trigger.setAttribute("aria-expanded", String(!open));
    });
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        content.style.display = "none";
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }
};
define("bp-dropdown", BpDropdown);
define("bp-dropdown-item", BpDropdownItem);
define("bp-dropdown-separator", BpDropdownSeparator);
define("bp-dropdown-label", BpDropdownLabel);

// components/bp-card.ts
var BpCard = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const footer = attr(this, "footer");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    this.setAttribute("data-slot", "card");
    this.classList.add(..."group/card flex flex-col gap-4 overflow-hidden rounded-lg bg-card py-4 text-xs/relaxed text-card-foreground ring-1 ring-foreground/10".split(" "));
    this.style.display = "flex";
    const headerHtml = title || description ? `
      <div data-slot="card-header" class="grid auto-rows-min items-start gap-1 px-4">
        ${title ? `<div data-slot="card-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
        ${description ? `<div data-slot="card-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
      </div>` : "";
    const footerHtml = footer ? `
      <div data-slot="card-footer" class="flex items-center px-4">${footer}</div>` : "";
    this.innerHTML = `
      ${headerHtml}
      <div data-slot="card-content" class="px-4"></div>
      ${footerHtml}`;
    this.querySelector('[data-slot="card-content"]').appendChild(fragment);
  }
};
define("bp-card", BpCard);

// components/bp-accordion.ts
var BpAccordion = class extends HTMLElement {
  connectedCallback() {
    this.setAttribute("data-slot", "accordion");
    this.classList.add(..."flex w-full flex-col overflow-hidden rounded-md border".split(" "));
    this.style.display = "flex";
  }
};
define("bp-accordion", BpAccordion);
var triggerClass = "group/accordion-trigger relative flex flex-1 items-start justify-between gap-6 border p-2 text-left text-xs/relaxed font-medium transition-all outline-none hover:underline aria-disabled:pointer-events-none aria-disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-4 **:data-[slot=accordion-trigger-icon]:text-muted-foreground";
var panelClass = "overflow-hidden px-2 text-xs/relaxed";
var innerClass = "pt-0 pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4";
var BpAccordionItem = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const open = boolAttr(this, "open");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    this.style.display = "block";
    this.setAttribute("data-slot", "accordion-item");
    this.classList.add("not-last:border-b");
    if (open) this.classList.add("bg-muted/50");
    const chevronDown = `<svg data-slot="accordion-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none shrink-0 ${open ? "hidden" : ""}"><path d="m6 9 6 6 6-6"/></svg>`;
    const chevronUp = `<svg data-slot="accordion-trigger-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="pointer-events-none shrink-0 ${open ? "" : "hidden"}"><path d="m18 15-6-6-6 6"/></svg>`;
    const id = `bp-acc-${Math.random().toString(36).slice(2, 8)}`;
    this.innerHTML = `
      <div class="flex">
        <button
          data-slot="accordion-trigger"
          class="${triggerClass}"
          aria-expanded="${open}"
          aria-controls="${id}"
          style="border-color:transparent"
          onclick="this.closest('bp-accordion-item').toggle()"
        >
          <span>${title}</span>
          ${chevronDown}
          ${chevronUp}
        </button>
      </div>
      <div id="${id}" data-slot="accordion-content" class="${panelClass}" style="${open ? "" : "display:none"}">
        <div class="${innerClass}" data-slot="accordion-body"></div>
      </div>`;
    this.querySelector('[data-slot="accordion-body"]').appendChild(fragment);
  }
  toggle() {
    const trigger = this.querySelector("[data-slot='accordion-trigger']");
    const content = this.querySelector("[data-slot='accordion-content']");
    if (!trigger || !content) return;
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    content.style.display = expanded ? "none" : "";
    this.classList.toggle("bg-muted/50", !expanded);
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
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const id = `bp-coll-${Math.random().toString(36).slice(2, 8)}`;
    this.setAttribute("data-slot", "collapsible");
    this.innerHTML = `
      <button
        data-slot="collapsible-trigger"
        aria-expanded="${open}"
        aria-controls="${id}"
        onclick="this.closest('bp-collapsible').toggle()"
      >${title}</button>
      <div id="${id}" data-slot="collapsible-content" style="${open ? "" : "display:none"}"></div>`;
    this.querySelector('[data-slot="collapsible-content"]').appendChild(fragment);
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

// components/bp-scroll-area.ts
var BpScrollArea = class extends HTMLElement {
  connectedCallback() {
    const height = attr(this, "height", "auto");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    this.setAttribute("data-slot", "scroll-area");
    this.classList.add("relative");
    this.style.display = "block";
    this.style.height = height;
    this.style.overflow = "hidden";
    const viewportClass = "size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1";
    const scrollbarClass = "flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l";
    const thumbClass = "relative flex-1 rounded-full bg-border";
    this.innerHTML = `
      <div data-slot="scroll-area-viewport" class="${viewportClass}" style="overflow:auto;height:100%" tabindex="0"></div>
      <div data-slot="scroll-area-scrollbar" data-orientation="vertical" class="${scrollbarClass}" style="position:absolute;right:0;top:0;bottom:0;border-color:transparent">
        <div data-slot="scroll-area-thumb" class="${thumbClass}"></div>
      </div>`;
    this.querySelector('[data-slot="scroll-area-viewport"]').appendChild(fragment);
  }
};
define("bp-scroll-area", BpScrollArea);

// components/bp-sidebar.ts
var BpSidebarContent = class extends HTMLElement {
  connectedCallback() {
    const classes = "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto group-data-[collapsible=icon]:overflow-hidden";
    this.setAttribute("data-slot", "sidebar-content");
    this.setAttribute("data-sidebar", "content");
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
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const tempHolder = document.createElement("div");
    tempHolder.appendChild(fragment);
    let sidebarContentEl = null;
    let mainContentEl = null;
    const otherChildren = [];
    for (const child of Array.from(tempHolder.childNodes)) {
      if (child instanceof Element) {
        if (child.tagName.toLowerCase() === "bp-sidebar-content") {
          sidebarContentEl = child;
        } else if (child.tagName.toLowerCase() === "bp-sidebar-main") {
          mainContentEl = child;
        } else {
          otherChildren.push(child);
        }
      } else {
        otherChildren.push(child);
      }
    }
    const wrapperClasses = "group/sidebar-wrapper flex min-h-svh w-full has-data-[variant=inset]:bg-sidebar";
    const outerClasses = "group peer text-sidebar-foreground";
    const gapClasses = "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear";
    const containerBase = cn(
      "fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear data-[side=left]:left-0 data-[side=right]:right-0 md:flex",
      side === "left" ? "border-r" : "border-l"
    );
    const innerClasses = "flex size-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 group-data-[variant=floating]:ring-sidebar-border";
    this.setAttribute("data-slot", "sidebar-wrapper");
    this.setAttribute("data-side", side);
    this.classList.add(...wrapperClasses.split(" "));
    this.style.setProperty("--sidebar-width", width);
    this.style.display = "flex";
    this.innerHTML = `
        <div class="${outerClasses}" data-slot="sidebar" data-side="${side}" data-state="expanded">
          <div data-slot="sidebar-gap" class="${gapClasses}"></div>
          <div data-slot="sidebar-container" data-side="${side}" class="${containerBase}">
            <div data-sidebar="sidebar" data-slot="sidebar-inner" class="${innerClasses}">
              <div data-slot="sidebar-children"></div>
            </div>
          </div>
        </div>
        <div data-slot="sidebar-main-slot"></div>`;
    const sidebarSlot = this.querySelector('[data-slot="sidebar-children"]');
    if (sidebarContentEl) {
      sidebarSlot.appendChild(sidebarContentEl);
    } else if (!mainContentEl) {
      otherChildren.forEach((child) => sidebarSlot.appendChild(child));
    }
    const mainSlot = this.querySelector('[data-slot="sidebar-main-slot"]');
    if (mainContentEl) {
      mainSlot.parentNode.replaceChild(mainContentEl, mainSlot);
    } else {
      mainSlot.remove();
    }
    const sidebarChildrenWrapper = this.querySelector('[data-slot="sidebar-children"]');
    if (sidebarChildrenWrapper) {
      while (sidebarChildrenWrapper.firstChild) {
        sidebarChildrenWrapper.parentNode.insertBefore(sidebarChildrenWrapper.firstChild, sidebarChildrenWrapper);
      }
      sidebarChildrenWrapper.remove();
    }
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
    this.style.display = "block";
    const table = this.querySelector("table");
    if (!table) return;
    const wrapper = document.createElement("div");
    wrapper.classList.add("relative", "w-full", "overflow-x-auto");
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);
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
var variants2 = {
  default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
  destructive: "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
  outline: "border-border bg-input/20 text-foreground dark:bg-input/30 [a]:hover:bg-muted [a]:hover:text-muted-foreground",
  ghost: "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
  link: "text-primary underline-offset-4 hover:underline"
};
var BpBadge = class extends HTMLElement {
  connectedCallback() {
    const variant = attr(this, "variant", "default");
    const text = this.textContent?.trim() || "";
    const base2 = "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border px-2 py-0.5 text-[0.625rem] font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-2.5!";
    this.setAttribute("data-slot", "badge");
    this.classList.add(...cn(base2, variants2[variant] || variants2.default).split(" "));
    this.style.display = "inline-flex";
    if (variant !== "outline") {
      this.style.borderColor = "transparent";
    }
    this.innerHTML = text;
  }
};
define("bp-badge", BpBadge);

// components/bp-avatar.ts
var BpAvatar = class extends HTMLElement {
  connectedCallback() {
    const src = attr(this, "src");
    const fallback = attr(this, "fallback");
    const size = attr(this, "size", "default");
    const rootClasses = "group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten";
    const imageClasses = "aspect-square size-full rounded-full object-cover";
    const fallbackClasses = "flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs";
    this.setAttribute("data-slot", "avatar");
    this.setAttribute("data-size", size);
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "flex";
    const imageHtml = src ? `<img data-slot="avatar-image" class="${imageClasses}" src="${src}" alt="${fallback || ""}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : "";
    const fallbackHtml = `<span data-slot="avatar-fallback" class="${fallbackClasses}" ${src ? 'style="display:none"' : ""}>${fallback || ""}</span>`;
    this.innerHTML = `${imageHtml}${fallbackHtml}`;
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
};
define("bp-chart", BpChart);

// components/bp-kbd.ts
var BpKbd = class extends HTMLElement {
  connectedCallback() {
    const text = this.textContent?.trim() || "";
    const classes = "pointer-events-none inline-flex h-5 w-fit min-w-5 items-center justify-center gap-1 rounded-xs bg-muted px-1 font-sans text-[0.625rem] font-medium text-muted-foreground select-none in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3";
    this.setAttribute("data-slot", "kbd");
    this.classList.add(...classes.split(" "));
    this.style.display = "inline-flex";
    this.innerHTML = text;
  }
};
define("bp-kbd", BpKbd);

// components/bp-spinner.ts
var BpSpinner = class extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `<svg
      role="status"
      aria-label="Loading"
      class="size-4 animate-spin"
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
var BpSkeleton = class extends HTMLElement {
  connectedCallback() {
    const width = attr(this, "width");
    const height = attr(this, "height");
    const baseClasses = "animate-pulse rounded-md bg-muted";
    this.setAttribute("data-slot", "skeleton");
    this.classList.add(...baseClasses.split(" "));
    this.style.display = "block";
    if (width) this.style.width = width;
    if (height) this.style.height = height;
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
    this.setAttribute("data-slot", "progress");
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "flex";
    this.innerHTML = `${label ? `<span data-slot="progress-label" class="${labelClasses}">${label}</span>` : ""}<span data-slot="progress-value" class="${valueClasses}">${value}%</span><div data-slot="progress-track" class="${trackClasses}"><div data-slot="progress-indicator" class="${indicatorClasses}" style="width:${value}%"></div></div>`;
  }
};
define("bp-progress", BpProgress);

// components/bp-carousel.ts
var BpCarousel = class extends HTMLElement {
  connectedCallback() {
    const slides = Array.from(this.children);
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
    this.setAttribute("data-slot", "carousel");
    this.classList.add(..."relative".split(" "));
    this.setAttribute("role", "region");
    this.setAttribute("aria-roledescription", "carousel");
    this.style.display = "block";
    this.innerHTML = `
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
        </button>`;
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
    const mediaClasses = "mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0 flex size-8 shrink-0 items-center justify-center rounded-md bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4";
    const titleClasses2 = "font-heading text-sm font-medium tracking-tight";
    const descClasses = "text-xs/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary";
    const iconSvg = icons[icon] || icons.inbox;
    this.setAttribute("data-slot", "empty");
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "flex";
    this.innerHTML = `
        <div data-slot="empty-header" class="${headerClasses}">
          <div data-slot="empty-icon" data-variant="icon" class="${mediaClasses}">
            ${iconSvg}
          </div>
          ${title ? `<div data-slot="empty-title" class="${titleClasses2}">${title}</div>` : ""}
          ${description ? `<div data-slot="empty-description" class="${descClasses}">${description}</div>` : ""}
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
    const navBtnClasses = "size-(--cell-size) p-0 select-none aria-disabled:opacity-50 inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground";
    const captionClasses = "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)";
    const captionLabelClasses = "font-medium select-none text-sm";
    const weekdaysClasses = "flex";
    const weekdayClasses = "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none";
    const weekClasses = "mt-2 flex w-full";
    const dayClasses = "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none";
    const dayBtnClasses = "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal inline-flex items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground";
    const todayClasses = "rounded-(--cell-radius) bg-muted text-foreground data-[selected=true]:rounded-none";
    const outsideClasses = "text-muted-foreground aria-selected:text-muted-foreground";
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
    this.setAttribute("data-slot", "calendar");
    this.classList.add(...rootClasses.split(" "));
    this.style.display = "block";
    this.innerHTML = `
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
        </div>`;
  }
};
define("bp-calendar", BpCalendar);

// components/bp-tabs.ts
var tabsRootClasses = "group/tabs flex gap-2 data-horizontal:flex-col";
var tabsListClasses = "group/tabs-list inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-8 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none bg-muted";
var tabsTriggerBase = "relative inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border px-1.5 py-0.5 text-xs font-medium whitespace-nowrap text-foreground/60 transition-all group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start group-data-vertical/tabs:py-[calc(--spacing(1.25))] hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1 has-data-[icon=inline-start]:pl-1 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5";
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
    const tabs = [];
    let activeIdx = 0;
    const children = Array.from(this.children);
    children.forEach((child, i) => {
      if (child.tagName.toLowerCase() === "bp-tab") {
        const label = child.getAttribute("label") || `Tab ${i + 1}`;
        const active = child.hasAttribute("active") && child.getAttribute("active") !== "false";
        if (active) activeIdx = tabs.length;
        const fragment = document.createDocumentFragment();
        while (child.firstChild) fragment.appendChild(child.firstChild);
        tabs.push({ label, active, fragment });
      }
    });
    this.setAttribute("data-slot", "tabs");
    this.setAttribute("data-orientation", "horizontal");
    this.setAttribute("data-horizontal", "");
    this.classList.add(...tabsRootClasses.split(" "));
    this.style.display = "flex";
    let triggersHTML = "";
    tabs.forEach((tab, i) => {
      const isActive = i === activeIdx;
      triggersHTML += `<button
        type="button"
        role="tab"
        data-slot="tabs-trigger"
        data-tab-index="${i}"
        ${isActive ? 'data-active=""' : ""}
        aria-selected="${isActive}"
        class="${tabsTriggerClasses}"
        style="border-color:transparent"
      >${tab.label}</button>`;
    });
    let panelsHTML = "";
    tabs.forEach((_, i) => {
      const isActive = i === activeIdx;
      panelsHTML += `<div
        data-slot="tabs-content"
        data-tab-index="${i}"
        role="tabpanel"
        class="${tabsContentClasses}"
        style="${isActive ? "" : "display:none"}"
      ></div>`;
    });
    this.innerHTML = `
      <div data-slot="tabs-list" data-variant="default" role="tablist" class="${tabsListClasses}">
        ${triggersHTML}
      </div>
      ${panelsHTML}
    `;
    tabs.forEach((tab, i) => {
      const panel = this.querySelector(
        `[data-slot="tabs-content"][data-tab-index="${i}"]`
      );
      panel.appendChild(tab.fragment);
    });
    this.querySelectorAll(
      "[data-slot='tabs-trigger']"
    ).forEach((btn) => {
      btn.addEventListener("click", () => {
        const idx = btn.getAttribute("data-tab-index");
        this.querySelectorAll(
          "[data-slot='tabs-trigger']"
        ).forEach((t) => {
          t.removeAttribute("data-active");
          t.setAttribute("aria-selected", "false");
        });
        btn.setAttribute("data-active", "");
        btn.setAttribute("aria-selected", "true");
        this.querySelectorAll(
          "[data-slot='tabs-content']"
        ).forEach((p) => {
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
    const items = Array.from(this.querySelectorAll("bp-breadcrumb-item"));
    this.setAttribute("data-slot", "breadcrumb");
    this.setAttribute("aria-label", "breadcrumb");
    this.setAttribute("role", "navigation");
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
      <ol data-slot="breadcrumb-list" class="${breadcrumbListClasses}">
        ${listHTML}
      </ol>
    `;
  }
};
define("bp-breadcrumb-item", BpBreadcrumbItem);
define("bp-breadcrumb", BpBreadcrumb);

// components/bp-pagination.ts
var paginationClasses = "mx-auto flex w-full justify-center";
var paginationContentClasses = "flex items-center gap-0.5";
var buttonBase = "inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs/relaxed font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";
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
    this.setAttribute("data-slot", "pagination");
    this.setAttribute("role", "navigation");
    this.setAttribute("aria-label", "pagination");
    this.classList.add(...paginationClasses.split(" "));
    this.render(total, current, siblings);
  }
  render(total, current, siblings) {
    const pages = buildPageRange(total, current, siblings);
    const prevDisabled = current <= 1;
    const prevHTML = `<li data-slot="pagination-item">
      <a aria-label="Go to previous page" data-slot="pagination-link" data-page="${current - 1}" class="${paginationPrevClasses}" style="border-color:transparent" ${prevDisabled ? 'aria-disabled="true" style="border-color:transparent;pointer-events:none;opacity:0.5"' : ""}>
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
        const styleAttr = isActive ? "" : ' style="border-color:transparent"';
        pagesHTML += `<li data-slot="pagination-item">
          <a data-slot="pagination-link" data-page="${p}" data-active="${isActive}" ${isActive ? 'aria-current="page"' : ""} class="${isActive ? paginationLinkActive : paginationLinkInactive}"${styleAttr}>${p}</a>
        </li>`;
      }
    });
    const nextDisabled = current >= total;
    const nextHTML = `<li data-slot="pagination-item">
      <a aria-label="Go to next page" data-slot="pagination-link" data-page="${current + 1}" class="${paginationNextClasses}" style="border-color:transparent" ${nextDisabled ? 'aria-disabled="true" style="border-color:transparent;pointer-events:none;opacity:0.5"' : ""}>
        <span class="hidden sm:block">Next</span>${chevronRightSVG2}
      </a>
    </li>`;
    this.innerHTML = `
      <ul data-slot="pagination-content" class="${paginationContentClasses}">
        ${prevHTML}${pagesHTML}${nextHTML}
      </ul>
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

// components/bp-dialog.ts
var BpDialog = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const trigger = attr(this, "trigger");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const headerHtml = title || description ? `<div data-slot="dialog-header" class="flex flex-col gap-1">
            ${title ? `<div data-slot="dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="dialog-description" class="text-xs/relaxed text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>` : "";
    const closeBtnHtml = `<button data-slot="dialog-close" class="absolute top-3 right-3 rounded-md p-1 text-muted-foreground hover:text-foreground">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`;
    const overlayHtml = `
      <div data-slot="dialog-overlay" class="fixed inset-0 isolate z-50 flex items-center justify-center bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
        <div data-slot="dialog-content" class="relative w-full max-w-[calc(100%-2rem)] sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-4 text-xs/relaxed text-popover-foreground outline-none">
          ${closeBtnHtml}
          ${headerHtml}
          <div data-slot="dialog-body"></div>
        </div>
      </div>`;
    if (trigger) {
      this.innerHTML = `
        <button data-slot="dialog-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 bg-primary text-primary-foreground hover:bg-primary/80" style="border-color:transparent">${trigger}</button>
        ${overlayHtml}`;
      this.querySelector('[data-slot="dialog-body"]').appendChild(fragment);
      const triggerBtn = this.querySelector("[data-slot=dialog-trigger]");
      const overlay = this.querySelector("[data-slot=dialog-overlay]");
      const closeBtn = this.querySelector("[data-slot=dialog-close]");
      triggerBtn.addEventListener("click", () => overlay.style.display = "");
      closeBtn.addEventListener("click", () => overlay.style.display = "none");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.style.display = "none";
      });
    } else {
      this.innerHTML = `
        <div class="relative rounded-xl bg-muted/40 border border-dashed border-border p-8" style="min-height:200px">
          <span class="absolute top-2 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Dialog</span>
          <div class="flex items-center justify-center h-full">
            <div data-slot="dialog-content" class="w-full max-w-[calc(100%-2rem)] sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-4 text-xs/relaxed text-popover-foreground outline-none">
              ${headerHtml}
              <div data-slot="dialog-body"></div>
            </div>
          </div>
        </div>`;
      this.querySelector('[data-slot="dialog-body"]').appendChild(fragment);
    }
  }
};
define("bp-dialog", BpDialog);

// components/bp-alert-dialog.ts
var BpAlertDialog = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const confirmLabel = attr(this, "confirm-label", "\uD655\uC778");
    const cancelLabel = attr(this, "cancel-label", "\uCDE8\uC18C");
    const trigger = attr(this, "trigger");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const headerHtml = title || description ? `<div data-slot="alert-dialog-header" class="grid grid-rows-[auto_1fr] place-items-center gap-1 text-center sm:place-items-start sm:text-left">
            ${title ? `<div data-slot="alert-dialog-title" class="font-heading text-sm font-medium">${title}</div>` : ""}
            ${description ? `<div data-slot="alert-dialog-description" class="text-xs/relaxed text-balance text-muted-foreground md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground">${description}</div>` : ""}
          </div>` : "";
    const footerHtml = `
      <div data-slot="alert-dialog-footer" class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button data-slot="alert-dialog-cancel" class="inline-flex items-center justify-center rounded-md border border-border h-7 px-2 text-xs font-medium hover:bg-input/50 dark:bg-input/30">${cancelLabel}</button>
        <button data-slot="alert-dialog-action" class="inline-flex items-center justify-center rounded-md border h-7 px-2 text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/80" style="border-color:transparent">${confirmLabel}</button>
      </div>`;
    const overlayHtml = `
      <div data-slot="alert-dialog-overlay" class="fixed inset-0 isolate z-50 flex items-center justify-center bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
        <div data-slot="alert-dialog-content" data-size="default" class="group/alert-dialog-content w-full max-w-xs sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-3 text-popover-foreground outline-none">
          ${headerHtml}
          <div data-slot="alert-dialog-body"></div>
          ${footerHtml}
        </div>
      </div>`;
    if (trigger) {
      this.innerHTML = `
        <button data-slot="alert-dialog-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 bg-destructive/10 text-destructive hover:bg-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30" style="border-color:transparent">${trigger}</button>
        ${overlayHtml}`;
      this.querySelector('[data-slot="alert-dialog-body"]').appendChild(fragment);
      const triggerBtn = this.querySelector("[data-slot=alert-dialog-trigger]");
      const overlay = this.querySelector("[data-slot=alert-dialog-overlay]");
      const cancelBtn = this.querySelector("[data-slot=alert-dialog-cancel]");
      const actionBtn = this.querySelector("[data-slot=alert-dialog-action]");
      triggerBtn.addEventListener("click", () => overlay.style.display = "");
      cancelBtn.addEventListener("click", () => overlay.style.display = "none");
      actionBtn.addEventListener("click", () => overlay.style.display = "none");
    } else {
      this.innerHTML = `
        <div class="relative rounded-xl bg-muted/40 border border-dashed border-border p-8" style="min-height:180px">
          <span class="absolute top-2 left-3 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Alert Dialog</span>
          <div class="flex items-center justify-center h-full">
            <div data-slot="alert-dialog-content" data-size="default" class="group/alert-dialog-content w-full max-w-xs sm:max-w-sm rounded-xl bg-popover p-4 ring-1 ring-foreground/10 shadow-lg grid gap-3 text-popover-foreground outline-none">
              ${headerHtml}
              <div data-slot="alert-dialog-body"></div>
              ${footerHtml}
            </div>
          </div>
        </div>`;
      this.querySelector('[data-slot="alert-dialog-body"]').appendChild(fragment);
    }
  }
};
define("bp-alert-dialog", BpAlertDialog);

// components/bp-drawer.ts
var BpDrawer = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "bottom");
    const trigger = attr(this, "trigger");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const isVertical = side === "bottom" || side === "top";
    const handleHtml = side === "bottom" ? `<div class="mx-auto mt-4 h-1.5 w-[100px] shrink-0 rounded-full bg-muted"></div>` : "";
    const headerHtml = title || description ? `<div data-slot="drawer-header" class="${cn("flex flex-col gap-1 p-4", isVertical && "text-center", "md:text-left")}">
            ${title ? `<div data-slot="drawer-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="drawer-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>` : "";
    const panelPositionClasses = {
      bottom: "bottom-0 left-0 w-full rounded-t-xl border-t max-h-[80vh]",
      top: "top-0 left-0 w-full rounded-b-xl border-b max-h-[80vh]",
      left: "left-0 top-0 h-full w-80 max-w-[80vw] border-r",
      right: "right-0 top-0 h-full w-80 max-w-[80vw] border-l"
    };
    if (trigger) {
      this.innerHTML = `
        <button data-slot="drawer-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 dark:bg-input/30">${trigger}</button>
        <div data-slot="drawer-overlay" class="fixed inset-0 z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
          <div data-slot="drawer-content" class="group/drawer-content fixed ${panelPositionClasses[side] || panelPositionClasses.bottom} flex flex-col bg-popover text-xs/relaxed text-popover-foreground shadow-lg">
            ${handleHtml}
            ${headerHtml}
            <div data-slot="drawer-body" class="p-4 overflow-y-auto"></div>
          </div>
        </div>`;
      this.querySelector('[data-slot="drawer-body"]').appendChild(fragment);
      const triggerBtn = this.querySelector("[data-slot=drawer-trigger]");
      const overlay = this.querySelector("[data-slot=drawer-overlay]");
      triggerBtn.addEventListener("click", () => overlay.style.display = "");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.style.display = "none";
      });
    } else {
      const panelClasses = cn(
        "flex flex-col bg-popover text-xs/relaxed text-popover-foreground rounded-t-xl border-t border-border",
        isVertical ? "w-full" : "w-64 h-full border-l border-border rounded-none"
      );
      const containerClasses = cn(
        "relative rounded-xl bg-muted/40 border border-dashed border-border overflow-hidden",
        isVertical ? "flex flex-col" : "flex"
      );
      const mainArea = `<div class="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground/50">\uD398\uC774\uC9C0 \uC601\uC5ED</div>`;
      const panel = `<div data-slot="drawer-content" class="${panelClasses}">${handleHtml}${headerHtml}<div data-slot="drawer-body" class="p-4 overflow-y-auto"></div></div>`;
      const layout = side === "top" || side === "left" ? `${panel}${mainArea}` : `${mainArea}${panel}`;
      this.innerHTML = `
        <div class="${containerClasses}" style="${isVertical ? "min-height:240px" : "height:240px"}">
          <span class="absolute top-2 left-3 z-10 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Drawer (${side})</span>
          ${layout}
        </div>`;
      this.querySelector('[data-slot="drawer-body"]').appendChild(fragment);
    }
  }
};
define("bp-drawer", BpDrawer);

// components/bp-sheet.ts
var BpSheet = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const side = attr(this, "side", "right");
    const trigger = attr(this, "trigger");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const isHorizontal = side === "left" || side === "right";
    const headerHtml = title || description ? `<div data-slot="sheet-header" class="flex flex-col gap-1.5 p-6">
            ${title ? `<div data-slot="sheet-title" class="font-heading text-sm font-medium text-foreground">${title}</div>` : ""}
            ${description ? `<div data-slot="sheet-description" class="text-xs/relaxed text-muted-foreground">${description}</div>` : ""}
          </div>` : "";
    const closeBtnHtml = `<button data-slot="sheet-close" class="absolute top-4 right-4 rounded-md p-1 text-muted-foreground hover:text-foreground z-10">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
    </button>`;
    const panelPositionClasses = {
      right: "right-0 top-0 h-full w-3/4 sm:max-w-sm border-l",
      left: "left-0 top-0 h-full w-3/4 sm:max-w-sm border-r",
      top: "top-0 left-0 w-full border-b",
      bottom: "bottom-0 left-0 w-full border-t"
    };
    if (trigger) {
      this.innerHTML = `
        <button data-slot="sheet-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 dark:bg-input/30">${trigger}</button>
        <div data-slot="sheet-overlay" class="fixed inset-0 z-50 bg-black/80 supports-backdrop-filter:backdrop-blur-xs" style="display:none">
          <div data-slot="sheet-content" data-side="${side}" class="fixed ${panelPositionClasses[side] || panelPositionClasses.right} flex flex-col bg-popover bg-clip-padding text-xs/relaxed text-popover-foreground shadow-lg">
            ${closeBtnHtml}
            ${headerHtml}
            <div data-slot="sheet-body" class="flex-1 p-6 overflow-y-auto"></div>
          </div>
        </div>`;
      this.querySelector('[data-slot="sheet-body"]').appendChild(fragment);
      const triggerBtn = this.querySelector("[data-slot=sheet-trigger]");
      const overlay = this.querySelector("[data-slot=sheet-overlay]");
      const closeBtn = this.querySelector("[data-slot=sheet-close]");
      triggerBtn.addEventListener("click", () => overlay.style.display = "");
      closeBtn.addEventListener("click", () => overlay.style.display = "none");
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.style.display = "none";
      });
    } else {
      const panelClasses = cn(
        "flex flex-col bg-popover text-xs/relaxed text-popover-foreground shadow-lg",
        isHorizontal ? "w-64 h-full border-l border-border" : "w-full border-t border-border"
      );
      const containerClasses = cn(
        "relative rounded-xl bg-muted/40 border border-dashed border-border overflow-hidden",
        isHorizontal ? "flex" : "flex flex-col"
      );
      const mainArea = `<div class="flex-1 flex items-center justify-center p-4 text-xs text-muted-foreground/50">\uD398\uC774\uC9C0 \uC601\uC5ED</div>`;
      const panel = `<div data-slot="sheet-content" data-side="${side}" class="${panelClasses}">${headerHtml}<div data-slot="sheet-body" class="flex-1 p-6 overflow-y-auto"></div></div>`;
      const layout = side === "left" || side === "top" ? `${panel}${mainArea}` : `${mainArea}${panel}`;
      this.innerHTML = `
        <div class="${containerClasses}" style="${isHorizontal ? "height:240px" : "min-height:200px"}">
          <span class="absolute top-2 left-3 z-10 text-[10px] text-muted-foreground/60 uppercase tracking-wider">Sheet (${side})</span>
          ${layout}
        </div>`;
      this.querySelector('[data-slot="sheet-body"]').appendChild(fragment);
    }
  }
};
define("bp-sheet", BpSheet);

// components/bp-popover.ts
var BpPopover = class extends HTMLElement {
  constructor() {
    super(...arguments);
    this._outsideClick = null;
  }
  connectedCallback() {
    const trigger = attr(this, "trigger");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    const triggerHtml = trigger ? `<button data-slot="popover-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 hover:text-foreground dark:bg-input/30">${trigger}</button>` : "";
    this.setAttribute("data-slot", "popover");
    this.classList.add(..."relative inline-flex".split(" "));
    this.style.display = "inline-flex";
    this.innerHTML = `
        ${triggerHtml}
        <div data-slot="popover-content" class="absolute top-full left-0 mt-1 z-50 flex w-72 flex-col gap-4 rounded-lg bg-popover p-2.5 text-xs text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden" style="display:none"></div>`;
    this.querySelector('[data-slot="popover-content"]').appendChild(fragment);
    if (trigger) {
      const triggerBtn = this.querySelector("[data-slot=popover-trigger]");
      const content = this.querySelector("[data-slot=popover-content]");
      triggerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const el = content;
        el.style.display = el.style.display === "none" ? "" : "none";
      });
      this._outsideClick = (e) => {
        if (!this.contains(e.target)) {
          content.style.display = "none";
        }
      };
      document.addEventListener("click", this._outsideClick);
    }
  }
  disconnectedCallback() {
    if (this._outsideClick) {
      document.removeEventListener("click", this._outsideClick);
      this._outsideClick = null;
    }
  }
};
define("bp-popover", BpPopover);

// components/bp-hover-card.ts
var BpHoverCard = class extends HTMLElement {
  connectedCallback() {
    const trigger = attr(this, "trigger");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    this.setAttribute("data-slot", "hover-card");
    this.classList.add(..."relative inline-flex".split(" "));
    this.style.display = "inline-flex";
    this.innerHTML = `
        <button data-slot="hover-card-trigger" class="text-primary underline-offset-4 hover:underline text-xs font-medium cursor-pointer">${trigger}</button>
        <div data-slot="hover-card-content" class="absolute top-full left-0 mt-1 z-50 w-72 rounded-lg bg-popover p-2.5 text-xs/relaxed text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden" style="display:none"></div>`;
    this.querySelector('[data-slot="hover-card-content"]').appendChild(fragment);
    const triggerEl = this.querySelector("[data-slot=hover-card-trigger]");
    const content = this.querySelector("[data-slot=hover-card-content]");
    let timeout;
    triggerEl.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        content.style.display = "";
      }, 10);
    });
    triggerEl.addEventListener("mouseleave", () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (!content.matches(":hover")) content.style.display = "none";
      }, 100);
    });
    content.addEventListener("mouseleave", () => {
      timeout = setTimeout(() => {
        content.style.display = "none";
      }, 100);
    });
    content.addEventListener("mouseenter", () => {
      clearTimeout(timeout);
    });
  }
};
define("bp-hover-card", BpHoverCard);

// components/bp-tooltip.ts
var BpTooltip = class extends HTMLElement {
  connectedCallback() {
    const content = attr(this, "content");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    this.setAttribute("data-slot", "tooltip");
    this.classList.add(..."relative inline-flex".split(" "));
    this.style.display = "inline-flex";
    this.innerHTML = `
        <span data-slot="tooltip-trigger"></span>
        <div data-slot="tooltip-content" class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 inline-flex w-fit max-w-xs items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs text-background whitespace-nowrap" style="display:none">
          ${content}
          <div class="absolute -bottom-[5px] left-1/2 -translate-x-1/2 size-2.5 rotate-45 rounded-[2px] bg-foreground"></div>
        </div>`;
    this.querySelector('[data-slot="tooltip-trigger"]').appendChild(fragment);
    const triggerEl = this.querySelector("[data-slot=tooltip-trigger]");
    const tooltipEl = this.querySelector("[data-slot=tooltip-content]");
    triggerEl.addEventListener("mouseenter", () => {
      tooltipEl.style.display = "";
    });
    triggerEl.addEventListener("mouseleave", () => {
      tooltipEl.style.display = "none";
    });
  }
};
define("bp-tooltip", BpTooltip);

// components/bp-command.ts
var BpCommand = class extends HTMLElement {
  connectedCallback() {
    const placeholder = attr(this, "placeholder", "Search...");
    const groups = Array.from(this.querySelectorAll("bp-command-group"));
    const topLevelItems = Array.from(this.children).filter(
      (el) => el.tagName.toLowerCase() === "bp-command-item"
    );
    let groupsHTML = "";
    if (topLevelItems.length > 0) {
      groupsHTML += renderItems(topLevelItems);
    }
    groups.forEach((group) => {
      const label = group.getAttribute("label") || "";
      const items = Array.from(group.querySelectorAll("bp-command-item"));
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
    this.setAttribute("data-slot", "command");
    this.classList.add(...commandClasses.split(" "));
    this.style.display = "flex";
    this.innerHTML = `
        <div data-slot="command-input-wrapper" class="${inputWrapperClasses}">
          <div class="flex h-8 items-center gap-2 rounded-md bg-input/20 px-2 dark:bg-input/30">
            <input data-slot="command-input" placeholder="${placeholder}" class="${inputClasses}" />
            ${searchIcon}
          </div>
        </div>
        <div data-slot="command-list" class="${listClasses}">
          ${groupsHTML || `<div data-slot="command-empty" class="${emptyClasses}">No results found.</div>`}
        </div>`;
  }
};
function renderItems(items) {
  let out = "";
  const itemClasses = "group/command-item relative flex min-h-7 cursor-default items-center gap-2 rounded-md px-2.5 py-1.5 text-xs/relaxed outline-hidden select-none in-data-[slot=dialog-content]:rounded-md data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-3.5 data-selected:*:[svg]:text-foreground";
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
  default: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>`,
  success: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-green-600 dark:text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>`,
  error: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-red-600 dark:text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><path d="m15 9-6 6"/><path d="m9 9 6 6"/></svg>`,
  warning: `<svg xmlns="http://www.w3.org/2000/svg" class="size-4 text-amber-600 dark:text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`
};
function toastHtml(title, description, icon) {
  return `
    <div data-slot="sonner" class="flex w-full max-w-sm items-start gap-3 rounded-lg border bg-popover p-3 text-popover-foreground shadow-md">
      <span class="mt-0.5 shrink-0">${icon}</span>
      <div class="flex-1 flex flex-col gap-0.5">
        ${title ? `<div class="text-xs font-medium">${title}</div>` : ""}
        ${description ? `<div class="text-xs text-muted-foreground">${description}</div>` : ""}
      </div>
      <button data-slot="sonner-close" class="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>`;
}
var BpSonner = class extends HTMLElement {
  connectedCallback() {
    const title = attr(this, "title");
    const description = attr(this, "description");
    const variant = attr(this, "variant", "default");
    const trigger = attr(this, "trigger");
    const icon = variantIcons[variant] || variantIcons.default;
    const toast = toastHtml(title, description, icon);
    if (trigger) {
      this.innerHTML = `
        <button data-slot="sonner-trigger" class="inline-flex shrink-0 items-center justify-center rounded-md border border-border bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none h-7 gap-1 px-2 hover:bg-input/50 dark:bg-input/30">${trigger}</button>
        <div data-slot="sonner-container" class="fixed bottom-4 right-4 z-50" style="display:none">${toast}</div>`;
      const triggerBtn = this.querySelector("[data-slot=sonner-trigger]");
      const container = this.querySelector("[data-slot=sonner-container]");
      const closeBtn = this.querySelector("[data-slot=sonner-close]");
      triggerBtn.addEventListener("click", () => {
        container.style.display = "";
        setTimeout(() => container.style.display = "none", 3e3);
      });
      closeBtn.addEventListener("click", () => container.style.display = "none");
    } else {
      this.innerHTML = toast;
    }
  }
};
define("bp-sonner", BpSonner);

// components/bp-alert.ts
var base = "group/alert relative grid w-full gap-0.5 rounded-lg border px-2 py-1.5 text-left text-xs/relaxed has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-1.5 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-3.5";
var variants3 = {
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
    const variantClasses = variants3[variant] || variants3.default;
    this.setAttribute("data-slot", "alert");
    this.setAttribute("role", "alert");
    this.classList.add(...cn(base, variantClasses).split(" "));
    this.style.display = "grid";
    this.innerHTML = `${title ? `<div data-slot="alert-title" class="${titleClasses}">${title}</div>` : ""}${description ? `<div data-slot="alert-description" class="${descriptionClasses}">${description}</div>` : ""}`;
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
function buildMetaBar(meta) {
  const fields = [
    ["version", meta.version],
    ["screenId", meta.screenId],
    ["title", meta.title],
    ["viewport", meta.viewport],
    ["purpose", meta.purpose]
  ];
  const metaItems = fields.filter(([, v]) => v).map(
    ([k, v]) => `<span class="text-muted-foreground text-[0.625rem]">${k}</span> <span class="text-foreground text-xs font-medium">${v}</span>`
  ).join(`<span class="text-border">\xB7</span>`);
  return metaItems ? `<div class="sticky top-0 z-10 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-4 py-2 border-b border-border bg-background">${metaItems}</div>` : "";
}
function buildAside(meta) {
  const allElements = meta.features ? collectElements(meta.features) : [];
  if (allElements.length === 0) return "";
  const items = allElements.map(
    ({ el }, i) => `<li data-target-el="${esc(el.id)}" class="flex flex-col gap-1.5 rounded-lg border border-border bg-background px-3 py-2.5 cursor-default transition-all hover:border-primary/40 hover:ring-1 hover:ring-primary/20">
          <div class="flex items-center gap-1.5">
            <span class="flex items-center justify-center size-4 rounded-full bg-muted text-[0.5625rem] font-medium text-muted-foreground">${i + 1}</span>
            <span class="inline-flex items-center rounded-md bg-primary/10 px-1.5 py-0.5 text-[0.5625rem] font-medium text-primary">${esc(el.type)}</span>
            <span class="font-semibold text-foreground text-xs">${esc(el.label)}</span>
          </div>
          <div class="text-[0.6875rem] leading-relaxed text-muted-foreground whitespace-pre-line pl-[1.375rem]">${esc(el.description)}</div>
        </li>`
  ).join("");
  return `
    <aside data-slot="bp-page-aside" class="sticky top-0 h-screen w-80 shrink-0 border-l border-border bg-muted/30 overflow-y-auto">
      <ol class="flex flex-col gap-2 list-none p-3 m-0">${items}</ol>
    </aside>`;
}
function isVisible(el) {
  return el.getClientRects().length > 0;
}
function getActiveStateTabIndex(stateTab) {
  const visiblePanel = stateTab.querySelector(
    '[data-slot="state-tab-panel"]:not([style*="display:none"])'
  );
  return visiblePanel?.dataset.tabIndex ?? null;
}
function setStateTabIndex(stateTab, index) {
  const button = stateTab.querySelector(
    `[data-slot="state-tab-btn"][data-tab-index="${index}"]`
  );
  button?.click();
}
function ensureElementVisible(target) {
  const restoreStates = [];
  const panel = target.closest('[data-slot="state-tab-panel"]');
  if (!panel || panel.style.display !== "none") {
    return { target, restoreStates };
  }
  const stateTab = panel.closest('[data-slot="bp-state-tab"]');
  const tabIndex = panel.dataset.tabIndex;
  if (!stateTab || tabIndex == null) {
    return { target, restoreStates };
  }
  const previousIndex = getActiveStateTabIndex(stateTab);
  if (previousIndex != null && previousIndex !== tabIndex) {
    restoreStates.push({ stateTab, previousIndex, activatedIndex: tabIndex });
  }
  setStateTabIndex(stateTab, tabIndex);
  const targetEl = target.dataset.el;
  if (!targetEl) return { target, restoreStates };
  const visibleMatch = Array.from(
    stateTab.querySelectorAll(`[data-el="${targetEl}"]`)
  ).find((el) => isVisible(el));
  return { target: visibleMatch ?? target, restoreStates };
}
function findHighlightTarget(content, targetEl) {
  const matches = Array.from(
    content.querySelectorAll(`[data-el="${targetEl}"]`)
  );
  if (matches.length === 0) return { target: null, restoreStates: [] };
  const visibleMatch = matches.find((el) => isVisible(el));
  if (visibleMatch) return { target: visibleMatch, restoreStates: [] };
  return ensureElementVisible(matches[0]);
}
function bindHoverHighlight(content, aside) {
  const hoverRestoreStates = /* @__PURE__ */ new WeakMap();
  aside.addEventListener("mouseover", (e) => {
    const li = e.target.closest("[data-target-el]");
    if (!li) return;
    const targetEl = li.dataset.targetEl;
    if (!targetEl) return;
    const { target, restoreStates } = findHighlightTarget(content, targetEl);
    hoverRestoreStates.set(li, restoreStates);
    if (target) target.setAttribute("data-highlight", "");
  });
  aside.addEventListener("mouseout", (e) => {
    const li = e.target.closest("[data-target-el]");
    if (!li) return;
    const targetEl = li.dataset.targetEl;
    if (!targetEl) return;
    const targets = content.querySelectorAll(`[data-el="${targetEl}"]`);
    for (const target of targets) {
      target.removeAttribute("data-highlight");
    }
    const restoreStates = hoverRestoreStates.get(li) ?? [];
    for (const restore of restoreStates) {
      const activeIndex = getActiveStateTabIndex(restore.stateTab);
      if (activeIndex === restore.activatedIndex) {
        setStateTabIndex(restore.stateTab, restore.previousIndex);
      }
    }
    hoverRestoreStates.delete(li);
  });
  content.addEventListener("mouseover", (e) => {
    const el = e.target.closest("[data-el]");
    if (!el) return;
    el.setAttribute("data-highlight", "");
    const li = aside.querySelector(`[data-target-el="${el.dataset.el}"]`);
    if (li) {
      li.classList.add("border-primary/40", "ring-1", "ring-primary/20");
    }
  });
  content.addEventListener("mouseout", (e) => {
    const el = e.target.closest("[data-el]");
    if (!el) return;
    el.removeAttribute("data-highlight");
    const li = aside.querySelector(`[data-target-el="${el.dataset.el}"]`);
    if (li) {
      li.classList.remove("border-primary/40", "ring-1", "ring-primary/20");
    }
  });
}
var BpPage = class extends HTMLElement {
  connectedCallback() {
    const showDescription = boolAttr(this, "description");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) {
      fragment.appendChild(this.firstChild);
    }
    const metaScript = document.getElementById("blueprint-meta");
    let meta = {};
    if (metaScript) {
      try {
        meta = JSON.parse(metaScript.textContent || "{}");
      } catch {
      }
    }
    const metaBarHtml = buildMetaBar(meta);
    const asideHtml = showDescription ? buildAside(meta) : "";
    this.innerHTML = `
      <div data-slot="bp-page" class="flex min-h-screen min-w-[1520px] bg-background text-foreground">
        <div class="flex-1 min-w-0">
          ${metaBarHtml}
          <div data-slot="bp-page-content" class="p-6 bg-muted min-w-[1200px]"></div>
        </div>
        ${asideHtml}
      </div>`;
    const content = this.querySelector('[data-slot="bp-page-content"]');
    const headerSlot = document.createDocumentFragment();
    const mainSlot = document.createDocumentFragment();
    const footerSlot = document.createDocumentFragment();
    const children = Array.from(fragment.childNodes);
    for (const child of children) {
      const slot = child.getAttribute?.("slot");
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
    content.querySelector('[data-slot="bp-page-header"]').appendChild(headerSlot);
    content.querySelector('[data-slot="bp-page-main"]').appendChild(mainSlot);
    content.querySelector('[data-slot="bp-page-footer"]').appendChild(footerSlot);
    if (showDescription) {
      const aside = this.querySelector('[data-slot="bp-page-aside"]');
      if (aside) bindHoverHighlight(content, aside);
    }
  }
};
define("bp-page", BpPage);

// components/bp-section.ts
var BpSection = class extends HTMLElement {
  connectedCallback() {
    const feature = attr(this, "data-feature");
    const label = attr(this, "data-label");
    const fragment = document.createDocumentFragment();
    while (this.firstChild) fragment.appendChild(this.firstChild);
    this.style.display = "block";
    this.innerHTML = `
      <div data-slot="bp-section" class="relative flex flex-col gap-3">
        <div data-slot="bp-section-content"></div>
      </div>`;
    this.querySelector('[data-slot="bp-section-content"]').appendChild(fragment);
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
            class="inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-full px-1.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all ${i === 0 ? "bg-background text-foreground dark:bg-input/30" : "text-foreground/60 hover:text-foreground"}"
          >${p.name}</button>`
    ).join("");
    const tabPanels = panels.map(
      (p, i) => `<div data-slot="state-tab-panel" data-tab-index="${i}" style="${i > 0 ? "display:none" : ""}">${p.content}</div>`
    ).join("");
    this.innerHTML = `
      <div data-slot="bp-state-tab" class="relative flex flex-col rounded-md transition-all">
        <div data-slot="state-tab-bar" class="absolute -top-4 right-1 z-20 inline-flex items-center justify-center rounded-full p-[3px] text-muted-foreground bg-muted outline outline-1 outline-dashed outline-offset-0 outline-[color-mix(in_oklch,var(--muted-foreground)_40%,transparent)] opacity-0 transition-opacity">${tabButtons}</div>
        <div data-slot="state-tab-panels">${tabPanels}</div>
      </div>`;
    const root = this.querySelector('[data-slot="bp-state-tab"]');
    const tabBar = this.querySelector('[data-slot="state-tab-bar"]');
    const show = () => {
      tabBar.style.opacity = "1";
      root.style.outlineWidth = "1px";
      root.style.outlineStyle = "dashed";
      root.style.outlineColor = "color-mix(in oklch, var(--muted-foreground) 40%, transparent)";
      root.style.outlineOffset = "4px";
      root.style.borderRadius = "0.5rem";
    };
    const hide = () => {
      tabBar.style.opacity = "0";
      root.style.outlineWidth = "";
      root.style.outlineStyle = "";
      root.style.outlineColor = "";
      root.style.outlineOffset = "";
      root.style.borderRadius = "";
    };
    root.addEventListener("mouseenter", () => show());
    root.addEventListener("mouseleave", () => hide());
    const nestedTabs = root.querySelectorAll('[data-slot="bp-state-tab"] [data-slot="bp-state-tab"]');
    for (const nested of nestedTabs) {
      nested.addEventListener("mouseenter", () => hide());
      nested.addEventListener("mouseleave", () => show());
    }
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
            el.classList.remove("text-foreground/60", "hover:text-foreground");
            el.classList.add("bg-background", "text-foreground", "dark:bg-input/30");
          } else {
            el.classList.remove("bg-background", "text-foreground", "dark:bg-input/30");
            el.classList.add("text-foreground/60", "hover:text-foreground");
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
  esc,
  html,
  safeAttr
};
