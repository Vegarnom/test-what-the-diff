"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.responseData = exports.responseOk = exports.responseCreated = void 0;
const common_1 = require("@nestjs/common");
const responseCreated = (res, appData) => {
    if (appData) {
        res.status(common_1.HttpStatus.CREATED).json({ appData: appData });
    }
    res.status(common_1.HttpStatus.BAD_REQUEST);
};
exports.responseCreated = responseCreated;
const responseOk = (res, appData) => {
    if (appData) {
        res.status(common_1.HttpStatus.OK).json({ appData: appData });
    }
    res.status(common_1.HttpStatus.BAD_REQUEST);
};
exports.responseOk = responseOk;
const responseData = (res, resData, statusCode) => {
    if (resData && statusCode) {
        return res.status(statusCode).send(resData);
    }
    if (resData) {
        return res.status(common_1.HttpStatus.OK).send(resData);
    }
    return res
        .status(common_1.HttpStatus.BAD_REQUEST)
        .json({ meseage: 'request type not match' });
};
exports.responseData = responseData;
//# sourceMappingURL=response.js.map