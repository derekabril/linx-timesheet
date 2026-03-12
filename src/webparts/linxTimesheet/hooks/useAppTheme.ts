import { useTheme } from "@fluentui/react/lib/Theme";
import { ITheme } from "@fluentui/react/lib/Styling";

export interface IAppColors {
  textSecondary: string;
  textTertiary: string;
  textLink: string;
  textError: string;
  textWarning: string;
  textSuccess: string;
  textAccent: string;
  bgCard: string;
  bgSection: string;
  borderError: string;
  borderErrorHover: string;
}

export const useAppTheme = (): { theme: ITheme; colors: IAppColors } => {
  const theme = useTheme();
  const p = theme.palette;
  const s = theme.semanticColors;

  return {
    theme,
    colors: {
      textSecondary: s.bodySubtext || p.neutralSecondary,
      textTertiary: s.disabledBodyText || p.neutralTertiary,
      textLink: s.link || p.themePrimary,
      textError: s.errorText || p.redDark,
      textWarning: p.orangeLight || "#d83b01",
      textSuccess: s.successIcon || p.green,
      textAccent: p.purpleLight || "#8764b8",
      bgCard: s.cardStandoutBackground || s.bodyStandoutBackground || p.neutralLighterAlt,
      bgSection: s.bodyStandoutBackground || p.neutralLighter,
      borderError: s.errorText || p.redDark,
      borderErrorHover: p.red || "#a4262c",
    },
  };
};
