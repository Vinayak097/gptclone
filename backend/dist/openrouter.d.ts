type Model = "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo" | "gpt-3.5-turbo" | "gpt-4o-mini-code" | "gpt-3.5-turbo-16k" | "gpt-4o-mini-code" | "gpt-4o-code";
import type { Message } from "./types.ts";
export declare const createCompletion: (model: Model, message: Message[], cb: (chunk: string) => void) => Promise<void>;
export {};
//# sourceMappingURL=openrouter.d.ts.map