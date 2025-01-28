import React from 'react';
import emp1 from "../assets/emp1.jpg";

const TopEmployeeCard = () => {
  return (
    <div className='flex items-center px-4 gap-4'>
        <div className='w-30 h-30 rounded-full border-2 border-purple-600 overflow-hidden flex justify-center items-center'>
                <img src={emp1} className='w-full h-full object-cover'/>
        </div>

        <div>
            <h1>UserName</h1>
            <h1>Rating</h1>
        </div>


        <div>

        </div>
    </div>
  )
}

export default TopEmployeeCard