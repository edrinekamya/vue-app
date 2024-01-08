
import { Router } from "express";
import { authenticateRoute } from "../middleware";

const router = Router();

router.use(authenticateRoute);

export function users(db: DB) {
	router.get(`/:query`, async (req, res) => {
		const data = db.getUsers(req.user.id, req.params.query);
		res.status(200).json(data);
	});
	return router;
}
