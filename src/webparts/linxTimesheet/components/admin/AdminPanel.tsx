import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { GeneralSettings } from "./GeneralSettings";
import { OvertimeSettings } from "./OvertimeSettings";
import { LeaveSettings } from "./LeaveSettings";
import { HolidayManagement } from "./HolidayManagement";
import { AuditLogViewer } from "./AuditLogViewer";
import { UserRateManagement } from "./UserRateManagement";
import { IncentiveManagement } from "./IncentiveManagement";

interface IAdminPanelProps {
  readOnly?: boolean;
}

const readOnlyClass = mergeStyles({
  selectors: {
    "button, .ms-Button": { pointerEvents: "none", opacity: 0.5 },
    "input, textarea": { pointerEvents: "none" },
    ".ms-Dropdown": { pointerEvents: "none" },
    ".ms-Toggle": { pointerEvents: "none" },
    ".ms-SpinButton": { pointerEvents: "none" },
    ".ms-DatePicker": { pointerEvents: "none" },
  },
});

export const AdminPanel: React.FC<IAdminPanelProps> = ({ readOnly }) => {
  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
        Administration
      </Text>

      {readOnly && (
        <MessageBar messageBarType={MessageBarType.info}>
          You have view-only access to administration settings.
        </MessageBar>
      )}

      <Pivot>
        <PivotItem headerText="General" itemIcon="Settings">
          <GeneralSettings readOnly={readOnly} />
        </PivotItem>

        <PivotItem headerText="Overtime" itemIcon="Clock">
          <div className={readOnly ? readOnlyClass : undefined}>
            <OvertimeSettings />
          </div>
        </PivotItem>

        <PivotItem headerText="Leave" itemIcon="Calendar">
          <div className={readOnly ? readOnlyClass : undefined}>
            <LeaveSettings />
          </div>
        </PivotItem>

        <PivotItem headerText="Holidays" itemIcon="CalendarDay">
          <div className={readOnly ? readOnlyClass : undefined}>
            <HolidayManagement />
          </div>
        </PivotItem>

        <PivotItem headerText="User Rates" itemIcon="Money">
          <div className={readOnly ? readOnlyClass : undefined}>
            <UserRateManagement />
          </div>
        </PivotItem>

        <PivotItem headerText="Incentives" itemIcon="Trophy">
          <div className={readOnly ? readOnlyClass : undefined}>
            <IncentiveManagement />
          </div>
        </PivotItem>

        <PivotItem headerText="Audit Log" itemIcon="DocumentSearch">
          <AuditLogViewer />
        </PivotItem>
      </Pivot>
    </Stack>
  );
};
