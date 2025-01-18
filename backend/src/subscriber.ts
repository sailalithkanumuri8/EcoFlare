import type { S3Event } from "aws-lambda";

export const handler = async (e: S3Event) => {
  console.log(e.Records[0]);
};
