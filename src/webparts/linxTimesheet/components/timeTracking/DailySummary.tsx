import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatHours } from "../../utils/hoursFormatter";
import { EntryStatus } from "../../models/enums";
import { calculateEffectiveHours } from "../../utils/effectiveHours";

const statStyle: React.CSSProperties = {
  textAlign: "center",
  padding: "8px 16px",
  minWidth: 100,
};

export const DailySummary: React.FC = () => {
  const { todayEntries } = useTimesheetContext();
  const { configuration } = useAppContext();
  const { colors } = useAppTheme();

  const completedEntries = todayEntries.filter((e) => e.Status !== EntryStatus.Voided);
  const totalHours = calculateEffectiveHours(completedEntries);
  const totalBreakMins = completedEntries.reduce((sum, e) => sum + e.BreakMinutes, 0);
  const overtimeHours = Math.max(0, totalHours - configuration.overtimeDailyThreshold);
  const regularHours = totalHours - overtimeHours;

  return (
    <Stack
      tokens={{ childrenGap: 8 }}
      styles={{ root: { padding: 16, borderRadius: 8, backgroundColor: colors.bgSection } }}
    >
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Today's Summary
      </Text>
      <Stack horizontal tokens={{ childrenGap: 24 }} wrap>
        <div style={statStyle}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: colors.textLink } }}>
            {formatHours(totalHours)}
          </Text>
          <Text variant="small" block styles={{ root: { color: colors.textSecondary } }}>
            Total Hours
          </Text>
        </div>
        <div style={statStyle}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: colors.textSuccess } }}>
            {formatHours(regularHours)}
          </Text>
          <Text variant="small" block styles={{ root: { color: colors.textSecondary } }}>
            Regular
          </Text>
        </div>
        <div style={statStyle}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700, color: overtimeHours > 0 ? colors.textWarning : colors.textSecondary } }}>
            {formatHours(overtimeHours)}
          </Text>
          <Text variant="small" block styles={{ root: { color: colors.textSecondary } }}>
            Overtime
          </Text>
        </div>
        <div style={statStyle}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700 } }}>
            {totalBreakMins}m
          </Text>
          <Text variant="small" block styles={{ root: { color: colors.textSecondary } }}>
            Breaks
          </Text>
        </div>
        <div style={statStyle}>
          <Text variant="xxLarge" styles={{ root: { fontWeight: 700 } }}>
            {completedEntries.length}
          </Text>
          <Text variant="small" block styles={{ root: { color: colors.textSecondary } }}>
            Entries
          </Text>
        </div>
      </Stack>
    </Stack>
  );
};
