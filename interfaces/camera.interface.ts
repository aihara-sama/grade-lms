import type { ROLES } from "./user.interface";

export interface ICamera {
  stream: MediaStream;
  // user: User;
  isMicEnabled: boolean;
  isCameraEnabled: boolean;
  anonId: string;
  userName: string;
  role: ROLES;
}
