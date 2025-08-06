import express, { NextFunction } from "express";

import { PointlyRequest, PointlyResponse } from "../types";
import { PointlyError } from "./core/errors";
import { authRouter, userRouter } from "./features/users/user-router";
import loggerMiddleware from "./middleware/logger-middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.use("/", authRouter);
app.use("/users", userRouter);

app.get("/status", (req: PointlyRequest, res: PointlyResponse) => {
	const routes: Array<{ method: string; path: string }> = [];
	app._router.stack.forEach((middleware: any) => {
		if (middleware.route) {
			// routes registered directly on the app
			const methods = Object.keys(middleware.route.methods);
			methods.forEach((method) => {
				routes.push({ method: method.toUpperCase(), path: middleware.route.path });
			});
		} else if (middleware.name === "router" && middleware.handle.stack) {
			// routes added via router.use()
			middleware.handle.stack.forEach((handler: any) => {
				if (handler.route) {
					const methods = Object.keys(handler.route.methods);
					methods.forEach((method) => {
						routes.push({ method: method.toUpperCase(), path: handler.route.path });
					});
				}
			});
		}
	});
	res.json({ status: "OK", routes });
});

// ...existing code...
// error handling middleware
app.use((err: any, req: PointlyRequest, res: PointlyResponse, next: NextFunction) => {
	if (err instanceof PointlyError) {
		return res.status(400).json({ error: err.message });
	}
	console.error(err);
	res.status(500).json({ error: "Internal Server Error" });
});

app.listen(3000, () => {
	console.log("Server is running on port 3000");
});
