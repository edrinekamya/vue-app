import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Socket } from "socket.io";

export const secret_key = process.env.APP_SECRET as string;

export function authenticateSocket(socket: Socket, next: (err?: any) => void) {
	const token = socket.handshake.auth.token;
	jwt.verify(token, secret_key, (err: any, user: any) => {
		if (err) {
			return next(new Error("Unauthorized"));
		}
		socket.user = user;
		next();
	});
}

export function authenticateRoute(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const authorization = req.headers.authorization;

	if (!authorization) {
		return res.status(403).send({ error: "Not Unauthorized" });
	}

	const token = authorization.split(" ")[1];
	jwt.verify(token, secret_key, (err, user) => {
		if (err) {
			return res.status(403).send({ error: "Not Unauthorized" });
		}
		req.user = user as User;
		next();
	});
}

export function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err.message) {
		res.status(500).send({ error: err.message });
	} else {
		res.status(500).send({ error: String(err) });
	}
}
