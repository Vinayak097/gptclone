const EVICTION_TIME = 5 * 60 * 1000;
const EVICTION_CLOCK_TIME = 1 * 60 * 1000;
export class inMemoryStore {
    static store;
    store;
    clock;
    constructor() {
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
    destorey() {
        clearInterval(this.clock);
    }
    static getInstance() {
        if (!inMemoryStore.store) {
            inMemoryStore.store = new inMemoryStore();
        }
        return inMemoryStore.store;
    }
    get(converstionId) {
        if (!this.store[converstionId]) {
            return [];
        }
        return this.store[converstionId].message;
    }
    add(converstionId, message) {
        if (!this.store[converstionId]) {
            this.store[converstionId] = {
                message: [],
                evictionTime: Date.now() + EVICTION_TIME,
            };
        }
        this.store[converstionId]?.message.push(message);
    }
}
//# sourceMappingURL=inMemoryStrore.js.map