import { Router } from "express";
import { authController } from "./auth-controller";
import { userController } from "./user-controller";
import { userGroupController } from "./userGroups/user-group-controller";

// just doing placeholder, this will be replaced with actual logic later
// This is a placeholder for the user router, which will handle user-related routes

export const userRouter = Router();
export const authRouter = Router();

authRouter.post("/register", authController.registerUser);
authRouter.post("/login", authController.login);
authRouter.post("/logout", authController.logout);

userRouter.route("/").get(userController.fetchUsers);
userRouter
	.route("/:id")
	.get(userController.fetchUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

userRouter
	.route("/:id/groups")
	.get(userGroupController.fetchUserGroups)
	.post(userGroupController.createUserGroup);
