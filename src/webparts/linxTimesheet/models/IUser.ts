export interface IUser {
  id: number;
  loginName: string;
  displayName: string;
  email: string;
  jobTitle: string;
  managerId: number | null;
  managerTitle: string | null;
  isSiteAdmin: boolean;
}
