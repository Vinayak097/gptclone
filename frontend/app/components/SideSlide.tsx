import React, { Dispatch, SetStateAction, useState } from 'react'
import Conversations from './Conversations'
import useConversations from '@/hooks/useConversation'
import { PanelRight ,FilePenLine } from 'lucide-react'
import useMobile from '@/hooks/useMobile'

const SideSlide = ({
  setSideOpen,
  sideOpen,
  setConversationId,
  conversationID,
  onCreateNewChat,
  handleSideOpen
}: {
  setConversationId: Dispatch<SetStateAction<string | null>>,
  conversationID: string | null,
  onCreateNewChat: () => void,
  setSideOpen:Dispatch<SetStateAction<boolean>>,
  sideOpen:boolean,
  handleSideOpen:()=>void
}) => {
  const { data, isLoading, } = useConversations();
  const [hoverlogo,sethoverLogo]=useState();
  const isMobile=useMobile()
  
  
   
  return (
    <div
  className={`
    ${isMobile 
      ? `fixed top-0 left-0 h-screen w-64 z-50 bg-neutral-900 shadow-2xl transform transition-transform duration-300
          ${sideOpen ? "translate-x-0" : "-translate-x-full"}`
      : `${sideOpen ? "w-68" : "w-18"} relative bg-neutral-900`
    }
    overflow-auto text-xs 
  `}
>
        <div className='  mx-4 mt-4 flex  justify-between  '>
          
          
          {/* <!-- GPT-clone icon: inherits color via `currentColor` (use Tailwind like `text-violet-600`) --> */}
<svg className='w-8' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
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
{sideOpen && <PanelRight onClick={handleSideOpen} className='w-8' />}


        </div>
      <div className="p-4 mt-1">
        
        <div 
          onClick={onCreateNewChat}
          className={`overflow-hidden flex gap-4 items-center  px-3 py-2 ${!sideOpen && "p-2"} bg-neutral-700 mb-2 rounded-lg shadow-lg hover:bg-neutral-600 cursor-pointer text-white`}
        >
          
          <FilePenLine />
          {sideOpen && <span>+ New Chat</span>}
        </div>
        {isLoading && sideOpen &&
        <div className="hidden md:block relative h-screen w-xs bg-neutral-900 overflow-auto p-4">
        <div className="text-white">Loading conversations...</div>
      </div>}
      {sideOpen &&
      <div>
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
        }
      </div>
    </div>
  )
}

export default SideSlide