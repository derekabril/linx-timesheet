import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { IProject } from "../../models/IProject";
import { formatHours } from "../../utils/hoursFormatter";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IPlannedVsActualProps {
  project: IProject;
}

const barContainerClass = mergeStyles({
  position: "relative",
  height: 32,
  borderRadius: 4,
  overflow: "hidden",
});

export const PlannedVsActual: React.FC<IPlannedVsActualProps> = ({ project }) => {
  const { colors, theme } = useAppTheme();
  if (project.PlannedHours <= 0) return null;

  const ratio = project.ActualHours / project.PlannedHours;
  const percentage = Math.min(ratio * 100, 100);
  const isOver = ratio > 1;

  const barClass = mergeStyles({
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: `${percentage}%`,
    backgroundColor: isOver ? colors.textError : colors.textLink,
    transition: "width 0.3s ease",
    borderRadius: 4,
  });

  const labelClass = mergeStyles({
    position: "absolute",
    top: "50%",
    left: 8,
    transform: "translateY(-50%)",
    fontSize: 12,
    fontWeight: 600,
    color: percentage > 30 ? "#fff" : theme.semanticColors.bodyText,
  });

  return (
    <Stack tokens={{ childrenGap: 4 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Planned vs Actual
      </Text>
      <div className={barContainerClass} style={{ backgroundColor: colors.bgSection }}>
        <div className={barClass} />
        <span className={labelClass}>
          {formatHours(project.ActualHours)} / {formatHours(project.PlannedHours)}{" "}
          ({Math.round(ratio * 100)}%)
        </span>
      </div>
      {isOver && (
        <Text variant="small" styles={{ root: { color: colors.textError } }}>
          Over budget by {formatHours(project.ActualHours - project.PlannedHours)}
        </Text>
      )}
    </Stack>
  );
};
