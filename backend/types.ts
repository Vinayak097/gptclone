import { z } from "zod";
const MAX_TOKEN = 1000;
export const createChatType = z.object({
  message: z.string().max(MAX_TOKEN),
});
export type Message = {
  content: string;
  role: string;
};
