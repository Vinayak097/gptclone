import React, { useState } from 'react'
import { Roles } from './Messages'

const Input = ({ chatApi, isLoading }: { chatApi: (message: string) => Promise<void>, isLoading: boolean }) => {
  const [query, setQuery] = useState("") 
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      await chatApi(query);
      setQuery("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='flex justify-between p-2 bg-neutral-800 rounded-full mx-2'>
      <input 
        value={query} 
        onChange={(e) => setQuery(e.target.value)} 
        type="text" 
        placeholder='Ask anything...'  
        className='px-4 py-2 focus:outline-none flex-1 bg-transparent text-white'
        disabled={isLoading}
      />        
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