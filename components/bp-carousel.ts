import { define, html } from "./bp-core";

class BpCarousel extends HTMLElement {
  connectedCallback() {
    const slides = Array.from(this.children);
    const body = slides.map((child) => child.outerHTML).join("");

    // shadcn: Carousel root
    const rootClasses = "relative";
    // shadcn: CarouselContent wrapper
    const overflowClasses = "overflow-hidden";
    // shadcn: CarouselContent inner (horizontal)
    const contentClasses = "flex -ml-4";
    // shadcn: CarouselItem
    const itemClasses = "min-w-0 shrink-0 grow-0 basis-full pl-4";
    // shadcn: CarouselPrevious
    const prevClasses = "absolute touch-manipulation rounded-full top-1/2 -left-12 -translate-y-1/2";
    // shadcn: CarouselNext
    const nextClasses = "absolute touch-manipulation rounded-full top-1/2 -right-12 -translate-y-1/2";

    // Wrap each direct child as a slide
    const slideItems = slides.length > 0
      ? slides.map((child, i) =>
          `<div role="group" aria-roledescription="slide" data-slot="carousel-item" class="${itemClasses}" ${i > 0 ? 'style="display:none"' : ""}>${child.outerHTML}</div>`
        ).join("")
      : `<div role="group" aria-roledescription="slide" data-slot="carousel-item" class="${itemClasses}"><div class="flex items-center justify-center h-32 bg-muted rounded-lg text-muted-foreground text-xs">Slide</div></div>`;

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
}

define("bp-carousel", BpCarousel);
