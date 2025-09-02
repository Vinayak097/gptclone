import React from 'react'

const Input = () => {
  return (
    <div className='flex p-4 bg-third rounded-l-full rounded-r-full mx-2'>

        <input type="text" placeholder='Ask anything'  className='px-4 py-2 focus:outline-none  md:w-md '/>        
        
            <button className='px-3 py-1 bg-fourth rounded-2xl'>Send</button>
        
    </div>
  )
}

export default Input