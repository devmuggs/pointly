import { HttpStatusCode } from "axios";
import { PointlyRequest, PointlyRequestContext, PointlyResponse } from "../../../types";
import { UserSelectSchema } from "../users/user-schemas";
import { GroupAddUserSchema, GroupCreateSchema, GroupSelectSchema } from "./group-schemas";
import { groupService } from "./groups-service";

function withAuthorisationHOF(
	handler: (
		req: PointlyRequest & {
			context: PointlyRequestContext & { user: NonNullable<PointlyRequestContext["user"]> };
		},
		res: PointlyResponse
	) => Promise<void>
) {
	return async (req: PointlyRequest, res: PointlyResponse) => {
		if (!req.context?.user) {
			return res.status(HttpStatusCode.Unauthorized).send("Unauthorized");
		}

		return handler(
			req as PointlyRequest & {
				context: PointlyRequestContext & {
					user: NonNullable<PointlyRequestContext["user"]>;
				};
			},
			res
		);
	};
}

export type PointlyRequestHandler = (req: PointlyRequest, res: PointlyResponse) => Promise<void>;

class GroupController {
	// Group Management
	public fetchGroups = async (req: PointlyRequest, res: PointlyResponse) => {
		const groups = await groupService.fetchGroups(req.context);
		res.json(groups);
	};

	public fetchGroup = async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.params);
		const group = await groupService.fetchGroup(data, req.context);
		res.json(group);
	};

	public updateGroup = async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.body);
		const updatedGroup = await groupService.updateGroup(data, req.context);
		res.json(updatedGroup);
	};

	public deleteGroup = async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.params);
		await groupService.deleteGroup(data, req.context);
		res.sendStatus(204);
	};

	public createGroup = withAuthorisationHOF(async (req, res) => {
		const data = GroupCreateSchema.parse(req.body);
		const userData = { id: req.context.user.id };

		const newGroup = await groupService.createGroup(
			{ user: userData, group: data },
			req.context
		);

		res.status(201).json(newGroup);
	});

	// Group User Management
	public fetchGroupUsers = async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.params);
		const users = await groupService.fetchGroupUsers(data, req.context);
		res.json(users);
	};

	public addGroupUser = async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupAddUserSchema.parse(req.params);

		const newUser = await groupService.addGroupUser(data, req.context);

		res.status(201).json(newUser);
	};

	public removeGroupUser = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};

	// Group Currency Management
	public fetchGroupCurrencies = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};

	public addGroupCurrency = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};

	public deleteGroupCurrency = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};

	// Group Purchasable Management
	public fetchGroupPurchasable = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};

	public addGroupPurchasable = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};

	public deleteGroupPurchasable = async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(HttpStatusCode.NotImplemented);
	};
}

export const groupsController = new GroupController();
