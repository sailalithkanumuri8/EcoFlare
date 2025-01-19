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

    const model = new sst.aws.Function("ModelBackend", {
      handler: "model-backend/python.handler",
      runtime: "python3.12",
      url: true,
      python: { container: true },
    });

    const bucket = new sst.aws.Bucket("Bucket");
    bucket.subscribe(
      {
        handler: "backend/src/subscriber.handler",
        link: [bucket, database, model],
      },
      {
        events: ["s3:ObjectCreated:*"],
      },
    );

    const backend = new sst.aws.Function("Backend", {
      url: true,
      handler: "backend/src/hono.handler",
      link: [database, bucket],
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
