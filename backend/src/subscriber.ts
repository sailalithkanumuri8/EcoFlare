import type { S3Event } from "aws-lambda";
import { db, image } from "./db";
import { eq } from "drizzle-orm";
import { Resource } from "sst";

export const handler = async (e: S3Event) => {
  const record = e.Records[0];

  const resp = await fetch(
    `${Resource.ModelBackend.url}/${record.s3.object.key}`,
  );

  const n = parseFloat(await resp.text());
  console.log(n);

  await db
    .update(image)
    .set({
      deadTrees: n,
    })
    .where(eq(image.id, record.s3.object.key));
};
