import z from "zod";

const createPostFormSchema = z.object({
    title: z.string()
        .min(1, "Title cant be empty")
        .max(50, "Title cant exceed 50 characters"),
    text: z.string()
        .min(1, "Text cant be empty")
        .max(50, "Text cant exceed 50 characters"),
});

export default createPostFormSchema