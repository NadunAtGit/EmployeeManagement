import React from 'react';
import {DayPicker} from "react-day-picker";
import moment from 'moment';
import { MdOutlineDateRange,MdClose } from 'react-icons/md';

import { useState } from 'react';

const DateSelector = ({date,setDate}) => {
    
    const [openDatePicker, setOpenDatePicker] = useState(false); 

    
  return (
    <div>
    <button className='inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200 rounded-lg px-2 py-1 hover:bg-sky-200/20 cursor-pointer' onClick={()=>{setOpenDatePicker(true)}}>
                    <MdOutlineDateRange className='text-lg'/>

                    {date ? moment(date).format('Do MMM YYYY') : moment().format('Do MMM YYYY')}
    </button>


        {openDatePicker && <div className='overflow-y-scroll  p-5 bg-sky-50 relative'>
            <button className='w-10 h-10 rounded-full flex items-center  justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2' onClick={()=>{
                setOpenDatePicker(false);
            }}>
                <MdClose className='text-xl text-sky-600'/>
            </button>

            <DayPicker
  captionLayout="dropdown-buttons"
  mode="single"
  selected={date}
  onSelect={setDate}
  pagedNavigation
  classNames={{
    root: 'p-4 bg-sky-50 rounded-lg shadow-md', // Root wrapper
    table: 'table-auto border-separate', // Make table cells spaced
    head: 'text-sky-600 font-semibold', // Header row
    row: 'space-y-2', // Add vertical spacing between rows
    cell: 'px-2 py-1', // Add padding between days (columns)
    day: 'text-sky-700 hover:bg-sky-200 rounded-lg font-medium', // Style each day
    selected: 'bg-sky-600 text-white rounded-lg font-bold', // Style selected day
    today: 'bg-sky-300 font-bold', // Style today
  }}
/>




            
        </div>}

        
    </div>
    
  )
}

export default DateSelector