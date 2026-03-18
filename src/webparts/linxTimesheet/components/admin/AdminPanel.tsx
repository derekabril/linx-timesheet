import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Pivot, PivotItem } from "@fluentui/react/lib/Pivot";
import { Text } from "@fluentui/react/lib/Text";
import { OvertimeSettings } from "./OvertimeSettings";
import { LeaveSettings } from "./LeaveSettings";
import { HolidayManagement } from "./HolidayManagement";
import { AuditLogViewer } from "./AuditLogViewer";
import { UserRateManagement } from "./UserRateManagement";

export const AdminPanel: React.FC = () => {
  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <Text variant="large" styles={{ root: { fontWeight: 600 } }}>
        Administration
      </Text>

      <Pivot>
        <PivotItem headerText="Overtime" itemIcon="Clock">
          <OvertimeSettings />
        </PivotItem>

        <PivotItem headerText="Leave" itemIcon="Calendar">
          <LeaveSettings />
        </PivotItem>

        <PivotItem headerText="Holidays" itemIcon="CalendarDay">
          <HolidayManagement />
        </PivotItem>

        <PivotItem headerText="User Rates" itemIcon="Money">
          <UserRateManagement />
        </PivotItem>

        <PivotItem headerText="Audit Log" itemIcon="DocumentSearch">
          <AuditLogViewer />
        </PivotItem>
      </Pivot>
    </Stack>
  );
};
