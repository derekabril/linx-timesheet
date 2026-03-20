import { getGraphClient } from "./GraphConfig";

export interface IEmailNotification {
  to: string[];
  cc?: string[];
  subject: string;
  body: string;
}

export interface IEntryDetail {
  date: string;
  clockIn: string | null;
  clockOut: string | null;
  totalHours: number;
}

export class NotificationService {
  /**
   * Send email via Microsoft Graph /me/sendMail.
   * Requires Mail.Send permission approved by tenant admin.
   */
  public async sendEmail(notification: IEmailNotification): Promise<void> {
    if (notification.to.length === 0) return;
    console.log("[NotificationService] Sending email to:", notification.to, "Subject:", notification.subject);
    try {
      const graphClient = await getGraphClient();
      await graphClient.api("/me/sendMail").post({
        message: {
          subject: notification.subject,
          body: {
            contentType: "HTML",
            content: notification.body,
          },
          toRecipients: notification.to.map((email) => ({
            emailAddress: { address: email },
          })),
          ...(notification.cc && notification.cc.length > 0
            ? {
                ccRecipients: notification.cc.map((email) => ({
                  emailAddress: { address: email },
                })),
              }
            : {}),
        },
        saveToSentItems: false,
      });
      console.log("[NotificationService] Email sent successfully");
    } catch (e) {
      console.error("[NotificationService] Failed to send email:", e);
      throw e;
    }
  }

  private formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}/${m}/${d}`;
  }

  private formatTime(dateTimeStr: string | null): string {
    if (!dateTimeStr) return "--";
    const date = new Date(dateTimeStr);
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return `${h}:${String(minutes).padStart(2, "0")} ${ampm}`;
  }

  private buildEntryRows(entries: IEntryDetail[]): string {
    const sorted = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.map((e) =>
      `<tr>
        <td style="padding:6px 12px;border:1px solid #ddd;">${this.formatDate(e.date)}</td>
        <td style="padding:6px 12px;border:1px solid #ddd;">${this.formatTime(e.clockIn)}</td>
        <td style="padding:6px 12px;border:1px solid #ddd;">${this.formatTime(e.clockOut)}</td>
        <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${e.totalHours.toFixed(1)}</td>
      </tr>`
    ).join("");
  }

  /**
   * Notify the configured admin email when a timesheet is submitted.
   */
  public async notifySubmission(
    notificationEmail: string,
    employeeName: string,
    weekNumber: number,
    year: number,
    totalHours: number,
    entries?: IEntryDetail[]
  ): Promise<void> {
    if (!notificationEmail) return;

    const entryTable = entries && entries.length > 0
      ? `<table style="border-collapse:collapse;margin:12px 0;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:left;">Date</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:left;">Start</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:left;">End</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:right;">Hours</th>
            </tr>
          </thead>
          <tbody>
            ${this.buildEntryRows(entries)}
            <tr style="background:#f5f5f5;font-weight:bold;">
              <td colspan="3" style="padding:6px 12px;border:1px solid #ddd;">Total</td>
              <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${totalHours.toFixed(1)}</td>
            </tr>
          </tbody>
        </table>`
      : "";

    await this.sendEmail({
      to: [notificationEmail],
      subject: `Timesheet Submitted - ${employeeName} (Week ${weekNumber}, ${year})`,
      body: `
        <p><strong>${employeeName}</strong> has submitted a timesheet for review.</p>
        <table style="border-collapse:collapse;">
          <tr><td style="padding:4px 12px 4px 0;"><strong>Period:</strong></td><td>Week ${weekNumber}, ${year}</td></tr>
          <tr><td style="padding:4px 12px 4px 0;"><strong>Total Hours:</strong></td><td>${totalHours.toFixed(1)}</td></tr>
        </table>
        ${entryTable}
        <p>Please log in to Keystone Pulse to review and approve this submission.</p>
      `,
    });
  }

  /**
   * Notify the employee when their timesheet is approved.
   */
  public async notifyApproval(
    employeeEmail: string,
    employeeName: string,
    weekNumber: number,
    year: number,
    comments: string
  ): Promise<void> {
    if (!employeeEmail) return;
    await this.sendEmail({
      to: [employeeEmail],
      subject: `Timesheet Approved - Week ${weekNumber}, ${year}`,
      body: `
        <p>Hi ${employeeName},</p>
        <p>Your timesheet for <strong>Week ${weekNumber}, ${year}</strong> has been <strong style="color:green;">approved</strong>.</p>
        ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ""}
      `,
    });
  }

  /**
   * Notify the employee when their timesheet is rejected.
   */
  public async notifyRejection(
    employeeEmail: string,
    employeeName: string,
    weekNumber: number,
    year: number,
    comments: string
  ): Promise<void> {
    if (!employeeEmail) return;
    await this.sendEmail({
      to: [employeeEmail],
      subject: `Timesheet Rejected - Week ${weekNumber}, ${year}`,
      body: `
        <p>Hi ${employeeName},</p>
        <p>Your timesheet for <strong>Week ${weekNumber}, ${year}</strong> has been <strong style="color:red;">rejected</strong>.</p>
        ${comments ? `<p><strong>Reason:</strong> ${comments}</p>` : ""}
        <p>Please log in to Keystone Pulse to review and resubmit.</p>
      `,
    });
  }

  /**
   * Bookkeeper notifies Finance (admin) that the weekly payroll report is ready for review.
   */
  public async notifyFinanceReady(
    financeEmail: string,
    bookkeeperName: string,
    weekNumber: number,
    year: number,
    comments: string
  ): Promise<void> {
    if (!financeEmail) return;
    await this.sendEmail({
      to: [financeEmail],
      subject: `Payroll Ready for Review - Week ${weekNumber}, ${year}`,
      body: `
        <p>Hi,</p>
        <p><strong>${bookkeeperName}</strong> has reviewed the weekly payroll report for <strong>Week ${weekNumber}, ${year}</strong> and confirmed it is ready for your review.</p>
        ${comments ? `<p><strong>Bookkeeper Comments:</strong> ${comments}</p>` : ""}
        <p>Please log in to Keystone Pulse to review and submit the payroll report to the CEO.</p>
      `,
    });
  }

  /**
   * Resolve a user's first name (givenName) from their email via Graph.
   * Falls back to the local part of the email if lookup fails.
   */
  private async resolveFirstName(email: string): Promise<string> {
    try {
      const graphClient = await getGraphClient();
      const user = await graphClient
        .api(`/users/${email}`)
        .select("givenName,displayName")
        .get();
      return user.givenName || user.displayName?.split(" ")[0] || email.split("@")[0];
    } catch {
      // Fallback: derive from the email local part (e.g. "john.doe" → "John")
      const local = email.split("@")[0].split(/[._-]/)[0];
      return local.charAt(0).toUpperCase() + local.slice(1).toLowerCase();
    }
  }

  /**
   * Finance (admin) submits payroll report to CEO via email.
   */
  public async submitPayrollToCeo(
    ceoEmail: string,
    weekNumber: number,
    year: number,
    weekRange: string,
    payrollRows: IPayrollEmailRow[],
    totals: IPayrollTotals,
    ccEmails?: string[]
  ): Promise<void> {
    if (!ceoEmail) return;

    const firstName = await this.resolveFirstName(ceoEmail);

    const rows = payrollRows
      .map(
        (r) =>
          `<tr>
            <td style="padding:6px 12px;border:1px solid #ddd;">${r.contractorName}</td>
            <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${r.totalWorkHours}</td>
            <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${r.holidayPaidHours}</td>
            <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${r.holidayPay}</td>
            <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${r.incentiveAmount}</td>
            <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;font-weight:bold;">${r.weeklyTotal}</td>
          </tr>`
      )
      .join("");

    await this.sendEmail({
      to: [ceoEmail],
      cc: ccEmails?.filter(Boolean),
      subject: `Weekly Payroll Report - Week ${weekNumber}, ${year}`,
      body: `
        <p>Dear ${firstName},</p>
        <p>Please find below the approved weekly payroll report for <strong>Week ${weekNumber}, ${year}</strong> (${weekRange}).</p>
        <table style="border-collapse:collapse;margin:12px 0;width:100%;">
          <thead>
            <tr style="background:#f5f5f5;">
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:left;">Contractor</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:right;">Total Work Hours</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:right;">Holiday Hrs</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:right;">Holiday Pay</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:right;">Incentives</th>
              <th style="padding:6px 12px;border:1px solid #ddd;text-align:right;">Weekly Total</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
            <tr style="background:#f5f5f5;font-weight:bold;">
              <td style="padding:6px 12px;border:1px solid #ddd;">TOTALS</td>
              <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${totals.totalWorkHours}</td>
              <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${totals.holidayPaidHours}</td>
              <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${totals.holidayPay}</td>
              <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${totals.incentiveAmount}</td>
              <td style="padding:6px 12px;border:1px solid #ddd;text-align:right;">${totals.weeklyTotal}</td>
            </tr>
          </tbody>
        </table>
        <p>This report was generated by Keystone Pulse.</p>
      `,
    });
  }
}

export interface IPayrollEmailRow {
  contractorName: string;
  totalWorkHours: string;
  holidayPaidHours: string;
  holidayPay: string;
  incentiveAmount: string;
  weeklyTotal: string;
}

export interface IPayrollTotals {
  totalWorkHours: string;
  holidayPaidHours: string;
  holidayPay: string;
  incentiveAmount: string;
  weeklyTotal: string;
}
