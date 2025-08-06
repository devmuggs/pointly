import { randomUUID } from "crypto";
import { NextFunction, Response } from "express";
import { assignContextDefaults, PointlyRequest } from "../../types";

export default function loggerMiddleware(req: PointlyRequest, res: Response, next: NextFunction) {
	const correlationId = `${req.headers["x-correlation-id"] || randomUUID()}`;

	const start = Date.now();
	const { method, url } = req;

	res.on("finish", () => {
		const duration = Date.now() - start;
		console.log(`${method} ${url} ${res.statusCode} - ${duration}ms`);
	});

	assignContextDefaults(req, { correlationId });

	next();
}
