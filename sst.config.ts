/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "ecoflare",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
      providers: {
        turso: {
          version: "0.2.3",
          organization: "rgodha",
          apiToken: process.env.TURSO_API_TOKEN,
        },
      },
    };
  },
  async run() {
    const group = await turso.getGroup({
      id: "group",
    });
    const db = new turso.Database("db", {
      group: group.id,
    });
    const database = new sst.Linkable("Database", {
      properties: {
        token: db.id.apply(
          async (id) => (await turso.getDatabaseToken({ id })).jwt,
        ),
        url: $interpolate`libsql://${db.id}-rgodha.aws-us-east-1.turso.io`,
      },
    });
    new sst.x.DevCommand("Studio", {
      link: [database],
      dev: {
        command: "pnpm drizzle-kit studio",
        autostart: true,
        directory: "backend",
      },
    });
    const bucket = new sst.aws.Bucket("Bucket");

    const model = new sst.aws.Function("ModelBackend", {
      handler: "bootstrap",
      architecture: "arm64",
      bundle: "model-rs/target/lambda/api",
      runtime: "provided.al2023",
      url: true,
      layers: ["arn:aws:lambda:us-east-1:634758516618:layer:onnx2:1"],
      link: [bucket],
      environment: {
        BUCKET_NAME: bucket.name,
      },
    });

    bucket.subscribe(
      {
        handler: "backend/src/subscriber.handler",
        link: [bucket, database, model],
        nodejs: { install: ["@libsql/client", "@libsql/linux-x64-gnu"] },
      },
      {
        events: ["s3:ObjectCreated:*"],
      },
    );

    const backend = new sst.aws.Function("Backend", {
      url: true,
      handler: "backend/src/hono.handler",
      link: [database, bucket],
      nodejs: { install: ["@libsql/client", "@libsql/linux-x64-gnu"] },
    });

    const site = new sst.aws.StaticSite("Site", {
      path: "frontend/",
      build: {
        command: "pnpm build",
        output: "dist",
      },
      environment: {
        VITE_PUBLIC_BACKEND_URL: backend.url,
      },
    });

    return {
      model: model.url,
    };
  },
});
