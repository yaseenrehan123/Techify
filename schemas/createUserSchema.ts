import z from "zod";

const createUserSchema = z.object({
    clerkId: z.string(),
    username: z.string()
        .min(8, "Username must have minimum 8 characters")
        .max(15, "Username must contain maximum 15 characters"),
    email: z.email()
});

export default createUserSchema;