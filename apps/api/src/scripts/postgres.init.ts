import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import pool from "../configs/postgres.config";

async function initPostgresDB() {
	console.log("🔄 Initializing PostgreSQL database...");
	console.log("🌐 POSTGRES_URL:", process.env.POSTGRES_URL);

	try {
		const sql = fs.readFileSync(path.join(__dirname, "../database/postgres.schema.sql"), "utf-8");
		await pool.query(sql);

		console.log("✅ Tables created successfully in PostgreSQL database.");

		process.exit(0);
	} catch (err) {
		console.error("❌ Failed to initialize PostgreSQL database:", err);

		process.exit(1);
	}
}

initPostgresDB();
