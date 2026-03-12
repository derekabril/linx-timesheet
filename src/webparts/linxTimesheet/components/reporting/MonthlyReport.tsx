import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useAppContext } from "../../context/AppContext";
import { TimeEntryService } from "../../services/TimeEntryService";
import { getSP } from "../../services/PnPConfig";
import { ITimeEntry } from "../../models/ITimeEntry";
import { formatHours } from "../../utils/hoursFormatter";
import { toDateString } from "../../utils/dateUtils";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ExportToolbar } from "./ExportToolbar";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const MonthlyReport: React.FC = () => {
  const { currentUser } = useAppContext();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = React.useState(now.getMonth());
  const [selectedYear, setSelectedYear] = React.useState(now.getFullYear());
  const [entries, setEntries] = React.useState<ITimeEntry[]>([]);
  const [loading, setLoading] = React.useState(false);

  const monthOptions: IDropdownOption[] = months.map((m, i) => ({ key: i, text: m }));
  const yearOptions: IDropdownOption[] = [
    { key: now.getFullYear() - 1, text: String(now.getFullYear() - 1) },
    { key: now.getFullYear(), text: String(now.getFullYear()) },
  ];

  React.useEffect(() => {
    const load = async (): Promise<void> => {
      if (!currentUser) return;
      setLoading(true);
      const service = new TimeEntryService(getSP());
      const start = new Date(selectedYear, selectedMonth, 1);
      const end = new Date(selectedYear, selectedMonth + 1, 0);
      const data = await service.getByDateRange(
        currentUser.id,
        toDateString(start),
        toDateString(end)
      );
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [currentUser, selectedMonth, selectedYear]);

  // Group by week
  const weeklyTotals = React.useMemo(() => {
    const weeks = new Map<number, { weekNumber: number; totalHours: number; entries: number }>();
    entries.forEach((e) => {
      const w = e.WeekNumber;
      const existing = weeks.get(w) || { weekNumber: w, totalHours: 0, entries: 0 };
      existing.totalHours += e.TotalHours;
      existing.entries += 1;
      weeks.set(w, existing);
    });
    return Array.from(weeks.values()).sort((a, b) => a.weekNumber - b.weekNumber);
  }, [entries]);

  const totalHours = entries.reduce((sum, e) => sum + e.TotalHours, 0);

  const columns: IColumn[] = [
    { key: "week", name: "Week", minWidth: 60, maxWidth: 80, onRender: (item: { weekNumber: number }) => `W${item.weekNumber}` },
    { key: "entries", name: "Entries", fieldName: "entries", minWidth: 60, maxWidth: 80 },
    { key: "hours", name: "Total Hours", minWidth: 80, maxWidth: 110, onRender: (item: { totalHours: number }) => formatHours(item.totalHours) },
  ];

  return (
    <Stack tokens={{ childrenGap: 12 }}>
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <Dropdown
          label="Month"
          options={monthOptions}
          selectedKey={selectedMonth}
          onChange={(_, opt) => opt && setSelectedMonth(opt.key as number)}
          styles={{ root: { width: 140 } }}
        />
        <Dropdown
          label="Year"
          options={yearOptions}
          selectedKey={selectedYear}
          onChange={(_, opt) => opt && setSelectedYear(opt.key as number)}
          styles={{ root: { width: 100 } }}
        />
      </Stack>

      <ExportToolbar data={entries} reportName={`monthly-${months[selectedMonth]}-${selectedYear}`} />

      {loading ? (
        <LoadingSpinner label="Loading..." />
      ) : (
        <>
          <DetailsList
            items={weeklyTotals}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
          <Text styles={{ root: { fontWeight: 600 } }}>
            Month Total: {formatHours(totalHours)} ({entries.length} entries)
          </Text>
        </>
      )}
    </Stack>
  );
};
