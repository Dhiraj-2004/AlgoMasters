import { NavLink, useNavigate } from "react-router-dom";
import Sidebar from "../component/Sidebar";
import ThemeToggle from "../component/ThemeToggle";
import { useState, useEffect } from "react";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("token");
    setIsLoggedIn(!!user);
  }, [navigate]);

  return (
    <nav className="manrope-regular fixed top-0 left-0 w-full z-50 
    bg-white text-black dark:bg-black dark:text-white"
    style={{boxShadow: "rgba(102, 116, 204, 0.25) 0px 4px 10px"}}>
      
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2">
        
        <NavLink to="/home" className="hover:opacity-85 transition-opacity duration-200">
          <div className="flex justify-center items-center px-2 md:px-3">
            <h1 className="text-2xl lg:text-3xl xl:text-3xl lexend-bold whitespace-nowrap">
              <span className="text-orange-500">{`{`}</span>
              <span className="logo1">Algo</span>
              <span className="logo2">Masters</span>
              <span className="text-indigo-500">{`}`}</span>
            </h1>
          </div>
        </NavLink>

        <div className="flex md:order-2 space-x-2 md:space-x-0 rtl:space-x-reverse">
          {!isLoggedIn ? (
            <button className="custom-button text-xl h-12 w-28 md:w-36 my-1"
              onClick={()=>navigate("/login")}
            >Login</button>
          ) : (
            <div className="flex items-center">
              <ThemeToggle/>
              <Sidebar />
            </div>
          )}
        </div>

        {isLoggedIn && (
          <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 md:space-x-8 
              rtl:space-x-reverse md:flex-row md:mt-0 text-lg md:text-xl">
              
              {['Home', 'LeetCode', 'CodeChef', 'CodeForces'].map((item) => (
                <li key={item}>
                  <NavLink
                    to={`/${item.toLowerCase()}`}
                    className={({ isActive }) =>
                      isActive
                        ? "block py-2 px-3 md:p-0 border-b-2 border-orange-500 text-black dark:text-orange-400 "
                        : "block py-2 px-3 md:p-0 text-gray-700 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors duration-300"
                    }
                    aria-current={item === "Home" ? "page" : undefined}
                  >
                    {item}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
