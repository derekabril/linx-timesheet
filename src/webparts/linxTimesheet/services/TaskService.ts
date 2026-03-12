import { SPFI } from "@pnp/sp";
import { ITask, ITaskCreate } from "../models/ITask";
import { LIST_NAMES, MAX_ITEMS_PER_QUERY } from "../utils/constants";

export class TaskService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  public async getByProject(projectId: number, activeOnly: boolean = true): Promise<ITask[]> {
    let filter = `ProjectId eq ${projectId}`;
    if (activeOnly) filter += " and IsActive eq 1";

    return this.sp.web.lists
      .getByTitle(LIST_NAMES.TASKS)
      .items.filter(filter)
      .select("Id", "Title", "ProjectId", "Project/Title", "TaskCode", "PlannedHours", "IsActive", "Created", "Modified")
      .expand("Project")
      .orderBy("Title", true)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async getById(id: number): Promise<ITask> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.TASKS)
      .items.getById(id)
      .select("Id", "Title", "ProjectId", "Project/Title", "TaskCode", "PlannedHours", "IsActive", "Created", "Modified")
      .expand("Project")();
  }

  public async create(task: ITaskCreate): Promise<ITask> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TASKS)
      .items.add(task);
    return result as unknown as ITask;
  }

  public async update(id: number, updates: Partial<ITask>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.TASKS)
      .items.getById(id)
      .update(updates);
  }

  public async archive(id: number): Promise<void> {
    await this.update(id, { IsActive: false } as Partial<ITask>);
  }
}
