export function logError(label: string, err: unknown) {
	const isDev = import.meta.env.MODE === "development";

	if (!isDev) return;

	console.error(`${label}:`, JSON.stringify(err, null, 4));
}
