import { SPFI } from "@pnp/sp";
import { IHoliday, IHolidayCreate } from "../models/IHoliday";
import { LIST_NAMES } from "../utils/constants";

export class HolidayService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  public async getByYear(year: number): Promise<IHoliday[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.HOLIDAYS)
      .items.filter(`Year eq ${year} or IsRecurring eq 1`)
      .select("Id", "Title", "HolidayDate", "Year", "IsRecurring")
      .orderBy("HolidayDate", true)
      .top(100)();
  }

  public async create(holiday: IHolidayCreate): Promise<IHoliday> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.HOLIDAYS)
      .items.add(holiday);
    return result as unknown as IHoliday;
  }

  public async update(id: number, updates: Partial<IHoliday>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.HOLIDAYS)
      .items.getById(id)
      .update(updates);
  }

  public async delete(id: number): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.HOLIDAYS)
      .items.getById(id)
      .delete();
  }

  /**
   * Check if a specific date is a holiday.
   */
  public isHoliday(date: Date, holidays: IHoliday[]): boolean {
    const dateStr = date.toISOString().split("T")[0];
    return holidays.some((h) => {
      const holidayDate = h.HolidayDate.split("T")[0];
      return holidayDate === dateStr;
    });
  }
}
