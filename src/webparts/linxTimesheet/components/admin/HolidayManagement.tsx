import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, IconButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useAppContext } from "../../context/AppContext";
import { HolidayService } from "../../services/HolidayService";
import { getSP } from "../../services/PnPConfig";
import { IHoliday } from "../../models/IHoliday";
import { formatDisplayDate, toDateString } from "../../utils/dateUtils";
import { ConfirmDialog } from "../common/ConfirmDialog";

export const HolidayManagement: React.FC = () => {
  const { holidays, refreshHolidays } = useAppContext();
  const service = React.useMemo(() => new HolidayService(getSP()), []);

  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>();
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);

  const handleAdd = async (): Promise<void> => {
    if (!name.trim() || !date) return;
    setSaving(true);
    setSuccess(false);
    try {
      await service.create({
        Title: name,
        HolidayDate: toDateString(date),
        Year: date.getFullYear(),
        IsRecurring: isRecurring,
      });
      setName("");
      setDate(undefined);
      setIsRecurring(false);
      setSuccess(true);
      await refreshHolidays();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null) return;
    await service.delete(deleteId);
    setDeleteId(null);
    await refreshHolidays();
  };

  const columns: IColumn[] = [
    { key: "name", name: "Holiday", fieldName: "Title", minWidth: 150, maxWidth: 250 },
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
    {
      key: "actions",
      name: "",
      minWidth: 40,
      maxWidth: 40,
      onRender: (item: IHoliday) => (
        <IconButton
          iconProps={{ iconName: "Delete" }}
          title="Delete"
          onClick={() => setDeleteId(item.Id)}
        />
      ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Manage Company Holidays
      </Text>

      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(false)}>
          Holiday added successfully.
        </MessageBar>
      )}

      <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">Holiday Name</Text>
          <TextField
            value={name}
            onChange={(_, v) => setName(v || "")}
            styles={{ root: { width: 200 } }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">Date</Text>
          <DatePicker
            value={date}
            onSelectDate={(d) => setDate(d || undefined)}
            styles={{ root: { width: 160 } }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">Recurring</Text>
          <Toggle
            checked={isRecurring}
            onChange={(_, val) => setIsRecurring(val || false)}
          />
        </Stack>
        <Stack verticalAlign="end">
          <PrimaryButton
            text="Add Holiday"
            iconProps={{ iconName: "Add" }}
            onClick={handleAdd}
            disabled={saving || !name.trim() || !date}
          />
        </Stack>
      </Stack>

      <DetailsList
        items={holidays}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        compact
      />

      <ConfirmDialog
        isOpen={deleteId !== null}
        title="Delete Holiday"
        message="Are you sure you want to delete this holiday?"
        confirmText="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Stack>
  );
};
