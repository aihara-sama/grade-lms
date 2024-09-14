import type { User } from "@/types/users";
import type { MediaConnection } from "peerjs";

export interface ICamera {
  stream: MediaStream;
  connection?: MediaConnection;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  user: User;
}
