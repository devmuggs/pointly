import express from "express";

import { PointlyRequest, PointlyResponse } from "../types";
import { authRouter, userRouter } from "./features/users/user-router";
import errorMiddleware from "./middleware/error-middleware";
import loggerMiddleware from "./middleware/logger-middleware";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.use("/", authRouter);
app.use("/users", userRouter);

app.get("/status", (req: PointlyRequest, res: PointlyResponse) => {
	const routes: Array<{ method: string; path: string }> = [];
	res.json({ status: "OK", routes });
});

app.use(errorMiddleware);

const ApplicationConfiguration = {
	port: 3000,
	databaseUrl: process.env.DATABASE_URL || "file:./dev.db"
} as const;

app.listen(ApplicationConfiguration.port, () => {
	console.log(`Server is running on port ${ApplicationConfiguration.port}`);
});
