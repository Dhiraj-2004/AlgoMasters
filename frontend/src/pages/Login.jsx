import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import InputField from "../component/InputField";
import Dropdown from "../component/Dropdown";
import AuthSwitch from "../component/AuthSwitch";
import SubmitButton from "../component/SubmitButton";
import toast, { Toaster } from "react-hot-toast";
import Title from "../component/PageTitle";
import { AuthContext } from "../context/AuthContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const LoginForm = () => {
  const { fetchUser } = useContext(AuthContext);
  const [currentState, setCurrentState] = useState("Login");
  const [formData, setFormData] = useState({
    name: "",
    roll: "",
    registeredID: "",
    username: "",
    email: "",
    password: "",
    department: "Select your Department",
    year: "Select studying year",
  });

  const [usernameStatus, setUsernameStatus] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);

  const navigate = useNavigate();

  const departmentOptions = [
    "Select your Department",
    "COMPUTER ENGINEERING",
    "ELECTRONICS AND TELECOMMUNICATION",
    "INFORMATION TECHNOLOGY",
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
    "ELECTRONICS AND COMPUTER",
  ];

  const yearOptions = ["Select studying year", "First Year", "Second Year", "Third Year", "Forth Year"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // cheack username
  useEffect(() => {
    if (formData.username.length < 3) {
      setUsernameStatus("");
      return;
    }
    let isMounted = true;

    const checkUsername = async () => {
      setCheckingUsername(true);
      try {
        const response = await axios.get(`${backendUrl}/api/user/check-username/${formData.username}`);
        if (isMounted) {
          setUsernameStatus(response.data.msg)
        }
      } catch (error) {
        if (isMounted) {
          if (error.response) {
            if (error.response) {
              if (error.response.status === 400) {
                setUsernameStatus(error.response.data.msg);
              }
              else {
                setUsernameStatus("Server error. Please try again.");
              }
            }
            else {
              setUsernameStatus("Network error. Please check your connection.");
            }
          }
        }
      } finally {
        if (isMounted) {
          setCheckingUsername(false);
        }
      }
    };

    const debounceTimeout = setTimeout(checkUsername, 500);

    return () => {
      isMounted = false;
      clearTimeout(debounceTimeout);
    };
  }, [formData.username]);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      const url = currentState === "Sign Up" ? "/api/user/signup" : "/api/user/login";
      const response = await axios.post(`${backendUrl}${url}`, formData);

      localStorage.setItem("token", response.data.token);
      await fetchUser();
      toast.success(`${currentState} successful!`);
      setTimeout(() => {
        navigate(currentState === "Sign Up" ? "/add" : "/");
      }, 2000);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Login failed! Try again.");
    }
  };

  return (
    <div>
      <form
        onSubmit={onSubmitHandler}
        className="manrope-regular border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/70 hover:scale-[1.01] dark:shadow-xl p-8 w-full max-w-md mx-auto mt-10 space-y-6"
      >
        {currentState === "Login" ? (
          <Title text1="Login" text2="" className="text-center dark:text-white" />
        ) : (
          <Title text1="Sign" text2="Up" className="text-center dark:text-white" />
        )}

        <div className="space-y-5">
          {currentState === "Sign Up" && (
            <>
              <div className="space-y-5">
                <div>
                  <InputField 
                    name="username" 
                    value={formData.username} 
                    onChange={handleChange} 
                    placeholder="Username"
                    label="Username"
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                  {checkingUsername ? (
                    <p className="text-blue-500 dark:text-blue-400 text-sm mt-1 ml-1 animate-pulse flex items-center gap-1">
                      <svg className="animate-spin h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Checking availability...
                    </p>
                  ) : (
                    <p className={`text-sm mt-1 ml-1 flex items-center gap-1 ${
                      usernameStatus === "Username is available" 
                        ? "text-green-600 dark:text-green-400" 
                        : "text-red-600 dark:text-red-400"
                    }`}>
                      {usernameStatus && (
                        <>
                          {usernameStatus === "Username is available" ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          )}
                          {usernameStatus}
                        </>
                      )}
                    </p>
                  )}
                </div>

                <InputField
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  label="Name"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
                <InputField
                  name="roll"
                  value={formData.roll}
                  onChange={handleChange}
                  placeholder="Roll Number"
                  label="Roll"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
                <InputField
                  name="registeredID"
                  value={formData.registeredID}
                  onChange={handleChange}
                  placeholder="Registered ID"
                  label="Registered ID"
                  className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
                />
                <Dropdown
                  name="department"
                  options={departmentOptions}
                  value={formData.department}
                  onChange={handleChange}
                  label="Select Department"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
                <Dropdown
                  name="year"
                  options={yearOptions}
                  value={formData.year}
                  onChange={handleChange}
                  label="Select Year"
                  className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400
                         dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </>
          )}

          <InputField
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            label="Email"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
          />
          <InputField
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            label="Password"
            className="dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400
                   focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
          />
        </div>

        <AuthSwitch
          currentState={currentState}
          setCurrentState={setCurrentState}
          className="text-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
        />
        
        <div className="text-center">
        <SubmitButton 
          currentState={currentState}
        />
        </div>
      </form>
      <Toaster position="top-right" reverseOrder={false}/>
    </div>
  );
};

export default LoginForm;
