import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const schema = fs.readFileSync("schema.sql", "utf8");

const dbDir = path.join(__dirname, "db");
if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir);
}

const dbPath = path.join(dbDir, "database.db");

export default class DatabaseWrapper {
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

	createFriend(userId: ID, friendId: ID, status = "REQUEST") {
		const sql =
			"INSERT INTO friends (userId, friendId, status) VALUES (?, ?, ?)";
		return this.db.prepare(sql).run(userId, friendId, status);
	}

	deleteFriend(userId: ID, friendId: ID) {
		const sql = `
		DELETE FROM friends
		WHERE (userId = :userId AND friendId = :friendId)
		OR (userId = :friendId AND friendId = :userId)`;
		return this.db.prepare(sql).run({ userId, friendId });
	}

	getChatMessages(chatId: ID, messages = 1000) {
		const sql = `SELECT * FROM messages WHERE chatId = ? ORDER BY createdAt DESC LIMIT ?`;
		return this.db.prepare(sql).all(chatId, messages);
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
}
