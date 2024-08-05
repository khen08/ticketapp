import { z } from "zod";

export const replySchema = z.object({
  content: z
    .string()
    .min(1, { message: "Reply content cannot be empty" })
    .max(1000, { message: "Reply content cannot exceed 1000 characters" }),
});

export type Reply = z.infer<typeof replySchema>;
