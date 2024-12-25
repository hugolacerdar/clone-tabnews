import { Client } from "pg";

async function connect() {
  const client = new Client({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT,
  });

  await client.connect();
  return client;
}

async function query(queryObject) {
  const client = await connect();
  try {
    const result = await client.query(queryObject);

    return result;
  } finally {
    await client.end();
  }
}

export default { query };
