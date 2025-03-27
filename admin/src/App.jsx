import React from 'react'
import {Routes, Route} from 'react-router-dom';
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import LeetcodeList from './pages/LeetcodeList';
import CodeforcesList from './pages/CodeforcesList';
import CodechefList from './pages/CodechefList';
import SearchBar from './components/Searchbar';

const App = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <SearchBar />
      <hr />

      <div className='flex w-full'>
        <Sidebar />
        <div className='w-[70%] mx-auto ml-[max(5vw, 25px)] my-8 text-gray-600 text-base'>
          <Routes>
            <Route path='/leetcode' element={<LeetcodeList />} />
            <Route path='/codeforces' element={<CodeforcesList />} />
            <Route path='/codechef' element={<CodechefList />} />
          </Routes>
        </div>

      </div>
    </div>
  )
}

export default App
