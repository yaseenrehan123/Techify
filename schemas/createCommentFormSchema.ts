import z from "zod";

const createCommentFormSchema = z.object({
    text: z.string().min(1, "Comment cant be null!")
});

export default createCommentFormSchema;