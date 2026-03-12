import * as React from "react";
import { PrimaryButton, DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { TextField } from "@fluentui/react/lib/TextField";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { useTimer as useTimerHook } from "../../hooks/useTimer";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useProjects } from "../../hooks/useProjects";
import { useTasks } from "../../hooks/useTasks";
import { useAppContext } from "../../context/AppContext";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTimerDisplay } from "../../utils/hoursFormatter";

const timerDisplayClass = mergeStyles({
  fontSize: 36,
  fontWeight: 700,
  fontFamily: "'Courier New', monospace",
  textAlign: "center",
  padding: "8px 0",
});

export const Timer: React.FC = () => {
  const { currentUser } = useAppContext();
  const { refreshTodayEntries, refreshWeekEntries } = useTimesheetContext();
  const timer = useTimerHook();
  const { createTimerEntry } = useTimeEntries();
  const { projects } = useProjects();
  const { colors, theme } = useAppTheme();
  const [selectedProjectId, setSelectedProjectId] = React.useState<number | null>(null);
  const { tasks } = useTasks(selectedProjectId);

  const [showSaveDialog, setShowSaveDialog] = React.useState(false);
  const [saveProjectId, setSaveProjectId] = React.useState<number | null>(null);
  const [saveTaskId, setSaveTaskId] = React.useState<number | null>(null);
  const [saveNotes, setSaveNotes] = React.useState("");
  const [stoppedState, setStoppedState] = React.useState<{ elapsedSeconds: number; startTime: Date | null }>({
    elapsedSeconds: 0,
    startTime: null,
  });

  const handleStop = (): void => {
    const state = timer.stop();
    setStoppedState({ elapsedSeconds: state.elapsedSeconds, startTime: state.startTime });
    setSaveProjectId(selectedProjectId);
    setShowSaveDialog(true);
  };

  const handleSave = async (): Promise<void> => {
    if (!currentUser || !stoppedState.startTime) return;
    await createTimerEntry(
      currentUser.id,
      stoppedState.startTime,
      stoppedState.elapsedSeconds,
      saveProjectId,
      saveTaskId,
      saveNotes
    );
    setShowSaveDialog(false);
    setSaveNotes("");
    setSaveProjectId(null);
    setSaveTaskId(null);
    await refreshTodayEntries();
    await refreshWeekEntries();
  };

  const handleDiscard = (): void => {
    setShowSaveDialog(false);
    setSaveNotes("");
  };

  const projectOptions: IDropdownOption[] = projects.map((p) => ({
    key: p.Id,
    text: `${p.ProjectCode} - ${p.Title}`,
  }));

  const taskOptions: IDropdownOption[] = tasks.map((t) => ({
    key: t.Id,
    text: `${t.TaskCode} - ${t.Title}`,
  }));

  return (
    <Stack
      tokens={{ childrenGap: 12 }}
      styles={{
        root: {
          padding: 16,
          borderRadius: 8,
          backgroundColor: colors.bgCard,
          border: `1px solid ${theme.semanticColors.bodyDivider}`,
          height: "100%",
          boxSizing: "border-box",
        },
      }}
    >
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Timer
      </Text>

      <div className={timerDisplayClass}>{formatTimerDisplay(timer.elapsedSeconds)}</div>

      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 8 }}>
        {!timer.isRunning && !timer.isPaused && (
          <PrimaryButton text="Start" iconProps={{ iconName: "Play" }} onClick={timer.start} />
        )}
        {timer.isRunning && (
          <>
            <DefaultButton text="Pause" iconProps={{ iconName: "Pause" }} onClick={timer.pause} />
            <DefaultButton
              text="Stop"
              iconProps={{ iconName: "Stop" }}
              onClick={handleStop}
              styles={{ root: { borderColor: colors.borderError, color: colors.borderError } }}
            />
          </>
        )}
        {timer.isPaused && (
          <>
            <PrimaryButton text="Resume" iconProps={{ iconName: "Play" }} onClick={timer.resume} />
            <DefaultButton
              text="Stop"
              iconProps={{ iconName: "Stop" }}
              onClick={handleStop}
              styles={{ root: { borderColor: colors.borderError, color: colors.borderError } }}
            />
            <IconButton iconProps={{ iconName: "Delete" }} title="Reset" onClick={timer.reset} />
          </>
        )}
      </Stack>

      {/* Optional project selection while timer runs */}
      {(timer.isRunning || timer.isPaused) && (
        <Dropdown
          label="Project (optional)"
          placeholder="Select project"
          options={projectOptions}
          selectedKey={selectedProjectId}
          onChange={(_, opt) => setSelectedProjectId(opt ? (opt.key as number) : null)}
        />
      )}

      {/* Save dialog */}
      <Dialog
        hidden={!showSaveDialog}
        onDismiss={handleDiscard}
        dialogContentProps={{
          type: DialogType.normal,
          title: "Save Timer Entry",
          subText: `Duration: ${formatTimerDisplay(stoppedState.elapsedSeconds)}`,
        }}
        modalProps={{ isBlocking: true }}
        minWidth={400}
      >
        <Stack tokens={{ childrenGap: 12 }}>
          <Dropdown
            label="Project"
            placeholder="Select project"
            options={projectOptions}
            selectedKey={saveProjectId}
            onChange={(_, opt) => {
              setSaveProjectId(opt ? (opt.key as number) : null);
              setSaveTaskId(null);
            }}
          />
          {saveProjectId && (
            <Dropdown
              label="Task"
              placeholder="Select task"
              options={taskOptions}
              selectedKey={saveTaskId}
              onChange={(_, opt) => setSaveTaskId(opt ? (opt.key as number) : null)}
            />
          )}
          <TextField
            label="Notes"
            multiline
            rows={3}
            value={saveNotes}
            onChange={(_, val) => setSaveNotes(val || "")}
          />
        </Stack>
        <DialogFooter>
          <PrimaryButton text="Save" onClick={handleSave} />
          <DefaultButton text="Discard" onClick={handleDiscard} />
        </DialogFooter>
      </Dialog>
    </Stack>
  );
};
