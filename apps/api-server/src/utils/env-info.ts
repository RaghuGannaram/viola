import { LogLevel, ErrorExposureDepth } from "@src/types/index";

export function getCurrentEnv(): "development" | "production" {
    return process.env["NODE_ENV"] || "development";
}

export function getCurrentPort(): number {
    return Number(process.env["PORT"]) || 5000;
}

export function getAPIGatewayURL(): string {
    return process.env["API_GATEWAY_URL"] || "*";
}


export function getLogLevel(): LogLevel {
    return (process.env["LOG_LEVEL"] as LogLevel) || LogLevel.INFO;
}

export function getErrorExposureDepth(): ErrorExposureDepth {
    return (process.env["ERROR_EXPOSURE_DEPTH"] as ErrorExposureDepth) || ErrorExposureDepth.BUSINESS;
}
