import prisma from "@/lib/prisma";
import seedData from "../json/testData.json"
import { User } from "@/lib/generated/prisma/client";
interface SeedComment {
    authorIndex: number;
    text: string;
}

interface SeedPost {
    id: string;
    title: string;
    text: string;
    authorIndex: number;
    comments: SeedComment[];
    likedByIndices: number[];
}

interface SeedData {
    users: Array<{
        clerkId: string;
        email: string;
        username: string;
    }>;
    posts: SeedPost[];
}
const typedSeedData = seedData as SeedData;

async function main(): Promise<void> {
    // Clear existing data in correct dependency order
    await prisma.viewedPost.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.user.deleteMany();

    console.log("Cleared database.");

    // 1. Create Users - Annotate explicit type User[]
    const createdUsers: User[] = [];
    for (const userData of typedSeedData.users) {
        const user = await prisma.user.create({
            data: userData,
        });
        createdUsers.push(user);
    }
    console.log(`Created ${createdUsers.length} users.`);

    // 2. Create Posts, Comments, and Likes
    for (const postData of typedSeedData.posts) {
        const author = createdUsers[postData.authorIndex];

        if (!author) {
            throw new Error(`User at index ${postData.authorIndex} does not exist.`);
        }

        // Create the post with nested comments
        const createdPost = await prisma.post.create({
            data: {
                id: postData.id,
                title: postData.title,
                text: postData.text,
                userClerkId: author.clerkId,
                comments: {
                    create: postData.comments.map((comment) => {
                        const commentAuthor = createdUsers[comment.authorIndex];
                        if (!commentAuthor) {
                            throw new Error(`Comment user at index ${comment.authorIndex} does not exist.`);
                        }
                        return {
                            text: comment.text,
                            userClerkId: commentAuthor.clerkId,
                        };
                    }),
                },
            },
        });

        // Create likes for this post
        for (const likedUserIdx of postData.likedByIndices) {
            const likedUser = createdUsers[likedUserIdx];
            if (!likedUser) {
                throw new Error(`Like user at index ${likedUserIdx} does not exist.`);
            }

            await prisma.like.create({
                data: {
                    postId: createdPost.id,
                    userClerkId: likedUser.clerkId,
                },
            });
        }
    }

    // Fetch created users and posts summary for verification
    const users = await prisma.user.findMany();
    const postsCount = await prisma.post.count();
    const commentsCount = await prisma.comment.count();
    const likesCount = await prisma.like.count();

    console.log("\nDATABASE SEEDED SUCCESSFULLY!");
    console.log(`- Users created: ${users.length}`);
    console.log(`- Posts created: ${postsCount}`);
    console.log(`- Comments created: ${commentsCount}`);
    console.log(`- Likes created: ${likesCount}\n`);
    console.log("USERS: ", users);
}

main()
    .catch((err: Error) => {
        console.error("Error seeding database:", err);
        throw new Error(err.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });