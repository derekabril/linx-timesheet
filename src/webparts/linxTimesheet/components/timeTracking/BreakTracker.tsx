import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTimerDisplay } from "../../utils/hoursFormatter";

export const BreakTracker: React.FC = () => {
  const { activeClockEntry } = useTimesheetContext();
  const { colors, theme } = useAppTheme();
  const [isOnBreak, setIsOnBreak] = React.useState(false);
  const [breakSeconds, setBreakSeconds] = React.useState(0);
  const [totalBreakSeconds, setTotalBreakSeconds] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);

  const startBreak = (): void => {
    setIsOnBreak(true);
    intervalRef.current = window.setInterval(() => {
      setBreakSeconds((prev) => prev + 1);
    }, 1000);
  };

  const endBreak = (): void => {
    setIsOnBreak(false);
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTotalBreakSeconds((prev) => prev + breakSeconds);
    setBreakSeconds(0);
  };

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const totalMinutes = Math.floor((totalBreakSeconds + breakSeconds) / 60);

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
        Break
      </Text>

      {isOnBreak && (
        <Text
          variant="large"
          styles={{ root: { fontFamily: "'Courier New', monospace", textAlign: "center" } }}
        >
          {formatTimerDisplay(breakSeconds)}
        </Text>
      )}

      <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
        Total break today: {totalMinutes} min
      </Text>

      <Stack horizontal tokens={{ childrenGap: 8 }}>
        {!isOnBreak ? (
          <DefaultButton
            text="Start Break"
            iconProps={{ iconName: "Coffee" }}
            onClick={startBreak}
            disabled={!activeClockEntry}
          />
        ) : (
          <DefaultButton
            text="End Break"
            iconProps={{ iconName: "Play" }}
            onClick={endBreak}
          />
        )}
      </Stack>

      {!activeClockEntry && (
        <Text variant="tiny" styles={{ root: { color: colors.textTertiary } }}>
          Clock in first to track breaks
        </Text>
      )}
    </Stack>
  );
};
