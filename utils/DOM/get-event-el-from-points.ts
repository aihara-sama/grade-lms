import type { EventElement } from "@/interfaces/element.interface";

export const getEventElFromPoints = (x: number, y: number) =>
  document
    .elementsFromPoint(x, y)
    .find((el) => el.classList.contains("event")) as EventElement;
