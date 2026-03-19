import { SPFI } from "@pnp/sp";
import { IIncentive, IIncentiveCreate, IIncentiveAssignment, IIncentiveAssignmentCreate } from "../models/IIncentive";
import { LIST_NAMES, MAX_ITEMS_PER_QUERY } from "../utils/constants";

const INCENTIVE_FIELDS = {
  SELECT: ["Id", "Title", "Frequency", "Value", "IncentiveType", "IsActive"],
} as const;

const ASSIGNMENT_FIELDS = {
  SELECT: ["Id", "Title", "IncentiveId", "Incentive/Title", "EmployeeId", "Employee/Title"],
  EXPAND: ["Incentive", "Employee"],
} as const;

export class IncentiveService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  // ── Incentives CRUD ──

  public async getAll(): Promise<IIncentive[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVES)
      .items.select(...INCENTIVE_FIELDS.SELECT)
      .orderBy("Title", true)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async create(data: IIncentiveCreate): Promise<IIncentive> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVES)
      .items.add(data);
    return result as unknown as IIncentive;
  }

  public async update(id: number, updates: Partial<IIncentiveCreate>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVES)
      .items.getById(id)
      .update(updates);
  }

  public async delete(id: number): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVES)
      .items.getById(id)
      .delete();
  }

  // ── Assignments CRUD ──

  public async getAssignments(): Promise<IIncentiveAssignment[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVE_ASSIGNMENTS)
      .items.select(...ASSIGNMENT_FIELDS.SELECT)
      .expand(...ASSIGNMENT_FIELDS.EXPAND)
      .orderBy("Title", true)
      .top(MAX_ITEMS_PER_QUERY)();

    return items.map((item: Record<string, unknown>) => ({
      ...item,
      IncentiveTitle: (item.Incentive as Record<string, unknown>)?.Title as string ?? undefined,
      EmployeeTitle: (item.Employee as Record<string, unknown>)?.Title as string ?? undefined,
    })) as IIncentiveAssignment[];
  }

  public async getAssignmentsByEmployee(employeeId: number): Promise<IIncentiveAssignment[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVE_ASSIGNMENTS)
      .items.filter(`EmployeeId eq ${employeeId}`)
      .select(...ASSIGNMENT_FIELDS.SELECT)
      .expand(...ASSIGNMENT_FIELDS.EXPAND)
      .top(MAX_ITEMS_PER_QUERY)();

    return items.map((item: Record<string, unknown>) => ({
      ...item,
      IncentiveTitle: (item.Incentive as Record<string, unknown>)?.Title as string ?? undefined,
      EmployeeTitle: (item.Employee as Record<string, unknown>)?.Title as string ?? undefined,
    })) as IIncentiveAssignment[];
  }

  public async createAssignment(data: IIncentiveAssignmentCreate): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVE_ASSIGNMENTS)
      .items.add(data);
  }

  public async deleteAssignment(id: number): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.INCENTIVE_ASSIGNMENTS)
      .items.getById(id)
      .delete();
  }
}
