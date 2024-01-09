require("dotenv").config();
import cors from "cors";
import express from "express";
import { app, io, server } from "./app";
import DatabaseWrapper from "./database";
import {
	authenticateRoute,
	authenticateSocket,
	errorHandler,
} from "./middleware";
import { auth } from "./routers/auth";
import { friends } from "./routers/friends";
import { users } from "./routers/users";
import "./types";

const port = process.env.PORT || 5000;

const db = new DatabaseWrapper();

async function main() {
	io.use(authenticateSocket);

	io.on("connection", async (socket) => {
		const userId = socket.user.id;
		socket.join(userId.toString());

		socket.on("call-data", (data, to, callback) => {
			callback();
			io.to(String(to)).emit("call-data", data, socket.user);
		});

		socket.on("message:read", (to: ID, messageId: ID) => {
			io.to(to.toString()).emit(
				"message:read",
				socket.user.id,
				messageId
			);
			db.updateMessage(messageId, "READ");
		});

		socket.on("chat:deleted", (to: ID) => {
			db.deleteFriend(socket.user.id, to);
			io.to(String(to)).emit("chat:deleted", userId, "DELETED");
		});

		socket.on(
			"message:create",
			(message: Message, to: ID, callback: Function) => {
				if (message.type === "REQUEST") {
					console.log(message);
					try {
						db.createFriend(socket.user.id, to, "FRIEND");
					} catch (e) {}
				}
				const id = db.createMessage(message).lastInsertRowid as number;
				const permanentMessage = { ...message, id };
				callback(permanentMessage);
				if (message.type === "REQUEST") {
					io.to(String(to)).emit(
						"message:request",
						permanentMessage,
						socket.user
					);
				} else {
					io.to(String(to)).emit(
						"message:new",
						permanentMessage,
						socket.user.id
					);
				}
			}
		);
	});

	app.use(cors());

	app.use(express.json());

	app.use(`/api/friends`, friends(db));

	app.use(`/api/users`, users(db));

	app.use(`/api/auth`, auth(db));

	app.all("*", authenticateRoute, (_req, res) => {
		res.status(404).send("Not Found");
	});

	app.use(errorHandler);

	server.listen(port, function () {
		console.log(`Server listening at http://localhost:${port}`);
	});
}

main();
