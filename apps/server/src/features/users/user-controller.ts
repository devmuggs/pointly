import { PointlyRequest, PointlyResponse } from "../../../types";
import { UserSelectSchema, UserUpdateSchema } from "./user-schemas";
import { userService } from "./user-service";

export const userController = {
	fetchUsers: async (req: PointlyRequest, res: PointlyResponse) => {
		const users = await userService.fetchUsers(req.context);
		res.json(users);
	},

	fetchUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserSelectSchema.parse(req.params);
		const user = await userService.fetchUser(data, req.context);
		res.json(user);
	},

	updateUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserUpdateSchema.parse({
			...req.body,
			userId: req.params.userId
		});
		const user = await userService.updateUser(data, req.context);
		res.json(user);
	},

	deleteUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserSelectSchema.parse(req.params);
		await userService.deleteUser(data, req.context);
		res.status(204).send();
	}
};
