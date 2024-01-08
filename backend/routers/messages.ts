import { Router } from "express";
import { authenticateRoute } from "../middleware";

const router = Router();

router.use(authenticateRoute);

export function messages(db: DB) {
	router.get(`/channel/:id`, async (req, res) => {
		const data = db.getChannelMessages(req.params.id);
		res.status(200).json(data);
  });
  
  router.get(`/chat/:id`, async (req, res) => {
		const data = db.getChatMessages(req.params.id);
		res.status(200).json(data);
  });
	return router;
}
