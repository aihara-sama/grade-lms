import type { IUserMetadata } from "@/interfaces/user.interface";

export interface ISubmission {
  author: IUserMetadata;
  body: string;
  id: string;
  created: string;
}
