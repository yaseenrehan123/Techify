import prisma from "@/lib/prisma";
async function main(): Promise<void> {
    const users = await prisma.user.findMany();

    console.log("USERS: ", users);
}
main()
    .catch((err: Error) => {
        throw new Error(err.message)
    })
    .finally(() => {
        prisma.$disconnect()
    });