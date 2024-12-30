import retry from "async-retry";
import database from "infra/database";

async function waitForAllServices() {
  await waitForWebServer();

  async function waitForWebServer() {
    retry(fetchStatusPage, { retries: 100 });

    async function fetchStatusPage() {
      const response = await fetch(`http://localhost:3000/api/v1/status`);
      if (response.status !== 200) {
        throw new Error("Status page not ready");
      }
    }
  }
}

async function cleanDatabase() {
  await database.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
}

export default { waitForAllServices, cleanDatabase };
