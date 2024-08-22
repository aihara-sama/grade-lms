import type { Role } from "@/interfaces/user.interface";

export interface ICamera {
  stream: MediaStream;
  // user: User;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  anonId: string;
  userName: string;
  role: Role;
}
