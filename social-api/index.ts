import express from "express";
const app = express();

app.use(express.json());
app.use(express.urlencoded());

import { router as usersRouter } from "./routes/users";
app.use(usersRouter);

app.listen(8800, () => {
	console.log("Social API running at 8800...");
});
