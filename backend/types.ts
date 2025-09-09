import { z } from "zod";
const MAX_TOKEN = 1000;
export const createChatType = z.object({
  conversationId: z.string(),
  message: z.string().max(MAX_TOKEN).min(1),
});
export type Message = {
  content: string;
  role: string;
};

export const createUser = z.object({
  email: z.string().email(),
});

export const SigninType = z.object({
  email: z.string().email(),
  otp: z.string().min(4).max(6),
});
