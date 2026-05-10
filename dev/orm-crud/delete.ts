import { prisma } from "../lib/prisma";

async function remove() {
    await prisma.post.deleteMany({ where:{ userId: 1 } });
    
    const user = await prisma.user.delete({
        where: { id: 1 }
    });

    console.log(user);
}

remove();