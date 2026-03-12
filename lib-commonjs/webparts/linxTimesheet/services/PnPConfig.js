"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSP = void 0;
var sp_1 = require("@pnp/sp");
var logging_1 = require("@pnp/logging");
require("@pnp/sp/webs");
require("@pnp/sp/lists");
require("@pnp/sp/items");
require("@pnp/sp/fields");
require("@pnp/sp/views");
require("@pnp/sp/site-users/web");
require("@pnp/sp/profiles");
var _sp;
/**
 * Initialize or retrieve the PnPjs SPFI singleton.
 * Must be called with context once (in WebPart.onInit) before any service usage.
 */
var getSP = function (context, siteUrl) {
    if (context) {
        var base = siteUrl ? (0, sp_1.spfi)(siteUrl) : (0, sp_1.spfi)();
        _sp = base.using((0, sp_1.SPFx)(context)).using((0, logging_1.PnPLogging)(logging_1.LogLevel.Warning));
    }
    if (!_sp) {
        throw new Error("PnPjs SPFI not initialized. Call getSP(context) in WebPart.onInit first.");
    }
    return _sp;
};
exports.getSP = getSP;
//# sourceMappingURL=PnPConfig.js.map