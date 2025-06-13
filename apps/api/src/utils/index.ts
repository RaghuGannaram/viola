import crypto from "crypto";

type Data = Record<string, any>;

function hideSensitiveInfo<T extends Data>(data: T, ...sensitiveInfo: (keyof T)[]): Partial<T> {
	let clone: Partial<T> = {};
	for (let key of Object.keys(data) as (keyof T)[]) {
		if (!sensitiveInfo.includes(key)) {
			clone[key] = data[key];
		}
	}
	return clone;
}

function sanitizeFilename(filename: string): string {
	return filename
		.normalize("NFKD")
		.replace(/\s+/g, "-")
		.replace(/[^a-zA-Z0-9\-\.]/g, "")
		.slice(0, 50)
		.toLowerCase();
}

function generateRandomName(length: number): string {
	return crypto.randomBytes(length).toString("hex");
}

export { hideSensitiveInfo, sanitizeFilename, generateRandomName };
