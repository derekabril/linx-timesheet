import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IBarChartData {
  label: string;
  value: number;
  color?: string;
}

interface IBarChartProps {
  title: string;
  data: IBarChartData[];
  maxValue?: number;
}

const barContainerClass = mergeStyles({
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 6,
});

const barLabelClass = mergeStyles({
  width: 80,
  fontSize: 12,
  textAlign: "right",
  flexShrink: 0,
});

const barValueClass = mergeStyles({
  position: "absolute",
  right: 4,
  top: "50%",
  transform: "translateY(-50%)",
  fontSize: 11,
  fontWeight: 600,
});

export const SimpleBarChart: React.FC<IBarChartProps> = ({ title, data, maxValue }) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);
  const { colors } = useAppTheme();

  return (
    <Stack tokens={{ childrenGap: 4 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        {title}
      </Text>
      {data.map((item, idx) => {
        const width = (item.value / max) * 100;
        const barFillClass = mergeStyles({
          height: "100%",
          width: `${width}%`,
          backgroundColor: item.color || colors.textLink,
          borderRadius: 4,
          transition: "width 0.3s ease",
        });

        return (
          <div key={idx} className={barContainerClass}>
            <span className={barLabelClass}>{item.label}</span>
            <div
              style={{
                flex: 1,
                height: 20,
                backgroundColor: colors.bgSection,
                borderRadius: 4,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <div className={barFillClass} />
              <span className={barValueClass}>{item.value.toFixed(1)}h</span>
            </div>
          </div>
        );
      })}
    </Stack>
  );
};
