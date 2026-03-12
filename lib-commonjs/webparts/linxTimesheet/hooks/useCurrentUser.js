"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useCurrentUser = void 0;
var AppContext_1 = require("../context/AppContext");
/**
 * Convenience hook to access current user from AppContext.
 */
var useCurrentUser = function () {
    var _a = (0, AppContext_1.useAppContext)(), currentUser = _a.currentUser, isManager = _a.isManager, isAdmin = _a.isAdmin;
    return { currentUser: currentUser, isManager: isManager, isAdmin: isAdmin };
};
exports.useCurrentUser = useCurrentUser;
//# sourceMappingURL=useCurrentUser.js.map