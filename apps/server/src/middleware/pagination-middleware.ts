import { NextFunction, Response } from "express";
import z from "zod";
import { assignContextDefaults, PointlyRequest } from "../../types";

const PaginationSchema = z.object({
	take: z.coerce.number().int().min(1).default(10),
	skip: z.coerce.number().int().min(0).default(0)
});

export default function paginationMiddleware(
	req: PointlyRequest,
	res: Response,
	next: NextFunction
) {
	const result = PaginationSchema.safeParse(req.query);

	if (!result.success) {
		return res.status(400).json({ error: z.treeifyError(result.error) });
	}

	assignContextDefaults(req, { pagination: result.data });

	next();
}

export function toPrismaOptions(pagination: z.infer<typeof PaginationSchema>) {
	const { take, skip } = pagination;

	return {
		skip,
		take
	};
}
