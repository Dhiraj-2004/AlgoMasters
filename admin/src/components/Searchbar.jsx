import React, { useContext } from 'react'
import { assets } from '../assets/assets';
import {SearchContext} from '../context/SearchContext';

const SearchBar = () => {

  const {search, setSearch, showSearch, setShowSearch} = useContext(SearchContext);

  return showSearch ? (
    <div className='bg-black text-center'>
        <div className='inline-flex items-center justify-center border border-gray-400 px-5 py-2 my-5 mx-3 rounded-full w-3/4 sm:w-1/2'>
            <input value={search} onChange={(e) => setSearch(e.target.value)} className='flex-1 outline-none bg-inherit text-sm text-gray-200' type='text' placeholder='Search' />
            <img onClick={() => { console.log('Cross Clicked'); setShowSearch(false);}} className='inline w-3 cursor-pointer' src={assets.cross_icon} alt="" />
        </div>
    </div>
  ) : null
}

export default SearchBar
