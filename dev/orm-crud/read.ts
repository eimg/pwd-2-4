import { prisma } from "../lib/prisma";

async function read() {
    const users = await prisma.user.findMany();
    console.log(users);
}

read();