import { SPFI } from "@pnp/sp";
import { IProject, IProjectCreate } from "../models/IProject";
import { LIST_NAMES, PROJECT_FIELDS, MAX_ITEMS_PER_QUERY } from "../utils/constants";

export class ProjectService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  public async getAll(activeOnly: boolean = true): Promise<IProject[]> {
    let query = this.sp.web.lists
      .getByTitle(LIST_NAMES.PROJECTS)
      .items.select(...PROJECT_FIELDS.SELECT)
      .expand(...PROJECT_FIELDS.EXPAND)
      .orderBy("Title", true)
      .top(MAX_ITEMS_PER_QUERY);

    if (activeOnly) {
      query = query.filter("IsActive eq 1") as typeof query;
    }

    return query();
  }

  public async getById(id: number): Promise<IProject> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.PROJECTS)
      .items.getById(id)
      .select(...PROJECT_FIELDS.SELECT)
      .expand(...PROJECT_FIELDS.EXPAND)();
  }

  /**
   * Get projects where the given user is a team member or project manager.
   */
  public async getByTeamMember(userId: number, activeOnly: boolean = true): Promise<IProject[]> {
    const all = await this.getAll(activeOnly);
    return all.filter(
      (p) =>
        p.ProjectManagerId === userId ||
        (p.TeamMembersId && p.TeamMembersId.includes(userId))
    );
  }

  public async getByClient(client: string): Promise<IProject[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.PROJECTS)
      .items.filter(`Client eq '${client}' and IsActive eq 1`)
      .select(...PROJECT_FIELDS.SELECT)
      .expand(...PROJECT_FIELDS.EXPAND)
      .orderBy("Title", true)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async create(project: IProjectCreate): Promise<IProject> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.PROJECTS)
      .items.add(project);
    return result as unknown as IProject;
  }

  public async update(id: number, updates: Partial<IProject>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.PROJECTS)
      .items.getById(id)
      .update(updates);
  }

  public async archive(id: number): Promise<void> {
    await this.update(id, { IsActive: false } as Partial<IProject>);
  }

  /**
   * Update the ActualHours rollup for a project.
   */
  public async updateActualHours(id: number, totalHours: number): Promise<void> {
    await this.update(id, { ActualHours: totalHours } as Partial<IProject>);
  }
}
