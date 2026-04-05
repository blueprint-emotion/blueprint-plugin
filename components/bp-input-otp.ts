import { define, attr, cn } from "./bp-core";

const slotBase =
  "relative flex size-7 items-center justify-center border-y border-r border-input bg-input/20 text-xs/relaxed transition-all outline-none first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-2 data-[active=true]:ring-ring/30 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40";

const groupBase =
  "flex items-center rounded-md has-aria-invalid:border-destructive has-aria-invalid:ring-2 has-aria-invalid:ring-destructive/20 dark:has-aria-invalid:ring-destructive/40";

class BpInputOtp extends HTMLElement {
  connectedCallback() {
    const length = parseInt(attr(this, "length", "6"), 10);

    const slots = Array.from({ length }, (_, i) => {
      const val = "";
      return `<div
        data-slot="input-otp-slot"
        class="${cn(slotBase)}"
      >${val}</div>`;
    }).join("");

    // Apply data-slot and classes directly on the custom element (Fix 1)
    this.setAttribute("data-slot", "input-otp");
    this.classList.add(..."cn-input-otp flex items-center has-disabled:opacity-50".split(" "));
    this.style.display = "flex";

    this.innerHTML = `<div
        data-slot="input-otp-group"
        class="${cn(groupBase)}"
      >${slots}</div>`;
  }
}

define("bp-input-otp", BpInputOtp);
