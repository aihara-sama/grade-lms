interface EventDataset extends DOMStringMap {
  lessonId: string;
}
interface EventPlaceholderDataset extends DOMStringMap {
  date: string;
}

export interface EventElement extends HTMLElement {
  dataset: EventDataset;
}
export interface EventPlaceholderElement extends HTMLElement {
  dataset: EventPlaceholderDataset;
}
