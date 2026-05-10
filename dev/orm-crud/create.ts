import { prisma } from "../lib/prisma";

async function create() {
    const user = await prisma.user.create({
        data: {
            name: "Bob",
            email: "bob@gmail.com"
        }
    });

    console.log(user);
}

create();
