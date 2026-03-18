import { SPFI } from "@pnp/sp";
import { ILeaveRequest, ILeaveRequestCreate } from "../models/ILeaveRequest";
import { LIST_NAMES, MAX_ITEMS_PER_QUERY } from "../utils/constants";

const LEAVE_SELECT = [
  "Id", "Title", "EmployeeId", "Employee/Title", "LeaveType",
  "StartDate", "EndDate", "TotalDays", "Status", "ApproverId",
  "Approver/Title", "ApproverComments", "RequestDate", "Year",
  "Created", "Modified",
];
const LEAVE_EXPAND = ["Employee", "Approver"];

export class LeaveService {
  private sp: SPFI;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  public async getByEmployee(employeeId: number, year: number): Promise<ILeaveRequest[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.LEAVE_REQUESTS)
      .items.filter(`EmployeeId eq ${employeeId} and Year eq ${year}`)
      .select(...LEAVE_SELECT)
      .expand(...LEAVE_EXPAND)
      .orderBy("StartDate", false)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async getPendingForApprover(approverId: number): Promise<ILeaveRequest[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.LEAVE_REQUESTS)
      .items.filter(`ApproverId eq ${approverId} and Status eq 'Submitted'`)
      .select(...LEAVE_SELECT)
      .expand(...LEAVE_EXPAND)
      .orderBy("RequestDate", false)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async getAllPending(): Promise<ILeaveRequest[]> {
    return this.sp.web.lists
      .getByTitle(LIST_NAMES.LEAVE_REQUESTS)
      .items.filter(`Status eq 'Submitted'`)
      .select(...LEAVE_SELECT)
      .expand(...LEAVE_EXPAND)
      .orderBy("RequestDate", false)
      .top(MAX_ITEMS_PER_QUERY)();
  }

  public async create(request: ILeaveRequestCreate): Promise<ILeaveRequest> {
    const result = await this.sp.web.lists
      .getByTitle(LIST_NAMES.LEAVE_REQUESTS)
      .items.add(request);
    return result as unknown as ILeaveRequest;
  }

  public async update(id: number, updates: Partial<ILeaveRequest>): Promise<void> {
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.LEAVE_REQUESTS)
      .items.getById(id)
      .update(updates);
  }

  public async approve(id: number, comments: string): Promise<void> {
    await this.update(id, {
      Status: "Approved" as never,
      ApproverComments: comments,
    });
  }

  public async reject(id: number, comments: string): Promise<void> {
    await this.update(id, {
      Status: "Rejected" as never,
      ApproverComments: comments,
    });
  }

  public async cancel(id: number): Promise<void> {
    await this.update(id, { Status: "Cancelled" as never });
  }
}
