import type { User } from "@/types/user.type";

export interface ICamera {
  stream: MediaStream;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  user: User;
}
