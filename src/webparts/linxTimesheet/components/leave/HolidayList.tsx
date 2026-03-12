import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useAppContext } from "../../context/AppContext";
import { IHoliday } from "../../models/IHoliday";
import { formatDisplayDate } from "../../utils/dateUtils";
import { useAppTheme } from "../../hooks/useAppTheme";

export const HolidayList: React.FC = () => {
  const { holidays } = useAppContext();
  const { colors } = useAppTheme();

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
      key: "recurring",
      name: "Recurring",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IHoliday) => (item.IsRecurring ? "Yes" : "No"),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Company Holidays
      </Text>

      {holidays.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No holidays configured.
        </Text>
      ) : (
        <DetailsList
          items={holidays}
          columns={columns}
          layoutMode={DetailsListLayoutMode.justified}
          selectionMode={SelectionMode.none}
          compact
        />
      )}
    </Stack>
  );
};
