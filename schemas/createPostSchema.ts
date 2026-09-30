import z from "zod";

const createPostSchema = z.object({
    title: z.string()
        .min(1, "Title cant be empty")
        .max(50, "Title cant exceed max 50 characters"),
    text: z.string(),
    userClerkId: z.string(),
});

export default createPostSchema;