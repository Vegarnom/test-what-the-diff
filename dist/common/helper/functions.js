"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAndRemoveSpaceInput = void 0;
const checkAndRemoveSpaceInput = (input) => {
    input = input.trim();
    if (input === '') {
        return false;
    }
    return true;
};
exports.checkAndRemoveSpaceInput = checkAndRemoveSpaceInput;
//# sourceMappingURL=functions.js.map