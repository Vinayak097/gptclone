import { z } from "zod";
export declare const createChatType: z.ZodObject<{
    conversationId: z.ZodString;
    message: z.ZodString;
    model: z.ZodString;
}, "strip", z.ZodTypeAny, {
    conversationId: string;
    message: string;
    model: string;
}, {
    conversationId: string;
    message: string;
    model: string;
}>;
export type Message = {
    content: string;
    role: string;
};
export declare const createUser: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const SigninType: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    otp: string;
}, {
    email: string;
    otp: string;
}>;
//# sourceMappingURL=types.d.ts.map