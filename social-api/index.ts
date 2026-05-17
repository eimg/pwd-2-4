import express from "express";
import { prisma } from "./lib/prosma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

app.use(express.json());
app.use(express.urlencoded());

app.get("/users", async (req, res) => {
	const users = await prisma.user.findMany();

	res.json(users);
});

app.post("/users", async (req, res) => {
	const name = req.body?.name;
	const username = req.body?.username;
	const bio = req.body?.bio;
	const password = req.body?.password;

	if (!name || !username || !password) {
		return res
			.status(400)
			.json({ msg: "name, username and password are required" });
	}

	const hash = await bcrypt.hash(password, 10);

	try {
		const user = await prisma.user.create({
			data: {
				name,
				username,
				bio,
				password: hash,
			},
		});

		res.status(201).json(user);
	} catch (e) {
		res.status(400).json({ msg: "Duplicate username" });
	}
});

app.post("/users/login", async (req, res) => {
	const username = req.body?.username;
	const password = req.body?.password;

	if (!username || !password) {
		return res
			.status(400)
			.json({ msg: "username and password are required" });
	}

	const user = await prisma.user.findUnique({
		where: { username },
	});

	if (user) {
		if (await bcrypt.compare(password, user.password)) {
			const token = jwt.sign(
				{ id: user.id },
				process.env.JWT_SECRET as string,
			);

            return res.json({ user, token });
		}
	}

    res.status(401).json({ msg: "Incorrect username or password" });
});

app.listen(8800, () => {
	console.log("Social API running at 8800...");
});
