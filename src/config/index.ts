
import dotenv from "dotenv";
import * as AWS from "aws-sdk"; 

dotenv.config();

AWS.config.update({
  region: process.env.AWS_REGION!,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
});

export const dynamoDB = new AWS.DynamoDB.DocumentClient();
