import { create } from "zustand";
import { Message } from "@/app/components/Types";

type MessageStore = {
  messages: Message[];
  addMessage: (
    content: string,
    role: "user" | "assistant",
    conversationId: string | null
  ) => void;
  setMessages: (messages: Message[]) => void;
  clearMessages: () => void;
};

const messageStore = create<MessageStore>()((set) => ({
  messages: [],
  addMessage: (content, role, conversationId) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          content,
          role,
          conversationId,
          id: Date.now().toString(), // Add unique ID for each message
        },
      ],
    })),
  setMessages: (messages: Message[]) => set(() => ({ messages })),
  clearMessages: () => set(() => ({ messages: [] })),
}));

export default messageStore;
