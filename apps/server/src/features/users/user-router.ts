import { Router } from "express";
import { userController } from "./user-controller";

// just doing placeholder, this will be replaced with actual logic later
// This is a placeholder for the user router, which will handle user-related routes

export const userRouter = Router();
export const authRouter = Router();

authRouter.post("/register", userController.registerUser);
authRouter.post("/login", userController.login);
authRouter.post("/logout", userController.logout);

userRouter.route("/").get(userController.fetchUsers).post(userController.registerUser);
userRouter
	.route("/:userId")
	.get(userController.fetchUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

// userRouter.route("/groups").get().post();
// userRouter.route("/groups/:groupId").get().patch().delete();

// userRouter.route("/cards").get().post();
// userRouter.route("/cards/:cardId").get().patch().delete();
// userRouter.route("/cards/:cardId/transactions").get().post();
// userRouter.route("/cards/:cardId/transactions/:transactionId").get().patch().delete();
