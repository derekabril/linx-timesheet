import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";
import { calculateOvertime } from "../../utils/overtimeCalculator";
import { calculateLeaveBalances } from "../../utils/leaveCalculator";
import { formatHours } from "../../utils/hoursFormatter";
import { LeaveType } from "../../models/enums";

export const SummaryCards: React.FC = () => {
  const { weekEntries, currentSubmission, selectedWeek } = useTimesheetContext();
  const { currentUser, configuration } = useAppContext();
  const { colors, theme } = useAppTheme();
  const year = new Date().getFullYear();
  const { requests } = useLeaveRequests(currentUser?.id || null, year);

  const overtime = calculateOvertime(weekEntries, configuration);
  const balances = calculateLeaveBalances(requests, configuration);
  const vacationBalance = balances.find((b) => b.leaveType === LeaveType.Vacation);

  const cardStyle = (accentColor: string): React.CSSProperties => ({
    padding: "16px 20px",
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    border: `1px solid ${theme.semanticColors.bodyDivider}`,
    borderLeft: `4px solid ${accentColor}`,
    minWidth: 180,
    flex: "1 1 180px",
  });

  return (
    <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
      <div style={cardStyle(colors.textLink)}>
        <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
          This Week
        </Text>
        <Text variant="xxLarge" block styles={{ root: { fontWeight: 700, color: colors.textLink } }}>
          {formatHours(overtime.totalHours)}
        </Text>
        <Text variant="tiny" styles={{ root: { color: colors.textTertiary } }}>
          Week {selectedWeek.weekNumber}
        </Text>
      </div>

      <div style={cardStyle(colors.textSuccess)}>
        <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
          Regular Hours
        </Text>
        <Text variant="xxLarge" block styles={{ root: { fontWeight: 700, color: colors.textSuccess } }}>
          {formatHours(overtime.regularHours)}
        </Text>
      </div>

      <div style={cardStyle(colors.textWarning)}>
        <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
          Overtime
        </Text>
        <Text variant="xxLarge" block styles={{ root: { fontWeight: 700, color: colors.textWarning } }}>
          {formatHours(overtime.overtimeHours)}
        </Text>
      </div>

      <div style={cardStyle(colors.textAccent)}>
        <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
          Vacation Balance
        </Text>
        <Text variant="xxLarge" block styles={{ root: { fontWeight: 700, color: colors.textAccent } }}>
          {vacationBalance ? `${vacationBalance.remaining}d` : "--"}
        </Text>
      </div>

      <div style={cardStyle(currentSubmission ? colors.textSuccess : colors.textWarning)}>
        <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
          Submission
        </Text>
        <Text
          variant="large"
          block
          styles={{ root: { fontWeight: 700, color: currentSubmission ? colors.textSuccess : colors.textWarning } }}
        >
          {currentSubmission?.Status || "Not Submitted"}
        </Text>
      </div>
    </Stack>
  );
};
