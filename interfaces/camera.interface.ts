import type { User } from "@/types/user.type";

export interface Camera {
  user: User;
  stream: MediaStream;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
}
