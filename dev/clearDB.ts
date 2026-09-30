import prisma from "@/lib/prisma";
async function main(): Promise<void> {
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    const users = await prisma.user.findMany();

    console.log("DATABASE CLEARED!")
    console.log("USERS: ", users);
}
main()
    .catch((err: Error) => {
        throw new Error(err.message)
    })
    .finally(() => {
        prisma.$disconnect()
    });