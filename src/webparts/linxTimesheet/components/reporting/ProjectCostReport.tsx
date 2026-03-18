import * as React from "react";
import {
  DetailsList,
  DetailsListLayoutMode,
  SelectionMode,
  IColumn,
} from "@fluentui/react/lib/DetailsList";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { ProgressIndicator } from "@fluentui/react/lib/ProgressIndicator";
import { useProjects } from "../../hooks/useProjects";
import { useUserRates } from "../../hooks/useUserRates";
import { IProject } from "../../models/IProject";
import { formatHours } from "../../utils/hoursFormatter";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IProjectWithCost extends IProject {
  avgRate: number;
  totalCost: number;
  budgetUsed: number;
}

export const ProjectCostReport: React.FC = () => {
  const { projects, loading: projectsLoading } = useProjects(true);
  const { rates, loading: ratesLoading } = useUserRates();
  const { colors, theme } = useAppTheme();

  const loading = projectsLoading || ratesLoading;

  // Build a map of userId -> hourlyRate for quick lookup
  const rateMap = React.useMemo(() => {
    const map = new Map<number, number>();
    rates.forEach((r) => map.set(r.EmployeeId, r.HourlyRate));
    return map;
  }, [rates]);

  // Calculate blended rate per project from team members' rates
  const projectsWithCost: IProjectWithCost[] = projects
    .filter((p) => p.ActualHours > 0 || p.PlannedHours > 0)
    .map((p) => {
      const memberIds = p.TeamMembersId || [];
      const memberRates = memberIds
        .map((id) => rateMap.get(id) ?? 0)
        .filter((r) => r > 0);
      const avgRate =
        memberRates.length > 0
          ? memberRates.reduce((sum, r) => sum + r, 0) / memberRates.length
          : 0;
      return {
        ...p,
        avgRate,
        totalCost: p.ActualHours * avgRate,
        budgetUsed: p.PlannedHours > 0 ? (p.ActualHours / p.PlannedHours) * 100 : 0,
      };
    });

  const totalCost = projectsWithCost.reduce((sum, p) => sum + p.totalCost, 0);
  const totalActualHours = projectsWithCost.reduce((sum, p) => sum + p.ActualHours, 0);

  const columns: IColumn[] = [
    { key: "code", name: "Code", fieldName: "ProjectCode", minWidth: 70, maxWidth: 90 },
    { key: "name", name: "Project", fieldName: "Title", minWidth: 150, maxWidth: 220 },
    { key: "client", name: "Client", fieldName: "Client", minWidth: 100, maxWidth: 150 },
    {
      key: "rate",
      name: "Avg Rate",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IProjectWithCost) =>
        item.avgRate > 0 ? `$${item.avgRate.toFixed(2)}` : "--",
    },
    {
      key: "actual",
      name: "Hours",
      minWidth: 70,
      maxWidth: 90,
      onRender: (item: IProjectWithCost) => formatHours(item.ActualHours),
    },
    {
      key: "cost",
      name: "Est. Cost",
      minWidth: 80,
      maxWidth: 110,
      onRender: (item: IProjectWithCost) =>
        item.totalCost > 0 ? `$${item.totalCost.toLocaleString()}` : "--",
    },
    {
      key: "budget",
      name: "Budget Used",
      minWidth: 150,
      maxWidth: 200,
      onRender: (item: IProjectWithCost) => (
        <ProgressIndicator
          percentComplete={Math.min(item.budgetUsed / 100, 1)}
          barHeight={6}
          styles={{
            progressBar: { backgroundColor: item.budgetUsed > 100 ? colors.textError : colors.textLink },
          }}
          description={`${Math.round(item.budgetUsed)}%`}
        />
      ),
    },
  ];

  if (loading) return <LoadingSpinner label="Loading projects..." />;

  return (
    <Stack tokens={{ childrenGap: 12 }} styles={{ root: { paddingTop: 12 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Project Cost Tracking
      </Text>
      <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
        Costs are estimated using team members' hourly rates (managed in Admin &gt; User Rates).
      </Text>

      {projectsWithCost.length === 0 ? (
        <Text styles={{ root: { color: colors.textSecondary, fontStyle: "italic" } }}>
          No project data available.
        </Text>
      ) : (
        <>
          <DetailsList
            items={projectsWithCost}
            columns={columns}
            layoutMode={DetailsListLayoutMode.justified}
            selectionMode={SelectionMode.none}
            compact
          />
          <Stack
            horizontal
            tokens={{ childrenGap: 24 }}
            styles={{ root: { padding: "8px 0", borderTop: `2px solid ${theme.semanticColors.bodyDivider}`, fontWeight: 600 } }}
          >
            <Text>Total Hours: {formatHours(totalActualHours)}</Text>
            <Text>Total Est. Cost: ${totalCost.toLocaleString()}</Text>
          </Stack>
        </>
      )}
    </Stack>
  );
};
