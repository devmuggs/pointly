import { createContextDefaults, PointlyRequestContext } from "../../../types";
import { PointlyError } from "../../core/errors";
import { Hasher } from "../../core/hash";
import prisma from "../../core/prisma";
import { toPrismaOptions } from "../../middleware/pagination-middleware";
import { userDto } from "./user-dto";
import { userRepo } from "./user-repo";
import { UserJson, UserLogin, UserRegistration, UserSelect, UserUpdate } from "./user-schemas";

export const userService = {
	login: async (
		data: UserLogin,
		ctx: PointlyRequestContext = createContextDefaults()
	): Promise<UserJson | null> => {
		const user = await userRepo.fetchUserByEmail(data.email);
		if (!user) return null;

		const isValid = await Hasher.compare({ hash: user.password, compare: data.password });
		if (!isValid) return null;

		return userDto.toSafe(user);
	},

	fetchUsers: async (
		ctx: PointlyRequestContext = createContextDefaults()
	): Promise<UserJson[]> => {
		const users = await prisma.user.findMany({
			...toPrismaOptions(ctx.pagination)
		});

		return users.map(userDto.toSafe).filter((user): user is UserJson => user !== null);
	},

	registerUser: async (
		data: UserRegistration,
		ctx: PointlyRequestContext = createContextDefaults()
	): Promise<UserJson | null> => {
		const existingUser = await userRepo.fetchUserByEmail(data.email);
		if (existingUser) throw new PointlyError("User already exists");

		const hashedPassword = await Hasher.hash(data.password);
		const user = await userRepo.createUser({ ...data, password: hashedPassword });

		return userDto.toSafe(user);
	},

	fetchUser: async (
		data: UserSelect,
		ctx: PointlyRequestContext = createContextDefaults()
	): Promise<UserJson | null> => {
		const user = await userRepo.fetchUserById(data.id);
		return userDto.toSafe(user);
	},

	updateUser: async (
		data: UserUpdate,
		ctx: PointlyRequestContext = createContextDefaults()
	): Promise<UserJson | null> => {
		if (ctx.user?.id !== data.id) throw new PointlyError("Cannot update another user");
		const user = await userRepo.updateUser(data);
		return userDto.toSafe(user);
	},

	deleteUser: async (data: UserSelect, ctx: PointlyRequestContext = createContextDefaults()) => {
		if (ctx.user?.id !== data.id) throw new PointlyError("Cannot delete another user");
		await userRepo.deleteUser(data);
		return { success: true, message: "User deleted successfully" };
	}
};
