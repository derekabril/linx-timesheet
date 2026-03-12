import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useAppTheme } from "../../hooks/useAppTheme";
import { ITimeEntry } from "../../models/ITimeEntry";
import { formatDisplayDate, formatTime } from "../../utils/dateUtils";
import { formatHours } from "../../utils/hoursFormatter";
import { StatusBadge } from "../common/StatusBadge";
import { ConfirmDialog } from "../common/ConfirmDialog";
import { calculateOvertime } from "../../utils/overtimeCalculator";
import { useAppContext } from "../../context/AppContext";

export const TimeEntryList: React.FC = () => {
  const { weekEntries, currentSubmission, refreshWeekEntries, selectedWeek } =
    useTimesheetContext();
  const { configuration } = useAppContext();
  const { voidEntry } = useTimeEntries();
  const { colors } = useAppTheme();
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const isLocked = currentSubmission !== null && currentSubmission.Status !== "Draft" && currentSubmission.Status !== "Rejected" && currentSubmission.Status !== "Cancelled";

  const overtime = calculateOvertime(weekEntries, configuration);

  const handleVoid = async (): Promise<void> => {
    if (deleteId === null) return;
    await voidEntry(deleteId);
    setDeleteId(null);
    await refreshWeekEntries();
  };

  const columns: IColumn[] = [
    {
      key: "date",
      name: "Date",
      fieldName: "EntryDate",
      minWidth: 120,
      maxWidth: 150,
      onRender: (item: ITimeEntry) => formatDisplayDate(item.EntryDate),
    },
    {
      key: "type",
      name: "Type",
      fieldName: "EntryType",
      minWidth: 60,
      maxWidth: 80,
    },
    {
      key: "clockIn",
      name: "Start",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimeEntry) => formatTime(item.ClockIn),
    },
    {
      key: "clockOut",
      name: "End",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimeEntry) => formatTime(item.ClockOut),
    },
    {
      key: "break",
      name: "Break",
      minWidth: 50,
      maxWidth: 60,
      onRender: (item: ITimeEntry) => `${item.BreakMinutes}m`,
    },
    {
      key: "hours",
      name: "Hours",
      minWidth: 60,
      maxWidth: 80,
      onRender: (item: ITimeEntry) => (
        <Text styles={{ root: { fontWeight: 600 } }}>{formatHours(item.TotalHours)}</Text>
      ),
    },
    {
      key: "project",
      name: "Project",
      minWidth: 120,
      maxWidth: 180,
      onRender: (item: ITimeEntry) => item.ProjectTitle || "--",
    },
    {
      key: "status",
      name: "Status",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: ITimeEntry) => <StatusBadge status={item.Status} />,
    },
    {
      key: "actions",
      name: "",
      minWidth: 40,
      maxWidth: 40,
      onRender: (item: ITimeEntry) =>
        !isLocked && item.Status !== "Voided" ? (
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Void entry"
            onClick={() => setDeleteId(item.Id)}
          />
        ) : null,
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          Week {selectedWeek.weekNumber}, {selectedWeek.year}
        </Text>
        <Stack horizontal tokens={{ childrenGap: 16 }}>
          <Text variant="small">
            Regular: <strong>{formatHours(overtime.regularHours)}</strong>
          </Text>
          <Text variant="small" styles={{ root: { color: overtime.overtimeHours > 0 ? colors.textWarning : undefined } }}>
            Overtime: <strong>{formatHours(overtime.overtimeHours)}</strong>
          </Text>
          <Text variant="small">
            Total: <strong>{formatHours(overtime.totalHours)}</strong>
          </Text>
        </Stack>
      </Stack>

      {isLocked && (
        <Text variant="small" styles={{ root: { color: colors.textWarning, fontStyle: "italic" } }}>
          This week has been submitted and is locked for editing.
        </Text>
      )}

      <DetailsList
        items={weekEntries}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        isHeaderVisible={true}
        compact
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Void Time Entry"
        message="Are you sure you want to void this time entry? This action cannot be undone."
        confirmText="Void"
        onConfirm={handleVoid}
        onCancel={() => setDeleteId(null)}
      />
    </Stack>
  );
};
