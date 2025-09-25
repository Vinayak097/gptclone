import React, { useState } from 'react'
type Model =
  | "gpt-4o" // Latest, most capable
  | "gpt-4o-mini" // Fast and cheap
  | "gpt-4-turbo" // Previous generation
  | "gpt-3.5-turbo"|
  "gpt-4o-mini-code"|
  "gpt-3.5-turbo-16k"|
  "gpt-4o-mini-code"|
  "gpt-4o-code"
  type Models=
    {value:Model,label:string}
  
  const models:Models[] = [
  { value: "gpt-4o", label: "GPT-4o (Latest GPT-4)" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini (Fast & cheap)" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo (Previous generation)" },
  { value: "gpt-4o-code", label: "GPT-4 Code (Optimized for coding)" },
  { value: "gpt-4o-mini-code", label: "GPT-4 Mini Code (Fast for coding)" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (Standard)" },
  { value: "gpt-3.5-turbo-16k", label: "GPT-3.5 Turbo 16k (Long context)" },
];

const Input = ({ chatApi, isLoading }: { chatApi: (message: string) => Promise<void>, isLoading: boolean }) => {
  const [query, setQuery] = useState("") 
  const [selectModel,setSelectedModel]=useState("gpt-4o");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      await chatApi(query,selectModel);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex justify-between p-2 bg-third rounded-full  mb-2 max-w-3xl mx-auto'>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        type="text" 
        placeholder='Ask anything...'  
        className='px-4 py-2 focus:outline-none flex-1 bg-transparent text-white'
        disabled={isLoading}
      />
      <select className='border border-neutral-500 w-fit mr-2 p-2 outline-none'
      id='model'
      name="model"
      value={selectModel}
       onChange={(e) => setSelectedModel(e.target.value)}
      >
        
         {models.map((m) => (
          <option key={m.value} value={m.value} className='w-fit text-neutral-400 bg-third'>
            {m.value}
          </option>
        ))}
      </select>
      
      <button 
        type="submit"
        disabled={isLoading || !query.trim()}
        className='cursor-pointer px-4 py-2 bg-blue-500 rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {isLoading ? "Sending..." : "Send"}
      </button>
    </form>
  )
}

export default Input