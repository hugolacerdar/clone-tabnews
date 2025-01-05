import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";

const ALLOWED_METHODS = ["GET", "POST"];

export default async function migrations(request, response) {
  if (!ALLOWED_METHODS.includes(request.method)) {
    return response.status(405).end();
  }

  let dbClient;

  try {
    dbClient = await database.getNewClient();

    const defaultMigrationOptions = {
      dbClient: dbClient,
      dir: resolve("infra", "migrations"),
      migrationsTable: "pgmigrations",
      verbose: true,
      direction: "up",
    };

    if (request.method === "GET") {
      const pendingMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: true,
      });

      return response.status(200).json(pendingMigrations);
    }

    if (request.method === "POST") {
      const executedMigrations = await migrationRunner({
        ...defaultMigrationOptions,
        dryRun: false,
      });

      const status_code = executedMigrations.length > 0 ? 201 : 200;
      return response.status(status_code).json(executedMigrations);
    }
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "Something went wrong" });
  } finally {
    if (dbClient) {
      await dbClient.end();
    }
  }
}
