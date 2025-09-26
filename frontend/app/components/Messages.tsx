// filepath: d:\codeLab\projects\gptclone\frontend\app\components\Messages.tsx
import { useEffect, useRef } from "react";
import { Message } from "./Types";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export enum Roles {
  user = "user",
  assistant = "assistant",
}

interface Props {
  messages: Message[];
}

const Messages = ({ messages }: Props) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Function to render message content with code highlighting
  const renderMessageContent = (content: string) => {
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
      const [fullMatch, language, code] = match;
      const startIndex = match.index;

      // Push plain text before the code block
      if (startIndex > lastIndex) {
        parts.push(content.slice(lastIndex, startIndex));
      }

      // Push the code block
      parts.push(
        <SyntaxHighlighter
          key={startIndex}
          language={language || "plaintext"}
          style={oneDark}
          customStyle={{ borderRadius: "8px", fontSize: "0.9rem" }}
        >
          {code.trim()}
        </SyntaxHighlighter>
      );

      lastIndex = startIndex + fullMatch.length;
    }

    // Push remaining plain text after the last code block
    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    return parts.map((part, index) =>
      typeof part === "string" ? <span key={index}>{part}</span> : part
    );
  };

  return (
    <div className="flex flex-col text-white space-y-4 p-4 overflow-auto h-full">
      {messages &&
        messages.map((message: Message, index: number) => (
          <div
            key={index}
            className={`flex gap-2 ${
              message.role === Roles.user ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={` p-2 rounded-2xl ${
                message.role === Roles.user
                  ? "bg-third ml-10"
                  : "bg-primary mr-10"
              }`}
            >
              {renderMessageContent(message.content)}
            </div>
          </div>
        ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Messages;