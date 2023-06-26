"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadLog = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3Client = new client_s3_1.S3Client({ region: process.env.AWS_REGION, credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    } });
const client_s3_2 = require("@aws-sdk/client-s3");
const path = require('path');
const fs = require('fs');
const uploadLog = async (bucket, moment, fileUp) => {
    try {
        const file = __dirname + `/../../logger/${fileUp}`;
        const fileStream = fs.createReadStream(file);
        var key = `${moment}/${path.basename(file)}`;
        if (process.env.EC2_AVAIL_ZONE) {
            key = `${process.env.EC2_AVAIL_ZONE}/${moment}/${path.basename(file)}`;
        }
        console.log(key);
        let uploadParams = {
            Bucket: bucket,
            Key: key,
            Body: fileStream,
        };
        const data = await s3Client.send(new client_s3_2.PutObjectCommand(uploadParams));
        return data;
    }
    catch (err) {
        console.log("Error", err);
    }
};
exports.uploadLog = uploadLog;
//# sourceMappingURL=s3-logger.js.map