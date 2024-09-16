import type { User } from "@/types/users";

export interface ICamera {
  stream: MediaStream;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  user: User;
}
