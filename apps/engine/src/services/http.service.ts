import logger from "@src/configs/logger.config";
import axios, { type AxiosInstance } from "axios";
import axiosRetry from "axios-retry";

const createHttpClient = (baseURL: string, timeout = 10000): AxiosInstance => {
	const instance = axios.create({
		baseURL,
		timeout,
		headers: {
			"User-Agent": "Viola-Backend/1.0",
		},
	});

	axiosRetry(instance, {
		retries: 3,
		retryDelay: axiosRetry.exponentialDelay,
		retryCondition: (error) => axiosRetry.isNetworkOrIdempotentRequestError(error) || error.response?.status! >= 500,
	});

	instance.interceptors.request.use((config) => {
		const method = config.method?.toUpperCase();
		const url = config.url;

		logger.info(`[HTTP →] ${method} ${url}`);
		return config;
	});

	instance.interceptors.response.use(
		(response) => {
			const status = response.status;
			const statusText = response.statusText;
			const url = response.config.url;

			logger.info(`[HTTP ←] ${status} ${statusText} ${url}`);
			return response;
		},
		(error) => {
			const url = error.config?.url;

			const status = error.response?.status ?? "N/A";
			const message = error.message;

			logger.error(`[HTTP ✖] ${status} ${url}: ${message}`);
			return Promise.reject(error);
		},
	);

	return instance;
};

export default {
	createHttpClient,
};
