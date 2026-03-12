import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTime } from "../../utils/dateUtils";
import { ITimeEntry } from "../../models/ITimeEntry";

export const AttendanceReport: React.FC = () => {
  const { weekEntries, selectedWeek } = useTimesheetContext();
  const { configuration } = useAppContext();
  const { colors, theme } = useAppTheme();

  const clockEntries = weekEntries.filter((e) => e.EntryType === "Clock" && e.ClockIn);

  const lateArrivals = clockEntries.filter((e) => {
    if (!e.ClockIn) return false;
    const clockInTime = new Date(e.ClockIn);
    return clockInTime.getHours() >= 9 && clockInTime.getMinutes() > 15;
  });

  const uniqueDays = new Set(weekEntries.map((e) => e.EntryDate));
  const expectedDays = configuration.workingDaysPerWeek;
  const absentDays = expectedDays - uniqueDays.size;

  const dailyHours = new Map<string, number>();
  weekEntries.forEach((e) => {
    dailyHours.set(e.EntryDate, (dailyHours.get(e.EntryDate) || 0) + e.TotalHours);
  });
  const avgHours =
    dailyHours.size > 0
      ? Array.from(dailyHours.values()).reduce((a, b) => a + b, 0) / dailyHours.size
      : 0;

  const cardStyle: React.CSSProperties = {
    padding: "12px 16px",
    borderRadius: 8,
    backgroundColor: colors.bgCard,
    border: `1px solid ${theme.semanticColors.bodyDivider}`,
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 12 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Attendance Patterns - Week {selectedWeek.weekNumber}
      </Text>

      <Stack horizontal tokens={{ childrenGap: 16 }} wrap>
        <div style={cardStyle}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Days Present</Text>
          <Text variant="xLarge" block styles={{ root: { fontWeight: 700, color: colors.textLink } }}>
            {uniqueDays.size} / {expectedDays}
          </Text>
        </div>

        <div style={cardStyle}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Absent Days</Text>
          <Text
            variant="xLarge"
            block
            styles={{ root: { fontWeight: 700, color: absentDays > 0 ? colors.textError : colors.textSuccess } }}
          >
            {Math.max(0, absentDays)}
          </Text>
        </div>

        <div style={cardStyle}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Late Arrivals</Text>
          <Text
            variant="xLarge"
            block
            styles={{ root: { fontWeight: 700, color: lateArrivals.length > 0 ? colors.textWarning : colors.textSuccess } }}
          >
            {lateArrivals.length}
          </Text>
        </div>

        <div style={cardStyle}>
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>Avg Daily Hours</Text>
          <Text variant="xLarge" block styles={{ root: { fontWeight: 700 } }}>
            {avgHours.toFixed(1)}h
          </Text>
        </div>
      </Stack>

      {lateArrivals.length > 0 && (
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small" styles={{ root: { fontWeight: 600, color: colors.textWarning } }}>
            Late Arrivals:
          </Text>
          {lateArrivals.map((entry: ITimeEntry) => (
            <Text key={entry.Id} variant="small" styles={{ root: { color: colors.textSecondary } }}>
              {entry.EntryDate} - Clocked in at {formatTime(entry.ClockIn)}
            </Text>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
