import PropTypes from 'prop-types';
import Title from './PageTitle';

const LeetcodeDailyData = ({ dailyChallenge }) => {
  if (!dailyChallenge) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'hard':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formattedDate = new Date(dailyChallenge.date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-5 pt-10 mt-10 sm:px-8 md:px-12 lg:px-16">
      <Title text1="Daily" text2="Challenge" />
      <div className="p-6 mt-10 flex flex-col items-center rounded-2xl shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/70 hover:scale-[1.01] w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-4xl">
        <div className="mb-6 w-full text-center">
          <h2 className="manrope-bold text-2xl sm:text-3xl md:text-4xl text-gray-800 dark:text-gray-300 mb-6">
            {dailyChallenge.question.title}
          </h2>
          <div className='flex flex-col sm:flex-row justify-center items-center gap-4 mb-4'>
            <span className={`inline-block px-4 py-2 rounded-full text-sm md:text-md font-semibold ${getDifficultyColor(dailyChallenge.question.difficulty)} dark:bg-opacity-80`}>
              {dailyChallenge.question.difficulty}
            </span>
            <span className="text-sm sm:text-md text-gray-600 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>
        </div>

        <a 
          href={`https://leetcode.com${dailyChallenge.link}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full max-w-[250px] text-center bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white 
            font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105
            flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Solve Challenge
        </a>
      </div>
    </div>
  );
};

LeetcodeDailyData.propTypes = {
  dailyChallenge: PropTypes.shape({
    date: PropTypes.string,
    link: PropTypes.string,
    question: PropTypes.shape({
      title: PropTypes.string,
      titleSlug: PropTypes.string,
      difficulty: PropTypes.string
    })
  })
};

export default LeetcodeDailyData;
