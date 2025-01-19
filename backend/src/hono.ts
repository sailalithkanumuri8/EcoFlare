import { Hono } from "hono";
import { Resource } from "sst";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { handle } from "hono/aws-lambda";
import { db, image } from "./db";
import { and, gte, isNotNull } from "drizzle-orm";

const s3 = new S3Client();

const app = new Hono();

app.get("/upload_url", async (c) => {
  const id = crypto.randomUUID();
  const command = new PutObjectCommand({
    Key: id,
    Bucket: Resource.Bucket.name,
  });

  await db.insert(image).values({
    id,
  });

  return c.text(await getSignedUrl(s3, command));
});

app.get("/images", async (c) => {
  const date = new Date();
  date.setHours(date.getHours() - 1);
  const images = await db
    .select()
    .from(image)
    .where(and(gte(image.createdAt, date), isNotNull(image.deadTrees)));

  new Date().getTime();
  return c.json(images);
});

export const handler = handle(app);
