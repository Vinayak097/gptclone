"use client";
import { useEffect, useState, useRef } from "react";
import SideSlide from "./components/SideSlide";
import Input from "./components/Input";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [newChat,setNewChat]=useState(false);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Alternative scroll method using chatRef

  // Scroll when messages change or current message updates
  useEffect(() => {
    scrollToBottom();
  }, [messages, currentMessage]);

  const callApi = async (userMessage: string) => {
    setIsLoading(true);
    setCurrentMessage("");
    if(!userMessage){
      console.log("usermessage empty")
      return;
    }
    try {
      const token=localStorage.getItem('token') ||"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxYzJjNGIyNS04ZWE4LTRjMmEtYjRhOS1kNzA4NDY4MTlmYTkiLCJpYXQiOjE3NTc0MDQxNzB9.Za2x8z02gKMU4h52rSAf8M6ALuUF1isgO-e9rsy5eak"
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" ,Authorization: `Bearer ${token}`},
        body: JSON.stringify({ message: userMessage ,conversationId:""}),
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

            
              // If it's JSON (OpenAI format)
              console.log(  "data " , data)
              
              
              
              if (data) {
                
                fullMessage += data;
                console.log(fullMessage)
                console.log(currentMessage)
                setCurrentMessage(fullMessage);              }
            
          } else if (line && !line.startsWith('data:')) {
            // Handle plain text streaming (non-SSE format)
            console.log("non see format"  ,line)
            fullMessage += line;
            
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
      
    }
  };

  // Initial call


 

 
  return (
    <div className=" bg-secondary h-screen flex  ">
      <SideSlide></SideSlide>
      <div className="flex-1  flex flex-col">
        <nav className="bg-primary flex justify-between m-3 " >
          <h1 className="px-4 py-2 bg-primary w-fit h-fit rounded-lg ">GptClone</h1>
          <div className=" border-dotted">TF</div>
        </nav>


      {/* hero */}
        <div className=" bg- h-full   md:m-">
          <div className=" flex justify-center items-center   text-black  mt-2 h-full">
            <div className="w-full mx-2 max-w-4xl  h-full bg-neutral-600 relative">
              {currentMessage}
              <div className={`bottom-8 absolute w-full  `}>
                <Input chatApi={callApi} isLoading={isLoading}></Input>
              </div>
            </div>           
          </div>
        </div>
      </div>
    </div>
  );
}