import database from "infra/database.js";

async function status(request, response) {
  await database.query("SELECT 1;");
  return response.json({ status: "healthy" });
}

export default status;
