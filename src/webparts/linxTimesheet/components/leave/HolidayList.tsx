import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useAppContext } from "../../context/AppContext";
import { IHoliday } from "../../models/IHoliday";
import { formatDisplayDate } from "../../utils/dateUtils";
import { useAppTheme } from "../../hooks/useAppTheme";

const ITEMS_PER_PAGE = 10;

export const HolidayList: React.FC = () => {
  const { holidays } = useAppContext();
  const { colors } = useAppTheme();
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState<number | "all">(currentYear);
  const [currentPage, setCurrentPage] = React.useState(1);

  const yearOptions = React.useMemo<IDropdownOption[]>(() => {
    const years = new Set(holidays.map((h) => h.Year));
    years.add(currentYear);
    const sorted = Array.from(years).sort((a, b) => b - a);
    return [
      { key: "all", text: "All Years" },
      ...sorted.map((y) => ({ key: y, text: String(y) })),
    ];
  }, [holidays, currentYear]);

  const filtered = React.useMemo(() => {
    if (selectedYear === "all") return holidays;
    return holidays.filter((h) => h.Year === selectedYear || h.IsRecurring);
  }, [holidays, selectedYear]);

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const columns: IColumn[] = [
    {
      key: "name",
      name: "Holiday",
      fieldName: "Title",
      minWidth: 150,
      maxWidth: 250,
    },
    {
      key: "date",
      name: "Date",
      minWidth: 120,
      maxWidth: 180,
      onRender: (item: IHoliday) => formatDisplayDate(item.HolidayDate),
    },
    {
      key: "category",
      name: "Category",
      minWidth: 80,
      maxWidth: 100,
      onRender: (item: IHoliday) => item.Category || "Regular",
    },
    {
      key: "recurring",
      name: "Recurring",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IHoliday) => (item.IsRecurring ? "Yes" : "No"),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          Company Holidays
        </Text>
        <Dropdown
          selectedKey={selectedYear}
          options={yearOptions}
          onChange={(_, opt) => setSelectedYear(opt?.key === "all" ? "all" : (opt?.key as number) ?? currentYear)}
          styles={{ root: { width: 120 } }}
        />
      </Stack>

      {filtered.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No holidays found.
        </Text>
      ) : (
        <>
          <DetailsList
            items={paged}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
          {filtered.length > ITEMS_PER_PAGE && (
            <Stack horizontal verticalAlign="center" horizontalAlign="end" tokens={{ childrenGap: 4 }}>
              <IconButton
                iconProps={{ iconName: "ChevronLeft" }}
                title="Previous page"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              />
              <Text variant="small">
                Page {currentPage} of {totalPages}
              </Text>
              <IconButton
                iconProps={{ iconName: "ChevronRight" }}
                title="Next page"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              />
            </Stack>
          )}
        </>
      )}
    </Stack>
  );
};
