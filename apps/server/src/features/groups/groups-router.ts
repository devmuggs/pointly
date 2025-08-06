import { Router } from "express";
import { groupsController } from "./groups-controller";

export const groupRouter = Router();
groupRouter.route("/").get(groupsController.fetchGroups);
groupRouter
	.route("/:id")
	.get(groupsController.fetchGroup)
	.patch(groupsController.updateGroup)
	.delete(groupsController.deleteGroup);

groupRouter
	.route("/:id/users")
	.get(groupsController.fetchGroupUsers)
	.post(groupsController.addGroupUser)
	.delete(groupsController.removeGroupUser);

groupRouter
	.route("/:id/currencies")
	.get(groupsController.fetchGroupCurrencies)
	.post(groupsController.addGroupCurrency)
	.delete(groupsController.deleteGroupCurrency);

groupRouter
	.route("/:id/purchasable")
	.get(groupsController.fetchGroupPurchasable)
	.post(groupsController.addGroupPurchasable)
	.delete(groupsController.deleteGroupPurchasable);
