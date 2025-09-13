export type Conversation = {
  id: string;
  messages: Message[];
};
export type Role = "user" | "assistant";

export type Message = {
  role: Role;
  content: string;
  id?: string;
  conversationId?: string | null;
};

export const demoConversations: Conversation[] = [
  {
    id: "conv1",
    messages: [
      { id: "msg1", role: "user", content: "Hi there!" },
      {
        id: "msg2",
        role: "assistant",
        content: "Hello! How can I assist you today?",
      },
      {
        id: "msg3",
        role: "user",
        content: "Can you help me with some TypeScript examples?",
      },
      {
        id: "msg4",
        role: "assistant",
        content: "Of course. What kind of examples are you looking for?",
      },
      {
        id: "msg5",
        role: "user",
        content: "Maybe something with interfaces and types.",
      },
      {
        id: "msg6",
        role: "assistant",
        content: "Sure! I’ll prepare a small demo for you.",
      },
    ],
  },
  {
    id: "conv2",
    messages: [
      {
        id: "msg7",
        role: "user",
        content: "What’s the weather like in New York today?",
      },
      {
        id: "msg8",
        role: "assistant",
        content: "It’s partly cloudy with a high of 25°C.",
      },
      { id: "msg9", role: "user", content: "Do I need an umbrella?" },
      {
        id: "msg10",
        role: "assistant",
        content: "No, rain is not expected today.",
      },
    ],
  },
  {
    id: "conv3",
    messages: [
      { id: "msg11", role: "user", content: "Tell me a motivational quote." },
      {
        id: "msg12",
        role: "assistant",
        content:
          "“The best time to plant a tree was 20 years ago. The second best time is now.”",
      },
      { id: "msg13", role: "user", content: "Nice one! Give me another." },
      {
        id: "msg14",
        role: "assistant",
        content:
          "“Success is not final, failure is not fatal: It is the courage to continue that counts.”",
      },
      { id: "msg15", role: "user", content: "Awesome, thank you!" },
    ],
  },
  {
    id: "conv4",
    messages: [
      {
        id: "msg16",
        role: "user",
        content: "Help me draft an email to my manager.",
      },
      {
        id: "msg17",
        role: "assistant",
        content: "Sure, what’s the purpose of the email?",
      },
      {
        id: "msg18",
        role: "user",
        content: "I need to request leave for next week.",
      },
      {
        id: "msg19",
        role: "assistant",
        content:
          "Got it. Here’s a draft:\n\nSubject: Leave Request\n\nHi [Manager],\nI would like to request leave from [date] to [date]. Please let me know if this works.\n\nThanks,\n[Your Name]",
      },
      { id: "msg20", role: "user", content: "Perfect, that works!" },
    ],
  },
  {
    id: "conv5",
    messages: [
      {
        id: "msg21",
        role: "user",
        content: "What are some good JavaScript frameworks?",
      },
      {
        id: "msg22",
        role: "assistant",
        content: "Some popular ones are React, Vue, and Angular.",
      },
      {
        id: "msg23",
        role: "user",
        content: "Which one is best for beginners?",
      },
      {
        id: "msg24",
        role: "assistant",
        content:
          "React is often recommended for beginners due to its large community and ecosystem.",
      },
      { id: "msg25", role: "user", content: "Thanks, I’ll start with React!" },
    ],
  },
];
