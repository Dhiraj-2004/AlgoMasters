import PropTypes from "prop-types";
import useAmcatRank from "../component/hook/useAmcatRank";
import { UsersIcon, UserIcon, TrophyIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { IdCard } from "lucide-react";
import { assets } from '../assets/assets';
import React, { useContext, useEffect, useState, } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import ScoreCard from "../component/ScoreCard";
import Title from "../component/PageTitle";
import { AuthContext } from "../context/AuthContext";


// Profile section
const Profile = () => {
  const { username } = useParams();
  const [localUserData, setUserData] = useState(null);
  const [amcatData, setAmcatdata] = useState(null)
  const [loder, setLoder] = useState(false);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    const fetchData = async () => {
      setLoder(true);
      try {
        const name = username || user?.username;
        const response = await axios.get(`${backendUrl}/api/user/userdata/${name}`);
        setUserData(response?.data);
        setAmcatdata(response?.data?.amcatData)
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
      finally {
        setLoder(false);
      }
    };
    fetchData();
  }, [user, username]);
  if (loder == true) {
    <div className="loader"></div>
  }
  return (
    <div>
      <Title text1="User" text2="Profile" />
      <div className="flex flex-col h-full justify-center items-center px-4 w-full">
        <div className="flex flex-col min-w-full md:flex-row gap-6">
          {/* User Data */}
          <div className="card flex flex-col items-start rounded-3xl border dark:border-zinc-800 p-4 w-full md:w-5/6 lg:w-11/12 xl:w-5/12">
            <InfoSection
              icon={<UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-500 dark:text-indigo-400" />}
              placeholder="Username:"
              data={localUserData?.userData?.username} />
            <InfoSection
              icon={<UserIcon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-500 dark:text-indigo-400" />}
              placeholder="Name:"
              data={localUserData?.userData?.name} />
            <InfoSection
              icon={assets.Gmail}
              placeholder="Email:"
              data={localUserData?.userData?.email} />
            <InfoSection
              icon={assets.Roll}
              placeholder="Roll:"
              data={localUserData?.userData?.roll} />
            <InfoSection
              icon={assets.Roll}
              placeholder="Registered ID:"
              data={localUserData?.userData?.registeredID} />
            <InfoSection
              icon={assets.college}
              placeholder="Department:"
              data={localUserData?.userData?.department} />
            <InfoSection
              icon={assets.Year}
              placeholder="Year:"
              data={localUserData?.userData?.year} />
            <InfoSection
              icon={assets.codechef}
              placeholder="CodeChef:"
              data={localUserData?.platform?.usernames?.codechefUser} />
            <InfoSection
              icon={assets.codeforce}
              placeholder="CodeForces:"
              data={localUserData?.platform?.usernames?.codeforcesUser} />
            <InfoSection
              icon={assets.leetcode}
              placeholder="Leetcode:"
              data={localUserData?.platform?.usernames?.leetcodeUser} />
            <InfoSection
              icon={assets.Amcat}
              placeholder="Amcat ID:"
              data={localUserData?.userData?.amcatKey} />
          </div>

          {/* Platform Rankings */}
          <div className="w-full flex flex-col gap-6">
            <div className="w-full flex flex-col xl:flex-row gap-6">
              {/* Leetcode */}
              <div className="card flex flex-col items-center justify-center rounded-3xl border border-zinc-300 dark:border-zinc-800 p-6 w-full md:w-5/6 lg:w-11/12 xl:w-5/12 h-auto gap-3">
                <h1 className="text-lg font-semibold">Leetcode</h1>
                <Section
                  overallRank={localUserData?.platform?.collegeRank?.leetcodeRank}
                  totalUsers={localUserData?.platform?.collegeUser?.totalleetcode}
                  departmentRank={localUserData?.platform?.departmentRank?.leetcodeRank}
                  departmentUsers={localUserData?.platform?.departmentUser?.totalleetcode}
                  currentRating={localUserData?.platform?.globalRank?.leetcodeRank}
                  total={localUserData?.platform?.question?.leetcode?.total}
                />
              </div>

              {/* CodeChef */}
              <div className="card flex flex-col items-center justify-center rounded-3xl border border-zinc-300 dark:border-zinc-800 p-6 w-full md:w-5/6 lg:w-11/12 xl:w-5/12 h-auto gap-3">
                <h1 className="text-lg font-semibold">CodeChef</h1>
                <Section
                  overallRank={localUserData?.platform?.collegeRank?.codechefRank}
                  totalUsers={localUserData?.platform?.collegeUser?.totalcodechef}
                  departmentRank={localUserData?.platform?.departmentRank?.codechefRank}
                  departmentUsers={localUserData?.platform?.departmentUser?.totalcodechef}
                  currentRating={localUserData?.platform?.globalRank?.codechefRank}
                  total={localUserData?.platform?.question?.codechef}
                />
              </div>

              {/* CodeForces */}
              <div className="card flex flex-col items-center justify-center rounded-3xl border border-zinc-300 dark:border-zinc-800 p-6 w-full md:w-5/6 lg:w-11/12 xl:w-5/12 h-auto gap-3">
                <h1 className="text-lg font-semibold">CodeForces</h1>
                <Section
                  overallRank={localUserData?.platform?.collegeRank?.codeforcesRank}
                  totalUsers={localUserData?.platform?.collegeUser?.totalcodeforces}
                  departmentRank={localUserData?.platform?.departmentRank?.codeforcesRank}
                  departmentUsers={localUserData?.platform?.departmentUser?.totalcodeforces}
                  currentRating={localUserData?.platform?.globalRank?.codeforcesRank}
                  total={localUserData?.platform?.question?.codeforces}
                />
              </div>
            </div>
            <div className="w-full hidden xl:flex">
              <Amcat amcatData={amcatData} />
            </div>
          </div>
        </div>

        <div className="w-full xl:hidden mt-6">
          <Amcat amcatData={amcatData} />
        </div>
        {user?.username && username && (
          <div className="flex justify-center">
            <button onClick={() => navigate('/update')} className="custom-button m-10">
              Update Profile
            </button>
          </div>
        )}
      </div>
    </div>
  )
}


const Section = ({ overallRank, totalUsers, departmentRank, departmentUsers, currentRating, total }) => {
  const getRankColor = (rank) => {
    if (rank === null || rank === undefined) return "text-gray-500";
    if (rank < 50) return "text-green-500";
    else if (rank < 150) return "text-yellow-500";
    else if (rank < 220) return "text-blue-500";
    return "text-red-500";
  };

  return (
    <>
      <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
        <span className={`font-bold text-md ${getRankColor(overallRank)}`}>College Rank</span>
        <div>
          <span className={`font-bold text-base ${getRankColor(overallRank)}`}>
            {overallRank || "Not Available"}
          </span>
          <span className="text-zinc-500 text-base">/{totalUsers}</span>
        </div>
      </div>

      <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
        <span className={`font-bold text-md ${getRankColor(departmentRank)}`}>Department Rank</span>
        <div>
          <span className={`font-bold text-base ${getRankColor(departmentRank)}`}>
            {departmentRank || "Not Available"}
          </span>
          <span className="text-zinc-500 text-base">/{departmentUsers}</span>
        </div>
      </div>

      <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
        <span className="font-bold text-md text-[#22C55E]">Current Rating</span>
        <span className="font-bold text-base text-[#22C55E]">{currentRating}</span>
      </div>

      <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
  <span className="font-bold text-md text-[#22C55E]">Problem Solved</span>
  {
    Number(total) === 0 ? (
      <span className="text-zinc-500 text-base">NA</span>
    ) : (
      <span className="font-bold text-base text-[#22C55E]">{total}</span>
    )
  }
</div>

    </>
  );
};

const InfoSection = ({ icon, placeholder, data }) => {
  return (
    <div className="flex space-y-6 mt-6">
      <div className="flex gap-x-2 items-center">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-2 rounded-lg">
          {typeof icon === "string" ? (
            <img src={icon} alt="icon" className="w-4 h-4 sm:w-6 sm:h-6" />
          ) : (
            icon
          )}
        </div>
        <div className="flex items-center gap-2 justify-center">
          <span className="text-sm font-medium text-zinc-400">{placeholder}</span>
          <span
            className="text-md font-semibold truncate block dark:text-zinc-200 max-w-[270px] overflow-hidden whitespace-nowrap"
            title={data}
          >
            {data}
          </span>
        </div>
      </div>
    </div>
  );
};



// Amcat data
const Amcat = ({ amcatData }) => {
  const { amcatRank } = useAmcatRank(amcatData?.amcatID);
  const MetricCard = ({ label, value, delta }) => (
    <div className="bg-zinc-100 dark:bg-zinc-900 w-40 p-2 md:w-48 rounded-lg">
      <p className="text-sm text-gray-500 dark:text-zinc-300 mb-1">{label}</p>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </span>
        {delta && (
          <span className={`text-sm ${delta > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {delta > 0 ? `▲ ${delta}` : `▼ ${Math.abs(delta)}`}
          </span>
        )}
      </div>
    </div>
  );


  const InfoBadge = ({ label, value, icon }) => (
    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
      <span className="text-gray-400 dark:text-gray-500">{icon}</span>
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );

  const StatCard = ({ label, value, icon }) => (
    <div className="bg-zinc-100 dark:bg-zinc-900 w-full h-20 p-2 rounded-lg flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </p>
      </div>
      <div className="p-3 bg-indigo-500/10 rounded-full">
        {React.cloneElement(icon, {
          className: "w-6 h-6 text-indigo-500 dark:text-indigo-400"
        })}
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-3">
        {amcatRank && (
          <div className="card flex flex-col items-center rounded-3xl  dark:border-zinc-800 p-5 w-full md:w-[443.2px]">
            <div className="grid grid-cols-1 gap-8">
              {/* Profile Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-indigo-500/10 p-4 rounded-full">
                    <UserIcon className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h2 className="manrope-bold text-2xl text-gray-800 dark:text-gray-100">
                      {amcatData?.name}
                    </h2>
                    <p className="text-gray-500 dark:text-gray-400">
                      {amcatData?.rollNo}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <InfoBadge
                    label="AMCAT ID"
                    value={amcatData?.amcatID}
                    icon={<IdCard className="w-5 h-5" />}
                  />
                </div>
              </div>

              {/* Ranks Section */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-orange-500/10 p-4 rounded-full">
                    <TrophyIcon className="w-8 h-8 text-orange-500 dark:text-orange-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    Ranking Overview
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <MetricCard
                    label="ELQ Rank"
                    value={amcatRank.ranks?.elqRank}
                    delta={amcatRank.previousRanks?.elqRank}
                  />
                  <MetricCard
                    label="Automata Rank"
                    value={amcatRank.ranks?.automataRank}
                    delta={amcatRank.previousRanks?.automataRank}
                  />
                  <div className="col-span-2">
                    <StatCard
                      label="Total Users"
                      value={amcatRank.totalUsers}
                      icon={<UsersIcon className="w-5 h-5" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {amcatData && (
          <div className="card flex flex-col items-center rounded-3xl  dark:border-zinc-800 p-5 w-full md:w-[443px]">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-green-500/10 p-4 rounded-full">
                <ChartBarIcon className="w-8 h-8 text-green-500 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
                Detailed Scores
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <ScoreCard
                label="ELQ Score"
                value={amcatData?.elqScore}
                max={300}
              />
              <ScoreCard
                label="C++"
                value={amcatData?.cppScore}
                max={100}
              />
              <ScoreCard
                label="Automata"
                value={amcatData?.automata}
                max={100}
              />
              <ScoreCard
                label="Quant"
                value={amcatData?.quant}
                max={100}
              />
              <ScoreCard
                label="English"
                value={amcatData?.english}
                max={100}
              />
              <ScoreCard
                label="Logical"
                value={amcatData?.logical}
                max={100}
              />
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

Amcat.propTypes = {
  amcatData: PropTypes.object.isRequired,
  icon: PropTypes.node.isRequired,
  label: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
  max: PropTypes.any.isRequired,
  delta: PropTypes.any.isRequired,
};


Section.propTypes = {
  overallRank: PropTypes.number,
  totalUsers: PropTypes.number,
  departmentRank: PropTypes.number,
  departmentUsers: PropTypes.number,
  currentRating: PropTypes.number,
  total: PropTypes.number
};

Section.defaultProps = {
  overallRank: null,
  totalUsers: null,
  departmentRank: null,
  departmentUsers: null,
  currentRating: null,
};


InfoSection.propTypes = {
  icon: PropTypes.node.isRequired,
  placeholder: PropTypes.string.isRequired,
  data: PropTypes.any.isRequired,
};



export default Profile