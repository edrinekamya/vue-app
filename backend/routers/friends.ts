import { Router } from "express";
import { io } from "../app";
import { authenticateRoute } from "../middleware";

const router = Router();

router.use(authenticateRoute);

export function friends(db: DB) {
	router.get(`/`, async (req, res) => {
		const userId = req.user.id as number;
		const data = db.getFriends(req.user.id)
			.reduce((acc: any, friend: any) => {
			const chatId = `${Math.min(userId, friend.id)}_${Math.max(
				Math.max(userId, friend.id)
			)}`;
			const messages = db.getChatMessages(chatId)
				.reduce(
					(acc: any, msg: any) => ({ ...acc, [msg.id]: msg }),
					{}
				);
			return { ...acc, [friend.id]: { ...friend, messages } };
			}, {});
		res.status(200).json(data);
	});

	router.get(`/messages/:id`, async (req, res) => {
		const data = db.getChatMessages(req.params.id);
		res.status(200).json(data);
	});

	router.get(`/requests/sent`, async (req, res) => {
		const data = db.getSentRequests(req.user.id);
		res.status(200).json(data);
	});

	router.get(`/requests/incoming`, async (req, res) => {
		const data = db.getIncomingRequests(req.user.id);
		res.status(200).json(data);
	});

	router.put(`/:id`, async (req, res) => {
		const friendId = req.params.id;
		db.updateFriend(req.user.id, friendId);
		io.to(friendId).emit("friend-request-accepted", req.user);
		res.status(201).send();
	});

	router.delete(`/:id`, async (req, res) => {
		const friendId = req.params.id;
		db.deleteFriend(req.user.id, friendId);
		io.to(friendId).emit("friend-deleted", req.user);
		res.status(201).send();
	});

	router.post(`/:id`, async (req, res) => {
		const friendId = req.params.id;
		db.createFriend(req.user.id, friendId);
		io.to(friendId).emit("new-friend-request", req.user);
		res.status(201).send();
	});

	return router;
}
