import z from "zod";

const createCommentSchema = z.object({
    clerkId: z.string(),
    postId: z.string(),
    text: z.string().min(1, "Comment Cant be empty")
});

export default createCommentSchema