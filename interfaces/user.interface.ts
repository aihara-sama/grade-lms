export enum ROLES {
  STUDENT = "Student",
  TEACHER = "Teacher",
  GUEST = "Guest",
}

export interface IUserMetadata {
  name: string;
  role: ROLES;
  /**
   * Push Notifications Token
   */
  fcm_token?: string;
  creator_id?: string;
}
export interface IUser {
  id: string;
  userName: string;
  role: ROLES;
  email?: string;
}
