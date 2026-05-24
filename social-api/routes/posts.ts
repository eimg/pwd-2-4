import express from "express";
import { prisma } from "../lib/prosma";

export const router = express.Router();

import { auth } from "../middlewares/auth";

router.get("/posts", async (req, res) => {
	const posts = await prisma.post.findMany({
		take: 20,
		orderBy: { id: "desc" },
		include: { 
            user: true,
            comments: true,
        },
	});

	res.json(posts);
});

router.post("/posts", auth, async (req, res) => {
    const body = req.body?.body;
    const user = res.locals.user;

    if(!body) {
        return res.status(400).json({ msg: "post body is required" });
    }

    const post = await prisma.post.create({
        data: {
            body, userId: user.id as number
        }
    });

    res.status(201).json(post);
});

router.get("/posts/:id", async (req, res) => {
    const id = req.params.id;
    const post = await prisma.post.findUnique({
		where: { id: Number(id) },
		include: {
			user: true,
			comments: {
                include: {
                    user: true,
                }
            },
		},
	});

	res.json(post);
});
