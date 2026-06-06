import express from "express";
import { prisma } from "../lib/prosma";
import { auth } from "../middlewares/auth";

export const router = express.Router();

router.delete("/comments/:id", auth, async (req, res) => {
	const commentId = Number(req.params.id);
	const user = res.locals.user;

	const comment = await prisma.comment.findUnique({
		where: { id: commentId },
		include: { post: true },
	});

	if (!comment) {
		return res.status(404).json({ msg: "comment not found" });
	}

	if (comment.userId !== user.id && comment.post.userId !== user.id) {
		return res
			.status(403)
			.json({ msg: "not authorized to delete this comment" });
	}

	await prisma.comment.delete({ where: { id: commentId } });

	res.status(204).send();
});
