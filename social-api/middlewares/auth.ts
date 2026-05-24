import express from "express";
import jwt from "jsonwebtoken";

export function auth(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const authorization = req.headers.authorization;
	const token = authorization?.split(" ")[1];
	if (token) {
		const user = jwt.verify(token, process.env.JWT_SECRET as string);
		res.locals.user = user;
		next();
	} else {
		res.status(401).json({ msg: "missing or invalid token" });
	}
}
