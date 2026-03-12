import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Separator } from "@fluentui/react/lib/Separator";
import { LeaveBalance } from "./LeaveBalance";
import { LeaveRequestForm } from "./LeaveRequestForm";
import { LeaveRequestList } from "./LeaveRequestList";
import { HolidayList } from "./HolidayList";
import { useAppContext } from "../../context/AppContext";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const LeavePanel: React.FC = () => {
  const { currentUser } = useAppContext();

  if (!currentUser) return <LoadingSpinner />;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      <LeaveBalance />
      <Separator />
      <LeaveRequestForm />
      <Separator />
      <LeaveRequestList />
      <Separator />
      <HolidayList />
    </Stack>
  );
};
