import type { EventPlaceholderElement } from "@/interfaces/element.interface";

export const getEventPlaceholderElFromPoints = (x: number, y: number) =>
  document
    .elementsFromPoint(x, y)
    .find((el) =>
      el.classList.contains("event-placeholder")
    ) as EventPlaceholderElement;
