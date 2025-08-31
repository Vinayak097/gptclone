"use client";
import { useEffect } from "react";

export default function Home() {
    useEffect(() => {
    async function callApi() {
      const response = await fetch("http://localhost:3000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: "create a todo app" }),
      });

      // Streaming
      const reader = await response.body?.getReader();
      const decoder = new TextDecoder();
      if(!reader){
        console.log('reader is undefined')
        return
      }
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        console.log(decoder.decode(value),   'decoder here');
      }
    }

    callApi();
  }, []);
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
    
    </div>
  );
}
