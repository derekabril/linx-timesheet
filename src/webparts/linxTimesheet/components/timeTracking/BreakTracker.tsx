import * as React from "react";
import { DefaultButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { mergeStyles, keyframes } from "@fluentui/react/lib/Styling";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTimerDisplay } from "../../utils/hoursFormatter";

const pulseAnimation = keyframes({
  "0%": { opacity: 1, transform: "scale(1)" },
  "50%": { opacity: 0.6, transform: "scale(1.2)" },
  "100%": { opacity: 1, transform: "scale(1)" },
});

export const BreakTracker: React.FC = () => {
  const { activeClockEntry } = useTimesheetContext();
  const { colors, theme } = useAppTheme();
  const [isOnBreak, setIsOnBreak] = React.useState(false);
  const [breakSeconds, setBreakSeconds] = React.useState(0);
  const [totalBreakSeconds, setTotalBreakSeconds] = React.useState(0);
  const [breakCount, setBreakCount] = React.useState(0);
  const intervalRef = React.useRef<number | null>(null);

  const canTrack = activeClockEntry !== null;
  const warmColor = colors.textWarning;

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
    setBreakCount((prev) => prev + 1);
    setBreakSeconds(0);
  };

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, []);

  const totalMinutes = Math.floor((totalBreakSeconds + breakSeconds) / 60);

  const breakTimerClass = mergeStyles({
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    color: warmColor,
    letterSpacing: "2px",
  });

  const idleTimerClass = mergeStyles({
    fontSize: 32,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    color: colors.textTertiary,
    letterSpacing: "2px",
  });

  const pulseCoffeeClass = mergeStyles({
    animationName: pulseAnimation,
    animationDuration: "2s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  });

  const statusBadgeClass = mergeStyles({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 10px",
    borderRadius: 12,
    backgroundColor: isOnBreak ? `${warmColor}18` : `${colors.textTertiary}18`,
    border: `1px solid ${isOnBreak ? `${warmColor}40` : `${colors.textTertiary}40`}`,
    fontSize: 11,
    fontWeight: 600,
    color: isOnBreak ? warmColor : colors.textTertiary,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  });

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{
        root: {
          padding: 20,
          borderRadius: 12,
          backgroundColor: colors.bgCard,
          border: `1px solid ${isOnBreak ? warmColor : theme.semanticColors.bodyDivider}`,
          borderTop: `3px solid ${isOnBreak ? warmColor : theme.palette.themePrimary}`,
          height: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.3s ease, border-top-color 0.3s ease",
          opacity: canTrack ? 1 : 0.6,
        },
      }}
    >
      {/* Header with status badge */}
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Icon
          iconName="CoffeeScript"
          className={isOnBreak ? pulseCoffeeClass : ""}
          styles={{
            root: {
              fontSize: 16,
              color: isOnBreak ? warmColor : theme.palette.themePrimary,
              transition: "color 0.3s ease",
            },
          }}
        />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, flexGrow: 1 } }}>
          Break
        </Text>
        <span className={statusBadgeClass}>
          {isOnBreak ? "On Break" : "Available"}
        </span>
      </Stack>

      {/* Break timer display */}
      <div className={isOnBreak ? breakTimerClass : idleTimerClass}>
        {formatTimerDisplay(breakSeconds)}
      </div>

      {/* Stats row */}
      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 20 }}>
        <Stack horizontalAlign="center" tokens={{ childrenGap: 2 }}>
          <Text variant="mediumPlus" styles={{ root: { fontWeight: 700, color: totalMinutes > 0 ? warmColor : colors.textTertiary } }}>
            {totalMinutes}m
          </Text>
          <Text variant="tiny" styles={{ root: { color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.3px" } }}>
            Total
          </Text>
        </Stack>
        <Stack horizontalAlign="center" tokens={{ childrenGap: 2 }}>
          <Text variant="mediumPlus" styles={{ root: { fontWeight: 700, color: breakCount > 0 ? theme.semanticColors.bodyText : colors.textTertiary } }}>
            {breakCount}
          </Text>
          <Text variant="tiny" styles={{ root: { color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.3px" } }}>
            Breaks
          </Text>
        </Stack>
      </Stack>

      {/* Action button */}
      <Stack horizontalAlign="center" styles={{ root: { paddingTop: 4 } }}>
        {!isOnBreak ? (
          <DefaultButton
            text="Start Break"
            iconProps={{ iconName: "CoffeeScript" }}
            onClick={startBreak}
            disabled={!canTrack}
            styles={{
              root: {
                minWidth: 140,
                height: 40,
                borderRadius: 6,
                borderColor: canTrack ? warmColor : undefined,
                color: canTrack ? warmColor : undefined,
              },
              rootHovered: canTrack
                ? { backgroundColor: `${warmColor}10` }
                : undefined,
            }}
          />
        ) : (
          <DefaultButton
            text="End Break"
            iconProps={{ iconName: "Play" }}
            onClick={endBreak}
            styles={{
              root: {
                minWidth: 140,
                height: 40,
                borderRadius: 6,
                borderColor: colors.textSuccess,
                color: colors.textSuccess,
              },
              rootHovered: {
                backgroundColor: `${colors.textSuccess}10`,
              },
            }}
          />
        )}
      </Stack>

      {/* Disabled hint */}
      {!canTrack && (
        <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 4 }}>
          <Icon iconName="Info" styles={{ root: { fontSize: 12, color: colors.textTertiary } }} />
          <Text variant="tiny" styles={{ root: { color: colors.textTertiary } }}>
            Clock in first to track breaks
          </Text>
        </Stack>
      )}
    </Stack>
  );
};
