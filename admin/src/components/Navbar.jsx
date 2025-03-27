import React from 'react'
import { assets } from '../assets/assets'
import { useContext } from 'react'
import { SearchContext } from '../context/SearchContext'

const Navbar = () => {

  const {setShowSearch} = useContext(SearchContext)

  return (
    <div className='flex items-center py-4 px-[4%] justify-between' >
      <img className='h-10' src={assets.logo} alt="" />
      <div className='flex gap-6 items-center'>
        <img onClick={() => setShowSearch(true)} className="h-7 cursor-pointer" src={assets.search_icon} alt="Search Icon" />
        <button className='bg-[#ff5757] text-black px-5 py-2 sm:px-7 sm:py-2 rounded-full sm:text-sm' >Logout</button>
      </div>
    </div>
  )
}

export default Navbar
