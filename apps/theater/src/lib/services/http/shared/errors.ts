export function formatError(error: any): string {
	if (error.response?.data?.message) {
		return error.response.data.message;
	}
	return "An unexpected error occurred";
}
