import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { SpinButton } from "@fluentui/react/lib/SpinButton";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useConfiguration } from "../../hooks/useConfiguration";
import { IAppConfiguration, ILeaveAllocation } from "../../models/IConfiguration";
import { LeaveType } from "../../models/enums";

const leaveTypes: { key: keyof ILeaveAllocation; label: string }[] = [
  { key: LeaveType.Vacation, label: "Vacation Days" },
  { key: LeaveType.Sick, label: "Sick Days" },
  { key: LeaveType.Personal, label: "Personal Days" },
  { key: LeaveType.Bereavement, label: "Bereavement Days" },
  { key: LeaveType.Other, label: "Other Days" },
];

export const LeaveSettings: React.FC = () => {
  const { configuration, saving, error, saveConfiguration } = useConfiguration();
  const [config, setConfig] = React.useState<IAppConfiguration>(configuration);
  const [success, setSuccess] = React.useState(false);

  React.useEffect(() => {
    setConfig(configuration);
  }, [configuration]);

  const updateLeaveBalance = (key: keyof ILeaveAllocation, value: number): void => {
    setConfig({
      ...config,
      leaveBalances: {
        ...config.leaveBalances,
        [key]: value,
      },
    });
  };

  const handleSave = async (): Promise<void> => {
    setSuccess(false);
    await saveConfiguration(config);
    setSuccess(true);
  };

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16, maxWidth: 500 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Leave Balance Allocation (per employee/year)
      </Text>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(false)}>
          Leave settings saved successfully.
        </MessageBar>
      )}

      {leaveTypes.map(({ key, label }) => (
        <SpinButton
          key={key}
          label={label}
          min={0}
          max={365}
          step={1}
          value={String(config.leaveBalances[key] || 0)}
          onChange={(_, v) => updateLeaveBalance(key, Number(v) || 0)}
        />
      ))}

      <PrimaryButton
        text="Save Leave Settings"
        iconProps={{ iconName: "Save" }}
        onClick={handleSave}
        disabled={saving}
        styles={{ root: { width: 180 } }}
      />
    </Stack>
  );
};
