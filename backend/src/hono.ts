import { Hono } from "hono";
import { Resource } from "sst";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { db, image } from "./db";

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
    status: "loading",
  });

  return c.text(await getSignedUrl(s3, command));
});

app.get("/images", async (c) => {
  const images = await db.select().from(image);
  return c.json(images);
});
