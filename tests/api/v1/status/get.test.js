import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
}, 30000);

test("GET /api/v1/status returns 200", async () => {
  const response = await fetch(`http://localhost:3000/api/v1/status`);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe(
    "application/json; charset=utf-8",
  );
  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();
  expect(responseBody.updated_at).not.toBeNull();
  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parsedUpdatedAt).toEqual(responseBody.updated_at);

  expect(responseBody.dependencies.database).toBeDefined();
  expect(responseBody.dependencies.database.version).toEqual("16.0");
  expect(responseBody.dependencies.database.max_connections).toEqual(100);
  expect(responseBody.dependencies.database.active_connections).toEqual(1);
});
