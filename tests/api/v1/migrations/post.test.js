import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
});

test("GET /api/v1/migrations returns 200", async () => {
  const response = await fetch(`http://localhost:3000/api/v1/migrations`, {
    method: "POST",
  });

  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);

  const secondResponse = await fetch(
    `http://localhost:3000/api/v1/migrations`,
    {
      method: "POST",
    },
  );

  expect(secondResponse.status).toBe(200);

  const secondResponseBody = await secondResponse.json();

  expect(Array.isArray(secondResponseBody)).toBe(true);
  expect(secondResponseBody.length).toBe(0);
});
