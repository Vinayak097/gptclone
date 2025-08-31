import type { Message } from "./types.js";
const EVICTION_TIME = 5 * 60 * 1000;
const EVICTION_CLOCK_TIME = 1 * 60 * 1000;
export class inMemoryStore {
  private static store: inMemoryStore;
  private store: Record<
    string,
    {
      message: Message[];
      evictionTime: number;
    }
  >;
  private clock: NodeJS.Timeout;
  private constructor() {
    this.store = {};
    this.clock = setInterval(() => {
      Object.entries(this.store).forEach(([key, { evictionTime }]) => {
        console.log(`Key: ${key} , time: ${evictionTime}`);
        if (Date.now() > evictionTime) {
          delete this.store[key];
        }
      });
    }, EVICTION_CLOCK_TIME);
  }
  public destorey() {
    clearInterval(this.clock);
  }
  static getInstance() {
    if (!inMemoryStore.store) {
      inMemoryStore.store = new inMemoryStore();
    }
    return inMemoryStore.store;
  }
  get(converstionId: string) {
    if (!this.store[converstionId]) {
      return [];
    }
    return this.store[converstionId].message;
  }
  add(converstionId: string, message: Message) {
    if (!this.store[converstionId]) {
      this.store[converstionId] = {
        message: [],
        evictionTime: Date.now() + EVICTION_TIME,
      };
    }
    this.store[converstionId]?.message.push(message);
  }
}
