import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Separator } from "@fluentui/react/lib/Separator";
import { ClockInOut } from "./ClockInOut";
import { Timer } from "./Timer";
import { ManualEntry } from "./ManualEntry";
import { BreakTracker } from "./BreakTracker";
import { DailySummary } from "./DailySummary";
import { TimeEntryList } from "./TimeEntryList";
import { SubmitTimesheet } from "../approval/SubmitTimesheet";
import { SubmissionHistory } from "../approval/SubmissionHistory";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppContext } from "../../context/AppContext";
import { LoadingSpinner } from "../common/LoadingSpinner";

export const TimeTrackingPanel: React.FC = () => {
  const { isLoading } = useTimesheetContext();
  const { currentUser } = useAppContext();

  if (!currentUser) return <LoadingSpinner />;

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16 } }}>
      {/* Top row: Clock In/Out + Timer + Break */}
      <Stack horizontal tokens={{ childrenGap: 16 }} wrap styles={{ root: { alignItems: "stretch" } }}>
        <Stack.Item grow={1} styles={{ root: { minWidth: 280, flexBasis: 0 } }}>
          <ClockInOut />
        </Stack.Item>
        <Stack.Item grow={1} styles={{ root: { minWidth: 280, flexBasis: 0 } }}>
          <Timer />
        </Stack.Item>
        <Stack.Item grow={1} styles={{ root: { minWidth: 280, flexBasis: 0 } }}>
          <BreakTracker />
        </Stack.Item>
      </Stack>

      <Separator />

      {/* Daily Summary */}
      <DailySummary />

      <Separator />

      {/* Manual Entry Form */}
      <ManualEntry />

      <Separator />

      {/* Weekly Entry List */}
      {isLoading ? <LoadingSpinner label="Loading entries..." /> : <TimeEntryList />}

      <Separator />

      {/* Submit Timesheet */}
      <SubmitTimesheet />

      <Separator />

      {/* Submission History */}
      <SubmissionHistory />
    </Stack>
  );
};
