import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { IconButton, PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { Checkbox } from "@fluentui/react/lib/Checkbox";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { CommandBar, ICommandBarItemProps } from "@fluentui/react/lib/CommandBar";
import { useAppContext } from "../../context/AppContext";
import { useUserRates } from "../../hooks/useUserRates";
import { useIncentives } from "../../hooks/useIncentives";
import { SubmissionService } from "../../services/SubmissionService";
import { getSP } from "../../services/PnPConfig";
import { ITimesheetSubmission } from "../../models/ITimesheetSubmission";
import { SubmissionStatus, HolidayCategory, IncentiveFrequency } from "../../models/enums";
import {
  getWeekStart,
  getWeekEnd,
  toDateString,
  getISOWeekNumber,
  formatDisplayDate,
} from "../../utils/dateUtils";
import { formatHours } from "../../utils/hoursFormatter";
import { NotificationService, IPayrollEmailRow, IPayrollTotals } from "../../services/NotificationService";
import { PayrollIncentiveService } from "../../services/PayrollIncentiveService";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAppTheme } from "../../hooks/useAppTheme";
import {
  exportToExcel,
  exportToCsv,
  exportToPdf,
  IExportColumn,
} from "../../utils/exportUtils";

interface IPayrollRow {
  employeeId: number;
  contractorName: string;
  totalWorkHours: number | null;
  holidayPaidHours: number | null;
  rate: number;
  holidayPay: number | null;
  incentiveAmount: number;
  weeklyTotal: number | null;
  status: string;
}

const exportColumns: IExportColumn[] = [
  { key: "contractorName", header: "Contractor", width: 25 },
  { key: "totalWorkHours", header: "Total Work Hours", width: 18 },
  { key: "holidayPaidHours", header: "Holiday Paid Hrs", width: 18 },
  { key: "rate", header: "Rate", width: 12 },
  { key: "holidayPay", header: "Holiday Pay", width: 15 },
  { key: "incentiveAmount", header: "Incentive", width: 15 },
  { key: "weeklyTotal", header: "Weekly Total", width: 18 },
  { key: "status", header: "Status", width: 15 },
];

// In-memory cache for fast tab-switch persistence (survives component unmount/remount)
// Authoritative data lives in SharePoint and is loaded on mount / week change
const incentiveMemCache: Record<string, Record<number, Record<number, number>>> = {};

export const WeeklyPayrollReport: React.FC = () => {
  const { configuration, holidays, isAdmin, isBookkeeper, currentUser } = useAppContext();
  const { rates, loading: ratesLoading, refresh: refreshRates } = useUserRates();
  const { incentives, assignments, loading: incentivesLoading, refresh: refreshIncentives } = useIncentives();
  const { colors, theme } = useAppTheme();

  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const weekStart = getWeekStart(selectedDate);
  const weekEnd = getWeekEnd(selectedDate);
  const weekNumber = getISOWeekNumber(selectedDate);
  const year = weekStart.getFullYear();

  const sp = getSP();
  const submissionService = React.useMemo(() => new SubmissionService(sp), [sp]);
  const payrollIncentiveService = React.useMemo(() => new PayrollIncentiveService(sp), [sp]);
  const notificationService = React.useMemo(() => new NotificationService(), []);

  const [submissions, setSubmissions] = React.useState<ITimesheetSubmission[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = React.useState(true);
  const [exporting, setExporting] = React.useState(false);
  const [payrollComments, setPayrollComments] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [actionMessage, setActionMessage] = React.useState<{ type: MessageBarType; text: string } | null>(null);
  const [approvalOverride, setApprovalOverride] = React.useState(false);
  // Manual incentive selections: employeeId -> set of selected incentive Ids
  // In-memory cache for fast tab switches; SharePoint for cross-device persistence
  const weekKey = `${year}-${weekNumber}`;
  const [manualIncentives, setManualIncentivesRaw] = React.useState<Record<number, Record<number, number>>>(
    () => incentiveMemCache[weekKey] || {}
  );
  const setManualIncentives = React.useCallback((update: Record<number, Record<number, number>> | ((prev: Record<number, Record<number, number>>) => Record<number, Record<number, number>>)) => {
    setManualIncentivesRaw((prev) => {
      const next = typeof update === "function" ? update(prev) : update;
      incentiveMemCache[weekKey] = next;
      return next;
    });
  }, [weekKey]);
  const [incentiveDialogTarget, setIncentiveDialogTarget] = React.useState<number | null>(null);
  const [dialogSelections, setDialogSelections] = React.useState<Record<number, number>>({});

  // Navigate weeks
  const goToPreviousWeek = (): void => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 7);
    setSelectedDate(prev);
  };

  const goToNextWeek = (): void => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 7);
    setSelectedDate(next);
  };

  // Count weekday holidays in the selected week, split by category
  const holidayCounts = React.useMemo(() => {
    const startStr = toDateString(weekStart);
    const endStr = toDateString(weekEnd);
    let regular = 0;
    let special = 0;

    holidays.forEach((h) => {
      const hDateStr = h.HolidayDate.split("T")[0];
      const hDate = new Date(hDateStr + "T00:00:00");
      const hDay = hDate.getDay();
      // Only count weekday holidays (Mon–Fri)
      if (hDay >= 1 && hDay <= 5 && hDateStr >= startStr && hDateStr <= endStr) {
        if (h.Category === HolidayCategory.Special) {
          special++;
        } else {
          regular++;
        }
      }
    });

    return { regular, special, total: regular + special };
  }, [holidays, weekStart, weekEnd]);

  // Fetch submissions for the selected week
  const fetchSubmissions = React.useCallback(async (): Promise<void> => {
    setSubmissionsLoading(true);
    try {
      const data = await submissionService.getAllByWeek(year, weekNumber);
      setSubmissions(data);
    } catch (err) {
      console.error("Failed to load submissions:", err);
    } finally {
      setSubmissionsLoading(false);
    }
  }, [submissionService, year, weekNumber]);

  React.useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  // Calculate incentive amount from manually selected incentives
  const getManualIncentiveTotal = React.useCallback((employeeId: number): number => {
    const selected = manualIncentives[employeeId];
    if (!selected || Object.keys(selected).length === 0) return 0;
    return Object.entries(selected).reduce((sum, [idStr, qty]) => {
      const incentive = incentives.find((i) => i.Id === Number(idStr));
      if (!incentive || !incentive.IsActive || qty <= 0) return sum;
      // Quantity-based incentives (title contains "(#)"): qty × rate
      if (/\(#\)/.test(incentive.Title)) {
        return sum + qty * incentive.Value;
      }
      switch (incentive.Frequency) {
        case IncentiveFrequency.Daily: return sum + incentive.Value * 5;
        case IncentiveFrequency.Weekly: return sum + incentive.Value;
        case IncentiveFrequency.Monthly: return sum + incentive.Value / 4;
        default: return sum + incentive.Value;
      }
    }, 0);
  }, [manualIncentives, incentives]);

  // Load incentive selections from SharePoint when week changes (or on mount)
  const loadIncentiveSelections = React.useCallback(async (): Promise<void> => {
    try {
      const data = await payrollIncentiveService.getByWeek(year, weekNumber);
      incentiveMemCache[weekKey] = data;
      setManualIncentivesRaw(data);
    } catch (err) {
      console.error("Failed to load incentive selections:", err);
      // Fall back to in-memory cache
      setManualIncentivesRaw(incentiveMemCache[weekKey] || {});
    }
  }, [payrollIncentiveService, year, weekNumber, weekKey]);

  React.useEffect(() => {
    // Use mem cache immediately for fast render, then load from SharePoint
    setManualIncentivesRaw(incentiveMemCache[weekKey] || {});
    loadIncentiveSelections();
  }, [weekKey, loadIncentiveSelections]);

  // Build payroll rows: one row per contractor from user rates
  const payrollRows: IPayrollRow[] = React.useMemo(() => {
    return rates.map((rate) => {
      // Prefer Approved, then Submitted, then any other status
      const userSubmissions = submissions.filter((s) => s.EmployeeId === rate.EmployeeId);
      const submission =
        userSubmissions.find((s) => s.Status === SubmissionStatus.Approved) ||
        userSubmissions.find((s) => s.Status === SubmissionStatus.Submitted) ||
        userSubmissions[0] || null;
      const isApproved = submission?.Status === SubmissionStatus.Approved;
      const incentiveAmount = getManualIncentiveTotal(rate.EmployeeId);

      if (isApproved) {
        const totalWorkHours = submission.TotalHours;
        const holidayPaidHours = holidayCounts.total * rate.MaxHoursPerDay;
        const regularHolidayPay = holidayCounts.regular * rate.MaxHoursPerDay * rate.HourlyRate * configuration.regularHolidayRate;
        const specialHolidayPay = holidayCounts.special * rate.MaxHoursPerDay * rate.HourlyRate * configuration.specialHolidayRate;
        const holidayPay = regularHolidayPay + specialHolidayPay;
        const weeklyTotal = (totalWorkHours * rate.HourlyRate) + holidayPay + incentiveAmount;

        return {
          employeeId: rate.EmployeeId,
          contractorName: rate.EmployeeTitle || rate.Title,
          totalWorkHours,
          holidayPaidHours,
          rate: rate.HourlyRate,
          holidayPay,
          incentiveAmount,
          weeklyTotal,
          status: SubmissionStatus.Approved,
        };
      }

      return {
        employeeId: rate.EmployeeId,
        contractorName: rate.EmployeeTitle || rate.Title,
        totalWorkHours: null,
        holidayPaidHours: null,
        rate: rate.HourlyRate,
        holidayPay: null,
        incentiveAmount,
        weeklyTotal: null,
        status: submission?.Status || "No Submission",
      };
    });
  }, [rates, submissions, holidayCounts, configuration.regularHolidayRate, configuration.specialHolidayRate, getManualIncentiveTotal]);

  // Totals for approved rows
  const totals = React.useMemo(() => {
    const approved = payrollRows.filter((r) => r.weeklyTotal !== null);
    return {
      totalWorkHours: approved.reduce((sum, r) => sum + (r.totalWorkHours || 0), 0),
      holidayPaidHours: approved.reduce((sum, r) => sum + (r.holidayPaidHours || 0), 0),
      holidayPay: approved.reduce((sum, r) => sum + (r.holidayPay || 0), 0),
      incentiveAmount: approved.reduce((sum, r) => sum + (r.incentiveAmount || 0), 0),
      weeklyTotal: approved.reduce((sum, r) => sum + (r.weeklyTotal || 0), 0),
      approvedCount: approved.length,
      totalCount: payrollRows.length,
    };
  }, [payrollRows]);

  // Table columns
  const columns: IColumn[] = [
    {
      key: "contractor",
      name: "Contractor",
      minWidth: 150,
      maxWidth: 220,
      onRender: (item: IPayrollRow) => (
        <Text styles={{ root: { fontWeight: item.weeklyTotal !== null ? 600 : 400 } }}>
          {item.contractorName}
        </Text>
      ),
    },
    {
      key: "totalWorkHours",
      name: "Total Work Hours",
      minWidth: 110,
      maxWidth: 140,
      onRender: (item: IPayrollRow) =>
        item.totalWorkHours !== null ? formatHours(item.totalWorkHours) : "",
    },
    {
      key: "holidayPaidHours",
      name: "Holiday Paid Hrs",
      minWidth: 110,
      maxWidth: 140,
      onRender: (item: IPayrollRow) =>
        item.holidayPaidHours !== null ? formatHours(item.holidayPaidHours) : "",
    },
    {
      key: "rate",
      name: "Rate",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: IPayrollRow) => `$${item.rate.toFixed(2)}`,
    },
    {
      key: "holidayPay",
      name: "Holiday Pay",
      minWidth: 100,
      maxWidth: 130,
      onRender: (item: IPayrollRow) =>
        item.holidayPay !== null
          ? `$${item.holidayPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "",
    },
    {
      key: "incentiveAmount",
      name: "Incentive",
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: IPayrollRow) => {
        const hasAssignments = assignments.some((a) => a.EmployeeId === item.employeeId);
        return (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 4 }}>
            <Text>{`$${item.incentiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Text>
            {hasAssignments && (
              <IconButton
                iconProps={{ iconName: "Edit" }}
                title="Set incentives"
                styles={{ root: { width: 24, height: 24 }, icon: { fontSize: 12 } }}
                onClick={() => {
                  setIncentiveDialogTarget(item.employeeId);
                  setDialogSelections(manualIncentives[item.employeeId] || {});
                }}
              />
            )}
          </Stack>
        );
      },
    },
    {
      key: "weeklyTotal",
      name: "Weekly Total",
      minWidth: 110,
      maxWidth: 140,
      onRender: (item: IPayrollRow) =>
        item.weeklyTotal !== null
          ? `$${item.weeklyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "",
    },
    {
      key: "status",
      name: "Status",
      minWidth: 100,
      maxWidth: 130,
      onRender: (item: IPayrollRow) => {
        let color = colors.textSecondary;
        if (item.status === SubmissionStatus.Approved) color = colors.textSuccess;
        else if (item.status === SubmissionStatus.Submitted) color = colors.textWarning;
        else if (item.status === SubmissionStatus.Rejected) color = colors.textError;
        return <Text styles={{ root: { color } }}>{item.status}</Text>;
      },
    },
  ];

  // Export helpers
  const prepareExportData = (): Record<string, unknown>[] => {
    return payrollRows.map((row) => ({
      contractorName: row.contractorName,
      totalWorkHours: row.totalWorkHours !== null ? formatHours(row.totalWorkHours) : "",
      holidayPaidHours: row.holidayPaidHours !== null ? formatHours(row.holidayPaidHours) : "",
      rate: `$${row.rate.toFixed(2)}`,
      holidayPay:
        row.holidayPay !== null
          ? `$${row.holidayPay.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "",
      incentiveAmount: `$${row.incentiveAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      weeklyTotal:
        row.weeklyTotal !== null
          ? `$${row.weeklyTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
          : "",
      status: row.status,
    }));
  };

  const handleExcelExport = async (): Promise<void> => {
    setExporting(true);
    try {
      const fileName = `payroll-week${weekNumber}-${year}`;
      await exportToExcel(prepareExportData(), exportColumns, fileName, "Payroll");
    } finally {
      setExporting(false);
    }
  };

  const handleCsvExport = (): void => {
    const fileName = `payroll-week${weekNumber}-${year}`;
    exportToCsv(prepareExportData(), exportColumns, fileName);
  };

  const handlePdfExport = async (): Promise<void> => {
    setExporting(true);
    try {
      const fileName = `payroll-week${weekNumber}-${year}`;
      const title = `Weekly Payroll — Week ${weekNumber}, ${year}`;
      await exportToPdf(prepareExportData(), exportColumns, title, fileName);
    } finally {
      setExporting(false);
    }
  };

  const loading = ratesLoading || submissionsLoading || incentivesLoading;

  const handleRefresh = async (): Promise<void> => {
    await Promise.all([refreshRates(), fetchSubmissions(), refreshIncentives()]);
  };

  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "refresh",
      text: "Refresh",
      iconProps: { iconName: "Refresh" },
      disabled: loading,
      onClick: () => { handleRefresh(); },
    },
    {
      key: "export",
      text: "Export",
      iconProps: { iconName: "Download" },
      disabled: payrollRows.length === 0 || exporting,
      subMenuProps: {
        items: [
          {
            key: "excel",
            text: "Export to Excel",
            iconProps: { iconName: "ExcelDocument" },
            onClick: () => { handleExcelExport(); },
          },
          {
            key: "csv",
            text: "Export to CSV",
            iconProps: { iconName: "TextDocument" },
            onClick: handleCsvExport,
          },
          {
            key: "pdf",
            text: "Export to PDF",
            iconProps: { iconName: "PDF" },
            onClick: () => { handlePdfExport(); },
          },
        ],
      },
    },
  ];

  // Whether all contractors have approved timesheets
  const allApproved = payrollRows.length > 0 && totals.approvedCount === totals.totalCount;

  const fmtCurrency = (n: number): string =>
    `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Bookkeeper: notify finance that payroll is ready
  const handleNotifyFinance = async (): Promise<void> => {
    if (!configuration.notificationEmail) {
      setActionMessage({ type: MessageBarType.warning, text: "No notification email configured. Set it in Admin > General Settings." });
      return;
    }
    setSending(true);
    setActionMessage(null);
    try {
      await notificationService.notifyFinanceReady(
        configuration.notificationEmail,
        currentUser?.displayName || "Bookkeeper",
        weekNumber,
        year,
        payrollComments
      );
      setActionMessage({ type: MessageBarType.success, text: "Finance has been notified that the payroll report is ready for review." });
    } catch (err) {
      console.error("Failed to notify finance:", err);
      setActionMessage({ type: MessageBarType.error, text: "Failed to send notification. Please check Mail.Send permissions." });
    } finally {
      setSending(false);
    }
  };

  // Admin: submit payroll report to CEO
  const handleSubmitPayroll = async (): Promise<void> => {
    if (!configuration.ceoEmail) {
      setActionMessage({ type: MessageBarType.warning, text: "No CEO email configured. Set it in Admin > General Settings." });
      return;
    }
    setSending(true);
    setActionMessage(null);
    try {
      const weekRange = `${formatDisplayDate(toDateString(weekStart))} — ${formatDisplayDate(toDateString(weekEnd))}`;
      const emailRows: IPayrollEmailRow[] = payrollRows
        .filter((r) => r.weeklyTotal !== null)
        .map((r) => ({
          contractorName: r.contractorName,
          totalWorkHours: formatHours(r.totalWorkHours!),
          holidayPaidHours: formatHours(r.holidayPaidHours!),
          holidayPay: fmtCurrency(r.holidayPay!),
          incentiveAmount: fmtCurrency(r.incentiveAmount!),
          weeklyTotal: fmtCurrency(r.weeklyTotal!),
        }));
      const emailTotals: IPayrollTotals = {
        totalWorkHours: formatHours(totals.totalWorkHours),
        holidayPaidHours: formatHours(totals.holidayPaidHours),
        holidayPay: fmtCurrency(totals.holidayPay),
        incentiveAmount: fmtCurrency(totals.incentiveAmount),
        weeklyTotal: fmtCurrency(totals.weeklyTotal),
      };
      // CC finance (notificationEmail) and bookkeeper emails
      const ccEmails = [
        configuration.notificationEmail,
        ...configuration.bookkeeperEmails.split(",").map((e) => e.trim()),
      ].filter(Boolean);

      await notificationService.submitPayrollToCeo(
        configuration.ceoEmail,
        weekNumber,
        year,
        weekRange,
        emailRows,
        emailTotals,
        ccEmails
      );
      setActionMessage({ type: MessageBarType.success, text: `Weekly payroll report for Week ${weekNumber} has been sent to the CEO.` });
    } catch (err) {
      console.error("Failed to submit payroll:", err);
      setActionMessage({ type: MessageBarType.error, text: "Failed to send payroll report. Please check Mail.Send permissions." });
    } finally {
      setSending(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading payroll data..." />;

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Weekly Payroll Report
      </Text>

      {/* Week navigation */}
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <IconButton
          iconProps={{ iconName: "ChevronLeft" }}
          title="Previous week"
          onClick={goToPreviousWeek}
        />
        <Text variant="medium" styles={{ root: { fontWeight: 600, minWidth: 260, textAlign: "center" } }}>
          Week {weekNumber}: {formatDisplayDate(toDateString(weekStart))} — {formatDisplayDate(toDateString(weekEnd))}
        </Text>
        <IconButton
          iconProps={{ iconName: "ChevronRight" }}
          title="Next week"
          onClick={goToNextWeek}
        />
      </Stack>

      <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
        Showing all contractors. Only approved timesheets display calculated hours and salary.
        {holidayCounts.total > 0 &&
          ` This week includes ${holidayCounts.total} paid holiday${holidayCounts.total > 1 ? "s" : ""}` +
          (holidayCounts.regular > 0 ? ` (${holidayCounts.regular} regular @ +${(configuration.regularHolidayRate * 100).toFixed(0)}%)` : "") +
          (holidayCounts.special > 0 ? ` (${holidayCounts.special} special @ +${(configuration.specialHolidayRate * 100).toFixed(0)}%)` : "") +
          "."}
      </Text>

      <CommandBar items={commandBarItems} styles={{ root: { padding: 0 } }} />

      {payrollRows.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No contractors found. Add user rates in Admin &gt; User Rates.
        </Text>
      ) : (
        <>
          <DetailsList
            items={payrollRows}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
          <Stack
            horizontal
            tokens={{ childrenGap: 24 }}
            styles={{
              root: {
                padding: "8px 0",
                borderTop: `2px solid ${theme.semanticColors.bodyDivider}`,
                fontWeight: 600,
              },
            }}
          >
            <Text>
              Approved: {totals.approvedCount} / {totals.totalCount}
            </Text>
            <Text>Total Work Hours: {formatHours(totals.totalWorkHours)}</Text>
            <Text>Holiday Hrs: {formatHours(totals.holidayPaidHours)}</Text>
            <Text>
              Holiday Pay: $
              {totals.holidayPay.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text>
              Incentives: $
              {totals.incentiveAmount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
            <Text>
              Weekly Total: $
              {totals.weeklyTotal.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </Stack>

          {/* Payroll comments and actions */}
          {(isBookkeeper || isAdmin) && (
            <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
              {actionMessage && (
                <MessageBar
                  messageBarType={actionMessage.type}
                  onDismiss={() => setActionMessage(null)}
                >
                  {actionMessage.text}
                </MessageBar>
              )}

              {isBookkeeper && (
                <>
                  <TextField
                    label="Payroll Comments"
                    placeholder="Add comments for finance review..."
                    multiline
                    rows={3}
                    value={payrollComments}
                    onChange={(_, v) => setPayrollComments(v || "")}
                  />
                  <DefaultButton
                    text="Notify Finance"
                    iconProps={{ iconName: "Mail" }}
                    onClick={handleNotifyFinance}
                    disabled={sending || payrollRows.length === 0}
                  />
                </>
              )}

              {isAdmin && (
                <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
                  <PrimaryButton
                    text="Submit Payroll"
                    iconProps={{ iconName: "Send" }}
                    onClick={handleSubmitPayroll}
                    disabled={sending || (!allApproved && !approvalOverride)}
                    title={
                      !allApproved && !approvalOverride
                        ? `All timesheets must be approved before submitting (${totals.approvedCount}/${totals.totalCount} approved)`
                        : "Send the weekly payroll report to the CEO"
                    }
                  />
                  {!allApproved && (
                    <DefaultButton
                      text={approvalOverride ? "Cancel Override" : "Override"}
                      iconProps={{ iconName: approvalOverride ? "Cancel" : "ShieldAlert" }}
                      onClick={() => setApprovalOverride(!approvalOverride)}
                      disabled={sending}
                      styles={approvalOverride ? {
                        root: { borderColor: colors.textWarning, color: colors.textWarning },
                      } : undefined}
                    />
                  )}
                  {approvalOverride && (
                    <Text variant="small" styles={{ root: { color: colors.textWarning } }}>
                      Override active — {totals.approvedCount}/{totals.totalCount} approved
                    </Text>
                  )}
                </Stack>
              )}
            </Stack>
          )}
        </>
      )}

      {/* Incentive selection dialog */}
      <Dialog
        hidden={incentiveDialogTarget === null}
        onDismiss={() => setIncentiveDialogTarget(null)}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Set Weekly Incentives",
          subText: incentiveDialogTarget
            ? `Select applicable incentives for ${payrollRows.find((r) => r.employeeId === incentiveDialogTarget)?.contractorName || "this user"}`
            : "",
        }}
        minWidth={420}
      >
        {incentiveDialogTarget !== null && (
          <Stack tokens={{ childrenGap: 8 }}>
            {assignments
              .filter((a) => a.EmployeeId === incentiveDialogTarget)
              .map((a) => {
                const inc = incentives.find((i) => i.Id === a.IncentiveId);
                if (!inc || !inc.IsActive) return null;
                const isQtyBased = /\(#\)/.test(inc.Title);
                let weeklyValue = inc.Value;
                if (!isQtyBased) {
                  if (inc.Frequency === IncentiveFrequency.Daily) weeklyValue = inc.Value * 5;
                  else if (inc.Frequency === IncentiveFrequency.Monthly) weeklyValue = inc.Value / 4;
                }
                const isChecked = (dialogSelections[inc.Id] || 0) > 0;
                return (
                  <Stack key={a.Id} tokens={{ childrenGap: 4 }}>
                    <Checkbox
                      label={isQtyBased
                        ? `${inc.Title} — $${inc.Value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} each`
                        : `${inc.Title} — $${weeklyValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} / week (${inc.Frequency})`
                      }
                      checked={isChecked}
                      onChange={(_, checked) => {
                        setDialogSelections((prev) => {
                          const next = { ...prev };
                          if (checked) {
                            next[inc.Id] = 1;
                          } else {
                            delete next[inc.Id];
                          }
                          return next;
                        });
                      }}
                    />
                    {isQtyBased && isChecked && (
                      <TextField
                        type="number"
                        label="Quantity"
                        min={1}
                        value={String(dialogSelections[inc.Id] || 1)}
                        onChange={(_, v) => {
                          const qty = Math.max(1, parseInt(v || "1", 10) || 1);
                          setDialogSelections((prev) => ({ ...prev, [inc.Id]: qty }));
                        }}
                        styles={{ root: { width: 100, marginLeft: 28 } }}
                      />
                    )}
                  </Stack>
                );
              })}
          </Stack>
        )}
        <DialogFooter>
          <PrimaryButton
            text="Apply"
            onClick={() => {
              if (incentiveDialogTarget !== null) {
                const empId = incentiveDialogTarget;
                const selections = dialogSelections;
                setManualIncentives((prev) => ({
                  ...prev,
                  [empId]: selections,
                }));
                setIncentiveDialogTarget(null);
                // Persist to SharePoint in the background
                payrollIncentiveService.save(empId, year, weekNumber, selections).catch((err) =>
                  console.error("Failed to save incentive selections:", err)
                );
              }
            }}
          />
          <DefaultButton text="Cancel" onClick={() => setIncentiveDialogTarget(null)} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};
