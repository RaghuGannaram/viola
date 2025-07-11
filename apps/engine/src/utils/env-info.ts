import { LogLevel, ErrorExposureDepth, CacheProvider, type CacheParams } from "@src/types/index";

export function getMongoUrl(): string {
	return process.env["MONGODB_URL"];
}

export function getPostgresUrl(): string {
	return process.env["POSTGRES_URL"];
}

export function getCacheProvider(): CacheProvider {
	return process.env["CACHE_PROVIDER"] as CacheProvider;
}

export function getCacheParams(type: CacheProvider): CacheParams {
	switch (type) {
		case CacheProvider.REDIS:
			return {
				host: process.env["REDIS_HOST"],
				port: Number(process.env["REDIS_PORT"]),
				username: process.env["REDIS_USERNAME"],
				password: process.env["REDIS_PASSWORD"],
			};

		case CacheProvider.UPSTASH:
			return {
				rest_url: process.env["UPSTASH_REDIS_REST_URL"],
				token: process.env["UPSTASH_REDIS_REST_TOKEN"],
			};

		default:
			throw new Error("Invalid cache type");
	}
}

export function getAWSParams(): {
	accessKey: string;
	secretAccessKey: string;
	region: string;
	bucket: string;
	signedUrlValidity: string;
	cloudFrontUrl: string;
} {
	return {
		accessKey: process.env["AWS_ACCESS_KEY"],
		secretAccessKey: process.env["AWS_SECRET_ACCESS_KEY"],
		region: process.env["AWS_BUCKET_REGION"],
		bucket: process.env["AWS_BUCKET_NAME"],
		signedUrlValidity: process.env["AWS_SIGNED_URL_EXPIRATION"],
		cloudFrontUrl: process.env["AWS_CLOUD_FRONT_URL"],
	};
}

export function getJWTInfo(): {
	accessTokenSecret: string;
	refreshTokenSecret: string;
	accessTokenValidity: string;
	refreshTokenValidity: string;
	refreshTokenMaxAge: string;
} {
	return {
		accessTokenSecret: process.env["ACCESS_TOKEN_SECRET"],
		refreshTokenSecret: process.env["REFRESH_TOKEN_SECRET"],
		accessTokenValidity: process.env["ACCESS_TOKEN_VALIDITY"],
		refreshTokenValidity: process.env["REFRESH_TOKEN_VALIDITY"],
		refreshTokenMaxAge: process.env["REFRESH_TOKEN_MAX_AGE"],
	};
}

export function getAPIGatewayURL(): string {
	const apiGatewayDevURL = process.env["API_GATEWAY_DEV_URL"];
	const apiGatewayProdURL = process.env["API_GATEWAY_PROD_URL"];

	return process.env["NODE_ENV"] === "production" ? apiGatewayProdURL : apiGatewayDevURL;
}

export function getCurrentEnv(): "development" | "production" {
	return process.env["NODE_ENV"] || "development";
}

export function getCurrentPort(): number {
	return Number(process.env["PORT"]) || 5000;
}

export function getLogLevel(): LogLevel {
	return (process.env["LOG_LEVEL"] as LogLevel) || LogLevel.INFO;
}

export function getErrorExposureDepth(): ErrorExposureDepth {
	return (process.env["ERROR_EXPOSURE_DEPTH"] as ErrorExposureDepth) || ErrorExposureDepth.BUSINESS;
}
