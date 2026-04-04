import { define, attr } from "./bp-core";

class BpCalendar extends HTMLElement {
  connectedCallback() {
    // shadcn: Calendar root
    const rootClasses = "group/calendar bg-background p-3 [--cell-radius:var(--radius-md)] [--cell-size:--spacing(6)]";
    // shadcn: months
    const monthsClasses = "relative flex flex-col gap-4 md:flex-row";
    // shadcn: month
    const monthClasses = "flex w-full flex-col gap-4";
    // shadcn: nav
    const navClasses = "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1";
    // shadcn: button_previous / button_next (ghost variant + sizing)
    const navBtnClasses = "size-(--cell-size) p-0 select-none inline-flex items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground";
    // shadcn: month_caption
    const captionClasses = "flex h-(--cell-size) w-full items-center justify-center px-(--cell-size)";
    // shadcn: caption_label (captionLayout="label" branch)
    const captionLabelClasses = "font-medium select-none text-sm";
    // shadcn: weekdays
    const weekdaysClasses = "flex";
    // shadcn: weekday
    const weekdayClasses = "flex-1 rounded-(--cell-radius) text-[0.8rem] font-normal text-muted-foreground select-none";
    // shadcn: week
    const weekClasses = "mt-2 flex w-full";
    // shadcn: day
    const dayClasses = "group/day relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none";
    // shadcn: CalendarDayButton
    const dayBtnClasses = "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal inline-flex items-center justify-center rounded-md text-sm hover:bg-accent hover:text-accent-foreground";
    // shadcn: today
    const todayClasses = "rounded-(--cell-radius) bg-muted text-foreground";
    // shadcn: outside
    const outsideClasses = "text-muted-foreground";

    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const today = now.getDate();

    const monthName = now.toLocaleString("default", { month: "long", year: "numeric" });
    const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    // Build calendar grid
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const chevronLeft = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m15 18-6-6 6-6"/></svg>`;
    const chevronRight = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="size-4"><path d="m9 18 6-6-6-6"/></svg>`;

    // Weekday header row
    const weekdayHeaders = dayNames
      .map((d) => `<th class="${weekdayClasses}" style="text-align:center;padding:4px 0">${d}</th>`)
      .join("");

    // Build weeks
    const cells: string[] = [];
    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      cells.push(`<td class="${dayClasses}"><button class="${dayBtnClasses} ${outsideClasses}" tabindex="-1">${d}</button></td>`);
    }
    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === today;
      const extraClasses = isToday ? todayClasses : "";
      cells.push(`<td class="${dayClasses}${isToday ? " " + todayClasses : ""}"><button class="${dayBtnClasses}${isToday ? " " + todayClasses : ""}" tabindex="-1">${d}</button></td>`);
    }
    // Next month leading days
    const remaining = 7 - (cells.length % 7);
    if (remaining < 7) {
      for (let d = 1; d <= remaining; d++) {
        cells.push(`<td class="${dayClasses}"><button class="${dayBtnClasses} ${outsideClasses}" tabindex="-1">${d}</button></td>`);
      }
    }

    // Chunk into weeks
    const weeks: string[] = [];
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
}

define("bp-calendar", BpCalendar);
