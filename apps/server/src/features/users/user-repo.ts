import { User } from "../../../generated/prisma";
import { PointlyRequestContext } from "../../../types";
import prisma from "../../core/prisma";
import { toPrismaOptions } from "../../middleware/pagination-middleware";
import { userDto } from "./user-dto";
import { UserRegistration, UserSelect, UserUpdate } from "./user-schemas";

export const userRepo = {
	async fetchUserByEmail(email: string) {
		const user = await prisma.user.findUnique({
			where: { email }
		});
		return user;
	},

	async createUser(data: UserRegistration) {
		const user = await prisma.user.create({
			data: {
				email: data.email,
				name: data.name,
				password: data.password // Ensure to hash the password before storing it
			}
		});
		return user;
	},

	async fetchUserById(id: User["id"]) {
		const user = await prisma.user.findUnique({
			where: { id }
		});
		return user;
	},

	async fetchUsers({ pagination }: Pick<PointlyRequestContext, "pagination">) {
		const users = await prisma.user.findMany({
			...toPrismaOptions(pagination)
		});

		return users.map(userDto.toSafe);
	},

	async updateUser(data: UserUpdate) {
		const user = await prisma.user.update({
			where: { id: data.id },
			data: {
				email: data.email,
				name: data.name,
				password: data.password
			}
		});
		return user;
	},

	async deleteUser(data: UserSelect) {
		await prisma.user.delete({
			where: { id: data.id }
		});
	}
};
