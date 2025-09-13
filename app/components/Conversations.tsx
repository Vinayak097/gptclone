import React, { Dispatch, SetStateAction } from 'react'

type Params = {
  conversationId: string
  title: string
  setSelected: Dispatch<SetStateAction<string | null>>
  isSelected: boolean
}

const Conversations = ({ conversationId, title, setSelected, isSelected }: Params) => {
  return (
    <div 
      onClick={() => setSelected(conversationId)} 
      className={`overflow-hidden px-3 py-2 mb-2 rounded-lg shadow-lg hover:bg-neutral-600 cursor-pointer text-white ${
        isSelected ? 'bg-neutral-600' : 'bg-neutral-700'
      }`}
    >
      {title || "Untitled Conversation"}
    </div>
  )
}

export default Conversations