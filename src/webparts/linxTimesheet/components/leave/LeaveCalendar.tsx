import * as React from "react";
import { Calendar } from "@fluentui/react/lib/Calendar";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useAppContext } from "../../context/AppContext";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";
import { useAppTheme } from "../../hooks/useAppTheme";

export const LeaveCalendar: React.FC = () => {
  const { currentUser } = useAppContext();
  const year = new Date().getFullYear();
  const { requests } = useLeaveRequests(currentUser?.id || null, year);
  const { colors } = useAppTheme();
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  // Find leave requests that include the selected date
  const selectedDateStr = selectedDate.toISOString().split("T")[0];
  const activeLeave = requests.find((r) => {
    const start = r.StartDate.split("T")[0];
    const end = r.EndDate.split("T")[0];
    return selectedDateStr >= start && selectedDateStr <= end && r.Status !== "Cancelled";
  });

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Leave Calendar
      </Text>
      <Calendar
        value={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
        showMonthPickerAsOverlay
      />
      {activeLeave && (
        <Text variant="small" styles={{ root: { color: colors.textLink } }}>
          {activeLeave.LeaveType} leave ({activeLeave.Status})
        </Text>
      )}
    </Stack>
  );
};
