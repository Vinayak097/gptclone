"use client";
import { useEffect, useState } from "react";
import SideSlide from "./components/SideSlide";
import Input from "./components/Input";
import Messages, { Roles } from "./components/Messages";

import { useMessage } from "@/hooks/useMessage";
import { Message } from "./components/Types";
import Auth from "./components/Auth";

import { backend_url } from "@/config";
export interface User{
    email:string,
    id:string,
    createdAt:string,
    updatedAt:string
}
export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [currentAssistantMessage, setCurrentAssistantMessage] = useState("");
  const [messages,setMessages]=useState<Message[]|[]>([])
  const [showauth, setShowAuth]=useState(false)
  const [user ,setUser]=useState<null|User>(null)
  
  
  


  const {data , isLoading:convesationLoading} =useMessage(conversationId);
  useEffect(()=>{
    console.log("data  calling messages" , data)
    if(Array.isArray(data)){
      setMessages(data)
    }else{
      setMessages([])
    }
    
  },[data])

  const handleChat = async (userMessage: string) => {
    if (!userMessage.trim() || convesationLoading) return;

    // Add user message to the store
    if(!user){
      setShowAuth(true)
      return;
    }
    
    const usermessage:Message={
      role:Roles.user,
      content:userMessage,
      id:`user-${Date.now()}`
    }
    setMessages(prev=>[...prev,usermessage])

    // Call the API and handle streaming
    await callApi(userMessage);
  };

  const callApi = async (userMessage: string) => {
    setIsLoading(true);
    setCurrentAssistantMessage("");
    const tempraryId=`assistant-${Date.now()}`
    const assistanmessage:Message={
      role:Roles.assistant,
      content:"",
      id:tempraryId
    }

    setMessages(prev=>[...prev,assistanmessage])
    try {
      const token = localStorage.getItem("token") ;
      if(token){

      }
      const response = await fetch("http://localhost:3001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: userMessage, conversationId :conversationId||"" }),
      });

      if (!response.ok) {
        console.log("responsoen not okay ")
        if(response.status==403){
          setShowAuth(true)
        }
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
                  setCurrentAssistantMessage("");
                }
                break;
              } else {
                try {
                  // Parse the JSON data
                  const parsedData = JSON.parse(data);
                  setMessages(prev=>
                    prev.map(m=>m.id==tempraryId?
                      {...m,content:m.content+parsedData.content} :
                      m
                    )
                  )
                  
                } catch (e) {
                  // If it's not JSON, treat as plain text
                  console.log(e)
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
                  
                }
              }
            }
          }
        }
      }
    } catch (error: any) {
      console.error("Streaming error:", error);
      
    } finally {
      setIsLoading(false);
      // addMessage(currentAssistantMessage ,Roles.assistant , conversationId)
      
    }
  };

  const createNewChat = () => {
    setConversationId(null);
    setMessages([]);
  };
  useEffect(()=>{
    async function fetches() {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backend_url}/user`, {
        method: "GET",
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        return null;
      } else {
        const data = await res.json();
        setUser(data.user);
      }

      return;
    }
    fetches()
  },[])
  
  console.log("conversatin id changes " , conversationId)
  console.log(currentAssistantMessage , 'asssitatent')
  return (
    <div className=  " bg-secondary h-screen flex">
      
      
      <SideSlide 
        conversationID={conversationId} 
        setConversationId={setConversationId}
        onCreateNewChat={createNewChat}
      />
      <div className="relative flex-1 flex flex-col">
        <div className="">
          {showauth &&<Auth setUser={setUser} setShowAuth={setShowAuth } ></Auth>}
      

      </div>
        <nav className="bg-primary flex justify-between p-4">
          <h1 className="text-white font-extralight text-md -tracking-wider">Promptly</h1>
          <div className="border-dotted text-white text-sm ">...</div>
        </nav>

        <div className="flex-grow overflow-hidden flex flex-col">
          <div className="flex-grow overflow-auto container mx-auto md:w-4xl">
            <Messages  messages={messages} />
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