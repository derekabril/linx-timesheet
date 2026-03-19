import * as React from "react";
import { PrimaryButton } from "@fluentui/react/lib/Button";
import { TextField } from "@fluentui/react/lib/TextField";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { MessageBar, MessageBarType } from "@fluentui/react/lib/MessageBar";
import { useConfiguration } from "../../hooks/useConfiguration";
import { IAppConfiguration } from "../../models/IConfiguration";

interface IGeneralSettingsProps {
  readOnly?: boolean;
}

export const GeneralSettings: React.FC<IGeneralSettingsProps> = ({ readOnly }) => {
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

  return (
    <Stack tokens={{ childrenGap: 16 }} styles={{ root: { paddingTop: 16, maxWidth: 500 } }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        General Settings
      </Text>

      {error && <MessageBar messageBarType={MessageBarType.error}>{error}</MessageBar>}
      {success && (
        <MessageBar messageBarType={MessageBarType.success} onDismiss={() => setSuccess(false)}>
          Settings saved successfully.
        </MessageBar>
      )}

      <TextField
        label="Regular Holiday Rate"
        description="Additional premium on top of regular pay for regular holidays (e.g. 1.0 = additional 100%, making it double pay)."
        type="number"
        value={String(config.regularHolidayRate)}
        onChange={(_, v) => setConfig({ ...config, regularHolidayRate: Number(v) || 0 })}
        readOnly={readOnly}
      />

      <TextField
        label="Special Holiday Rate"
        description="Additional premium on top of regular pay for special holidays (e.g. 0.3 = additional 30%)."
        type="number"
        value={String(config.specialHolidayRate)}
        onChange={(_, v) => setConfig({ ...config, specialHolidayRate: Number(v) || 0 })}
        readOnly={readOnly}
      />

      <TextField
        label="Notification Email"
        description="Email address to receive timesheet submission notifications (Finance/Admin). Must be a valid user in your SharePoint tenant."
        placeholder="e.g. admin@company.com"
        value={config.notificationEmail}
        onChange={(_, v) => setConfig({ ...config, notificationEmail: v || "" })}
        readOnly={readOnly}
      />

      <TextField
        label="CEO Email"
        description="Email address of the CEO who receives the weekly payroll report when submitted by Finance."
        placeholder="e.g. ceo@company.com"
        value={config.ceoEmail}
        onChange={(_, v) => setConfig({ ...config, ceoEmail: v || "" })}
        readOnly={readOnly}
      />

      <TextField
        label="Bookkeeper Emails"
        description="Comma-separated email addresses of users with the Bookkeeper role (view-only admin access, can review and notify finance)."
        placeholder="e.g. bookkeeper1@company.com, bookkeeper2@company.com"
        value={config.bookkeeperEmails}
        onChange={(_, v) => setConfig({ ...config, bookkeeperEmails: v || "" })}
        multiline
        rows={2}
        readOnly={readOnly}
      />

      {!readOnly && (
        <PrimaryButton
          text="Save Settings"
          iconProps={{ iconName: "Save" }}
          onClick={handleSave}
          disabled={saving}
          styles={{ root: { width: 150 } }}
        />
      )}
    </Stack>
  );
};
