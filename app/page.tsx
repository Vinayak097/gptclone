"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Alternative scroll method using chatRef
  const scrollToBottomInstant = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  };

  // Scroll when messages change or current message updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage]);

  const callApi = async (userMessage: string) => {
    setIsLoading(true);
    setCurrentMessage("");
    try {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Streaming
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        console.log('Reader is undefined');
        setIsLoading(false);
        return;
      }

      let buffer = "";
      let fullMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });

        // Process complete lines from buffer (handling SSE format)
        while (true) {
          const lineEnd = buffer.indexOf('\n');
          if (lineEnd === -1) break;

          const line = buffer.slice(0, lineEnd).trim();
          buffer = buffer.slice(lineEnd + 1);

          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            
            if (data === '') continue; // Skip empty data lines

            try {
              // If it's JSON (OpenAI format)
              const parsed = JSON.parse(data);
              const content = parsed?.choices?.[0]?.delta?.content;
              if (content) {
                fullMessage += content;
                setCurrentMessage(fullMessage);
              }
            } catch (e) {
              // If it's plain text, just append it
              if (data) {
                fullMessage += data;
                setCurrentMessage(fullMessage);
              }
            }
          } else if (line && !line.startsWith('data:')) {
            // Handle plain text streaming (non-SSE format)
            fullMessage += line;
            setCurrentMessage(fullMessage);
          }
        }
      }

      // Add the complete message to messages array
      if (fullMessage) {
        setMessages(prev => [...prev, `You: ${userMessage}`, `AI: ${fullMessage}`]);
      }

    } catch (error:any) {
      console.error('Streaming error:', error);
      setMessages(prev => [...prev, `You: ${userMessage}`, `AI: Error: ${error.message}`]);
    } finally {
      setIsLoading(false);
      setCurrentMessage("");
    }
  };

  // Initial call
  useEffect(() => {
    callApi("Is this working?");
  }, []);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      callApi(input.trim());
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="bg-neutral-600">

    </div>
  );
}