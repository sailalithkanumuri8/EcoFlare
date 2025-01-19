import type { S3Event } from "aws-lambda";
import { db, image } from "./db";
import { eq } from "drizzle-orm";
import * as tf from "@tensorflow/tfjs-node"

export const handler = async (e: S3Event) => {
  const record = e.Records[0];
  const model = tf.loadLayersModel("file://./model/model.json")
  await db
    .update(image)
    .set({
      deadTrees: Math.random(),
    })
    .where(eq(image.id, record.s3.object.key));
};
