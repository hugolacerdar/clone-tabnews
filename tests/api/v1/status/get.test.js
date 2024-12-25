test("GET /api/v1/status returns 200", async () => {
  const response = await fetch(`http://localhost:3000/api/v1/status`);

  await response;
  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe(
    "application/json; charset=utf-8",
  );
  const body = await response.json();
  expect(body).toEqual({ status: "healthy" });
});
