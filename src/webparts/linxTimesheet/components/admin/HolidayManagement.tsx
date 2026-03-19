import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { PrimaryButton, DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Toggle } from "@fluentui/react/lib/Toggle";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useAppContext } from "../../context/AppContext";
import { HolidayService } from "../../services/HolidayService";
import { getSP } from "../../services/PnPConfig";
import { IHoliday } from "../../models/IHoliday";
import { HolidayCategory } from "../../models/enums";
import { formatDisplayDate, toDateString } from "../../utils/dateUtils";
import { ConfirmDialog } from "../common/ConfirmDialog";

export const HolidayManagement: React.FC = () => {
  const { holidays, refreshHolidays } = useAppContext();
  const service = React.useMemo(() => new HolidayService(getSP()), []);

  const [name, setName] = React.useState("");
  const [date, setDate] = React.useState<Date | undefined>();
  const [isRecurring, setIsRecurring] = React.useState(false);
  const [category, setCategory] = React.useState<string>(HolidayCategory.Regular);
  const [saving, setSaving] = React.useState(false);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [editHoliday, setEditHoliday] = React.useState<IHoliday | null>(null);
  const [deleteId, setDeleteId] = React.useState<number | null>(null);
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = React.useState<number | "all">(currentYear);
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 10;

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

  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedYear]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paged = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetForm = (): void => {
    setName("");
    setDate(undefined);
    setIsRecurring(false);
    setCategory(HolidayCategory.Regular);
    setEditHoliday(null);
  };

  const openEdit = (holiday: IHoliday): void => {
    setEditHoliday(holiday);
    setName(holiday.Title);
    setDate(new Date(holiday.HolidayDate));
    setIsRecurring(holiday.IsRecurring);
    setCategory(holiday.Category || HolidayCategory.Regular);
    setSuccess(null);
  };

  const handleSave = async (): Promise<void> => {
    if (!name.trim() || !date) return;
    setSaving(true);
    setSuccess(null);
    try {
      if (editHoliday) {
        await service.update(editHoliday.Id, {
          Title: name,
          HolidayDate: toDateString(date),
          Year: date.getFullYear(),
          IsRecurring: isRecurring,
          Category: category,
        });
        setSuccess("Holiday updated successfully.");
      } else {
        await service.create({
          Title: name,
          HolidayDate: toDateString(date),
          Year: date.getFullYear(),
          IsRecurring: isRecurring,
          Category: category,
        });
        setSuccess("Holiday added successfully.");
      }
      resetForm();
      await refreshHolidays();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (deleteId === null) return;
    await service.delete(deleteId);
    setDeleteId(null);
    if (editHoliday && editHoliday.Id === deleteId) {
      resetForm();
    }
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
    {
      key: "actions",
      name: "",
      minWidth: 70,
      maxWidth: 70,
      onRender: (item: IHoliday) => (
        <Stack horizontal tokens={{ childrenGap: 4 }}>
          <IconButton
            iconProps={{ iconName: "Edit" }}
            title="Edit"
            onClick={() => openEdit(item)}
          />
          <IconButton
            iconProps={{ iconName: "Delete" }}
            title="Delete"
            onClick={() => setDeleteId(item.Id)}
          />
        </Stack>
      ),
    },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 12 }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
          Manage Company Holidays
        </Text>
        <Dropdown
          selectedKey={selectedYear}
          options={yearOptions}
          onChange={(_, opt) => setSelectedYear(opt?.key === "all" ? "all" : (opt?.key as number) ?? currentYear)}
          styles={{ root: { width: 120 } }}
        />
      </Stack>

      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(null)}>
          {success}
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
          <Text variant="small">Category</Text>
          <Dropdown
            selectedKey={category}
            options={[
              { key: HolidayCategory.Regular, text: "Regular" },
              { key: HolidayCategory.Special, text: "Special" },
            ] as IDropdownOption[]}
            onChange={(_, opt) => setCategory((opt?.key as string) || HolidayCategory.Regular)}
            styles={{ root: { width: 120 } }}
          />
        </Stack>
        <Stack tokens={{ childrenGap: 4 }}>
          <Text variant="small">Recurring</Text>
          <Toggle
            checked={isRecurring}
            onChange={(_, val) => setIsRecurring(val || false)}
          />
        </Stack>
        <Stack verticalAlign="end" horizontal tokens={{ childrenGap: 8 }}>
          <PrimaryButton
            text={editHoliday ? "Update Holiday" : "Add Holiday"}
            iconProps={{ iconName: editHoliday ? "Save" : "Add" }}
            onClick={handleSave}
            disabled={saving || !name.trim() || !date}
          />
          {editHoliday && (
            <DefaultButton
              text="Cancel"
              onClick={resetForm}
            />
          )}
        </Stack>
      </Stack>

      <DetailsList
        items={paged}
        columns={columns}
        layoutMode={DetailsListLayoutMode.justified}
        selectionMode={SelectionMode.none}
        compact
      />
      {filtered.length > itemsPerPage && (
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
