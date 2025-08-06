export class PointlyError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "PointlyError";
	}
}
