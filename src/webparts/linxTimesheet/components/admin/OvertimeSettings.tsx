import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Dropdown, IDropdownOption } from "@fluentui/react/lib/Dropdown";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useConfiguration } from "../../hooks/useConfiguration";
import { IAppConfiguration } from "../../models/IConfiguration";

export const OvertimeSettings: React.FC = () => {
  const { configuration, saving, error, saveConfiguration } = useConfiguration();
  const [config, setConfig] = React.useState<IAppConfiguration>(configuration);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    setConfig(configuration);
  }, [configuration]);

  const handleSave = async (): Promise<void> => {
    setSuccess(false);
    await saveConfiguration(config);
    setSuccess(true);
  };

  const periodOptions: IDropdownOption[] = [
    { key: "Weekly", text: "Weekly" },
    { key: "BiWeekly", text: "Bi-Weekly" },
  ];

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16, maxWidth: 500 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Overtime & General Settings
      </Text>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(false)}>
          Settings saved successfully.
        </MessageBar>
      )}

      <SpinButton
        label="Daily Overtime Threshold (hours)"
        min={1}
        max={24}
        step={0.5}
        value={String(config.overtimeDailyThreshold)}
        onChange={(_, v) =>
          setConfig({ ...config, overtimeDailyThreshold: Number(v) || 8 })
        }
      />

      <SpinButton
        label="Weekly Overtime Threshold (hours)"
        min={1}
        max={168}
        step={1}
        value={String(config.overtimeWeeklyThreshold)}
        onChange={(_, v) =>
          setConfig({ ...config, overtimeWeeklyThreshold: Number(v) || 40 })
        }
      />

      <Dropdown
        label="Submission Period"
        options={periodOptions}
        selectedKey={config.submissionPeriod}
        onChange={(_, opt) =>
          opt &&
          setConfig({
            ...config,
            submissionPeriod: opt.key as "Weekly" | "BiWeekly",
          })
        }
      />

      <SpinButton
        label="Working Days Per Week"
        min={1}
        max={7}
        step={1}
        value={String(config.workingDaysPerWeek)}
        onChange={(_, v) =>
          setConfig({ ...config, workingDaysPerWeek: Number(v) || 5 })
        }
      />

      <SpinButton
        label="Default Break Duration (minutes)"
        min={0}
        max={240}
        step={5}
        value={String(config.defaultBreakMinutes)}
        onChange={(_, v) =>
          setConfig({ ...config, defaultBreakMinutes: Number(v) || 60 })
        }
      />

      <PrimaryButton
        text="Save Settings"
        iconProps={{ iconName: "Save" }}
        onClick={handleSave}
        disabled={saving}
        styles={{ root: { width: 150 } }}
      />
    </Stack>
  );
};
