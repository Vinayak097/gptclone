import type { Message } from "./types.js";
export declare class inMemoryStore {
    private static store;
    private store;
    private clock;
    private constructor();
    destorey(): void;
    static getInstance(): inMemoryStore;
    get(converstionId: string): Message[];
    add(converstionId: string, message: Message): void;
}
//# sourceMappingURL=inMemoryStrore.d.ts.map