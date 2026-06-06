import jwt from "jsonwebtoken";
import express from "express";

export function optionalAuth(
	req: express.Request,
	res: express.Response,
	next: express.NextFunction,
) {
	const token = req.headers.authorization?.split(" ")[1];
	if (token) {
		try {
			const user = jwt.verify(token, process.env.JWT_SECRET as string);
			res.locals.user = user;
		} catch {
			// ignore invalid token for public reads
		}
	}
	next();
}
