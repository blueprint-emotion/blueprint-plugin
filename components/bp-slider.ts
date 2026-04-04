import { define, attr } from "./bp-core";

class BpSlider extends HTMLElement {
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

    const pct = ((value - min) / (max - min)) * 100;

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

    const rangeInput = this.querySelector("input[type='range']") as HTMLInputElement;
    const rangeBar = this.querySelector("[data-slot='slider-range']") as HTMLElement;
    const thumb = this.querySelector("[data-slot='slider-thumb']") as HTMLElement;

    rangeInput.addEventListener("input", () => {
      const v = Number(rangeInput.value);
      const p = ((v - min) / (max - min)) * 100;
      rangeBar.style.width = `${p}%`;
      thumb.style.left = `${p}%`;
      thumb.setAttribute("aria-valuenow", String(v));
    });
  }
}

define("bp-slider", BpSlider);
