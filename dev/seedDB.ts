import prisma from "@/lib/prisma";
async function main(): Promise<void> {
    await prisma.user.deleteMany();

    const users = await prisma.user.findMany();

    console.log("DATABASE SEEDED!")
    console.log("USERS: ", users);
}
main()
    .catch((err: Error) => {
        throw new Error(err.message)
    })
    .finally(() => {
        prisma.$disconnect()
    });