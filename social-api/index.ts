import express from "express";
import { prisma } from "./lib/prosma";

const app = express();

app.get("/users", async (req, res) => {
    const users = await prisma.user.findMany();

    res.json(users);
});

app.listen(8800, () => {
    console.log("Social API running at 8800...");
});
