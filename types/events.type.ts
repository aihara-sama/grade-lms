export type TEvent = TBasicEvent | TPointerEvent | TWhiteboardEvent;
export type TBasicEvent =
  | "connect"
  | "connect_error"
  | "disconnect"
  | "upgrade"
  | "packet"
  | "packetCreate"
  | "drain"
  | "close";

export type TPointerEvent = "pointer:move";
export type TWhiteboardEvent = "whiteboard:change";
export enum Event {
  ChatMessage = "chat:message",
  NewNotification = "notification:new",
  ToggleCamera = "camera:toggle",
  ToggleAudio = "audio:toggle",
}
