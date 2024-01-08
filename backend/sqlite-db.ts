import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";
import fs from 'fs'

const schema = fs.readFileSync("schema.sql", "utf8");

export default class IDatabase {
	private db!: Database<sqlite3.Database, sqlite3.Statement>;
	async open() {
		this.db = await open({
			filename: "database.db",
			driver: sqlite3.cached.Database,
		});
		await this.db.exec(schema);
	}

	async getUser(username: string) {
		return await this.db.get(
			"SELECT * FROM users WHERE username = ?",
			username
		);
	}

	async updateUser(id: ID, password: string) {
		return await this.db.run(
			"UPDATE users SET password = ? WHERE id = ?",
			password,
			id
		);
	}

	async deleteUser(id: ID) {
		return await this.db.run("DELETE FROM users WHERE id = ?", id);
	}

	async createUser(username: string, password: string, avatar = "") {
		return await this.db.run(
			"INSERT INTO users (username, password, avatar) VALUES (?, ?, ?)",
			username,
			password,
			avatar
		);
	}

	async getUsers(id: ID, query: string) {
		const sql =
			"SELECT id, username, avatar FROM users u WHERE username LIKE :query AND NOT EXISTS (SELECT 1 FROM friends f WHERE (u.id = f.user_id AND f.friend_id = :userId) OR (u.id = f.friend_id AND f.user_id = :userId)) ORDER BY username";
		return await this.db.all(sql, {
			":query": `%${query}%`,
			":userId": id,
		});
	}

	async getFriends(id: ID) {
		const sql = `SELECT id, username, avatar FROM users u WHERE EXISTS (SELECT 1 FROM friends f WHERE (u.id = f.user_id AND f.friend_id = :userId) OR (u.id = f.friend_id AND f.user_id = :userId) AND f.status = "FRIEND") ORDER BY username`;
		return await this.db.all(sql, {
			":userId": id,
		});
	}

	async getIncomingRequests(id: ID) {
		const sql = `SELECT id, username, avatar FROM users u WHERE EXISTS (SELECT 1 FROM friends f WHERE u.id = f.user_id AND f.friend_id = ? AND f.status = "REQUEST") ORDER BY username`;
		return await this.db.all(sql, id);
	}

	async getSentRequests(id: ID) {
		const sql = `SELECT id, username, avatar FROM users u WHERE EXISTS (SELECT 1 FROM friends f WHERE u.id = f.friend_id AND f.user_id = ? AND f.status = "REQUEST") ORDER BY username`;
		return await this.db.all(sql, id);
	}

	async createFriend(id: ID, friendId: ID, status = "REQUEST") {
		const sql =
			"INSERT INTO friends (user_id, friend_id, status) VALUES (?, ?, ?)";
		return await this.db.run(sql, id, friendId, status);
	}

	async updateFriend(id: ID, friendId: ID) {
		const sql = `UPDATE friends SET status = "FRIEND" WHERE user_id = ? AND friend_id = ?`;
		return await this.db.run(sql, friendId, id);
	}

	async deleteFriend(id: ID, friendId: ID) {
		const sql =
			"DELETE FROM friends WHERE (user_id = :userId AND friend_id = :friendId) OR (user_id = :friendId AND friend_id = :userId)";
		return await this.db.run(sql, { ":userId": id, ":friendId": friendId });
	}
}
