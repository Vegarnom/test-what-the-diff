"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationType = exports.DeploymentRestApiNoKey = exports.DeploymentRestApiNeedKey = exports.UsagePlanKioskId = exports.METHOD = exports.TYPE_DATA_FUNCTION = exports.TYPE_DATA = exports.SESAME_API_KEY = exports.SESAME_CMD_CODE = exports.JWT_CONSTANT = exports.SALT_OR_ROUNDS = void 0;
exports.SALT_OR_ROUNDS = 10;
exports.JWT_CONSTANT = 'genkisystem-2018';
exports.SESAME_CMD_CODE = {
    TOGGLE: 88,
    LOCK: 82,
    UNLOCK: 83,
};
exports.SESAME_API_KEY = 'UW2JMvQ9nm52MxWOmDHWN9PliZSWn7179UkrAyu5';
exports.TYPE_DATA = ['int', 'double', 'string', 'date', 'object', 'array', 'response_code'];
exports.TYPE_DATA_FUNCTION = {
    int: (data) => {
        return data ? parseInt(data) : data;
    },
    double: (data) => {
        return data ? parseFloat(data) : data;
    },
    string: (data) => {
        return data ? '' + data : data;
    },
    date: (data) => {
        return data ? new Date(data).toISOString() : data;
    },
};
exports.METHOD = ['POST', 'GET', 'PUT', 'DELETE'];
exports.UsagePlanKioskId = process.env.USAGE_PLAN_KIOSK_ID || 'b5be2i';
exports.DeploymentRestApiNeedKey = {
    restApiId: process.env.AWS_NEED_KEY_REST_API_ID,
    stage: process.env.STAGE_NEED_KEY_REST_API,
};
exports.DeploymentRestApiNoKey = {
    restApiId: process.env.AWS_NO_KEY_REST_API_ID,
    stage: process.env.STAGE_NO_KEY_REST_API,
};
exports.authorizationType = ['token', 'firebase'];
//# sourceMappingURL=constant.js.map