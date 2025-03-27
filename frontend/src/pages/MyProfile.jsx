import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import LeetCodeDesign from "./LeetCodeDesign";
import CodeChefDesign from "./CodeChefDesign";
import CodeForcesDesign from "./CodeForcesDesign";
import { useNavigate } from "react-router-dom";

const MyProfile = ({ platformUser, apiEndpoint }) => {
  const [username, setUsername] = useState(null);
  const [data, setUserData] = useState(null);
  const [loader, setLoader] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false);
  const [userData, setUserDataLocal] = useState(null);
  const [rankData, setRankData] = useState(null);
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  // Fetch username from backend
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        setLoader(true)
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUserDataLocal(response?.data);
        const username = response.data?.platform;
        const fetchedUsername =
          platformUser === "leetcodeUser"
            ? username?.usernames?.leetcodeUser
            : platformUser === "codechefUser"
            ? username?.usernames?.codechefUser
            : platformUser === "codeforcesUser"
            ? username?.usernames?.codeforcesUser
            : null;

        if (!fetchedUsername) {
          setShowUpdateMessage(true);
        }
        setUsername(fetchedUsername);
      } catch (error) {
        console.error("Error fetching username:", error);
        setShowUpdateMessage(true);
      }
    };

    fetchUsername();
  }, [backendUrl, platformUser]);

  // Codeforces solved problems
  const fetchCodeforcesSolvedProblems = async (username) => {
    try {
      let solvedProblems = new Set();
      let from = 1;
      let count = 100;
      let totalFetched = 0;
      const maxSubmissions = 1000;

      while (totalFetched < maxSubmissions) {
        const url = `https://codeforces.com/api/user.status?handle=${username}&from=${from}&count=${count}`;
        const response = await axios.get(url);

        if (response.data.status === "OK") {
          const submissions = response.data.result;
          submissions.forEach((submission) => {
            if (submission.verdict === "OK") {
              const problemId = `${submission.problem.contestId}-${submission.problem.index}`;
              solvedProblems.add(problemId);
            }
          });

          totalFetched += submissions.length;
          if (submissions.length < count) {
            break;
          }
          from += count;
        } else {
          console.error("Unexpected API response status:", response.data.status);
          break;
        }
      }

      return solvedProblems.size;
    } catch (error) {
      console.error("Error fetching Codeforces data:", error.message);
      return 0;
    }
  };

  // Fetch user data and update rank
  useEffect(() => {
    if (!username) return;

    const fetchUserData = async () => {
      try {
        setLoader(true);
        const response = await axios.get(`${apiEndpoint}/${username}`);

        if (!response || !response.data) {
          throw new Error("No data returned from API");
        }


        setUserData(response.data);

        let total = 0;
        if (platformUser === "codeforcesUser") {
          total = await fetchCodeforcesSolvedProblems(username);
        }

        const user = response.data.data || {};
        const easy =
          user?.matchedUser?.submitStats?.acSubmissionNum.find(
            (submission) => submission.difficulty === "Easy"
          )?.count || 0;

        const medium =
          user?.matchedUser?.submitStats?.acSubmissionNum.find(
            (submission) => submission.difficulty === "Medium"
          )?.count || 0;

        const hard =
          user?.matchedUser?.submitStats?.acSubmissionNum.find(
            (submission) => submission.difficulty === "Hard"
          )?.count || 0;

        const rank =
          platformUser === "leetcodeUser"
            ? Math.round(response.data.data?.userContestRanking?.rating || 0)
            : platformUser === "codechefUser"
            ? response.data.currentRating || 0
            : response.data.result?.[0]?.rating || 0;

        const token = localStorage.getItem("token");
        await axios.put(
          `${backendUrl}/api/user/rank`,
          { rank, platformUser, username, easy, medium, hard, total },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        setShowUpdateMessage(true);
      } finally {
        setLoader(false);
      }

      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${backendUrl}/api/user/college-rank/${username}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRankData(response.data);
      } catch (error) {
        console.error("Error fetching rank data:", error.message);
      }
    };

    fetchUserData();
  }, [username, apiEndpoint, platformUser, backendUrl]);

  return (
    <div>
      {showUpdateMessage ? (
        <div className="flex flex-col gap-6 items-center justify-center mt-40 m-auto">
          <p className="text-red-500 font-semibold">Please Update Profile</p>
          <button
            className="custom-button h-14 w-48 my-1"
            onClick={() => navigate("/update")}
          >
            Please Update
          </button>
        </div>
      ) : loader ? (
        <div className="flex flex-col gap-6 items-center justify-center mt-40 m-auto">
          <div className="loader"></div>
        </div>
      ) : (
        <div>
          {platformUser === "leetcodeUser" && data && (
            <LeetCodeDesign data={data} userData={userData} rankData={rankData} />
          )}
          {platformUser === "codechefUser" && data && (
            <CodeChefDesign data={data} userData={userData} rankData={rankData} />
          )}
          {platformUser === "codeforcesUser" && data && (
            <CodeForcesDesign data={data} userData={userData} rankData={rankData} />
          )}
        </div>
      )}
    </div>
  );
};

MyProfile.propTypes = {
  apiEndpoint: PropTypes.string.isRequired,
  platformUser: PropTypes.string.isRequired,
};

export default MyProfile;