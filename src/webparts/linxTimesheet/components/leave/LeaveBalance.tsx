import * as React from "react";
import { Stack } from "@fluentui/react/lib/Stack";
import { Text } from "@fluentui/react/lib/Text";
import { useLeaveRequests } from "../../hooks/useLeaveRequests";
import { useAppContext } from "../../context/AppContext";
import { useAppTheme } from "../../hooks/useAppTheme";
import { calculateLeaveBalances } from "../../utils/leaveCalculator";
import { ILeaveBalance as ILeaveBalanceType } from "../../models/ILeaveRequest";

export const LeaveBalance: React.FC = () => {
  const { currentUser, configuration } = useAppContext();
  const { colors, theme } = useAppTheme();
  const year = new Date().getFullYear();
  const { requests } = useLeaveRequests(currentUser?.id || null, year);

  const balances = React.useMemo(
    () => calculateLeaveBalances(requests, configuration),
    [requests, configuration]
  );

  return (
    <Stack tokens={{ childrenGap: 8 }}>
      <Text variant="mediumPlus" styles={{ root: { fontWeight: 600 } }}>
        Leave Balances ({year})
      </Text>
      <Stack horizontal tokens={{ childrenGap: 12 }} wrap>
        {balances.map((b: ILeaveBalanceType) => (
          <Stack
            key={b.leaveType}
            styles={{
              root: {
                padding: 12,
                borderRadius: 8,
                backgroundColor: colors.bgCard,
                border: `1px solid ${theme.semanticColors.bodyDivider}`,
                minWidth: 140,
                textAlign: "center",
              },
            }}
          >
            <Text variant="small" styles={{ root: { color: colors.textSecondary } }}>
              {b.leaveType}
            </Text>
            <Text
              variant="xLarge"
              block
              styles={{ root: { fontWeight: 700, color: b.remaining <= 0 ? colors.textError : colors.textLink } }}
            >
              {b.remaining}
            </Text>
            <Text variant="tiny" block styles={{ root: { color: colors.textTertiary } }}>
              {b.used} used / {b.allocated} total
            </Text>
            {b.pending > 0 && (
              <Text variant="tiny" block styles={{ root: { color: colors.textWarning } }}>
                {b.pending} pending
              </Text>
            )}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};
