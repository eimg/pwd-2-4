import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import { router as usersRouter } from "./routes/users";
app.use(usersRouter);

import { router as postsRouter } from "./routes/posts";
app.use(postsRouter);

import { router as commentsRouter } from "./routes/comments";
app.use(commentsRouter);

const port = Number(process.env.PORT ?? 8800);

const server = app.listen(port, () => {
	console.log(`Social API running at ${port}...`);
});
server.ref();

const keepAlive = setInterval(() => {}, 2 ** 31 - 1);
server.on("close", () => {
	clearInterval(keepAlive);
});

export { app, server };
