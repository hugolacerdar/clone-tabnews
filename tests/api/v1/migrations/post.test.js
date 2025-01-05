import orchestrator from "tests/orchestrator.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.cleanDatabase();
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const response = await fetch(
          `http://localhost:3000/api/v1/migrations`,
          {
            method: "POST",
          },
        );

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
      test("Before the first time", async () => {
        await fetch(`http://localhost:3000/api/v1/migrations`, {
          method: "POST",
        });

        const secondTimeResponse = await fetch(
          `http://localhost:3000/api/v1/migrations`,
          {
            method: "POST",
          },
        );

        expect(secondTimeResponse.status).toBe(200);

        const secondTimeResponseBody = await secondTimeResponse.json();

        expect(Array.isArray(secondTimeResponseBody)).toBe(true);
        expect(secondTimeResponseBody.length).toBe(0);
      });
    });
  });
});
