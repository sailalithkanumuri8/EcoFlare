import { drizzle } from "drizzle-orm/libsql/node";
import * as t from "drizzle-orm/sqlite-core";
import { Resource } from "sst";

export const db = drizzle({
  connection: {
    url: Resource.Database.url,
    authToken: Resource.Database.token,
  },
});

export const image = t.sqliteTable("image", {
  id: t.text().notNull().primaryKey(),
  status: t.text().$type<"loading" | "processing" | "processed">(),
  deadTrees: t.real()
});
