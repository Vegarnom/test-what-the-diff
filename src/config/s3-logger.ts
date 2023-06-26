// Create service client module using ES6 syntax.
import { S3Client } from "@aws-sdk/client-s3";
// Set the AWS Region.
const REGION = "ap-southeast-1";
// Create an Amazon S3 service client object.
const s3Client = new S3Client({ region: REGION, credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
} });

// Import required AWS SDK clients and commands for Node.js.
import { PutObjectCommand } from "@aws-sdk/client-s3";

// Set the parameters.
const path = require('path');
const fs = require('fs');


// Upload file to specified bucket.
export const uploadLog = async (bucket, moment, fileUp) => {
  try {
    const file = __dirname + `/../../logger/${fileUp}`; // Path to and name of object. For example '../myFiles/index.js'.
    const fileStream = fs.createReadStream(file);
    // Set the parameters
    let uploadParams = {
        Bucket: bucket,
        // Add the required 'Key' parameter using the 'path' module.
        Key: `${moment}/${path.basename(file)}`,
        // Add the required 'Body' parameter
        Body: fileStream,
    };
    const data = await s3Client.send(new PutObjectCommand(uploadParams));
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err);
  }
};

