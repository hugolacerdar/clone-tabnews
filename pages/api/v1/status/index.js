import database from "infra/database.js";

export default async function status(request, response) {
  const updatedAt = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const { server_version: serverVersion } = databaseVersionResult.rows[0];

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const { max_connections: maxConnectionsValue } =
    databaseMaxConnectionsResult.rows[0];

  const databaseActiveConnectionsResult = await database.query(
    "SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = current_database();",
  );
  const { count: activeConnectionsValue } =
    databaseActiveConnectionsResult.rows[0];

  return response.json({
    updated_at: updatedAt,
    dependencies: {
      database: {
        version: serverVersion,
        max_connections: parseInt(maxConnectionsValue),
        active_connections: activeConnectionsValue,
      },
    },
  });
}
