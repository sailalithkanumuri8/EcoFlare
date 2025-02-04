/// <reference path="./.sst/platform/config.d.ts" />
export default $config({
  app(input) {
    return {
      name: "ecoflare",
      removal: "remove",
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

    const bucket = new sst.aws.Bucket("Bucket", { access: "public" });

    const vpc = new sst.aws.Vpc("MyVpc", {
      nat: "ec2",
      bastion: true,
    });
    const cluster = new sst.aws.Cluster("MyCluster", { vpc });

    const model = cluster.addService("ModelBackend", {
      dev: {
        url: "http://0.0.0.0:3000",
        command: "cargo run --release",
        directory: "./model-rs",
      },
      image: {
        dockerfile: "./model-rs/Dockerfile",
        context: "./model-rs",
      },
      environment: {
        BUCKET_NAME: bucket.name,
      },
      link: [bucket],
      loadBalancer: {
        ports: [{ listen: "3000/http" }],
        public: false,
      },
    });

    const backend = new sst.aws.Function("Backend", {
      url: true,
      handler: "backend/src/hono.handler",
      link: [database, bucket],
      nodejs: { install: ["@libsql/client", "@libsql/linux-x64-gnu"] },
    });

    bucket.subscribe(
      {
        handler: "backend/src/subscriber.handler",
        link: [bucket, database, model],
        nodejs: { install: ["@libsql/client", "@libsql/linux-x64-gnu"] },
        vpc,
      },
      {
        events: ["s3:ObjectCreated:*"],
      },
    );

    const site = new sst.aws.StaticSite("Site", {
      path: "frontend/",
      build: {
        command: "pnpm build",
        output: "dist",
      },
      environment: {
        VITE_PUBLIC_BACKEND_URL: backend.url,
        VITE_PUBLIC_BUCKET_URL: $interpolate`https://${bucket.name}.s3.us-east-1.amazonaws.com`,
      },
    });
  },
});
