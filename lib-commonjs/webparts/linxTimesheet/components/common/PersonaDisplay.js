"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonaDisplay = void 0;
var tslib_1 = require("tslib");
var React = tslib_1.__importStar(require("react"));
var Persona_1 = require("@fluentui/react/lib/Persona");
var PersonaDisplay = function (_a) {
    var name = _a.name, email = _a.email, _b = _a.size, size = _b === void 0 ? Persona_1.PersonaSize.size24 : _b;
    return (React.createElement(Persona_1.Persona, { text: name, secondaryText: email, size: size, hidePersonaDetails: size === Persona_1.PersonaSize.size24 }));
};
exports.PersonaDisplay = PersonaDisplay;
//# sourceMappingURL=PersonaDisplay.js.map