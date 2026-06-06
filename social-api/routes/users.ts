import express from "express";
import { prisma } from "../lib/prosma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { auth } from "../middlewares/auth";
import { optionalAuth } from "../middlewares/optionalAuth";
import { formatPosts, postInclude } from "../lib/posts";

export const router = express.Router();

router.get("/users/verify", auth, async (req, res) => {
    const { id } = res.locals.user;
    const user = await prisma.user.findUnique({
        where: { id },
    });

    res.json(user);
});

router.get("/users", async (req, res) => {
	const users = await prisma.user.findMany();

	res.json(users);
});

router.get("/users/:id", optionalAuth, async (req, res) => {
	const id = Number(req.params.id);
	const userId = res.locals.user?.id as number | undefined;

	const user = await prisma.user.findUnique({
		where: { id },
		include: {
			posts: {
				orderBy: { id: "desc" },
				include: postInclude(userId),
			},
		},
	});

	if (!user) {
		return res.status(404).json({ msg: "user not found" });
	}

	const { password, posts, ...rest } = user;
	res.json({ ...rest, posts: formatPosts(posts) });
});

router.post("/users", async (req, res) => {
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

router.post("/users/login", async (req, res) => {
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
