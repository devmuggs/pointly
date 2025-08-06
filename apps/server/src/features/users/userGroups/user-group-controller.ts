import { PointlyRequest, PointlyResponse } from "../../../../types";
import { logger } from "../../../core/logger";
import { GroupCreateSchema } from "../../groups/group-schemas";
import { groupService } from "../../groups/groups-service";
import { UserSelectSchema } from "../user-schemas";

export const userGroupController = {
	fetchUserGroups: async (req: PointlyRequest, res: PointlyResponse) => {
		logger.debug({
			subject: "userGroupController.fetchUserGroups",
			message: "Fetching user groups",
			ctx: req.context
		});

		const data = UserSelectSchema.parse(req.params);
		const groups = await groupService.fetchUserGroups({ user: data }, req.context);
		res.json(groups);
	},

	createUserGroup: async (req: PointlyRequest, res: PointlyResponse) => {
		logger.debug({
			subject: "userGroupController.createUserGroup",
			message: "Creating user group",
			ctx: req.context
		});

		const userData = UserSelectSchema.parse(req.params);
		const groupData = GroupCreateSchema.parse(req.body); // Assuming body contains group data
		const group = await groupService.createGroup(
			{ user: userData, group: groupData },
			req.context
		);

		logger.info({
			subject: "userGroupController.createUserGroup",
			message: "User group created successfully",
			groupId: group.id,
			ctx: req.context
		});
		res.status(201).json(group);
	}
};
