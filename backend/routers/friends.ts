import { Router } from "express";
import { io } from "../app";
import { authenticateRoute } from "../middleware";

const router = Router();

router.use(authenticateRoute);

export function friends(db: DB) {
	router.get(`/`, async (req, res) => {
		const userId = req.user.id as number;
		const data = db
			.getFriends(req.user.id)
			.reduce((acc: any, friend: any) => {
				const chatId = `${Math.min(userId, friend.id)}_${Math.max(
					Math.max(userId, friend.id)
				)}`;
				const messages = db
					.getChatMessages(chatId, 1000)
					.reduce(
						(acc: any, msg: any) => ({ ...acc, [msg.id]: msg }),
						{}
					);
				return { ...acc, [friend.id]: { ...friend, messages } };
			}, {});
		res.status(200).json(data);
	});

	return router;
}
