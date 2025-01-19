import type { S3Event } from "aws-lambda";
import { db, image } from "./db";
import { eq } from "drizzle-orm";

export const handler = async (e: S3Event) => {
  const record = e.Records[0];
  await db
    .update(image)
    .set({
      deadTrees: Math.random(),
    })
    .where(eq(image.id, record.s3.object.key));
};
