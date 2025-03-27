import React from 'react'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets.js'

const Sidebar = () => {
  return (
    <div className='w-[18%] min-h-screen border-r-2 text-white'>
      <div className='flex flex-col gap-4 pt-6 pl-[20%] text-[15px]'>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to='/leetcode'>
            <img className='w-5 h-5' src={assets.leetcode} alt="" />
            <p className='hidden md:block'>LeetCode</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/codechef">
            <img className='w-5 h-5' src={assets.codechef} alt="" />
            <p className='hidden md:block'>CodeChef</p>
        </NavLink>

        <NavLink className='flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l' to="/codeforces">
            <img className='w-5 h-5' src={assets.codeforces} alt="" />
            <p className='hidden md:block'>CodeForces</p>
        </NavLink>

      </div>
    </div>
  )
}

export default Sidebar
