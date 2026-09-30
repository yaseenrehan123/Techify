import { z } from "zod";

const deleteAccountConfirmationSchema = z.object({
    email: z.email()
});

export default deleteAccountConfirmationSchema;