import * as React from "react";
import { mergeStyles } from "@fluentui/react/lib/Styling";
import { useAppTheme } from "../../hooks/useAppTheme";

interface IStatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<IStatusBadgeProps> = ({ status }) => {
  const { theme, colors } = useAppTheme();
  const isDark = theme.isInverted;

  const statusColors: Record<string, { bg: string; text: string }> = {
    Active: {
      bg: isDark ? "rgba(16, 124, 16, 0.2)" : "#dff6dd",
      text: colors.textSuccess,
    },
    Completed: {
      bg: isDark ? "rgba(0, 120, 212, 0.2)" : "#deecf9",
      text: colors.textLink,
    },
    Voided: {
      bg: isDark ? "rgba(209, 52, 56, 0.2)" : "#fed9cc",
      text: colors.textError,
    },
    Draft: {
      bg: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f2f1",
      text: colors.textSecondary,
    },
    Submitted: {
      bg: isDark ? "rgba(138, 105, 20, 0.2)" : "#fff4ce",
      text: colors.textWarning,
    },
    Approved: {
      bg: isDark ? "rgba(16, 124, 16, 0.2)" : "#dff6dd",
      text: colors.textSuccess,
    },
    Rejected: {
      bg: isDark ? "rgba(209, 52, 56, 0.2)" : "#fed9cc",
      text: colors.textError,
    },
    Processed: {
      bg: isDark ? "rgba(0, 120, 212, 0.2)" : "#deecf9",
      text: colors.textLink,
    },
    Cancelled: {
      bg: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f2f1",
      text: colors.textSecondary,
    },
  };

  const c = statusColors[status] || {
    bg: isDark ? "rgba(255, 255, 255, 0.08)" : "#f3f2f1",
    text: theme.semanticColors.bodyText,
  };

  const className = mergeStyles({
    display: "inline-block",
    padding: "2px 8px",
    borderRadius: 12,
    fontSize: 12,
    fontWeight: 600,
    backgroundColor: c.bg,
    color: c.text,
  });

  return <span className={className}>{status}</span>;
};
