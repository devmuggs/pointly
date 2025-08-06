import { Router } from "express";

export const groupRouter = Router();
groupRouter.route("/").get().post();
groupRouter.route("/:groupId").get().patch().delete();
groupRouter.route("/:groupId/users").get().post();
groupRouter.route("/:groupId/users/:userId").get().patch().delete();
groupRouter.route("/:groupId/cards").get().post();
groupRouter.route("/:groupId/cards/:cardId").get().patch().delete();
groupRouter.route("/:groupId/transactions").get().post();
groupRouter.route("/:groupId/transactions/:transactionId").get().patch().delete();
groupRouter.route("/:groupId/catalogue").get().post();
groupRouter.route("/:groupId/catalogue/:itemId").get().patch().delete();
