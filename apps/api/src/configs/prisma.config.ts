import { PrismaClient } from "@prisma/client";
import logger from "@src/configs/logger.config";
import { getCurrentEnv } from "@src/utils/env-info";
import chalk from "chalk";

const currentEnv = getCurrentEnv();

const prisma = new PrismaClient({
	log: [
		{ level: "query", emit: "event" },
		{ level: "info", emit: "event" },
		{ level: "warn", emit: "event" },
		{ level: "error", emit: "event" },
	],
});

async function initializePrisma() {
	try {
		const now = await prisma.$queryRaw`SELECT NOW()`;
		logger.info(`prisma: connected to database at ${chalk.grey("%s")}`, (now as any)[0].now);
		logger.info(`prisma: environment = ${chalk.cyan(currentEnv)}`);
	} catch (err) {
		logger.error("prisma: unable to connect to the database ❌", err);
		throw new Error("prisma: unable to connect to the database");
	}
}

initializePrisma();

prisma.$on("query", (event) => {
	logger.debug(`prisma:  ${event.query} — ${event.params} ⏱ ${event.duration}ms`);
});

prisma.$on("info", (event) => {
	logger.info(`prisma:  ${event.message}`);
});

prisma.$on("warn", (event) => {
	logger.warn(`prisma:  ${event.message}`);
});

prisma.$on("error", (event) => {
	logger.error(`prisma:  ${event.message}`);
});

process.on("SIGINT", async () => {
	logger.warn("prisma: shutting down gracefully... 🟥");
	await prisma.$disconnect();
	process.exit(0);
});

export default prisma;
