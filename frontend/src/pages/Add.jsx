import { useState } from "react";
import InputField from "../component/InputField";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Add = () => {
  const [leetcodeUser, setLeetUser] = useState("");
  const [codeforcesUser, setCodeforcesUser] = useState("");
  const [codechefUser, setCodechefUser] = useState("");
  const [amcatkey, setAmcatID] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const payload = {};
    if (leetcodeUser) payload.leetcodeUser = leetcodeUser;
    if (codeforcesUser) payload.codeforcesUser = codeforcesUser;
    if (codechefUser) payload.codechefUser = codechefUser;
    if (amcatkey) payload.amcatkey = amcatkey;

    try {
      if (Object.keys(payload).length === 0) {
        toast.error("No data provided to add!", { duration: 3000 });
        return;
      }

      const token = localStorage.getItem("token");
      await axios.post(
        `${backendUrl}/api/user/insertuser`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Data added successfully!", { duration: 3000 });
      setTimeout(() => navigate("/"), 1000);
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  return (
    <div className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-16 gap-4 text-white">
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
        label="AMCAT ID (Optional)"
      />

      <button
        className="custom-button w-full mt-5"
        onClick={handleSubmit}
      >
        Submit
      </button>

      <Toaster position="top-right" reverseOrder={false} />
    </div>
  );
};

export default Add;