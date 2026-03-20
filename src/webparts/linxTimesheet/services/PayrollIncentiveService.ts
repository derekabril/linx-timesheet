import { SPFI } from "@pnp/sp";
import { LIST_NAMES } from "../utils/constants";

interface IPayrollIncentiveSelectionItem {
  Id: number;
  EmployeeId: number;
  Year: number;
  WeekNumber: number;
  SelectedIncentiveIds: string; // comma-separated incentive Ids
}

/**
 * Persists manual incentive selections per employee per week in SharePoint.
 * Each row stores a comma-separated list of selected incentive IDs.
 */
export class PayrollIncentiveService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  /**
   * Load all incentive selections for a given week.
   * Returns a map: employeeId -> { incentiveId: quantity }.
   * Storage format: "id:qty,id:qty,...". Legacy "id,id,..." treated as qty 1.
   */
  public async getByWeek(year: number, weekNumber: number): Promise<Record<number, Record<number, number>>> {
    const items: IPayrollIncentiveSelectionItem[] = await this.sp.web.lists
      .getByTitle(LIST_NAMES.PAYROLL_INCENTIVE_SELECTIONS)
      .items.filter(`Year eq ${year} and WeekNumber eq ${weekNumber}`)
      .select("Id", "EmployeeId", "Year", "WeekNumber", "SelectedIncentiveIds")
      .top(500)();

    const result: Record<number, Record<number, number>> = {};
    for (const item of items) {
      if (item.EmployeeId && item.SelectedIncentiveIds) {
        const selections: Record<number, number> = {};
        item.SelectedIncentiveIds.split(",").forEach((s) => {
          const parts = s.trim().split(":");
          const id = Number(parts[0]);
          const qty = parts.length > 1 ? Number(parts[1]) : 1;
          if (!isNaN(id) && id > 0 && !isNaN(qty) && qty > 0) {
            selections[id] = qty;
          }
        });
        if (Object.keys(selections).length > 0) {
          result[item.EmployeeId] = selections;
        }
      }
    }
    return result;
  }

  /**
   * Save incentive selections for a single employee in a given week.
   * Creates or updates the row as needed.
   */
  public async save(
    employeeId: number,
    year: number,
    weekNumber: number,
    selections: Record<number, number>
  ): Promise<void> {
    const list = this.sp.web.lists.getByTitle(LIST_NAMES.PAYROLL_INCENTIVE_SELECTIONS);

    // Check for existing row
    const existing: IPayrollIncentiveSelectionItem[] = await list.items
      .filter(`EmployeeId eq ${employeeId} and Year eq ${year} and WeekNumber eq ${weekNumber}`)
      .select("Id")
      .top(1)();

    const entries = Object.entries(selections).filter(([, qty]) => qty > 0);
    const idsString = entries.map(([id, qty]) => `${id}:${qty}`).join(",");

    if (existing.length > 0) {
      if (entries.length === 0) {
        // Remove the row if no incentives selected
        await list.items.getById(existing[0].Id).delete();
      } else {
        await list.items.getById(existing[0].Id).update({
          SelectedIncentiveIds: idsString,
        });
      }
    } else if (entries.length > 0) {
      await list.items.add({
        Title: `${year}-W${weekNumber}-${employeeId}`,
        EmployeeId: employeeId,
        Year: year,
        WeekNumber: weekNumber,
        SelectedIncentiveIds: idsString,
      });
    }
  }
}
