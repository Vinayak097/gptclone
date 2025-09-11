import React from 'react'
type params={
    conversationId:string
    title:string
    selected:boolean
    setSelected:(id:string)=>void
}
const Conversations = ({conversationId,title ,selected , setSelected}:params) => {
  return (
    <div onClick={()=>{setSelected(conversationId)}} className={`${selected ?"overflow-hidden bg-neutral-700":""} px-3 py-2  mx-2  rounded-lg  shadow-lg hover:bg-neutral-600`}>
        {title}
    </div>
  )
}

export default Conversations