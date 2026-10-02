import prisma from "@/lib/prisma";
import { generateEmbedding } from "../lib/ai";

async function main() {
    console.log("Fetching all posts to update vector embeddings...");
    const posts = await prisma.post.findMany({
        select: { id: true, title: true, text: true }
    });

    for (const post of posts) {
        const textToEmbed = `${post.title} ${post.text}`;
        const embedding = await generateEmbedding(textToEmbed);
        const vectorString = `[${embedding.join(",")}]`;

        await prisma.$executeRaw`
      UPDATE "Post"
      SET vector = ${vectorString}::vector
      WHERE id = ${post.id};
    `;
        console.log(`Updated post: "${post.title}"`);
    }

    console.log("Re-indexing complete!");
}

main().catch(console.error);