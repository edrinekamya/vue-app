import bcrypt from "bcrypt";
import { faker } from "@faker-js/faker";

export async function mock(db: DB) {
	for (let i = 0; i < 1000; i++) {
		try {
			const hashedPassword = await bcrypt.hash(
				faker.internet.password(),
				10
			);
			db.createUser(
				faker.person.firstName(),
				hashedPassword,
				faker.image.avatar()
			);
		} catch (error: any) {
			console.log(error.message);
		}
	}

	// Generate fake friendships
	for (let i = 0; i < 10000; i++) {
		let user_id = Math.floor(Math.random() * 100);
		let friend_id = Math.floor(Math.random() * 100);
		let status = ["REQUEST", "FRIEND"][Math.floor(Math.random() * 2)];
		try {
			db.createFriend(user_id, friend_id);
		} catch (error: any) {
			console.log(error.message);
		}
	}
}
