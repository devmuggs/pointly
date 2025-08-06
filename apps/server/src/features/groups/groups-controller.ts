import { PointlyRequest, PointlyResponse } from "../../../types";
import { GroupSelectSchema } from "./group-schemas";
import { groupService } from "./groups-service";

export const groupsController = {
	// Group Management
	fetchGroups: async (req: PointlyRequest, res: PointlyResponse) => {
		const groups = await groupService.fetchGroups(req.context);
		res.json(groups);
	},
	fetchGroup: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.params);
		const group = await groupService.fetchGroup(data, req.context);
		res.json(group);
	},
	updateGroup: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.body);
		const updatedGroup = await groupService.updateGroup(data, req.context);
		res.json(updatedGroup);
	},
	deleteGroup: async (req: PointlyRequest, res: PointlyResponse) => {
		const data = GroupSelectSchema.parse(req.params);
		await groupService.deleteGroup(data, req.context);
		res.sendStatus(204);
	},

	// Group User Management
	fetchGroupUsers: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},
	addGroupUser: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},
	removeGroupUser: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},

	// Group Currency Management
	fetchGroupCurrencies: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},
	addGroupCurrency: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},
	deleteGroupCurrency: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},

	// Group Purchasable Management
	fetchGroupPurchasable: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},
	addGroupPurchasable: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	},
	deleteGroupPurchasable: async (req: PointlyRequest, res: PointlyResponse) => {
		res.sendStatus(501);
	}
};
