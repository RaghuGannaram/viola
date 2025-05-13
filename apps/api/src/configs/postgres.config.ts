import chalk from "chalk";
import { Pool, type PoolClient, type PoolConfig } from "pg";
import logger from "@src/configs/logger.config";
import { getPostgresUrl, getCurrentEnv } from "@src/utils/env-info";

const currentEnv = getCurrentEnv();
const dbUrl = getPostgresUrl();

const dbConfig: Record<string, PoolConfig> = {
	development: {
		max: 10,
		// connectionTimeoutMillis: 5000,
	},
	production: {
		max: 20,
		// connectionTimeoutMillis: 10000,
	},
};

const pool = new Pool({
	application_name: "viola-api",
	connectionString: dbUrl,
	ssl: { rejectUnauthorized: false },
	...dbConfig[currentEnv],
});

const client = await pool.connect();

const res = await client.query("SELECT NOW()");
logger.info(`postgres server: connected at : ${chalk.grey("%s")}`, res.rows[0]);

client.release();

logger.info("postgres server: initializing... ");

pool.on("connect", (client: PoolClient) => {
	logger.info(`postgres server: connected...🐘, client : ${chalk.grey("%s")}`, (client as any).processID);
});

pool.on("acquire", (client: PoolClient) => {
	logger.debug(`postgres server: connection acquired..., client : ${chalk.grey("%os")}`, (client as any).processID);
});

pool.on("remove", (client: PoolClient) => {
	logger.warn(`postgres server: connection removed, client : ${chalk.grey("%s")}`, (client as any).processID);
});

pool.on("error", (err) => {
	logger.error("postgres server: Unable to connect to the database", err);
	throw new Error("postgres server: Unable to connect to the database");
});

process.on("SIGINT", async () => {
	logger.error("postgres server: shutting down...🟥");
	await pool.end();
});

export default pool;
