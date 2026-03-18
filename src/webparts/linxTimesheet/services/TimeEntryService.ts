import { SPFI } from "@pnp/sp";
import { ITimeEntry, ITimeEntryCreate } from "../models/ITimeEntry";
import { LIST_NAMES, TIME_ENTRY_FIELDS, MAX_ITEMS_PER_QUERY } from "../utils/constants";

export class TimeEntryService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static mapEntry(item: any): ITimeEntry {
    return {
      ...item,
      EmployeeTitle: item.Employee?.Title ?? item.EmployeeTitle,
      ProjectTitle: item.Project?.Title ?? item.ProjectTitle,
      TaskTitle: item.Task?.Title ?? item.TaskTitle,
    };
  }

  private static mapEntries(items: unknown[]): ITimeEntry[] {
    return items.map(TimeEntryService.mapEntry);
  }

  /**
   * Get time entries for a specific employee, year, and week.
   * Uses indexed columns (Year, WeekNumber, Employee) for optimal query.
   */
  public async getByEmployeeAndWeek(
    employeeId: number,
    year: number,
    weekNumber: number
  ): Promise<ITimeEntry[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(
        `EmployeeId eq ${employeeId} and Year eq ${year} and WeekNumber eq ${weekNumber} and Status ne 'Voided'`
      )
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .orderBy("EntryDate", true)
      .orderBy("ClockIn", true)
      .top(MAX_ITEMS_PER_QUERY)();
    return TimeEntryService.mapEntries(items);
  }

  /**
   * Get today's entries for a specific employee.
   */
  public async getToday(employeeId: number, todayStr: string): Promise<ITimeEntry[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(
        `EmployeeId eq ${employeeId} and EntryDate eq '${todayStr}' and Status ne 'Voided'`
      )
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .orderBy("ClockIn", true)
      .top(50)();
    return TimeEntryService.mapEntries(items);
  }

  /**
   * Get the currently active (clocked-in but not clocked-out) entry.
   */
  public async getActiveEntry(employeeId: number): Promise<ITimeEntry | null> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(
        `EmployeeId eq ${employeeId} and Status eq 'Active' and EntryType eq 'Clock'`
      )
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .orderBy("Created", false)
      .top(1)();
    return items.length > 0 ? TimeEntryService.mapEntry(items[0]) : null;
  }

  /**
   * Get entries by submission ID (for approval review).
   */
  public async getBySubmission(submissionId: number): Promise<ITimeEntry[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(`SubmissionId eq ${submissionId}`)
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .orderBy("EntryDate", true)
      .orderBy("ClockIn", true)
      .top(MAX_ITEMS_PER_QUERY)();
    return TimeEntryService.mapEntries(items);
  }

  /**
   * Get entries for multiple submission IDs in a single query.
   */
  public async getBySubmissionIds(submissionIds: number[]): Promise<ITimeEntry[]> {
    if (submissionIds.length === 0) return [];
    const filter = submissionIds.map((id) => `SubmissionId eq ${id}`).join(" or ");
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(filter)
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .top(MAX_ITEMS_PER_QUERY)();
    return TimeEntryService.mapEntries(items);
  }

  /**
   * Get entries for a date range and employee (for reporting).
   */
  public async getByDateRange(
    employeeId: number,
    startDate: string,
    endDate: string
  ): Promise<ITimeEntry[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(
        `EmployeeId eq ${employeeId} and EntryDate ge '${startDate}' and EntryDate le '${endDate}' and Status ne 'Voided'`
      )
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .orderBy("EntryDate", true)
      .top(MAX_ITEMS_PER_QUERY)();
    return TimeEntryService.mapEntries(items);
  }

  /**
   * Get entries for all employees in a date range (manager reporting).
   */
  public async getAllByDateRange(
    startDate: string,
    endDate: string
  ): Promise<ITimeEntry[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.filter(
        `EntryDate ge '${startDate}' and EntryDate le '${endDate}' and Status ne 'Voided'`
      )
      .select(...TIME_ENTRY_FIELDS.SELECT)
      .expand(...TIME_ENTRY_FIELDS.EXPAND)
      .orderBy("EntryDate", true)
      .top(MAX_ITEMS_PER_QUERY)();
    return TimeEntryService.mapEntries(items);
  }

  /**
   * Create a new time entry.
   */
  public async create(entry: ITimeEntryCreate): Promise<ITimeEntry> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.add(entry);
    return result as unknown as ITimeEntry;
  }

  /**
   * Update an existing time entry.
   */
  public async update(id: number, updates: Partial<ITimeEntry>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.TIME_ENTRIES)
      .items.getById(id)
      .update(updates);
  }

  /**
   * Soft-delete (void) a time entry. Never hard-delete for compliance.
   */
  public async void(id: number): Promise<void> {
    await this.update(id, { Status: "Voided" as never });
  }

  /**
   * Link entries to a submission (batch update SubmissionId).
   */
  public async linkToSubmission(
    entryIds: number[],
    submissionId: number
  ): Promise<void> {
    const list = this.sp.web.lists.getByTitle(LIST_NAMES.TIME_ENTRIES);
    for (const id of entryIds) {
      await list.items.getById(id).update({ SubmissionId: submissionId });
    }
  }

  /**
   * Unlink entries from a submission (set SubmissionId to null).
   */
  public async unlinkFromSubmission(entryIds: number[]): Promise<void> {
    const list = this.sp.web.lists.getByTitle(LIST_NAMES.TIME_ENTRIES);
    for (const id of entryIds) {
      await list.items.getById(id).update({ SubmissionId: null });
    }
  }
}
