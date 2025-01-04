const { exec, spawn } = require("node:child_process");

const runCommand = (command, description) => {
  // eslint-disable-next-line no-undef
  return new Promise((resolve, reject) => {
    console.log(`\n⏳ ${description}...`);
    const child = exec(command, { stdio: "inherit" });

    child.stdout?.on("data", (data) => process.stdout.write(data));
    child.stderr?.on("data", (data) => process.stderr.write(data));

    child.on("exit", (code) => {
      if (code === 0) {
        console.log(`\n✅ Success: ${description}`);
        resolve();
      } else {
        console.error(`\n❌ Failed: ${description} with exit code ${code}`);
        reject(new Error(`${description} failed with exit code ${code}`));
      }
    });
  });
};

(async () => {
  let cleanupCalled = false; // Flag to ensure cleanup is only called once

  const cleanup = () => {
    if (cleanupCalled) return; // Skip if already called
    cleanupCalled = true;

    console.log("\n🧹 Cleaning up resources...");
    exec("npm run services:stop", (err) => {
      if (err) {
        console.error("\n❌ Cleanup script failed:", err);
      } else {
        console.log("\n✅ Cleanup completed successfully!");
      }
      process.exit();
    });
  };

  try {
    // Step 1: Start services
    await runCommand("npm run services:up", "Starting necessary services...");

    // Step 2: Wait for database
    await runCommand(
      "npm run services:wait:database",
      "Waiting for the database to become available...",
    );

    // Step 3: Run migrations
    await runCommand(
      "npm run migrations:up",
      "Applying database migrations...",
    );

    // Step 4: Start the development server
    console.log("\n🚀 Starting the development server...\n");
    const devServer = spawn("npm", ["run", "next:run"], { stdio: "inherit" });

    devServer.on("exit", () => {
      console.log("\n🚀 Dev server exited. Triggering cleanup...");
      cleanup();
    });

    process.on("SIGINT", () => {
      console.log("\n⚡ Received SIGINT (Ctrl+C). Initiating cleanup...");
      cleanup();
    });

    process.on("SIGTERM", () => {
      console.log("\n⚡ Received SIGTERM. Initiating cleanup...");
      cleanup();
    });
  } catch (err) {
    console.error("\n💥 An error occurred during the dev setup:");
    console.error(err.message);
    process.exit(1); // Exit with error code
  }
})();
