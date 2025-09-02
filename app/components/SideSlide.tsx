import React, { useState } from 'react'

import Conversations from './Conversations'
import { demoConversations } from './Types'
const SideSlide = () => {
  const [selected,setSelected]=useState<string>(demoConversations[0].id ||'')
  return (
    <div className="hidden md:block relative h-screen w-xs bg-neutral-900">
      <div>
        <h1 className='m-1 p-1'>Chat</h1>
      {demoConversations.map((conversation , index)=>(
      <Conversations title="title" setSelected={setSelected} conversationId={conversation.id} selected={conversation.id==selected} ></Conversations>
      ))}
      </div>
      
      
    </div>
  )
}

export default SideSlide