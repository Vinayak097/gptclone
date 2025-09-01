import OpenAI from "openai";
const apiKey = process.env.OPENAI_KEY;
if (!apiKey)
    throw new Error("env open ai key is not present");
export const openai = new OpenAI({ apiKey });
//# sourceMappingURL=openai.js.map