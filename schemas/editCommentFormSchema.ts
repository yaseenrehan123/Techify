import z from "zod";

const editCommentFormSchema = z.object({
    text: z.string().min(1, "Comment Cant be null")
});

export default editCommentFormSchema