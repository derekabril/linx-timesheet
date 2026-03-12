import * as React from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTime } from "../../utils/dateUtils";
import { ErrorMessage } from "../common/ErrorMessage";

export const ClockInOut: React.FC = () => {
  const { currentUser } = useAppContext();
  const { activeClockEntry, refreshActiveEntry, refreshTodayEntries, refreshWeekEntries } =
    useTimesheetContext();
  const { clockIn, clockOut, loading, error } = useTimeEntries();
  const { colors, theme } = useAppTheme();

  const handleClockIn = async (): Promise<void> => {
    if (!currentUser) return;
    await clockIn(currentUser.id);
    await refreshActiveEntry();
    await refreshTodayEntries();
  };

  const handleClockOut = async (): Promise<void> => {
    if (!activeClockEntry) return;
    await clockOut(activeClockEntry.Id);
    await refreshActiveEntry();
    await refreshTodayEntries();
    await refreshWeekEntries();
  };

  const isClockedIn = activeClockEntry !== null;

  return (
    <Stack
      tokens={{ childrenGap: 12 }}
      styles={{
        root: {
          padding: 16,
          borderRadius: 8,
          backgroundColor: colors.bgCard,
          border: `1px solid ${theme.semanticColors.bodyDivider}`,
          height: "100%",
          boxSizing: "border-box",
        },
      }}
    >
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Clock In / Out
      </Text>

      {error && <ErrorMessage message={error} />}

      <Stack tokens={{ childrenGap: 4 }}>
        <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
          Status:{" "}
          <strong style={{ color: isClockedIn ? colors.textSuccess : colors.textSecondary }}>
            {isClockedIn ? "Clocked In" : "Not Clocked In"}
          </strong>
        </Text>
        {isClockedIn && activeClockEntry?.ClockIn && (
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
            Since: {formatTime(activeClockEntry.ClockIn)}
          </Text>
        )}
      </Stack>

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        {!isClockedIn ? (
          <PrimaryButton
            text="Clock In"
            iconProps={{ iconName: "Play" }}
            onClick={handleClockIn}
            disabled={loading}
          />
        ) : (
          <DefaultButton
            text="Clock Out"
            iconProps={{ iconName: "Stop" }}
            onClick={handleClockOut}
            disabled={loading}
            styles={{
              root: { borderColor: colors.borderError, color: colors.borderError },
              rootHovered: { borderColor: colors.borderErrorHover, color: colors.borderErrorHover },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};
