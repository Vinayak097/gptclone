import React, { Dispatch, SetStateAction } from 'react'
import Conversations from './Conversations'
import useConversations from '@/utils/useConversation'

const SideSlide = ({
  setConversationId,
  conversationID,
  onCreateNewChat
}: {
  setConversationId: Dispatch<SetStateAction<string | null>>,
  conversationID: string | null,
  onCreateNewChat: () => void
}) => {
  const { data, isLoading, mutate } = useConversations();
  
  if (isLoading) {
    return (
      <div className="hidden md:block relative h-screen w-xs bg-neutral-900 overflow-auto p-4">
        <div className="text-white">Loading conversations...</div>
      </div>
    )
  }
   
  return (
    <div className="hidden md:block relative h-screen w-xs bg-neutral-900 overflow-auto">
      <div className="p-4">
        <h1 className="text-white text-xl font-bold mb-4">Chats</h1>
        
        <div 
          onClick={onCreateNewChat}
          className={`overflow-hidden bg-neutral-700 px-3 py-2 mb-2 rounded-lg shadow-lg hover:bg-neutral-600 cursor-pointer text-white`}
        >
          + New Chat
        </div>
        
        {data && data.conversations.map((conversation: {conversationId: string, title: string}) => (
          <Conversations 
            key={conversation.conversationId} 
            title={conversation.title} 
            setSelected={setConversationId} 
            conversationId={conversation.conversationId} 
            isSelected={conversationID === conversation.conversationId}
          />
        ))}
      </div>
    </div>
  )
}

export default SideSlide