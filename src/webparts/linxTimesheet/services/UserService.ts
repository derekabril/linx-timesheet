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
   * Get the current logged-in user's details.
   */
  public async getCurrentUser(): Promise<IUser> {
    const user = await this.sp.web.currentUser();
    const profile = await this.sp.profiles.myProperties();

    const managerLogin = profile.UserProfileProperties?.find(
      (p: { Key: string; Value: string }) => p.Key === "Manager"
    )?.Value;

    let managerId: number | null = null;
    let managerTitle: string | null = null;

    if (managerLogin) {
      try {
        const managerUser = await this.sp.web.ensureUser(managerLogin);
        managerId = managerUser.Id;
        managerTitle = managerUser.Title;
      } catch {
        // Manager not found in site
      }
    }

    return {
      id: user.Id,
      loginName: user.LoginName,
      displayName: user.Title,
      email: user.Email,
      jobTitle: profile.Title || "",
      managerId,
      managerTitle,
      isSiteAdmin: user.IsSiteAdmin,
    };
  }

  /**
   * Check if the current user is a manager (has direct reports).
   */
  public async isManager(): Promise<boolean> {
    try {
      const reports = await this.sp.profiles.myProperties.select("DirectReports")();
      return ((reports as { DirectReports?: string[] }).DirectReports?.length ?? 0) > 0;
    } catch {
      return false;
    }
  }

  /**
   * Check if the current user is a member of the site's Owners group.
   */
  public async isSiteOwner(): Promise<boolean> {
    try {
      const ownerGroup = await this.sp.web.associatedOwnerGroup();
      const owners = await this.sp.web.siteGroups.getById(ownerGroup.Id).users();
      const currentUser = await this.sp.web.currentUser();
      return owners.some((o: { Id: number }) => o.Id === currentUser.Id);
    } catch {
      return false;
    }
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
