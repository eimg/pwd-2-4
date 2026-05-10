import { prisma } from "../lib/prisma";

async function update() {
    const user = await prisma.user.update({
        where: { id: 1 },
        data: { name: "Mary" }
    });

    console.log(user);
}

update();
