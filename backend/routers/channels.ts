import { Router } from "express";
import { authenticateRoute } from "../middleware";

const router = Router()

router.use(authenticateRoute);

export function channels(db: DB) {
	router.get(`/`, async (req, res) => {
		const data = db.getChannels(req.user.id);
		res.status(200).json(data);
  });

  router.post(`/`, async (req, res, next) => {
    const participants = req.body.participants
    const name = req.body.name
    if (!participants || !name || participants.length < 2 || name.length < 1) {
      return next(new Error("Invalid inputs"))
    }
    const isPrivate = participants.length > 2 ? 0 : 1
		const id = db.createChannel(req.user.id, participants, name, isPrivate);
		res.status(201).json({id});
  });

  router.put(`/:id`, async (req, res) => {
		db.updateChannel(req.params.id, req.body);
		res.status(200).json({ message: "Channel updated successfully." });
  });

  router.delete(`/:id`, async (req, res) => {
		db.deleteChannel(req.params.id);
		res.status(200).json({ message: "Channel deleted successfully." });
  });
	return router;
}