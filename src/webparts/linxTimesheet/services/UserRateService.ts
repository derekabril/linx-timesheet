import { SPFI } from "@pnp/sp";
import { IUserRate, IUserRateCreate } from "../models/IUserRate";
import { LIST_NAMES, MAX_ITEMS_PER_QUERY } from "../utils/constants";

const USER_RATE_FIELDS = {
  SELECT: ["Id", "Title", "EmployeeId", "Employee/Title", "HourlyRate"],
  EXPAND: ["Employee"],
} as const;

export class UserRateService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  public async getAll(): Promise<IUserRate[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.USER_RATES)
      .items.select(...USER_RATE_FIELDS.SELECT)
      .expand(...USER_RATE_FIELDS.EXPAND)
      .orderBy("Title", true)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async getByEmployeeId(employeeId: number): Promise<IUserRate | null> {
    const items: IUserRate[] = await this.sp.web.lists
      .getByTitle(LIST_NAMES.USER_RATES)
      .items.filter(`EmployeeId eq ${employeeId}`)
      .select(...USER_RATE_FIELDS.SELECT)
      .expand(...USER_RATE_FIELDS.EXPAND)
      .top(1)();
    return items.length > 0 ? items[0] : null;
  }

  public async create(data: IUserRateCreate): Promise<IUserRate> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.USER_RATES)
      .items.add(data);
    return result as unknown as IUserRate;
  }

  public async update(id: number, updates: Partial<IUserRateCreate>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.USER_RATES)
      .items.getById(id)
      .update(updates);
  }

  public async delete(id: number): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.USER_RATES)
      .items.getById(id)
      .delete();
  }
}
