import * as React from "react";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { AppTab } from "../../models/enums";

interface INavigationTabsProps {
  activeTab: string;
  isManager: boolean;
  isAdmin: boolean;
  onTabChange: (tab: string) => void;
}

export const NavigationTabs: React.FC<INavigationTabsProps> = ({
  activeTab,
  isManager,
  isAdmin,
  onTabChange,
}) => {
  const handleChange = (item?: PivotItem): void => {
    if (item?.props.itemKey) {
      onTabChange(item.props.itemKey);
    }
  };

  return (
    <Pivot selectedKey={activeTab} onLinkClick={handleChange}>
      <PivotItem headerText="My Timesheet" itemKey={AppTab.Timesheet} itemIcon="Clock" />
      <PivotItem headerText="Projects" itemKey={AppTab.Projects} itemIcon="ProjectCollection" />
      <PivotItem headerText="Leave" itemKey={AppTab.Leave} itemIcon="Calendar" />
      {(isManager || isAdmin) && (
        <PivotItem headerText="Approvals" itemKey={AppTab.Approvals} itemIcon="CheckMark" />
      )}
      <PivotItem headerText="Reports" itemKey={AppTab.Reports} itemIcon="BarChart4" />
      {isAdmin && (
        <PivotItem headerText="Admin" itemKey={AppTab.Admin} itemIcon="Settings" />
      )}
    </Pivot>
  );
};
