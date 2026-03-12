import { SPFI } from "@pnp/sp";
import { ITimesheetSubmission, ITimesheetSubmissionCreate } from "../models/ITimesheetSubmission";
import { LIST_NAMES, SUBMISSION_FIELDS, MAX_ITEMS_PER_QUERY } from "../utils/constants";

export class SubmissionService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static mapSubmission(item: any): ITimesheetSubmission {
    return {
      ...item,
      EmployeeTitle: item.Employee?.Title ?? item.EmployeeTitle,
    };
  }

  private static mapSubmissions(items: unknown[]): ITimesheetSubmission[] {
    return items.map(SubmissionService.mapSubmission);
  }

  /**
   * Get submissions for an employee for a given year.
   */
  public async getByEmployee(employeeId: number, year: number): Promise<ITimesheetSubmission[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.SUBMISSIONS)
      .items.filter(`EmployeeId eq ${employeeId} and Year eq ${year}`)
      .select(...SUBMISSION_FIELDS.SELECT)
      .expand(...SUBMISSION_FIELDS.EXPAND)
      .orderBy("PeriodStart", false)
      .top(MAX_ITEMS_PER_QUERY)();
    return SubmissionService.mapSubmissions(items);
  }

  /**
   * Get a specific submission for a given employee and week.
   */
  public async getByEmployeeAndWeek(
    employeeId: number,
    year: number,
    weekNumber: number
  ): Promise<ITimesheetSubmission | null> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.SUBMISSIONS)
      .items.filter(
        `EmployeeId eq ${employeeId} and Year eq ${year} and WeekNumber eq ${weekNumber} and Status ne 'Cancelled' and Status ne 'Rejected'`
      )
      .select(...SUBMISSION_FIELDS.SELECT)
      .expand(...SUBMISSION_FIELDS.EXPAND)
      .top(1)();
    return items.length > 0 ? SubmissionService.mapSubmission(items[0]) : null;
  }

  /**
   * Get pending submissions for a manager to approve.
   */
  public async getPendingForApprover(approverId: number): Promise<ITimesheetSubmission[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.SUBMISSIONS)
      .items.filter(`ApproverId eq ${approverId} and Status eq 'Submitted'`)
      .select(...SUBMISSION_FIELDS.SELECT)
      .expand(...SUBMISSION_FIELDS.EXPAND)
      .orderBy("SubmittedDate", false)
      .top(MAX_ITEMS_PER_QUERY)();
    return SubmissionService.mapSubmissions(items);
  }

  /**
   * Create a new submission.
   */
  public async create(submission: ITimesheetSubmissionCreate): Promise<ITimesheetSubmission> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.SUBMISSIONS)
      .items.add(submission);
    return result as unknown as ITimesheetSubmission;
  }

  /**
   * Update a submission.
   */
  public async update(id: number, updates: Partial<ITimesheetSubmission>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.SUBMISSIONS)
      .items.getById(id)
      .update(updates);
  }

  /**
   * Submit a timesheet for approval.
   */
  public async submit(id: number): Promise<void> {
    await this.update(id, {
      Status: "Submitted" as never,
      SubmittedDate: new Date().toISOString(),
    } as Partial<ITimesheetSubmission>);
  }

  /**
   * Approve a timesheet submission.
   */
  public async approve(id: number, comments: string): Promise<void> {
    await this.update(id, {
      Status: "Approved" as never,
      ApprovedDate: new Date().toISOString(),
      ApproverComments: comments,
    } as Partial<ITimesheetSubmission>);
  }

  /**
   * Reject a timesheet submission.
   */
  public async reject(id: number, comments: string): Promise<void> {
    await this.update(id, {
      Status: "Rejected" as never,
      ApproverComments: comments,
    } as Partial<ITimesheetSubmission>);
  }

  /**
   * Revoke an approved timesheet (manager returns it for correction).
   */
  public async revokeApproval(id: number, comments: string): Promise<void> {
    await this.update(id, {
      Status: "Submitted" as never,
      ApprovedDate: null,
      ApproverComments: comments,
    } as Partial<ITimesheetSubmission>);
  }

  /**
   * Get approved submissions for a manager.
   */
  public async getApprovedForApprover(approverId: number): Promise<ITimesheetSubmission[]> {
    const items = await this.sp.web.lists
      .getByTitle(LIST_NAMES.SUBMISSIONS)
      .items.filter(`ApproverId eq ${approverId} and Status eq 'Approved'`)
      .select(...SUBMISSION_FIELDS.SELECT)
      .expand(...SUBMISSION_FIELDS.EXPAND)
      .orderBy("ApprovedDate", false)
      .top(MAX_ITEMS_PER_QUERY)();
    return SubmissionService.mapSubmissions(items);
  }

  /**
   * Cancel a submitted timesheet (employee withdraws it).
   */
  public async cancel(id: number): Promise<void> {
    await this.update(id, {
      Status: "Cancelled" as never,
    } as Partial<ITimesheetSubmission>);
  }

  /**
   * Mark as processed (sent to payroll).
   */
  public async markProcessed(id: number): Promise<void> {
    await this.update(id, { Status: "Processed" as never } as Partial<ITimesheetSubmission>);
  }
}
