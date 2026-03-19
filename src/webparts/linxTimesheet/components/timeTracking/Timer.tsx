import * as React from "react";
import { PrimaryButton, DefaultButton, IconButton } from "@fluentui/react/lib/Button";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { Icon } from "@fluentui/react/lib/Icon";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { TextField } from "@fluentui/react/lib/TextField";
import { Dialog, DialogType, DialogFooter } from "@fluentui/react/lib/Dialog";
import { mergeStyles, keyframes } from "@fluentui/react/lib/Styling";
import { useTimer as useTimerHook } from "../../hooks/useTimer";
import { useTimeEntries } from "../../hooks/useTimeEntries";
import { useProjects } from "../../hooks/useProjects";
import { useTasks } from "../../hooks/useTasks";
import { useAppContext } from "../../context/AppContext";
import { useTimesheetContext } from "../../context/TimesheetContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { formatTimerDisplay } from "../../utils/hoursFormatter";

const blinkAnimation = keyframes({
  "0%": { opacity: 1 },
  "50%": { opacity: 0.3 },
  "100%": { opacity: 1 },
});

export const Timer: React.FC = () => {
  const { currentUser } = useAppContext();
  const { refreshTodayEntries, refreshWeekEntries } = useTimesheetContext();
  const timer = useTimerHook();
  const { createTimerEntry } = useTimeEntries();
  const { projects } = useProjects(
    currentUser ? { activeOnly: true, teamMemberUserId: currentUser.id } : true
  );
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

  // Determine visual state
  const isIdle = !timer.isRunning && !timer.isPaused;
  const accentColor = timer.isRunning
    ? colors.textSuccess
    : timer.isPaused
    ? colors.textWarning
    : theme.palette.neutralTertiary;

  const statusLabel = timer.isRunning ? "Running" : timer.isPaused ? "Paused" : "Ready";

  const timerDisplayClass = mergeStyles({
    fontSize: 40,
    fontWeight: 700,
    fontFamily: "'Courier New', monospace",
    textAlign: "center",
    padding: "12px 0 4px",
    letterSpacing: "3px",
    color: isIdle ? colors.textTertiary : theme.semanticColors.bodyText,
    animationName: timer.isPaused ? blinkAnimation : "none",
    animationDuration: "1.5s",
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  });

  const statusBadgeClass = mergeStyles({
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "2px 10px",
    borderRadius: 12,
    backgroundColor: `${accentColor}18`,
    border: `1px solid ${accentColor}40`,
    fontSize: 11,
    fontWeight: 600,
    color: accentColor,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  });

  return (
    <Stack
      tokens={{ childrenGap: 10 }}
      styles={{
        root: {
          padding: 20,
          borderRadius: 12,
          backgroundColor: colors.bgCard,
          border: `1px solid ${isIdle ? theme.semanticColors.bodyDivider : accentColor}`,
          borderTop: `3px solid ${isIdle ? theme.palette.themePrimary : accentColor}`,
          height: "100%",
          boxSizing: "border-box",
          transition: "border-color 0.3s ease, border-top-color 0.3s ease",
        },
      }}
    >
      {/* Header with status badge */}
      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
        <Icon iconName="Timer" styles={{ root: { fontSize: 16, color: theme.palette.themePrimary } }} />
        <Text variant="mediumPlus" styles={{ root: { fontWeight: 600, flexGrow: 1 } }}>
          Timer
        </Text>
        <span className={statusBadgeClass}>{statusLabel}</span>
      </Stack>

      {/* Timer display */}
      <div className={timerDisplayClass}>{formatTimerDisplay(timer.elapsedSeconds)}</div>

      {/* Controls */}
      <Stack horizontal horizontalAlign="center" tokens={{ childrenGap: 8 }} styles={{ root: { paddingTop: 4 } }}>
        {isIdle && (
          <PrimaryButton
            text="Start"
            iconProps={{ iconName: "Play" }}
            onClick={timer.start}
            styles={{
              root: { minWidth: 120, height: 40, borderRadius: 6 },
            }}
          />
        )}
        {timer.isRunning && (
          <>
            <DefaultButton
              text="Pause"
              iconProps={{ iconName: "Pause" }}
              onClick={timer.pause}
              styles={{
                root: {
                  minWidth: 100,
                  height: 40,
                  borderRadius: 6,
                  borderColor: colors.textWarning,
                  color: colors.textWarning,
                },
                rootHovered: {
                  backgroundColor: `${colors.textWarning}10`,
                },
              }}
            />
            <DefaultButton
              text="Stop"
              iconProps={{ iconName: "CircleStop" }}
              onClick={handleStop}
              styles={{
                root: {
                  minWidth: 100,
                  height: 40,
                  borderRadius: 6,
                  borderColor: colors.borderError,
                  color: colors.borderError,
                },
                rootHovered: {
                  backgroundColor: `${colors.borderError}10`,
                },
              }}
            />
          </>
        )}
        {timer.isPaused && (
          <>
            <PrimaryButton
              text="Resume"
              iconProps={{ iconName: "Play" }}
              onClick={timer.resume}
              styles={{
                root: { minWidth: 100, height: 40, borderRadius: 6 },
              }}
            />
            <DefaultButton
              text="Stop"
              iconProps={{ iconName: "CircleStop" }}
              onClick={handleStop}
              styles={{
                root: {
                  minWidth: 100,
                  height: 40,
                  borderRadius: 6,
                  borderColor: colors.borderError,
                  color: colors.borderError,
                },
                rootHovered: {
                  backgroundColor: `${colors.borderError}10`,
                },
              }}
            />
            <IconButton
              iconProps={{ iconName: "Delete" }}
              title="Reset"
              onClick={timer.reset}
              styles={{
                root: { height: 40, width: 40, borderRadius: 6 },
              }}
            />
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
          styles={{ root: { marginTop: 4 } }}
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
