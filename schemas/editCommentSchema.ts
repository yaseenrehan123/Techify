import z from "zod";
const editCommentSchema = z.object({
    clerkId: z.string(),
    commentId: z.string(),
    text: z.string().min(1, "Comment cant be empty")
});

export default editCommentSchema