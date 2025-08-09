import { $Enums } from "../../../generated/prisma";
import { createContextDefaults, PointlyRequestContext } from "../../../types";
import prisma from "../../core/prisma";
import { toPrismaOptions } from "../../middleware/pagination-middleware";
import { UserSelect } from "../users/user-schemas";
import { GroupAddUser, GroupCreate, GroupSelect, GroupUpdate } from "./group-schemas";

export const groupService = {
	createGroup: async (
		data: { user: UserSelect; group: GroupCreate },
		context: PointlyRequestContext = createContextDefaults()
	) => {
		const { user, group } = data;
		const newGroup = await prisma.group.create({
			data: {
				name: group.name,
				description: group.description ?? null,
				users: {
					create: {
						userId: user.id,
						role: "OWNER"
					}
				}
			}
		});

		return newGroup;
	},

	fetchGroup: async (
		data: GroupSelect,
		context: PointlyRequestContext = createContextDefaults()
	) => {
		const group = await prisma.group.findUnique({
			where: { id: data.id }
		});

		if (!group) throw new Error("Group not found");

		return group;
	},

	fetchGroups: async (context: PointlyRequestContext = createContextDefaults()) => {
		const groups = await prisma.group.findMany({
			...toPrismaOptions(context.pagination)
		});

		return groups;
	},

	updateGroup: async (
		data: GroupUpdate,
		context: PointlyRequestContext = createContextDefaults()
	) => {
		if (!context.user) throw new Error("Unauthorized");

		const updatedGroup = await prisma.group.update({
			where: {
				id: data.id,
				users: {
					some: {
						userId: context.user.id,
						role: { in: [$Enums.GroupRole.ADMIN, $Enums.GroupRole.OWNER] }
					}
				}
			},

			data: {
				name: data.name,
				description: data.description ?? null
			}
		});

		return updatedGroup;
	},

	deleteGroup: async (
		data: GroupSelect,
		context: PointlyRequestContext = createContextDefaults()
	) => {
		if (!context.user) throw new Error("Unauthorized");
		await prisma.group.delete({
			where: { id: data.id, users: { some: { userId: context.user.id, role: "OWNER" } } }
		});
	},

	fetchGroupUsers: async (
		data: GroupSelect,
		context: PointlyRequestContext = createContextDefaults()
	) => {
		const groups = await prisma.groupMembership.findMany({
			where: { groupId: data.id },
			...toPrismaOptions(context.pagination),
			include: { user: { select: { id: true, email: true, name: true } } }
		});

		return groups.map((gm) => gm.user);
	},

	addGroupUser: async (
		data: GroupAddUser,
		context: PointlyRequestContext = createContextDefaults()
	) => {
		if (!context.user) throw new Error("Unauthorized");

		const groupMembership = await prisma.groupMembership.create({
			data: {
				userId: data.user.id,
				groupId: data.id,
				role: data.role
			}
		});

		return groupMembership;
	}
};
