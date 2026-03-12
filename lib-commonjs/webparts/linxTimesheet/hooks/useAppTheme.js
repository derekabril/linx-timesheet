"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAppTheme = void 0;
var Theme_1 = require("@fluentui/react/lib/Theme");
var useAppTheme = function () {
    var theme = (0, Theme_1.useTheme)();
    var p = theme.palette;
    var s = theme.semanticColors;
    return {
        theme: theme,
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
exports.useAppTheme = useAppTheme;
//# sourceMappingURL=useAppTheme.js.map