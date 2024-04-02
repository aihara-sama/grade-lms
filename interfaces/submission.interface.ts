import type { IUserMetadata } from "./user.interface";

export interface ISubmission {
  author: IUserMetadata;
  body: string;
  id: string;
  created: string;
}
