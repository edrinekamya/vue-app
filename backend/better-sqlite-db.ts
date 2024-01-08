import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const schema = fs.readFileSync("schema.sql", "utf8");

const dbDir = path.join(__dirname, "db");
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, "database.db");

export default class IDatabase {
	private db: Database.Database;
	constructor() {
		this.db = new Database(dbPath);
		this.db.pragma("journal_mode = WAL");
		this.db.exec(schema);
	}

	getUser(username: string) {
		return this.db
			.prepare("SELECT * FROM users WHERE username = ?")
			.get(username) as User;
	}

	updateUser(userId: ID, password: string) {
		return this.db
			.prepare("UPDATE users SET password = ? WHERE id = ?")
			.run(password, userId);
	}

	deleteUser(id: ID) {
		return this.db.prepare("DELETE FROM users WHERE id = ?").run(id);
	}

	createUser(username: string, password: string, avatar?: string) {
		return this.db
			.prepare(
				"INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)"
			)
			.run(username, password, avatar);
	}

	getUsers(userId: ID, query: string) {
		const sql = `
		SELECT id, username, avatar FROM users u
		WHERE username LIKE :query
		AND u.id != :userId
		AND NOT EXISTS (
			SELECT 1 FROM friends f
			WHERE (u.id = f.userId AND f.friendId = :userId)
			OR (u.id = f.friendId AND f.userId = :userId)
		) ORDER BY username`;
		return this.db.prepare(sql).all({
			query: `%${query}%`,
			userId,
		});
	}

	getFriends(userId: ID) {
		return this.db
			.prepare(
				`
		SELECT id, username, avatar
		FROM users u
		WHERE EXISTS (
    	SELECT 1
    	FROM friends f
    	WHERE f.status = 'FRIEND' 
    	AND ((u.id = f.userId AND f.friendId = :userId) OR (u.id = f.friendId AND f.userId = :userId))
		) ORDER BY username;`
			)
			.all({ userId });
	}

	getIncomingRequests(userId: ID) {
		const sql = `
		SELECT id, username, avatar FROM users u 
		WHERE EXISTS (
			SELECT 1 FROM friends f
			WHERE u.id = f.userId
			AND f.friendId = ?
			AND f.status = 'REQUEST'
		) ORDER BY username`;
		return this.db.prepare(sql).all(userId);
	}

	getSentRequests(userId: ID) {
		const sql = `
		SELECT id, username, avatar FROM users u
		WHERE EXISTS (
			SELECT 1 FROM friends f
			WHERE u.id = f.friendId
			AND f.userId = ?
			AND f.status = 'REQUEST'
		) ORDER BY username`;
		return this.db.prepare(sql).all(userId);
	}

	createFriend(userId: ID, friendId: ID, status = "REQUEST") {
		const sql =
			"INSERT INTO friends (userId, friendId, status) VALUES (?, ?, ?)";
		return this.db.prepare(sql).run(userId, friendId, status);
	}

	updateFriend(userId: ID, friendId: ID) {
		const sql = `UPDATE friends SET status = 'FRIEND' WHERE userId = ? AND friendId = ?`;
		return this.db.prepare(sql).run(friendId, userId);
	}

	deleteFriend(userId: ID, friendId: ID) {
		const sql = `
		DELETE FROM friends
		WHERE (userId = :userId AND friendId = :friendId)
		OR (userId = :friendId AND friendId = :userId)`;
		return this.db.prepare(sql).run({ userId, friendId });
	}

	getChannels(userId: ID) {
		const sql = `
		SELECT c.*, p.userId AS userId 
		FROM channels c
		JOIN channel_participants p ON c.id = p.channelId
		WHERE p.userId = ?
	`;
		return this.db.prepare(sql).all(userId);
	}

	getChannelMessages(channelId: ID, messages = 10) {
		const sql = `SELECT * FROM messages WHERE channelId = ? ORDER BY createdAt DESC LIMIT ?`;
		return this.db.prepare(sql).all(channelId, messages);
	}

	getChatMessages(chatId: ID, messages = 10) {
		const sql = `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt DESC LIMIT ?`;
		return this.db.prepare(sql).all(chatId, messages);
	}

	getMessage(id: ID) {
		const sql = `SELECT * FROM messages WHERE id = ?`;
		return this.db.prepare(sql).get(id);
	}

	createMessage(message: Partial<Message>) {
		const sql = `
		INSERT INTO messages
		(message, senderId, chatId, type, status, createdAt)
		VALUES (:message, :senderId, :chatId, :type, :status, :createdAt)`;
		return this.db.prepare(sql).run(message);
	}

	updateMessage(id: ID, status: string) {
		const sql = `UPDATE messages SET status = ? WHERE id = ?`;
		return this.db.prepare(sql).run(status, id);
	}

	createChannel(
		adminId: ID,
		participants: ID[],
		name: string,
		isPrivate: 0 | 1
	) {
		const insertChannel = this.db.prepare(
			"INSERT INTO channels (name, adminId, isPrivate) VALUES (?, ?, ?)"
		);
		const insertParticipant = this.db.prepare(
			"INSERT INTO channel_participants (channelId, userId) VALUES (?, ?)"
		);
		const transaction = this.db.transaction(
			(adminId, participants, name) => {
				const info = insertChannel.run(name, adminId, isPrivate);
				const channelId = info.lastInsertRowid;
				for (const userId of participants) {
					insertParticipant.run(channelId, userId);
				}
				return channelId;
			}
		);
		return transaction(adminId, participants, name);
	}

	deleteChannel(id: ID) {
		return this.db.prepare("DELETE FROM channels WHERE id = ?").run(id);
	}

	updateChannel(id: ID, name: string) {
		const sql = `UPDATE channel SET name = ? WHERE userId = ?`;
		return this.db.prepare(sql).run(name, id);
	}

	createChannelParticipant(channelId: ID, userId: ID) {
		return this.db
			.prepare(
				"INSERT INTO channel_participants (channelId, userId) VALUES (?, ?)"
			)
			.run(channelId, userId);
	}

	deleteChannelParticipant(channelId: ID, userId: ID) {
		const sql = `DELETE FROM channel_participants WHERE channelId = ? AND userId = ?`;
		return this.db.prepare(sql).run(channelId, userId);
	}

	createCall(call: Call) {
		const sql = `INSERT INTO calls (type, startTime, endTime, callerId, receiverId) VALUES (@type, @startTime, @endTime, @callerId, @receiverId)`;
		return this.db.prepare(sql).run(call);
	}

	getCalls(userId: ID) {
		const sql = `SELECT * FROM calls WHERE callerId = @userId OR receiverId = @userId`;
		return this.db.prepare(sql).all({ userId });
	}

	getCall(callId: ID) {
		const sql = `SELECT * FROM calls WHERE id = @callId`;
		return this.db.prepare(sql).get({ callId });
	}

	updateCall(call: Call) {
		const sql = `UPDATE calls SET type = @type, startTime = @startTime, endTime = @endTime, callerId = @callerId, receiverId = @receiverId WHERE id = @id`;
		return this.db.prepare(sql).run(call);
	}

	deleteCall(callId: ID) {
		const sql = `DELETE FROM calls WHERE id = @callId`;
		return this.db.prepare(sql).run({ callId });
	}
}
