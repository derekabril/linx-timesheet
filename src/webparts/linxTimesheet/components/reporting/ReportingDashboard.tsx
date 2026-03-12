import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { SummaryCards } from "./SummaryCards";
import { WeeklyReport } from "./WeeklyReport";
import { MonthlyReport } from "./MonthlyReport";
import { ProjectCostReport } from "./ProjectCostReport";
import { AttendanceReport } from "./AttendanceReport";
import { ExportToolbar } from "./ExportToolbar";
import { useAppContext } from "../../context/AppContext";
import { useTimesheetContext } from "../../context/TimesheetContext";

export const ReportingDashboard: React.FC = () => {
  const { currentUser, isManager } = useAppContext();
  const { weekEntries } = useTimesheetContext();

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <SummaryCards />

      <Pivot>
        <PivotItem headerText="Weekly" itemIcon="CalendarWeek">
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 12 } }}>
            <ExportToolbar data={weekEntries} reportName="weekly-timesheet" />
            <WeeklyReport />
          </Stack>
        </PivotItem>

        <PivotItem headerText="Monthly" itemIcon="Calendar">
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 12 } }}>
            <MonthlyReport />
          </Stack>
        </PivotItem>

        <PivotItem headerText="Project Costs" itemIcon="Money">
          <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 12 } }}>
            <ProjectCostReport />
          </Stack>
        </PivotItem>

        {isManager && (
          <PivotItem headerText="Attendance" itemIcon="People">
            <Stack tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 12 } }}>
              <AttendanceReport />
            </Stack>
          </PivotItem>
        )}
      </Pivot>
    </Stack>
  );
};
