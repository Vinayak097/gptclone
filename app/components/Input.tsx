import React, { useCallback, useState } from 'react'

const Input = ({chatApi ,isLoading} :{chatApi:(message:string)=>Promise<void>,isLoading:boolean}) => {
  const [query ,setQuery]=useState("") 
  console.log(isLoading , ' loading')
  return (
    <div className='flex justify-between p-4 bg-third rounded-l-full rounded-r-full mx-2'>
        <input onChange={(e)=>setQuery(e.target.value)} type="text" placeholder='Ask anything'  className='px-4 py-2 focus:outline-none  md:w-md '/>        
        <button onClick={()=>{chatApi(query)}} className='cursor-pointer px-3 py-1 bg-fourth rounded-2xl'>
          {isLoading ?"loading": "Send" }</button>
    </div>
  )
}

export default Input