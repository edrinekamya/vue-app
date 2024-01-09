import { NextFunction, Request, Response } from "express";
import DatabaseWrapper from "./database";

declare global {
	type DB = DatabaseWrapper;
	type Middleware = (req: Request, res: Response, next: NextFunction) => any;
	type ID = string | number;

	interface User {
		id: ID;
		username: string;
		avatar?: string;
		createdAt: string;
		password: string;
	}

	interface Friend {
		userId: ID;
		friendId: ID;
		id: string;
		status: "REQUEST" | "FRIEND";
		createdAt: string;
	}

	interface Message {
		id: ID;
		senderId: ID;
		channelId?: ID;
		chatId?: ID;
		message: string;
		type: "TEXT" | "IMAGE" | "FILE" | "REQUEST" | "CALL";
		createdAt: string;
		read: boolean;
	}
}

declare module "socket.io" {
	interface Socket {
		user: User;
	}
}

declare module "express-serve-static-core" {
	interface Request {
		user: User;
	}
}

export {};
