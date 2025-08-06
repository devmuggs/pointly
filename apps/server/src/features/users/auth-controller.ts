import { HttpStatusCode } from "axios";
import { PointlyRequest, PointlyResponse } from "../../../types";
import { UserLoginSchema, UserRegistrationSchema } from "./user-schemas";
import { userService } from "./user-service";

const AuthControllerConfig = {
	authTokenName: "auth_token",
	cookieOptions: {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict"
	}
} as const;

function assignUserToCookie(userId: string, res: PointlyResponse): void {
	res.cookie(AuthControllerConfig.authTokenName, userId, AuthControllerConfig.cookieOptions);
}

export const authController = {
	registerUser: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserRegistrationSchema.parse(req.body);
		const user = await userService.registerUser(data, req.context);
		if (!user) {
			return res.status(HttpStatusCode.BadRequest).json({ error: "User already exists" });
		}
		assignUserToCookie(user.id, res);
		res.status(201).json(user);
	},

	login: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = UserLoginSchema.parse(req.body);
		const user = await userService.login(data, req.context);

		if (!user) {
			return res
				.status(HttpStatusCode.Unauthorized)
				.json({ error: "Invalid email or password" });
		}

		// set cookie
		assignUserToCookie(user.id, res);
		res.json(user);
	},

	logout: async (req: PointlyRequest, res: PointlyResponse) => {
		// Clear the auth token cookie
		res.clearCookie(AuthControllerConfig.authTokenName, AuthControllerConfig.cookieOptions);
		res.status(204).send();
	}
};
