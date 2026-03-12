import { SPFI } from "@pnp/sp";
import { IUser } from "../models/IUser";

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
}
