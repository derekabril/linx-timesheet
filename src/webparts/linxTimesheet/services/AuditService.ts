import { SPFI } from "@pnp/sp";
import "@pnp/sp/site-users";
import { IAuditLogEntry, IAuditLogCreate } from "../models/IAuditLogEntry";
import { AuditAction } from "../models/enums";
import { LIST_NAMES } from "../utils/constants";

export class AuditService {
  private sp: SPFI;
  private currentUserId: number | null = null;

  constructor(sp: SPFI) {
    this.sp = sp;
  }

  private async ensureCurrentUserId(): Promise<number> {
    if (this.currentUserId === null) {
      const user = await this.sp.web.currentUser.select("Id")();
      this.currentUserId = user.Id;
    }
    return this.currentUserId;
  }

  /**
   * Log an audit entry. Called after every mutation.
   */
  public async log(entry: IAuditLogCreate): Promise<void> {
    const userId = entry.PerformedById || await this.ensureCurrentUserId();
    await this.sp.web.lists
      .getByTitle(LIST_NAMES.AUDIT_LOG)
      .items.add({
        ...entry,
        PerformedById: userId,
        Year: new Date().getFullYear(),
      });
  }

  /**
   * Convenience method to log a create action.
   */
  public async logCreate(
    targetList: string,
    targetItemId: number,
    newValue: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      Title: `Created item ${targetItemId} in ${targetList}`,
      Action: AuditAction.Create,
      TargetList: targetList,
      TargetItemId: targetItemId,
      NewValue: JSON.stringify(newValue),
      Year: new Date().getFullYear(),
    });
  }

  /**
   * Convenience method to log an update action.
   */
  public async logUpdate(
    targetList: string,
    targetItemId: number,
    previousValue: Record<string, unknown>,
    newValue: Record<string, unknown>
  ): Promise<void> {
    await this.log({
      Title: `Updated item ${targetItemId} in ${targetList}`,
      Action: AuditAction.Update,
      TargetList: targetList,
      TargetItemId: targetItemId,
      PreviousValue: JSON.stringify(previousValue),
      NewValue: JSON.stringify(newValue),
      Year: new Date().getFullYear(),
    });
  }

  /**
   * Convenience method to log a status change (Submit, Approve, Reject).
   */
  public async logStatusChange(
    action: AuditAction,
    targetList: string,
    targetItemId: number,
    previousStatus: string,
    newStatus: string
  ): Promise<void> {
    await this.log({
      Title: `${action} item ${targetItemId} in ${targetList}`,
      Action: action,
      TargetList: targetList,
      TargetItemId: targetItemId,
      PreviousValue: JSON.stringify({ Status: previousStatus }),
      NewValue: JSON.stringify({ Status: newStatus }),
      Year: new Date().getFullYear(),
    });
  }

  /**
   * Get audit log entries with filtering (for admin viewer).
   */
  public async getEntries(
    filters: {
      year?: number;
      action?: AuditAction;
      targetList?: string;
      performedById?: number;
    },
    top: number = 100
  ): Promise<IAuditLogEntry[]> {
    const filterParts: string[] = [];

    if (filters.year) filterParts.push(`Year eq ${filters.year}`);
    if (filters.action) filterParts.push(`Action eq '${filters.action}'`);
    if (filters.targetList) filterParts.push(`TargetList eq '${filters.targetList}'`);
    if (filters.performedById) filterParts.push(`PerformedById eq ${filters.performedById}`);

    let query = this.sp.web.lists
      .getByTitle(LIST_NAMES.AUDIT_LOG)
      .items.select(
        "Id", "Title", "Action", "TargetList", "TargetItemId",
        "PerformedById", "PerformedBy/Title", "ActionDate",
        "PreviousValue", "NewValue", "Year", "Created"
      )
      .expand("PerformedBy")
      .orderBy("Created", false)
      .top(top);

    if (filterParts.length > 0) {
      query = query.filter(filterParts.join(" and ")) as typeof query;
    }

    return query();
  }
}
