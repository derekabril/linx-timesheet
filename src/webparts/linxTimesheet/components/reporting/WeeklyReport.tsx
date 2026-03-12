import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { formatHours } from "../../utils/hoursFormatter";
import { formatDisplayDate } from "../../utils/dateUtils";
import { calculateOvertime } from "../../utils/overtimeCalculator";

export const WeeklyReport: React.FC = () => {
  const { weekEntries } = useTimesheetContext();
  const { configuration } = useAppContext();

  const overtime = calculateOvertime(weekEntries, configuration);

  const columns: IColumn[] = [
    {
      key: "date",
      name: "Date",
      minWidth: 140,
      maxWidth: 180,
      onRender: (item: { date: string }) => formatDisplayDate(item.date),
    },
    {
      key: "total",
      name: "Total Hours",
      minWidth: 90,
      maxWidth: 110,
      onRender: (item: { totalHours: number }) => formatHours(item.totalHours),
    },
    {
      key: "regular",
      name: "Regular",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: { regularHours: number }) => formatHours(item.regularHours),
    },
    {
      key: "overtime",
      name: "Overtime",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: { overtimeHours: number }) => (
        <Text styles={{ root: { color: item.overtimeHours > 0 ? "#d83b01" : undefined } }}>
          {formatHours(item.overtimeHours)}
        </Text>
      ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Daily Breakdown
      </Text>

      <DetailsList
        items={overtime.dailyBreakdown}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        compact
      />

      {/* Totals row */}
      <Stack
        horizontal
        tokens={{ childrenGap: 24 }}
        styles={{
          root: { padding: "8px 0", borderTop: "2px solid #edebe9", fontWeight: 600 },
        }}
      >
        <Text>Total: {formatHours(overtime.totalHours)}</Text>
        <Text>Regular: {formatHours(overtime.regularHours)}</Text>
        <Text styles={{ root: { color: overtime.overtimeHours > 0 ? "#d83b01" : undefined } }}>
          Overtime: {formatHours(overtime.overtimeHours)}
        </Text>
      </Stack>
    </Stack>
  );
};
