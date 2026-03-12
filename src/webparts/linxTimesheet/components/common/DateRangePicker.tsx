import * as React from "react";
import { DatePicker } from "@fluentui/react/lib/DatePicker";
import { Stack } from "@fluentui/react/lib/Stack";
import { Label } from "@fluentui/react/lib/Label";

interface IDateRangePickerProps {
  startDate: Date | null;
  endDate: Date | null;
  onStartDateChange: (date: Date | null | undefined) => void;
  onEndDateChange: (date: Date | null | undefined) => void;
  label?: string;
}

export const DateRangePicker: React.FC<IDateRangePickerProps> = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
  label,
}) => {
  return (
    <Stack tokens={{ childrenGap: 8 }}>
      {label && <Label>{label}</Label>}
      <Stack horizontal tokens={{ childrenGap: 12 }}>
        <DatePicker
          label="Start Date"
          value={startDate || undefined}
          onSelectDate={onStartDateChange}
          placeholder="Select start date"
          styles={{ root: { width: 180 } }}
        />
        <DatePicker
          label="End Date"
          value={endDate || undefined}
          onSelectDate={onEndDateChange}
          placeholder="Select end date"
          minDate={startDate || undefined}
          styles={{ root: { width: 180 } }}
        />
      </Stack>
    </Stack>
  );
};
