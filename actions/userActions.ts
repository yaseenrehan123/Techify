"use server";
import { CreateUserFields, DeleteAccountConfirmationFields } from "@/lib/types";
import prisma from "@/lib/prisma";
import { createClerkClient } from "@clerk/nextjs/server";
import { Post } from "@/lib/generated/prisma/client";

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function createUser(data: CreateUserFields): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { clerkId: data.clerkId, }
    });
    if (user) {
        throw new Error("USER ALREADY EXISTS!")
    }
    const newUser = await prisma.user.create({
        data: data
    });
    console.log("NEW USER CREATED: ", newUser);

}
export async function deleteUser(data: DeleteAccountConfirmationFields): Promise<void> {
    const user = await prisma.user.findUnique({
        where: { email: data.email },
        include: { posts: true }
    });
    if (!user) {
        throw new Error("USER DOES NOT EXIST!")
    }


    await prisma.user.delete({
        where: { email: user.email }
    });


    try {
        clerkClient.users.deleteUser(user.clerkId);
    }
    catch (err) {
        throw new Error((err as Error).message)
    }
}