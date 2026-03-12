import { ILeaveRequest } from "../models/ILeaveRequest";
import { ILeaveBalance } from "../models/ILeaveRequest";
import { IAppConfiguration } from "../models/IConfiguration";
import { LeaveType, LeaveStatus } from "../models/enums";

/**
 * Calculate leave balances for an employee for a given year.
 */
export function calculateLeaveBalances(
  requests: ILeaveRequest[],
  config: IAppConfiguration
): ILeaveBalance[] {
  const leaveTypes: LeaveType[] = [
    LeaveType.Vacation,
    LeaveType.Sick,
    LeaveType.Personal,
    LeaveType.Bereavement,
    LeaveType.Other,
  ];

  return leaveTypes.map((type) => {
    const allocated = config.leaveBalances[type] || 0;

    const used = requests
      .filter((r) => r.LeaveType === type && r.Status === LeaveStatus.Approved)
      .reduce((sum, r) => sum + r.TotalDays, 0);

    const pending = requests
      .filter((r) => r.LeaveType === type && r.Status === LeaveStatus.Submitted)
      .reduce((sum, r) => sum + r.TotalDays, 0);

    return {
      leaveType: type,
      allocated,
      used,
      pending,
      remaining: allocated - used,
    };
  });
}

/**
 * Validate that a leave request doesn't exceed remaining balance.
 */
export function validateLeaveBalance(
  balance: ILeaveBalance,
  requestedDays: number
): { valid: boolean; message?: string } {
  if (requestedDays <= 0) {
    return { valid: false, message: "Requested days must be greater than 0." };
  }
  if (requestedDays > balance.remaining) {
    return {
      valid: false,
      message: `Insufficient ${balance.leaveType} leave balance. Remaining: ${balance.remaining} days, Requested: ${requestedDays} days.`,
    };
  }
  return { valid: true };
}
