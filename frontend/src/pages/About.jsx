
import { assets } from '../assets/assets';
import Title from '../component/PageTitle';

const About = () => {
  return (
    <div className="manrope-regular flex flex-col justify-center items-center">
      {/* Title */}
      <Title text1="About" text2="Us" />

      {/* Content 1 */}
      <div className="glowCard flex flex-col rounded-3xl border border-zinc-300 dark:border-zinc-800 p-5 w-full sm:w-4/5 xl:w-[75%] my-5">
        {/* Image and Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:gap-5 p-2">
          <div className="w-full lg:w-1/2 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[30vw] flex items-center justify-center">
            <img
              className="h-full object-contain"
              src={assets.Student}
              alt="Programmer"
            />
          </div>

          {/* Text Content */}
          <div className="mt-5 lg:mt-0 w-full lg:w-1/2 space-y-6">
            {/* Who We Are Section */}
            <div>
              <h2 className="manrope-bold text-lg sm:text-2xl text-indigo-600 dark:text-indigo-400">
                Who We Are
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                We are a passionate team of developers and coding enthusiasts dedicated to simplifying the competitive programming experience. Our mission is to bring all your favorite coding contest platforms—LeetCode, CodeChef, and CodeForces—onto one unified platform.
              </p>
            </div>

            {/* What We Do Section */}
            <div>
              <h2 className="manrope-bold text-lg sm:text-2xl text-orange-600 dark:text-orange-400">
                What We Do
              </h2>
              <ul className="mt-4 space-y-3">
                {[
                  "Access their coding stats, including ratings, problems solved, and more, across multiple platforms.",
                  "Track their growth in competitive programming through intuitive dashboards and visualizations.",
                  "Get updates on upcoming coding contests from LeetCode, CodeChef, and CodeForces in one place.",
                  "Stay motivated by analyzing personalized progress reports and milestone achievements."
                ].map((item, index) => (
                  <li key={index} className="flex items-start">
                    {/* Custom Bullet */}
                    <span className="w-5 h-5 flex-shrink-0 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm mt-1 dark:bg-indigo-400">
                      {index + 1}
                    </span>
                    {/* List Item Content */}
                    <p className="ml-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                      {item}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Content 2 */}
      <div className="glowCard flex flex-col rounded-3xl border border-zinc-300 dark:border-zinc-800 p-5 w-full sm:w-4/5 xl:w-[75%] my-20">
        {/* Image and Content */}
        <div className="flex flex-col lg:flex-row items-center lg:items-start lg:gap-5 p-2">

          {/* Text Content */}
          <div className="mt-5 lg:mt-0 w-full lg:w-1/2 space-y-6">
            {/* Why We Built This Section */}
            <div>
              <h2 className="manrope-bold text-lg sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
                Why We Built This
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                The idea stemmed from our own experience as competitive programmers. Switching between platforms to check stats, compare performance, and stay updated was often time-consuming. We envisioned a tool that could make life easier for coders, providing a centralized solution for all their competitive programming needs.
              </p>
            </div>

            {/* Our Vision Section */}
            <div>
              <h2 className="manrope-bold text-lg sm:text-2xl font-semibold text-orange-600 dark:text-orange-400">
                Our Vision
              </h2>
              <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                Our vision is to empower programmers by giving them tools to focus on what truly matters: learning, solving problems, and excelling in competitions. We aim to be the go-to platform for competitive programmers of all skill levels.
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 h-48 sm:h-64 md:h-80 lg:h-96 xl:h-[30vw] flex items-center justify-center">
            <img
              className="h-full object-contain"
              src={assets.Student2}
              alt="Programmer"
            />
          </div>

        </div>
      </div>
      
      {/* Content 3 */}
      <div className="flex flex-col justify-center items-center text-center mt-10 space-y-6">
        <div>
          <h2 className="manrope-bold text-lg sm:text-2xl font-semibold text-indigo-600 dark:text-indigo-400">
            Get Involved
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            We’re constantly looking for ways to improve our platform. If you have suggestions, feature requests, or feedback, we’d love to hear from you. Contact us at <a href="mailto:algomasters25@gmail.com" className="text-orange-600 dark:text-orange-400 underline">algomasters25@gmail.com</a>.
          </p>
        </div>
        <div>
          <h2 className="manrope-bold text-lg sm:text-2xl font-semibold text-orange-600 dark:text-orange-400">
            Follow Us
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
            Stay connected for updates and exciting features coming your way.
          </p>
        </div>
      </div>

      <div className="m-9 p-10 text-center sm:text-xl">
        <p className="m-10 p-10 italic">Empowering coders to track, grow, and challenge their problem-solving prowess across the world’s top platforms.</p>
      </div>

    </div>
  );
};

export default About;
