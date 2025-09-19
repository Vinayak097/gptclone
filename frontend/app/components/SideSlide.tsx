import React, { Dispatch, SetStateAction } from 'react'
import Conversations from './Conversations'
import useConversations from '@/hooks/useConversation'

const SideSlide = ({
  setConversationId,
  conversationID,
  onCreateNewChat
}: {
  setConversationId: Dispatch<SetStateAction<string | null>>,
  conversationID: string | null,
  onCreateNewChat: () => void
}) => {
  const { data, isLoading, } = useConversations();
  
  if (isLoading) {
    return (
      <div className="hidden md:block relative h-screen w-xs bg-neutral-900 overflow-auto p-4">
        <div className="text-white">Loading conversations...</div>
      </div>
    )
  }
   
  return (
    <div className="hidden md:block relative h-screen w-xs bg-neutral-900 overflow-auto  text-xs max-w-68 sidebar ">
      
        <div className='w-6  ml-4 mt-4'>
          {/* <!-- GPT-clone icon: inherits color via `currentColor` (use Tailwind like `text-violet-600`) --> */}
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <title>GPT Clone</title>
  {/* <!-- rounded square / badge --> */}
  <rect x="1.5" y="1.5" width="21" height="21" rx="5" ry="5" stroke="currentColor" fill="none"/>
  {/* <!-- stylized network / nodes --> */}
  <line x1="8.2" y1="9.2" x2="12" y2="7" />
  <line x1="12" y1="7" x2="15.8" y2="9.2" />
  <line x1="9.6" y1="12.8" x2="12" y2="11" />
  <line x1="12" y1="11" x2="14.4" y2="12.8" />
  {/* <!-- small nodes --> */}
  <circle cx="8.2" cy="9.2" r="0.95" fill="currentColor" stroke="none"/>
  <circle cx="12" cy="7" r="0.95" fill="currentColor" stroke="none"/>
  <circle cx="15.8" cy="9.2" r="0.95" fill="currentColor" stroke="none"/>
  <circle cx="9.6" cy="12.8" r="0.95" fill="currentColor" stroke="none"/>
  <circle cx="12" cy="11" r="0.95" fill="currentColor" stroke="none"/>
  <circle cx="14.4" cy="12.8" r="0.95" fill="currentColor" stroke="none"/>
  {/* <!-- subtle inner curve to suggest 'G' shape (abstract) --> */}
  <path d="M7.5 15.5c1.1 1.6 2.9 2.6 4.9 2.6 2.8 0 5.1-2.3 5.1-5.1S15.2 8 12.4 8" stroke="currentColor" fill="none"/>
  <path d="M14.2 13.7h-2.6" stroke="currentColor" />
</svg>

        </div>
      <div className="p-4 mt-1">
        
        <div 
          onClick={onCreateNewChat}
          className={`overflow-hidden  bg-neutral-700 px-3 py-2 mb-2 rounded-lg shadow-lg hover:bg-neutral-600 cursor-pointer text-white`}
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