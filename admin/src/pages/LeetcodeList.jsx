import React, { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { SearchContext } from '../context/SearchContext';

const LeetcodeList = () => {
  const { search } = useContext(SearchContext);

  const [students] = useState([
    { rank: 1, name: 'Alice Johnson', rating: 950, year: '1st Year' },
    { rank: 2, name: 'Bob Smith', rating: 900, year: '2nd Year' },
    { rank: 3, name: 'Charlie Brown', rating: 850, year: '3rd Year' },
    { rank: 4, name: 'Diana Ross', rating: 800, year: '4th Year' },
    { rank: 5, name: 'Eve Davis', rating: 750, year: '1st Year' },
  ]);

  // Filter students based on the search query
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(search.toLowerCase()) ||
    student.year.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <p className="my-3 text-4sm flex flex-end items-center cursor-pointer gap-2 text-gray-400">
        FILTERS
        <img className="h-4" src={assets.dropdown_icon} alt="Filter icon" />
      </p>
      <div className="flex gap-2 mb-2">
        <p className="mt-4 mb-3 text-3xl text-gray-200">Student</p>
        <p className="mt-4 mb-3 text-3xl text-[#ff5757]">Rankings</p>
      </div>
      <div className="flex flex-col gap-2">
        {/* ----------Table Header---------- */}
        <div className="bg-[#ff5757] hidden md:grid grid-cols-[0.7fr_1.5fr_1.5fr_1fr] items-center pl-6 py-3 px-2 border-b rounded-t-lg text-2sm text-black font-semibold">
          <p className="bg-[#ff5757]">Rank</p>
          <p className="bg-[#ff5757]">Student Name</p>
          <p className="bg-[#ff5757]">Studying Year</p>
          <p className="bg-[#ff5757]">Rating</p>
        </div>

        {/* ----------Table Rows---------- */}
        {filteredStudents.map((student, index) => (
          <div
            className="grid grid-cols-[0.7fr_1.5fr_1.5fr_1fr] items-center gap-2 py-3 pl-6 px-2 border-b border-gray-600 text-gray-200 text-sm"
            key={index}
          >
            <p>{student.rank}</p>
            <p>{student.name}</p>
            <p>{student.year}</p>
            <p>{student.rating}</p>
          </div>
        ))}

        {/* If no students match the search */}
        {filteredStudents.length === 0 && (
          <div className="text-center text-gray-400 mt-4">
            No students found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

export default LeetcodeList;
