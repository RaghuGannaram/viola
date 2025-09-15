import crypto from "crypto";
import path from "path";

import envAccess from "@src/configs/env.config";
import logger from "@src/configs/logger.config";
import httpService from "@src/services/http.service";
import type { AcrResponse } from "@src/types/audio.types";
import FormData from "form-data";

const { host, accessKey, accessSecret } = envAccess.acr.credentials();

const httpClient = httpService.createHttpClient(host, 20000);

async function identifyAudio(fileName: string, fileBuffer: Buffer) {
	const data = fileBuffer;

	logger.debug(`acr.service: identifying audio file: %s`, data.length);

	const http_method = "POST";
	const http_uri = "/v1/identify";
	const data_type = "audio";
	const signature_version = "1";
	const timestamp = Math.floor(Date.now() / 1000);

	const stringToSign = [http_method, http_uri, accessKey, data_type, signature_version, timestamp].join("\n");
	const signature = crypto.createHmac("sha1", accessSecret).update(Buffer.from(stringToSign, "utf-8")).digest().toString("base64");

	const form = new FormData();

	form.append("sample", data, {
		filename: path.basename(fileName),
		contentType: "application/octet-stream",
	});
	form.append("sample_bytes", data.length);
	form.append("data_type", data_type);
	form.append("access_key", accessKey);
	form.append("signature", signature);
	form.append("signature_version", signature_version);
	form.append("timestamp", timestamp.toString());

	try {
		const response = await httpClient.post(`https://${host}/v1/identify`, form, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			maxBodyLength: Infinity,
		});

		return response.data;
	} catch (err: any) {
		throw err;
	}
}

export function processAcrResponse(acr: AcrResponse) {
	const trackData = acr?.metadata?.music?.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		if ((b.duration_ms ?? 0) !== (a.duration_ms ?? 0)) return (b.duration_ms ?? 0) - (a.duration_ms ?? 0);

		if (!!b.label !== !!a.label) return !!b.label ? -1 : 1;

		return 0;
	})?.[0];

	if (!trackData) throw new Error("No track data found in ACR response.");

	const title = trackData.title;
	const duration = trackData.duration_ms;
	const album = trackData.album?.name ?? "Unknown Album";
	const artists = trackData.artists?.map((artist) => artist.name) ?? [];
	const genres = trackData.genres?.map((g) => g.name) ?? [];
	const label = trackData.label ?? "";
	const releaseDate = trackData.release_date ?? null;
	const acrid = trackData.acrid;

	return {
		title,
		duration,
		album,
		artists,
		genres,
		label,
		releaseDate,
		acrid,
	};
}

export default {
	identifyAudio,
	processAcrResponse,
};
