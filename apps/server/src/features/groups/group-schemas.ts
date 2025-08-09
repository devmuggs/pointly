import z from "zod";
import { $Enums } from "../../../generated/prisma";
import { UserSelectSchema } from "../users/user-schemas";

export const GroupSchemaBase = z.object({
	id: z.uuid(),
	name: z.string().min(1, "Group name is required"),
	description: z.string().optional()
});

export const GroupCreateSchema = GroupSchemaBase.omit({ id: true });
export const GroupUpdateSchema = GroupSchemaBase.partial().extend({
	id: z.uuid()
});
export const GroupSelectSchema = GroupSchemaBase.pick({
	id: true
});

export const GroupMembershipSchema = UserSelectSchema.extend(GroupSelectSchema.shape).extend({
	role: z.enum($Enums.GroupRole).default("MEMBER")
});

export const GroupAddUserSchema = GroupSelectSchema.extend({
	user: UserSelectSchema,
	role: z.enum($Enums.GroupRole).default("MEMBER")
});

export type GroupCreate = z.infer<typeof GroupCreateSchema>;
export type GroupUpdate = z.infer<typeof GroupUpdateSchema>;
export type GroupSelect = z.infer<typeof GroupSelectSchema>;
export type GroupMembership = z.infer<typeof GroupMembershipSchema>;
export type GroupAddUser = z.infer<typeof GroupAddUserSchema>;
