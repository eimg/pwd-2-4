import express from "express";
const app = express();

import cors from "cors";
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

import { router as usersRouter } from "./routes/users";
app.use(usersRouter);

import { router as postsRouter } from "./routes/posts";
app.use(postsRouter);

app.listen(8800, () => {
	console.log("Social API running at 8800...");
});
