import { NextFunction } from "express";
import { PointlyRequest, PointlyResponse } from "../../types";
import { PointlyError } from "../core/errors";

export default function errorMiddleware(
	err: any,
	req: PointlyRequest,
	res: PointlyResponse,
	next: NextFunction
) {
	if (err instanceof PointlyError) {
		return res.status(400).json({ error: err.message });
	}
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
}
