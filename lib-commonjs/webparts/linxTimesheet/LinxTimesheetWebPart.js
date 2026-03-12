"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var ReactDom = tslib_1.__importStar(require("react-dom"));
var sp_core_library_1 = require("@microsoft/sp-core-library");
var sp_webpart_base_1 = require("@microsoft/sp-webpart-base");
var sp_property_pane_1 = require("@microsoft/sp-property-pane");
var App_1 = tslib_1.__importDefault(require("./components/App"));
var PnPConfig_1 = require("./services/PnPConfig");
var LinxTimesheetWebPart = /** @class */ (function (_super) {
    tslib_1.__extends(LinxTimesheetWebPart, _super);
    function LinxTimesheetWebPart() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LinxTimesheetWebPart.prototype.onInit = function () {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var siteUrl;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _super.prototype.onInit.call(this)];
                    case 1:
                        _a.sent();
                        if (this.context.sdks.microsoftTeams) {
                            // In Teams the default context points to the Team's underlying site,
                            // not the site where the timesheet lists are provisioned. Always
                            // target the dedicated timesheets site.
                            siteUrl = "https://linxconsultingoffice.sharepoint.com/sites/timesheets";
                        }
                        (0, PnPConfig_1.getSP)(this.context, siteUrl);
                        return [2 /*return*/];
                }
            });
        });
    };
    LinxTimesheetWebPart.prototype.render = function () {
        var element = React.createElement(App_1.default, {
            context: this.context,
            title: this.properties.title || "LINX Timesheet",
        });
        ReactDom.render(element, this.domElement);
    };
    LinxTimesheetWebPart.prototype.onDispose = function () {
        ReactDom.unmountComponentAtNode(this.domElement);
    };
    Object.defineProperty(LinxTimesheetWebPart.prototype, "dataVersion", {
        get: function () {
            return sp_core_library_1.Version.parse("1.0");
        },
        enumerable: false,
        configurable: true
    });
    LinxTimesheetWebPart.prototype.getPropertyPaneConfiguration = function () {
        return {
            pages: [
                {
                    header: { description: "LINX Timesheet Settings" },
                    groups: [
                        {
                            groupName: "General",
                            groupFields: [
                                (0, sp_property_pane_1.PropertyPaneTextField)("title", {
                                    label: "Web Part Title",
                                }),
                            ],
                        },
                    ],
                },
            ],
        };
    };
    return LinxTimesheetWebPart;
}(sp_webpart_base_1.BaseClientSideWebPart));
exports.default = LinxTimesheetWebPart;
//# sourceMappingURL=LinxTimesheetWebPart.js.map