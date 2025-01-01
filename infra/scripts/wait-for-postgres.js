const { exec } = require("node:child_process");

function waitForPostgres() {
  exec(
    "docker exec postgres-dev pg_isready --host localhost",
    (error, stdout) => {
      if (stdout.search("accepting connections") === -1) {
        process.stdout.write(".");
        waitForPostgres();
        return;
      }
      console.log("\n\n✅ PostgreSQL is available!\n");
    },
  );
}

console.log("🔴 Waiting for PostgreSQL to become available...");
waitForPostgres();
