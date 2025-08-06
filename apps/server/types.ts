import { Request, Response } from "express";

export type PointlyRequestContext = {
	pagination: { take: number; skip: number; page: number };
	correlationId: string;
	user?: { id: string; email: string; name: string };
};

export interface PointlyRequest extends Request {
	context?: PointlyRequestContext;
}

export interface PointlyResponse extends Response {
	json: (body: any) => this;
	status: (code: number) => this;
}

export function createContextDefaults(): PointlyRequestContext {
	return {
		pagination: { take: 10, skip: 0, page: 0 },
		correlationId: "",
		user: undefined
	};
}

export function assignContextDefaults(
	req: PointlyRequest,
	context: Partial<PointlyRequestContext>
): PointlyRequest {
	req.context = {
		...createContextDefaults(),
		...req.context,
		...context
	};
	return req;
}
