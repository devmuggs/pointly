import { PointlyRequest, PointlyResponse } from "../../../types";
import {
	UserLoginSchema,
	UserRegistrationSchema,
	UserSelectSchema,
	UserUpdateSchema
} from "./user-schemas";
import { userService } from "./user-service";

export const userController = {
	fetchUsers: async (req: PointlyRequest, res: PointlyResponse) => {
		const users = await userService.fetchUsers(req.context);
		res.json(users);
	},

	registerUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserRegistrationSchema.parse(req.body);
		const user = await userService.registerUser(data, req.context);
		res.status(201).json(user);
	},

	fetchUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserSelectSchema.parse(req.params);
		const user = await userService.fetchUser(data, req.context);
		res.json(user);
	},

	updateUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserUpdateSchema.parse(req.body);
		const user = await userService.updateUser(data, req.context);
		res.json(user);
	},

	deleteUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserSelectSchema.parse(req.params);
		await userService.deleteUser(data, req.context);
		res.status(204).send();
	},

	login: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserLoginSchema.parse(req.body);
		const user = await userService.login(data, req.context);

		if (!user) {
			return res.status(401).json({ error: "Invalid email or password" });
		}

		// set cookie
		res.cookie("auth_token", user.id, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict"
		});

		res.json(user);
	},

	logout: async (req: PointlyRequest, res: PointlyResponse) => {
		// Clear the auth token cookie
		res.clearCookie("auth_token");
		res.status(204).send();
	}
};
