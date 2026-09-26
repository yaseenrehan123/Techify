import z from "zod";
const verificationSchema = z.object({
    code: z.string()
});

export default verificationSchema;