import { useContext, useEffect, useState } from "react";
import Dropdown from "../component/Dropdown";
import { ThemeContext } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { assets } from "../assets/assets";
import toast, { Toaster } from "react-hot-toast";
import { FaTrophy } from "react-icons/fa";
import { BiSortUp, BiSortDown } from "react-icons/bi";
import Export from "../component/Export";
import { IoMdClose } from "react-icons/io";

const AllUserData = () => {
  const [platform, setPlatform] = useState("LeetCode");
  const [department, setDepartment] = useState("Department");
  const [users, setUsers] = useState(null);
  const [searchOption, setSearchOption] = useState("Search Option");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [year, setYear] = useState("Select year");
  const [isOpen, setIsOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const pages = [
    { value: 10, label: "10 / page" },
    { value: 20, label: "20 / page" },
    { value: 50, label: "50 / page" },
    { value: 100, label: "100 / page" },
  ];

  const platformOptions = ["Select Platform", "LeetCode", "CodeChef", "Codeforces"];
  const departmentOptions = [
    "Department",
    "COMPUTER ENGINEERING",
    "ELECTRONICS AND TELECOMMUNICATION",
    "INFORMATION TECHNOLOGY",
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
    "ELECTRONICS AND COMPUTER",
  ];
  const searchOptions = ["Search Option", "Roll No", "Name", "UserName", "Registered ID"];
  const yearOptions = ["Select year", "First Year", "Second Year", "Third Year", "Forth Year"];

  useEffect(() => {
    const fetchData = async () => {
      setLoader(true);
      setErrorMessage(null);
      try {
        const site = platform === "Codeforces" ?
          "codeforcesUser" : platform === "CodeChef"
            ? "codechefUser" : "leetcodeUser";

        const departmentParam = department && department !== "Department"
          ? `&department=${department}` : "";

        const yearUser = year && year !== "Select year"
          ? `&year=${year}` : ""

        const searchParam = searchQuery
          ? `&searchBy=${encodeURIComponent(searchOption)}&search=${encodeURIComponent(searchQuery)}`
          : "";

        const url = `${backendUrl}/api/user?platform=${site}${departmentParam}${yearUser}${searchParam}`;
        const response = await axios.get(url);
        setUsers(response.data.users);
        setCurrentPage(1);
      } catch (error) {
        setErrorMessage(error.response?.data?.error || "An error occurred");
        toast.error(error.response?.data?.error || "Failed to fetch data");
      } finally {
        setLoader(false);
      }
    };
    fetchData();
  }, [platform, department, searchQuery, backendUrl, year]);

  const handleSearch = () => {
    setSearchQuery(searchText);
    setSearchText("");
  };

  const handleSort = (column) => {
    const sortableColumns = ["Roll No", "Solved", "Rating"];
    if (sortableColumns.includes(column)) {
      const newSortOrder = sortColumn === column && sortOrder === "asc" ? "desc" : "asc";
      setSortColumn(column);
      setSortOrder(newSortOrder);
    }
  };

  const handleDropdownChange = (event) => {
    setEntriesPerPage(parseInt(event.target.value));
    setCurrentPage(1);
  };

  const getSortingIcon = (column) => {
    const sortableColumns = ["Roll No", "Solved", "Rating"];
    if (!sortableColumns.includes(column)) return null;

    const isActive = sortColumn === column;
    const iconColor = theme === "dark" ? "text-teal-400" : "text-teal-600";
    const inactiveColor = theme === "dark" ? "text-gray-500" : "text-gray-400";

    return isActive ? (
      sortOrder === "asc" ? (
        <BiSortUp className={`inline ml-2 text-xl ${iconColor} transition-transform duration-200`} />
      ) : (
        <BiSortDown className={`inline ml-2 text-xl ${iconColor} transition-transform duration-200`} />
      )
    ) : (
      <BiSortUp className={`inline ml-2 text-xl ${inactiveColor} opacity-60 hover:opacity-100 hover:text-green-400 transition-opacity duration-200`} />
    );
  };

  const sortedUsers = users ? [...users] : [];
  if (sortColumn) {
    sortedUsers.sort((a, b) => {
      let aValue, bValue;
      switch (sortColumn) {
        case "Roll No":
          aValue = a.roll || "";
          bValue = b.roll || "";
          break;
        case "Solved":
          aValue = Number(a.platformSpecificData?.[platform.toLowerCase()]) || 0;
          bValue = Number(b.platformSpecificData?.[platform.toLowerCase()]) || 0;
          break;
        case "Rating":
          aValue = Number(a.ranks?.globalRank) || 0;
          bValue = Number(b.ranks?.globalRank) || 0;
          break;
        default:
          return 0;
      }
      if (typeof aValue === "string") {
        return sortOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    });
  }

  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = sortedUsers.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(sortedUsers.length / entriesPerPage);

  const handleNext = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className={`relative max-w-7xl mx-auto ${isOpen ? "blur-sm" : ""} transition-all duration-300`}>
        <div className={`rounded-2xl p-6 space-y-5 shadow-xl ${theme === "dark" ? "bg-zinc-800" : "bg-white"}`}>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dropdown
              options={searchOptions}
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
            />
            <Dropdown
              options={platformOptions}
              value={platform}
              onChange={(e) => setPlatform(e.target.value)}
            />
            <Dropdown
              options={departmentOptions}
              value={department} onChange={(e) =>
                setDepartment(e.target.value)}
            />
            <Dropdown
              options={yearOptions}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </div>
          <div className="relative">
            <input
              type="text"
              className={`w-full h-14 pl-10 pr-12 rounded-lg border transition-all duration-300 focus:outline-none focus:ring-2 shadow-sm ${theme === "dark"
                ? "bg-zinc-800 border-zinc-700 focus:ring-blue-500"
                : "bg-white border-zinc-200  focus:ring-blue-500"
                }`}
              placeholder="Search users..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <img
              src={assets.search}
              alt="Search"
              className="absolute left-3 top-5 w-5 h-5 invert dark:invert-0"
            />
            <button
              className="absolute right-2 top-6 -translate-y-3 bg-zinc-200 dark:bg-zinc-600 hover:dark:bg-blue-600 hover:bg-blue-300 rounded-full w-9 h-8 flex items-center justify-center transition-all duration-300 shadow-md"
              onClick={handleSearch}
            >
              <img src={assets.arrow} alt="Search" className="w-4 h-4 invert dark:invert-0" />
            </button>
          </div>
        </div>

        <div className={`mt-6 rounded-2xl overflow-hidden shadow-xl ${theme === "dark" ? "bg-zinc-800" : "bg-white"}`}>
          {loader ? (
            <div className="flex flex-col gap-6 items-center justify-center mt-40 m-auto">
              <div className="loader"></div>
            </div>
          ) : errorMessage ? (
            <div className={`p-6 text-center ${theme === "dark" ? "text-red-400" : "text-red-500"}`}>{errorMessage}</div>
          ) : platform && platform !== "Select Platform" ? (
            users && currentEntries.length > 0 ? (
              <>
                <div className="sm:hidden space-y-4 p-4">
                  {currentEntries.map((user, index) => (
                    <div
                      key={user._id}
                      className={`rounded-xl p-4 shadow-md hover:shadow-lg  ${theme === "dark" ? "bg-zinc-700" : "bg-zinc-50"} cursor-pointer`}
                    >
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-teal-500 font-semibold">#{indexOfFirstEntry + index + 1}</span>
                          <span
                            className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium"
                            onClick={() => navigate(`/user/${user?.username}`)}
                          >
                            {user.username}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm"
                          onClick={() => navigate(`/user/${user?.username}`)}>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Roll No:</span>
                          <span>{user.roll}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Registered:</span>
                          <span>{user.registeredID}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Year:</span>
                          <span>{user.year}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Department:</span>
                          <span>{user.department}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>{platform}:</span>
                          <span className="truncate">{user.usernames}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Name:</span>
                          <span>{user.name}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Solved:</span>
                          <span className="text-green-500 font-medium">{user?.platformSpecificData?.[platform.toLowerCase()] || "N/A"}</span>
                          <span className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>Rating:</span>
                          <div className="flex items-center gap-2">
                            <FaTrophy className="text-amber-500" />
                            <span className="text-amber-500 font-medium">{user.ranks?.globalRank || "N/A"}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full">
                    <thead className={theme === "dark" ? "bg-zinc-700" : "bg-zinc-300"}>
                      <tr>
                        {["#", "UserName", "Roll No", `${platform} ID`, "Name", "Solved", "Rating"].map((header) => (
                          <th
                            key={header}
                            className={`p-4 text-left font-semibold cursor-pointer transition-colors duration-200`}
                            onClick={() => handleSort(header)}
                          >
                            {header} {getSortingIcon(header)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {currentEntries.map((user, index) => (
                        <tr
                          key={user._id}
                          className={`border-y ${theme === "dark" ? "border-gray-600 hover:bg-zinc-900" : "border-gray-300 hover:bg-zinc-200"} transition-colors duration-300`}
                        >
                          <td className="p-4 text-teal-500 font-medium">#{indexOfFirstEntry + index + 1}</td>
                          <td className="p-4">
                            <span
                              className="text-blue-500 hover:text-blue-700 cursor-pointer font-medium transition-colors"
                              onClick={() => navigate(`/user/${user?.username}`)}
                            >
                              {user.username}
                            </span>
                          </td>
                          <td className="p-4">{user.roll}</td>
                          <td className="p-4 truncate max-w-xs">{user.usernames}</td>
                          <td className="p-4">{user.name}</td>
                          <td className="p-4 text-green-500 font-medium">{user?.platformSpecificData?.[platform.toLowerCase()] || "N/A"}</td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <FaTrophy className="text-amber-500" />
                              <span className="text-amber-500 font-medium">{user.ranks?.globalRank || "N/A"}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className={`p-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>No users found</div>
            )
          ) : (
            <div className={`p-6 text-center ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Please select a platform to start</div>
          )}
        </div>

        {/* Pagination */}
        {users && currentEntries.length > 0 && (
          <div className={`flex flex-row justify-between items-center mt-6 p-4 rounded-2xl shadow-xl ${theme === "dark" ? "bg-zinc-800" : "bg-zinc-50"}`}>
            <div>
              <Dropdown
                options={pages}
                value={entriesPerPage}
                onChange={handleDropdownChange}
                newStyle="w-[135px] h-9 rounded-md "
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`flex items-center gap-2 px-4  py-2 rounded-lg transition-all duration-300 shadow-md ${theme === "dark"
                  ? "bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-600"
                  : "bg-teal-500 hover:bg-teal-600 text-white disabled:bg-gray-300"
                  }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="hidden sm:inline">Previous</span>
              </button>
              <div className={`h-9 w-16 rounded-lg ${theme === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700"}`}>
                <span className="font-medium text-xl ml-3">{currentPage}</span> of {totalPages}
              </div>
              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 shadow-md ${theme === "dark"
                  ? "bg-teal-600 hover:bg-teal-700 text-white disabled:bg-gray-600"
                  : "bg-teal-500 hover:bg-teal-600 text-white disabled:bg-gray-300"
                  }`}
              >
                <span className="hidden sm:inline">Next</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <button onClick={() => setIsOpen(true)}
        className="w-1/4 ml-[38%] mt-10 px-5 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition duration-200"
      >
        Export
      </button>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-zinc-900 bg-opacity-50">
          <div className="relative w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl h-[60%] bg-white dark:bg-zinc-800 rounded-lg shadow-lg">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-2 bg-red-500  rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-800"
            >
              <IoMdClose size={20} />
            </button>
            <Export />
          </div>
        </div>
      )}

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default AllUserData;