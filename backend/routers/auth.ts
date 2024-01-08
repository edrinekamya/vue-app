import bcrypt from "bcrypt";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { authenticateRoute, secret_key } from "../middleware";

const router = Router();

export function auth(db: DB) {
	router.post(`/sign-in`, async (req, res) => {
		const result = db.getUser(req.body.username);
		if (!result) {
			res.status(401).send({ error: "Account does not exist" });
		} else if (await bcrypt.compare(req.body.password, result.password)) {
			const { password, ...user } = result;
			const token = jwt.sign(user, secret_key);
			res.status(200).json({ token, user });
		} else {
			res.statusMessage = "Username and password don't match";
			res.status(401).send({
				error: "Username and password don't match",
			});
		}
	});

	router.post(`/sign-up`, async (req, res) => {
		try {
			const hashedPassword = await bcrypt.hash(req.body.password, 10);
			db.createUser(req.body.username, hashedPassword);
			res.status(201).json();
		} catch (error: any) {
			if (error?.code === "SQLITE_CONSTRAINT_UNIQUE") {
				res.status(401).send({ error: "Username is already taken" });
			} else {
				res.status(401).send({
					error: "Something unexpected happened",
				});
			}
		}
	});

	router.put(`/`, authenticateRoute, async (req, res) => {
		const hashedPassword = await bcrypt.hash(req.body.password, 10);
		db.updateUser(req.user.id, hashedPassword);
		res.status(200).send();
	});

	router.delete(`/`, authenticateRoute, async (req, res) => {
		db.deleteUser(req.user.id);
		res.status(200).send();
	});

	return router;
}
