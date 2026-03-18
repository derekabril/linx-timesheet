import * as React from "react";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { useAppContext } from "../../context/AppContext";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { ErrorMessage } from "../common/ErrorMessage";
import { TimeTrackingPanel } from "../timeTracking/TimeTrackingPanel";
import { ProjectList } from "../projects/ProjectList";
import { LeavePanel } from "../leave/LeavePanel";
import { ApprovalDashboard } from "../approval/ApprovalDashboard";
import { ReportingDashboard } from "../reporting/ReportingDashboard";
import { AdminPanel } from "../admin/AdminPanel";
import { AppTab } from "../../models/enums";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IAppShellProps {
  title: string;
}

const containerClass = mergeStyles({
  maxWidth: 1200,
  margin: "0 auto",
  padding: "16px 20px",
});

const headerClass = mergeStyles({
  marginBottom: 16,
});

export const AppShell: React.FC<IAppShellProps> = ({ title }) => {
  const { isLoading, error, isManager, isAdmin, isSiteOwner, currentUser } = useAppContext();
  const { colors } = useAppTheme();
  const [activeTab, setActiveTab] = React.useState<string>(AppTab.Timesheet);

  if (isLoading) {
    return <LoadingSpinner label="Initializing Keystone Pulse..." />;
  }

  if (error) {
    return (
      <div className={containerClass}>
        <ErrorMessage message={error} />
      </div>
    );
  }

  const handleTabChange = (item?: PivotItem): void => {
    if (item?.props.itemKey) {
      setActiveTab(item.props.itemKey);
    }
  };

  return (
    <div className={containerClass}>
      <Stack className={headerClass}>
        <Text variant="xLarge" styles={{ root: { fontWeight: 600 } }}>
          {title}
        </Text>
        {currentUser && (
          <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
            Welcome, {currentUser.displayName}
          </Text>
        )}
      </Stack>

      <Pivot
        selectedKey={activeTab}
        onLinkClick={handleTabChange}
        styles={{ root: { marginBottom: 16 } }}
      >
        <PivotItem headerText="My Timesheet" itemKey={AppTab.Timesheet} itemIcon="Clock">
          <TimeTrackingPanel />
        </PivotItem>

        <PivotItem headerText="Projects" itemKey={AppTab.Projects} itemIcon="ProjectCollection">
          <ProjectList />
        </PivotItem>

        <PivotItem headerText="Leave" itemKey={AppTab.Leave} itemIcon="Calendar">
          <LeavePanel />
        </PivotItem>

        {(isManager || isAdmin || isSiteOwner) && (
          <PivotItem headerText="Approvals" itemKey={AppTab.Approvals} itemIcon="CheckMark">
            <ApprovalDashboard />
          </PivotItem>
        )}

        <PivotItem headerText="Reports" itemKey={AppTab.Reports} itemIcon="BarChart4">
          <ReportingDashboard />
        </PivotItem>

        {isAdmin && (
          <PivotItem headerText="Admin" itemKey={AppTab.Admin} itemIcon="Settings">
            <AdminPanel />
          </PivotItem>
        )}
      </Pivot>
    </div>
  );
};
