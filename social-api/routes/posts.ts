import express from "express";
import { prisma } from "../lib/prosma";
import { auth } from "../middlewares/auth";
import { optionalAuth } from "../middlewares/optionalAuth";
import {
	formatPost,
	formatPosts,
	postDetailInclude,
	postInclude,
} from "../lib/posts";

export const router = express.Router();

router.get("/posts", optionalAuth, async (req, res) => {
	const userId = res.locals.user?.id as number | undefined;

	const posts = await prisma.post.findMany({
		take: 20,
		orderBy: { id: "desc" },
		include: postInclude(userId),
	});

	res.json(formatPosts(posts));
});

router.post("/posts", auth, async (req, res) => {
	const body = req.body?.body;
	const user = res.locals.user;

	if (!body) {
		return res.status(400).json({ msg: "post body is required" });
	}

	const post = await prisma.post.create({
		data: {
			body,
			userId: user.id as number,
		},
	});

	res.status(201).json(post);
});

router.get("/posts/:id", optionalAuth, async (req, res) => {
	const id = Number(req.params.id);
	const userId = res.locals.user?.id as number | undefined;

	const post = await prisma.post.findUnique({
		where: { id },
		include: postDetailInclude(userId),
	});

	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	res.json(formatPost(post));
});

router.post("/posts/:id/like", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const userId = res.locals.user.id as number;

	const post = await prisma.post.findUnique({
		where: { id: postId },
	});

	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	const existing = await prisma.like.findUnique({
		where: { userId_postId: { userId, postId } },
	});

	if (existing) {
		return res.status(409).json({ msg: "already liked" });
	}

	await prisma.like.create({
		data: { userId, postId },
	});

	const likeCount = await prisma.like.count({ where: { postId } });

	res.status(201).json({ liked: true, likeCount });
});

router.delete("/posts/:id/like", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const userId = res.locals.user.id as number;

	const existing = await prisma.like.findUnique({
		where: { userId_postId: { userId, postId } },
	});

	if (!existing) {
		return res.status(404).json({ msg: "like not found" });
	}

	await prisma.like.delete({
		where: { userId_postId: { userId, postId } },
	});

	const likeCount = await prisma.like.count({ where: { postId } });

	res.json({ liked: false, likeCount });
});

router.delete("/posts/:id", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const user = res.locals.user;

	const post = await prisma.post.findUnique({
		where: { id: postId },
	});

	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	if (post.userId !== user.id) {
		return res.status(403).json({ msg: "not authorized to delete this post" });
	}

	await prisma.$transaction([
		prisma.like.deleteMany({ where: { postId } }),
		prisma.comment.deleteMany({ where: { postId } }),
		prisma.post.delete({ where: { id: postId } }),
	]);

	res.status(204).send();
});

router.post("/posts/:id/comments", auth, async (req, res) => {
	const postId = Number(req.params.id);
	const body = req.body?.body;
	const user = res.locals.user;

	if (!body) {
		return res.status(400).json({ msg: "comment body is required" });
	}

	const post = await prisma.post.findUnique({
		where: { id: postId },
	});

	if (!post) {
		return res.status(404).json({ msg: "post not found" });
	}

	const comment = await prisma.comment.create({
		data: {
			body,
			userId: user.id as number,
			postId,
		},
		include: { user: true },
	});

	res.status(201).json(comment);
});
