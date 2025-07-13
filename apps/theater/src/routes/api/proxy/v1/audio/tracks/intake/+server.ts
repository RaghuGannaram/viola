import { Buffer } from "buffer";
import type { RequestHandler } from "@sveltejs/kit";
import FormData from "form-data";
import { createProxyService } from "$lib/services/http/proxy.service";
import { BACKEND_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const POST: RequestHandler = async (event) => {
	const proxy = createProxyService(event);
	const form = await event.request.formData();

	const file = form.get("file") as File;
	const musicContentType = form.get("musicContentType") as string;
	const artworkContentType = form.get("artworkContentType") as string;

	if (!file || !(file instanceof File)) {
		return new Response("No file uploaded", { status: 400 });
	}

	const arrayBuffer = await file.arrayBuffer();
	const fileBuffer = Buffer.from(arrayBuffer);

	const backendForm = new FormData();
	backendForm.append("file", fileBuffer, { filename: file.name, contentType: file.type || "application/octet-stream" });
	backendForm.append("title", (form.get("title") as string) || "");
	backendForm.append("album", (form.get("album") as string) || "");
	backendForm.append("artists", (form.get("artists") as string) || "");
	backendForm.append("musicContentType", musicContentType);
	if (artworkContentType) {
		backendForm.append("artworkContentType", artworkContentType);
	}

	const { status, body, cookies } = await proxy.forward("POST", BACKEND_ENDPOINTS.AUDIO.INTAKE, backendForm);

	const headers = new Headers();
	for (const cookie of cookies) {
		headers.append("set-cookie", cookie.replace("Path=/api/v1/audio/", "Path=/"));
	}

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
