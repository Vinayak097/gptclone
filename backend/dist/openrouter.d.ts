type Model = "gpt-4o" | "gpt-4o-mini" | "gpt-4-turbo" | "gpt-4" | "gpt-3.5-turbo" | "openai/gpt-4o";
import type { Message } from "./types.ts";
export declare const createCompletion: (model: Model, message: Message[], cb: (chunk: string) => void) => Promise<void>;
export declare const testCompletion: () => Promise<void>;
export {};
//# sourceMappingURL=openrouter.d.ts.map