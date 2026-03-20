import * as React from "react";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { mergeStyles, keyframes } from "@fluentui/react/lib/Styling";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTime, toChicagoISOString } from "../../utils/dateUtils";
import { formatTimerDisplay } from "../../utils/hoursFormatter";
import { ErrorMessage } from "../common/ErrorMessage";

const pulseAnimation = keyframes({
  "0%": { opacity: 1, transform: "scale(1)" },
  "50%": { opacity: 0.5, transform: "scale(1.3)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const ClockInOut: React.FC = () => {
  const { currentUser } = useAppContext();
  const { activeClockEntry, refreshActiveEntry, refreshTodayEntries, refreshWeekEntries } =
    useTimesheetContext();
  const { clockIn, clockOut, loading, error } = useTimeEntries();
  const { colors, theme } = useAppTheme();
  const [elapsedSeconds, setElapsedSeconds] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);

  const isClockedIn = activeClockEntry !== null;

  // Live elapsed counter when clocked in
  React.useEffect(() => {
    if (isClockedIn && activeClockEntry?.ClockIn) {
      const clockInDate = new Date(activeClockEntry.ClockIn); // stored as Chicago fake-UTC
      const updateElapsed = (): void => {
        const chicagoNow = new Date(toChicagoISOString(new Date()));
        setElapsedSeconds(Math.floor((chicagoNow.getTime() - clockInDate.getTime()) / 1000));
      };
      updateElapsed();
      intervalRef.current = window.setInterval(updateElapsed, 1000);
      return () => {
        if (intervalRef.current) window.clearInterval(intervalRef.current);
      };
    } else {
      setElapsedSeconds(0);
    }
    return undefined;
  }, [isClockedIn, activeClockEntry?.ClockIn]);

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

  const pulseDotClass = mergeStyles({
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: colors.textSuccess,
    display: "inline-block",
    animationName: pulseAnimation,
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  });

  const inactiveDotClass = mergeStyles({
    width: 10,
    height: 10,
    borderRadius: "50%",
    backgroundColor: colors.textTertiary,
    display: "inline-block",
  });

  const elapsedDisplayClass = mergeStyles({
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    color: colors.textSuccess,
    letterSpacing: "2px",
  });

  const idleDisplayClass = mergeStyles({
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    color: colors.textTertiary,
    letterSpacing: "2px",
  });

  return (
    <Stack
      tokens={{ childrenGap: 12 }}
      styles={{
        root: {
          padding: 20,
          borderRadius: 12,
          backgroundColor: colors.bgCard,
          border: `1px solid ${isClockedIn ? colors.textSuccess : theme.semanticColors.bodyDivider}`,
          borderTop: isClockedIn ? `3px solid ${colors.textSuccess}` : `3px solid ${theme.palette.themePrimary}`,
          height: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.3s ease, border-top-color 0.3s ease",
        },
      }}
    >
      {/* Header with status dot */}
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Icon iconName="Clock" styles={{ root: { fontSize: 16, color: theme.palette.themePrimary } }} />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, flexGrow: 1 } }}>
          Clock In / Out
        </Text>
        <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }}>
          <div className={isClockedIn ? pulseDotClass : inactiveDotClass} />
          <Text
            variant="small"
            styles={{
              root: {
                fontWeight: 600,
                color: isClockedIn ? colors.textSuccess : colors.textTertiary,
                textTransform: "uppercase",
                fontSize: 11,
                letterSpacing: "0.5px",
              },
            }}
          >
            {isClockedIn ? "Active" : "Inactive"}
          </Text>
        </Stack>
      </Stack>

      {error && <ErrorMessage message={error} />}

      {/* Elapsed time display */}
      <div className={isClockedIn ? elapsedDisplayClass : idleDisplayClass}>
        {formatTimerDisplay(elapsedSeconds)}
      </div>

      {/* Clock-in time info */}
      {isClockedIn && activeClockEntry?.ClockIn && (
        <Text
          variant="small"
          styles={{ root: { color: colors.textSecondary, textAlign: "center" } }}
        >
          Clocked in at {formatTime(activeClockEntry.ClockIn)}
        </Text>
      )}

      {/* Action button */}
      <Stack horizontalAlign="center" styles={{ root: { paddingTop: 4 } }}>
        {!isClockedIn ? (
          <PrimaryButton
            text="Clock In"
            iconProps={{ iconName: "Play" }}
            onClick={handleClockIn}
            disabled={loading}
            styles={{
              root: {
                minWidth: 140,
                height: 40,
                borderRadius: 6,
              },
            }}
          />
        ) : (
          <DefaultButton
            text="Clock Out"
            iconProps={{ iconName: "CircleStop" }}
            onClick={handleClockOut}
            disabled={loading}
            styles={{
              root: {
                minWidth: 140,
                height: 40,
                borderRadius: 6,
                borderColor: colors.borderError,
                color: colors.borderError,
              },
              rootHovered: {
                borderColor: colors.borderErrorHover,
                color: colors.borderErrorHover,
                backgroundColor: `${colors.borderError}10`,
              },
            }}
          />
        )}
      </Stack>
    </Stack>
  );
};
