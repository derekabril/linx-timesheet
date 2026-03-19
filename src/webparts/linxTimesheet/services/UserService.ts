import { SPFI } from "@pnp/sp";
import "@pnp/sp/site-users";
import "@pnp/sp/webs";
import "@pnp/sp/site-groups";
import { IUser } from "../models/IUser";

export interface ISiteUser {
  Id: number;
  Title: string;
  Email: string;
  LoginName: string;
}

export class UserService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  /**
   * Lightweight: get current user basics (single API call).
   */
  public async getCurrentUser(): Promise<{ id: number; displayName: string; email: string }> {
    const user = await this.sp.web.currentUser();
    return { id: user.Id, displayName: user.Title, email: user.Email };
  }

  /**
   * Load current user info, manager status, and site owner status in
   * as few round trips as possible.
   */
  public async getCurrentUserWithRoles(): Promise<{
    user: IUser;
    isManager: boolean;
    isSiteOwner: boolean;
  }> {
    // Batch 1: independent calls in parallel
    const [spUser, profile, ownerGroupInfo] = await Promise.all([
      this.sp.web.currentUser(),
      this.sp.profiles.myProperties(),
      this.sp.web.associatedOwnerGroup().catch(() => null),
    ]);

    // Batch 2: dependent calls in parallel
    const managerLogin = profile.UserProfileProperties?.find(
      (p: { Key: string; Value: string }) => p.Key === "Manager"
    )?.Value;

    const directReports = (profile as { DirectReports?: string[] }).DirectReports ?? [];

    const managerPromise = managerLogin
      ? this.sp.web.ensureUser(managerLogin).catch(() => null)
      : Promise.resolve(null);

    const ownersPromise = ownerGroupInfo
      ? this.sp.web.siteGroups.getById(ownerGroupInfo.Id).users().catch(() => [])
      : Promise.resolve([]);

    const [managerUser, owners] = await Promise.all([managerPromise, ownersPromise]);

    return {
      user: {
        id: spUser.Id,
        loginName: spUser.LoginName,
        displayName: spUser.Title,
        email: spUser.Email,
        jobTitle: profile.Title || "",
        managerId: managerUser?.Id ?? null,
        managerTitle: managerUser?.Title ?? null,
        isSiteAdmin: spUser.IsSiteAdmin,
      },
      isManager: directReports.length > 0,
      isSiteOwner: (owners as { Id: number }[]).some((o) => o.Id === spUser.Id),
    };
  }

  /**
   * Search site users by name or email for people picker.
   */
  public async searchUsers(query: string): Promise<ISiteUser[]> {
    const users = await this.sp.web.siteUsers
      .select("Id", "Title", "Email", "LoginName")();
    const q = query.toLowerCase();
    return (users as ISiteUser[])
      .filter((u) => !!u.Email)
      .filter((u) => {
        const title = (u.Title || "").toLowerCase();
        const email = (u.Email || "").toLowerCase();
        // Match against full name, individual name parts, or email
        const nameParts = title.split(/\s+/);
        return title.includes(q) || email.includes(q) || nameParts.some((part) => part.includes(q));
      })
      .slice(0, 20);
  }

  /**
   * Get site users by their IDs.
   */
  public async getUsersByIds(ids: number[]): Promise<ISiteUser[]> {
    if (ids.length === 0) return [];
    const allUsers = await this.sp.web.siteUsers
      .select("Id", "Title", "Email", "LoginName")();
    return (allUsers as ISiteUser[]).filter((u) => ids.includes(u.Id));
  }
}
