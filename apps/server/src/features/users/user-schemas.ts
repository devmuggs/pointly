import z from "zod";

const userConfig = {
	password: { length: { min: 8, max: 128 } },
	name: { length: { min: 2, max: 100 }, regex: /^[a-zA-Z0-9_ -]+$/ }
};

export const UserSchema = z.object({
	id: z.uuid(),
	email: z.email().trim(),
	name: z
		.string()
		.trim()
		.min(userConfig.name.length.min)
		.max(userConfig.name.length.max)
		.regex(userConfig.name.regex, {
			message: "Name can only contain letters, numbers, spaces, underscores, and hyphens"
		}),
	createdAt: z.date(),
	updatedAt: z.date(),
	password: z
		.string()
		.trim()
		.min(userConfig.password.length.min)
		.max(userConfig.password.length.max)
});

export const UserSelectSchema = UserSchema.pick({
	id: true
});

export const UserRegistrationSchema = UserSchema.pick({
	email: true,
	password: true,
	name: true
});

export const UserLoginSchema = UserSchema.pick({
	email: true,
	password: true
});

export const UserUpdateSchema = UserSchema.pick({
	email: true,
	name: true,
	password: true
})
	.partial()
	.extend(UserSelectSchema.shape)
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update"
	});

export const UserJsonSchema = UserSchema.omit({ password: true, email: true }).refine((data) => {
	return {
		...data,
		createdAt: data.createdAt.toISOString(),
		updatedAt: data.updatedAt.toISOString()
	};
});

export type UserSelect = z.infer<typeof UserSelectSchema>;
export type UserRegistration = z.infer<typeof UserRegistrationSchema>;
export type UserLogin = z.infer<typeof UserLoginSchema>;
export type UserUpdate = z.infer<typeof UserUpdateSchema>;
export type UserJson = z.infer<typeof UserJsonSchema>;
