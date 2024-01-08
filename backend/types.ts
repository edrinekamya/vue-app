import { NextFunction, Request, Response } from "express";
import IDatabase from "./better-sqlite-db";

declare global {
	type DB = IDatabase;
	type Middleware = (req: Request, res: Response, next: NextFunction) => any;
	type ID = string | number;

	interface User {
		id: ID;
		username: string;
		avatar?: string;
		createdAt: string;
		password: string
	}

	interface Friend {
		userId: ID;
		friendId: ID;
		id: string;
		status: "REQUEST" | "FRIEND";
		createdAt: string;
	}

	interface Notification {
		id: ID;
		userId: ID;
		message: string;
		type: string | null;
		read: boolean;
		referenceId: ID | null;
		createdAt: string;
	}

	interface Call {
		id: ID;
		callerId: ID;
		receiverId: ID;
		startTime: string;
		endTime: string | null;
		status: "MISSED" | "ANSWERED" | "DECLINED" | null;
		video: boolean;
		createdAt: string;
	}

	interface Message {
		id: ID;
		senderId: ID;
		channelId?: ID;
		chatId?: ID;
		message: string;
		type: "TEXT" | "IMAGE" | "FILE" | 'REQUEST' | 'CALL';
		createdAt: string;
		read: boolean;
	}

	interface Channel {
		id: ID;
		name: string;
		adminId: ID;
		isPrivate: boolean;
		createdAt: string;
		userId: string;
	}

	interface ChannelParticipant {
		channelId: ID;
		userId: ID;
		createdAt: string;
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
