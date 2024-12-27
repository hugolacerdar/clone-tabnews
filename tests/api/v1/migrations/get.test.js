import { cleanDatabase } from "tests/utils";

beforeAll(cleanDatabase);

test("GET /api/v1/migrations returns 200", async () => {
  const response = await fetch(`http://localhost:3000/api/v1/migrations`);

  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(Array.isArray(responseBody)).toBe(true);
  expect(responseBody.length).toBeGreaterThan(0);
});
