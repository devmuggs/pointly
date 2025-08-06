import { User } from "../../../generated/prisma";
import { UserJson } from "./user-schemas";

export const userDto = {
	toSafe: (user: User | null): UserJson | null => {
		if (!user) return null;
		const { password, email, ...safe } = user;
		return safe;
	}
};
