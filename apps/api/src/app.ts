import api_v1 from "@src/api/v1";
import customErrorHandler from "@src/middlewares/custom-error-handler.middleware";
import defaultMiddleware from "@src/middlewares/default.middleware";
import morganMiddleware from "@src/middlewares/morgan.middleware";
import { getAPIGatewayURL } from "@src/utils/env-info";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Request, type Response } from "express";
import helmet from "helmet";

import logger from "./configs/logger.config";

import "@src/configs/session.config";
import "@src/configs/mongo.config";
import "@src/configs/prisma.config";

const app: express.Application = express();

const apiGatewayURL = getAPIGatewayURL();
const corsOptions = {
	origin: apiGatewayURL,
	credentials: true,
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/health-check", (_req: Request, res: Response) => {
	logger.info("Health check");
	res.status(200).json({ message: "OK" });
});

app.use("/api/v1", api_v1);

app.use(defaultMiddleware);
app.use(customErrorHandler);

export default app;
