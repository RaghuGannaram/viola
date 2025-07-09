export class ViolaHttpError extends Error {
	status: number;
	type: string;
	reason: Error | string;

	constructor(status: number, message: string, type: string, reason: Error | string) {
		super(message);

		this.name = this.constructor.name;
		this.status = status;
		this.type = type;
		this.reason = reason;
	}
}
