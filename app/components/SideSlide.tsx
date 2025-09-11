import React, { useState } from 'react'

import Conversations from './Conversations'
import { demoConversations } from './Types'
import useConversations from '@/utils/useConversation'
const SideSlide = () => {
  const [selected,setSelected]=useState<string>(demoConversations[0].id ||'')
   const { data, isLoading } = useConversations();

   if(isLoading){
    return (
      <div>Loading</div>
    )
   }
   console.log(data , 'data')
  return (

    <div className="hidden md:block relative h-screen w-xs bg-neutral-900 overflow-auto">
      <div className=''>
        <h1 className='m-1 p-1'>Chat</h1>
      {data && data.conversations.map((conversation :{id:string,title:string}, index:number)=>(
      <Conversations key={index} title={conversation.title} setSelected={setSelected} conversationId={conversation.id} selected={conversation.id==selected} ></Conversations>
      ))}
      </div>
      
      
    </div>
  )
}

export default SideSlide