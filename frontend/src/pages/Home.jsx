import { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import Title from "../component/PageTitle";

const Home = () => {

  const [quote, setQuote] = useState("");
  const [contest, setContest] = useState([]);

  useEffect(() => {
    fetch("https://programming-quotesapi.vercel.app/api/random")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.author && data.quote) {
          setQuote(`${data.quote} — ${data.author}`);
        } else {
          setQuote("No quote available at the moment.");
        }
      })
      .catch((error) => {
        console.error("Failed to fetch the quote:", error);
        setQuote(
          "Perhaps the central problem we face in all of computer science is how we are to get to the situation where we build on top of the work of others rather than redoing so much of it in a trivially different way. — Richard Hamming"
        );
      });
  }, []);

  useEffect(() => {
    async function fetchContests() {
      const apiUrl = "https://codeforces.com/api/contest.list";

      try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.status === "OK") {
          const upcoming = data.result
            .filter((contest) => contest.phase === "BEFORE")
            .sort((a, b) => a.startTimeSeconds - b.startTimeSeconds)
            .slice(0, 2);

          setContest(upcoming);
        } else {
          console.error("Error fetching contests:", data.comment);
        }
      } catch (error) {
        console.error("Failed to fetch contest timings:", error);
      }
    }

    fetchContests();
  }, []);

  const handleNavigate = (contestId) => {
    window.open(`https://codeforces.com/contest/${contestId}`, "_blank");
  };

  return (
    <div className="manrope-regular min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="relative h-screen w-full overflow-hidden">
        {/* Hero Section */}
        <div className="relative h-full w-full">
          {/* Scattered Platform Logos */}
          <img 
            className="absolute h-12 w-12 -rotate-12 animate-float md:h-16 md:w-16"
            style={{ top: '15%', left: '20%' }}
            src={assets.leetcode} 
            alt="LeetCode" 
          />
          <img 
            className="absolute h-12 w-12 -rotate-12 animate-float md:h-20 md:w-20"
            style={{ top: '25%', left: '48%' }}
            src={assets.Python} 
            alt="Python" 
          />
          <img 
            className="absolute h-12 w-12 rotate-6 animate-float md:h-16 md:w-16"
            style={{ top: '10%', left: '65%' }}
            src={assets.codechef} 
            alt="CodeChef" 
          />
          <img 
            className="absolute h-12 w-12 rotate-6 animate-float md:h-16 md:w-16"
            style={{ top: '38%', left: '80%' }}
            src={assets.Cpp} 
            alt="CodeChef" 
          />
          <img 
            className="absolute h-12 w-12 -rotate-6 animate-float md:h-16 md:w-16"
            style={{ top: '55%', left: '15%' }}
            src={assets.codeforce} 
            alt="Codeforces" 
          />
          <img 
            className="absolute h-12 w-12 rotate-12 animate-float md:h-16 md:w-16"
            style={{ top: '65%', left: '65%' }}
            src={assets.Amcat} 
            alt="AMCAT" 
          />

          {/* Centered Quote */}
          <div className="absolute left-1/2 top-[40%] z-10 w-4/5 -translate-x-1/2 -translate-y-1/2 transform text-center">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-white drop-shadow-2xl md:text-6xl">
              <span className="bg-gradient-to-r from-orange-600 to-purple-800 bg-clip-text text-transparent dark:from-orange-400 dark:to-orange-800">"Merge,</span>
               
              <span className="bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent dark:from-blue-400 dark:to-purple-600">
              Your Coding Universe"
              </span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-200 md:text-xl">
            - Where Algorithms Meet Achievement -
            </p>
          </div>
        </div>
      </div>

      {/* Motivation */}
      <div className="flex flex-col items-center justify-center mx-10 pb-10">
        <div className="glowCardbig text-center text-lg sm:text-xl m-10 p-6 rounded-2xl relative bg-white dark:bg-[#15171c]">
          <p className="text-gray-800 dark:text-gray-300 relative z-10">{quote ? `"${quote}"` : "Loading quote..."}</p>
        </div>
      </div>

      <Title text1="CodeForces" text2="Contests" />

      <div className="flex flex-col xl:flex-row gap-8 sm:gap-10 items-center justify-center m-10">
        {/* Contest 1 */}
        <div className="glowCard relative w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[400px] text-gray-800 dark:text-gray-300 p-5 m-4 rounded-2xl text-center border border-indigo-50 hover:border-indigo-100 dark:border-indigo-800 hover:shadow-sm hover:shadow-purple-200/30 transition-colors duration-300 ease-in-out">
          <h1 className="manrope-bold text-lg sm:text-2xl pb-3">Upcoming Contest 1</h1>
          {contest.length > 0 ? (
            <div className="text-lg" key={contest[0].id}>
              <h2>{`Contest 1: ${contest[0].name}`}</h2>
              <p>{`Start Time: ${new Date(contest[0].startTimeSeconds * 1000).toLocaleString()}`}</p>
              <p>{`Duration: ${contest[0].durationSeconds / 3600} hours`}</p>
              <button onClick={() => handleNavigate(contest[0].id)} 
                className="gradient-hover-btn relative mt-2 focus:outline-none">
                <span>Enter Contest</span>
              </button>
            </div>
          ) : (
            <p>Loading contests...</p>
          )}
        </div>

        {/* Contest 2 */}
        <div className="glowCard relative w-full sm:w-80 md:w-96 lg:w-[400px] xl:w-[400px] text-gray-800 dark:text-gray-300 p-5 m-4 rounded-2xl text-center border border-indigo-50 hover:border-indigo-100 dark:border-indigo-800 hover:shadow-sm hover:shadow-purple-200/30 transition-colors duration-300 ease-in-out">
          <h1 className="manrope-bold text-lg sm:text-2xl pb-3">Upcoming Contest 2</h1>
          {contest.length > 1 ? (
            <div className="text-lg" key={contest[1].id}>
              <h2>{`Contest 2: ${contest[1].name}`}</h2>
              <p>{`Start Time: ${new Date(contest[1].startTimeSeconds * 1000).toLocaleString()}`}</p>
              <p>{`Duration: ${contest[1].durationSeconds / 3600} hours`}</p>
              <button 
                onClick={() => handleNavigate(contest[0].id)} 
                className="gradient-hover-btn relative mt-2 focus:outline-none">
                <span>Enter Contest</span>
              </button>

            </div>
          ) : (
            <p className="text-lg">There are no upcoming Contests at the moment.</p>
          )}
        </div>
      </div>
      <div className="m-4 sm:m-6 lg:m-11 p-4 sm:p-6 lg:p-11 text-center sm:text-xl">
        <p className="m-4 sm:m-6 lg:m-10 p-4 sm:p-6 lg:p-10 italic">
          Empowering coders to track, grow, and challenge their problem-solving prowess across the world’s top platforms.
        </p>
      </div>
    </div>
  );
};

export default Home;
