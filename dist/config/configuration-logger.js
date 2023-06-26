"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerConfig = void 0;
const winston = require("winston");
const nest_winston_1 = require("nest-winston");
require("winston-daily-rotate-file");
const s3_logger_1 = require("./s3-logger");
const moment = require('moment-timezone');
let uploadFileInfo = null;
let uploadFileWarn = null;
let uploadFileError = null;
let time_to_upload = parseInt(process.env.S3_TIME_TO_UPLOAD);
let bucket = process.env.S3_BUCKET;
const myFormat = winston.format.combine(winston.format.timestamp({
    format: 'DD-MM-YYYY HH:mm:ss',
}), winston.format.printf((info) => {
    let momentCurrent = moment().tz(process.env.TZ).format('YYYY_MM_DD');
    switch (info.level) {
        case 'info':
            if (uploadFileInfo !== null) {
                clearTimeout(uploadFileInfo);
            }
            uploadFileInfo = setTimeout(() => {
                (0, s3_logger_1.uploadLog)(bucket, momentCurrent, `${info.level}_${momentCurrent}.log`);
            }, time_to_upload);
            break;
        case 'warn':
            if (uploadFileWarn !== null) {
                clearTimeout(uploadFileWarn);
            }
            uploadFileWarn = setTimeout(() => {
                (0, s3_logger_1.uploadLog)(bucket, momentCurrent, `${info.level}_${momentCurrent}.log`);
            }, time_to_upload);
            break;
        case 'error':
            if (uploadFileError !== null) {
                clearTimeout(uploadFileError);
            }
            uploadFileError = setTimeout(() => {
                (0, s3_logger_1.uploadLog)(bucket, momentCurrent, `${info.level}_${momentCurrent}.log`);
            }, time_to_upload);
            break;
    }
    return `${info.timestamp} [BNB-IOT] ${info.level}: ${info.message}`;
}));
const loggerLevel = (level) => {
    return new winston.transports.DailyRotateFile({
        filename: `./logger/${level}_%DATE%.log`,
        datePattern: 'YYYY_MM_DD',
        zippedArchive: true,
        level: level,
        maxSize: '20m',
        maxFiles: '14d',
        format: myFormat,
    });
};
exports.loggerConfig = {
    exitOnError: false,
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(winston.format.timestamp(), winston.format.ms(), nest_winston_1.utilities.format.nestLike()),
        }),
        loggerLevel('info'),
        loggerLevel('warn'),
        loggerLevel('error')
    ],
};
//# sourceMappingURL=configuration-logger.js.map