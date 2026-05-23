import { prisma } from "../lib/prosma";
import { faker } from "@faker-js/faker";
import bcrypt from "bcrypt";

async function main() {
	console.log("User seeding started...");

    await prisma.user.create({
        data: {
            name: "Alice",
            username: "alice",
            bio: "first user",
            password: await bcrypt.hash("password", 10),
        }
    });

	for (let i = 0; i < 5; i++) {
		const firstName = faker.person.firstName();
		const lastName = faker.person.lastName();
		const username = firstName.toLowerCase() + lastName.toLowerCase();

		await prisma.user.create({
			data: {
				name: `${firstName} ${lastName}`,
				username,
				bio: faker.person.bio(),
				password: await bcrypt.hash("password", 10),
			},
		});
	}
	console.log("User seeding done. \n");

	console.log("Post seeding started...");
	for (let i = 0; i < 20; i++) {
		await prisma.post.create({
			data: {
				body: faker.lorem.paragraph(),
				userId: faker.number.int({ min: 1, max: 5 }),
			},
		});
	}
	console.log("Post seeding done. \n");

	console.log("Comment seeding started...");
	for (let i = 0; i < 40; i++) {
		await prisma.comment.create({
			data: {
				body: faker.lorem.paragraph(),
				postId: faker.number.int({ min: 1, max: 20 }),
				userId: faker.number.int({ min: 1, max: 5 }),
			},
		});
	}
	console.log("Comment seeding done. \n");
}

main();
