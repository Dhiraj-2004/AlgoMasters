import { useContext, useState } from "react";
import InputField from "../component/InputField";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Dropdown from "../component/Dropdown";
import Title from "../component/PageTitle";
import { AuthContext } from "../context/AuthContext";


const UpdateProfile = () => {
  const [leetcodeUser, setLeetUser] = useState('');
  const [codeforcesUser, setCodeforcesUser] = useState('');
  const [codechefUser, setCodechefUser] = useState('');
  const [amcatkey, setAmcatID] = useState("");
  const [year, setYear] = useState("Select studying year");
  const navigate = useNavigate();
  const { fetchUser } = useContext(AuthContext);
  const [department, setDepartment] = useState("Select your Department");

  const yearOptions = ["Select studying year", "First Year", "Second Year", "Third Year", "Forth Year"];
  const departmentOptions = [
    "Select your Department",
    "COMPUTER ENGINEERING",
    "ELECTRONICS AND TELECOMMUNICATION",
    "INFORMATION TECHNOLOGY",
    "ARTIFICIAL INTELLIGENCE AND DATA SCIENCE",
    "ELECTRONICS AND COMPUTER",
    "First Year",
  ];
  const handleSubmit = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    try {
      const token = localStorage.getItem('token');
      const payload = {};
      if (leetcodeUser) payload.leetcodeUser = leetcodeUser;
      if (codeforcesUser) payload.codeforcesUser = codeforcesUser;
      if (codechefUser) payload.codechefUser = codechefUser;
      if (amcatkey) payload.amcatkey = amcatkey;
      if (year && year!="Select studying year") payload.year = year;
      if(department && department!="Select your Department") payload.department=department
      await axios.put(`${backendUrl}/api/user/updateUser`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      await fetchUser();
      toast.success('Data Updated successfully!');
      setTimeout(() => { navigate("/") }, 1000)
    } catch (error) {
      toast.error(error.response?.data?.message)
      console.error('Error inserting user:', error);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto gap-4">
      <Title text1="Update" text2="Profile" />
      <InputField
        type="text"
        value={leetcodeUser}
        onChange={(e) => setLeetUser(e.target.value)}
        placeholder="LeetCode Username"
        label="LeetCode"
      />

      <InputField
        type="text"
        value={codeforcesUser}
        onChange={(e) => setCodeforcesUser(e.target.value)}
        placeholder="Codeforces Username"
        label="Codeforces"
      />

      <InputField
        type="text"
        value={codechefUser}
        onChange={(e) => setCodechefUser(e.target.value)}
        placeholder="CodeChef Username"
        label="CodeChef"
      />

      <InputField
        type="text"
        value={amcatkey}
        onChange={(e) => setAmcatID(e.target.value)}
        placeholder="AMCAT ID"
        label="AMCAT ID"
      />

      <Dropdown
        name="year"
        options={yearOptions}
        value={year}
        onChange={(e)=>setYear(e.target.value)}
        label="Select Year"
      />
      <Dropdown
        name="year"
        options={departmentOptions}
        value={department}
        onChange={(e)=>setDepartment(e.target.value)}
        label="Select Department"
      />

      <button
        className="custom-button text-xl m-5 w-full"
        onClick={handleSubmit}
      >
        <span>Submit</span>
      </button>

      <Toaster position="top-right" reverseOrder={false}/>
    </div>
  );
}

export default UpdateProfile;
