"use client";
import { useEffect, useState } from "react";
import SideSlide from "./components/SideSlide";
import Input from "./components/Input";
import Messages, { Roles } from "./components/Messages";
import messageStore from "@/store/messages.store";
import useConversations from "@/utils/useConversation";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const { messages, addMessage, setMessages } = messageStore();
  const { data: conversations, isLoading: isLoadingConversations, mutate } = useConversations();

  // Load messages when conversation changes
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId]);

  const loadConversationMessages = async (convId: string) => {
    try {
      const token = localStorage.getItem("token") || "your_fallback_token";
      const response = await fetch(`http://localhost:3001/conversations/${convId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const conversation = await response.json();
        setMessages(conversation.messages || []);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const handleChat = async (userMessage: string) => {
    if (!userMessage) return;

    // Add user message to the store
    addMessage(userMessage, Roles.user, conversationId);

    // Call the API and handle streaming
    await callApi(userMessage);
  };

  const callApi = async (userMessage: string) => {
    setIsLoading(true);
    setCurrentAssistantMessage("");
    
    try {
      const token = localStorage.getItem("token") || "your_fallback_token";
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, conversationId :conversationId||"" }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) {
        throw new Error("No reader available");
      }

      let newConversationId = conversationId;
      let buffer = "";
      let done = false;

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          buffer += decoder.decode(value, { stream: true });
          
          // Process each line in the buffer
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          
          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") {
                // Finalize the assistant message
                if (currentAssistantMessage) {
                  addMessage(currentAssistantMessage, Roles.assistant, newConversationId);
                  setCurrentAssistantMessage("");
                }
                break;
              } else {
                try {
                  // Parse the JSON data
                  const parsedData = JSON.parse(data);
                  setCurrentAssistantMessage(prev => prev + parsedData.content);
                } catch (e) {
                  // If it's not JSON, treat as plain text
                  setCurrentAssistantMessage(prev => prev + data);
                }
              }
            } else if (line.startsWith("event: convId")) {
              const nextLine = lines[lines.indexOf(line) + 1];
              if (nextLine && nextLine.startsWith("data: ")) {
                const receivedConvId = nextLine.slice(6);
                if (!newConversationId) {
                  newConversationId = receivedConvId;
                  setConversationId(receivedConvId);
                  // Refresh conversations list
                  mutate();
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Streaming error:", error);
      addMessage("Error: Failed to get response", Roles.assistant, conversationId);
    } finally {
      setIsLoading(false);
    }
  };

  const createNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };

  return (
    <div className="bg-secondary h-screen flex">
      <SideSlide 
        conversationID={conversationId} 
        setConversationId={setConversationId}
        onCreateNewChat={createNewChat}
      />
      <div className="flex-1 flex flex-col">
        <nav className="bg-primary flex justify-between p-4">
          <h1 className="text-white font-bold text-xl">GptClone</h1>
          <div className="border-dotted text-white">TF</div>
        </nav>

        <div className="flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto">
            <Messages conversationId={conversationId} />
            {/* Display current assistant message while streaming */}
            {isLoading && currentAssistantMessage && (
              <div className="flex justify-start p-4">
                <div className="max-w-md p-3 rounded-2xl bg-primary mr-10 text-white">
                  {currentAssistantMessage}
                </div>
              </div>
            )}
          </div>
          <div className="p-4">
            <Input chatApi={handleChat} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}