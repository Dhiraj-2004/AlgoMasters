import PropTypes from "prop-types";
import { assets } from "../assets/assets";
import Title from "../component/PageTitle";
import CodeChefGraph from "../component/CodeChefGraph";

const CodeChefDesign = ({ data, userData, rankData }) => {

  return (
    <div className="manrope-regular">
      {/* Title */}
      <Title text1="Code" text2="Chef" />
      <div className="w-full flex flex-col xl:flex-row gap-10 items-center justify-center">
        {/* Info */}
        <div className="card flex flex-col items-center rounded-3xl border border-zinc-300 dark:border-zinc-800 p-5 w-full sm:w-3/5 xl:w-[30%] h-80">
          <div>
            <h1 className="manrope-bold mt-3 text-2xl">{userData?.name}</h1>
            <div className="flex flex-col items-center font font-semibold ml-3 mb-auto text-zinc-500 dark:text-gray-500 text-sm">
              <span>
                #{userData?.platform?.usernames?.codechefUser}
              </span>
              <span className="text-yellow-400 font-bold text-lg">{data.stars}</span>
              <span>
                Rank : {data?.currentRating}
              </span>
            </div>
          </div>
          <div className="flex flex-col space-y-6 mt-6">
            <div className="flex gap-x-2 items-center">
              <div className="dark:bg-dark bg-[#c1c1c1] p-2 rounded-lg">
                <img src={assets.Gmail} alt="Email" className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-medium text-zinc-600">Email</span>
                <span className="text-md font-semibold truncate block">
                  {userData.email}
                </span>
              </div>
            </div>

            <div className="flex gap-x-2 items-center">
              <div className="dark:bg-dark bg-[#c1c1c1] p-2 rounded-lg">
                <img src={assets.college} alt="College" className="h-5 w-5" />
              </div>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-sm font-medium text-zinc-600">Department</span>
                <span className="text-md font-semibold truncate block">
                  {userData.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Codechef Data */}

        <div className="card flex flex-col items-center justify-center rounded-3xl border border-zinc-300 dark:border-zinc-800 p-5 w-full sm:w-3/5 xl:w-[30%] h-80 gap-3">

          <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
            <span className="font-bold text-md text-[#22C55E]">College Rank</span>
            <div>
              <span className="font-bold text-base">{rankData?.userRank?.overall?.codechef || "Not Available"}</span>
              <span className="text-zinc-500 text-base">/{rankData?.totalUsers?.college}</span>
            </div>
          </div>

          <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
            <span className="font-bold text-md text-[#22C55E]">Department Rank</span>
            <div>
              <span className="font-bold text-base">{rankData?.userRank?.overall?.codechef || "Not Available"}</span>
              <span className="text-zinc-500 text-base">/{rankData?.totalUsers?.department}</span>
            </div>
          </div>

          <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
            <span className="font-bold text-md text-[#22C55E]">Current Rating</span>
            <span className="font-bold text-base">{data.currentRating}</span>
          </div>

          <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
            <span className="font-bold text-md text-[#EAB308]">Highest Rating</span>
            <span className="font-bold text-base">{data.highestRating}</span>
          </div>

          <div className="flex justify-between items-center rounded-lg border border-zinc-300 dark:border-zinc-800 p-3 w-full">
            <span className="font-bold text-md text-[#F43F5E]">Global Rank</span>
            <span className="font-bold text-base">{data.globalRank}</span>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <CodeChefGraph 
        attendedContests={data?.ratingData}
        ></CodeChefGraph>
      </div>
    </div>
  );
};

CodeChefDesign.propTypes = {
  data: PropTypes.object,
  userData: PropTypes.object,
  rankData: PropTypes.object,
};

export default CodeChefDesign;
