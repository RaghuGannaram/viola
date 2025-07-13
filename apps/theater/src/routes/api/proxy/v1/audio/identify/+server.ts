import { Buffer } from "buffer";
import type { RequestHandler } from "@sveltejs/kit";
import FormData from "form-data";
import { createProxyService } from "$lib/services/http/proxy.service";
import { BACKEND_ENDPOINTS } from "$lib/services/http/shared/endpoints";

export const POST: RequestHandler = async (event) => {
	const proxy = createProxyService(event);
	const form = await event.request.formData();

	const file = form.get("file") as File;

	if (!file || !(file instanceof File)) {
		return new Response("No file uploaded", { status: 400 });
	}

	const arrayBuffer = await file.arrayBuffer();
	const fileBuffer = Buffer.from(arrayBuffer);

	const backendForm = new FormData();
	backendForm.append("file", fileBuffer, { filename: file.name, contentType: file.type || "application/octet-stream" });

	const { status, body, cookies } = await proxy.forward("POST", BACKEND_ENDPOINTS.AUDIO.IDENTIFY, backendForm);

	const headers = new Headers();
	for (const cookie of cookies) {
		headers.append("set-cookie", cookie.replace("Path=/api/v1/audio/", "Path=/"));
	}

	return new Response(JSON.stringify(body), {
		status,
		headers,
	});
};
