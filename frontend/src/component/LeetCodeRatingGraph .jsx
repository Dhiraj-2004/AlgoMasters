import { useContext, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import Title from './PageTitle';
import { ThemeContext } from '../context/ThemeContext';

const formatContestData = (contests) => {
  if (!Array.isArray(contests) || contests.length === 0) return [];

  return contests
    .map((contest) => {
      const date = new Date(contest.startTime * 1000);
      if (!isValid(date)) return null;

      return {
        ...contest,
        date,
        rating: Number(contest.rating.toFixed(2)),
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
};

const LeetCodeRatingGraph = ({ attendedContests }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";

  const chartData = useMemo(() => formatContestData(attendedContests), [attendedContests]);

  const averageRating = useMemo(() => {
    if (chartData.length === 0) return null;
    const totalRating = chartData.reduce((sum, contest) => sum + contest.rating, 0);
    return Number((totalRating / chartData.length).toFixed(2));
  }, [chartData]);

  const chartHeight = useMemo(() => {
    const width = window.innerWidth;
    if (width < 640) return 300; 
    if (width < 1024) return 350;
    return 400; 
  }, []);

  if (chartData.length === 0) {
    return (
      <div className="text-gray-500 dark:text-gray-400 text-center py-10 text-lg">
        No contest history available
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const contest = payload[0].payload;
    return (
      <div
        className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200"
        role="tooltip"
        aria-label={`Contest details for ${contest.contestTitle}`}
      >
        <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 text-base">
          {contest.contestTitle}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
          {format(contest.date, 'MMM dd, yyyy')}
        </p>
        <p className="mt-2 text-gray-800 dark:text-gray-100">
          Rating:{' '}
          <span className="font-medium text-orange-500 dark:text-orange-400">
            {contest.rating}
          </span>
        </p>
        <p className="text-gray-800 dark:text-gray-100">
          Solved: {contest.problemsSolved}/{contest.totalProblems}
        </p>
        <p className="text-gray-800 dark:text-gray-100">
          Rank: {contest.ranking?.toLocaleString() || 'N/A'}
        </p>
      </div>
    );
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        payload: PropTypes.shape({
          contestTitle: PropTypes.string,
          date: PropTypes.instanceOf(Date),
          rating: PropTypes.number,
          problemsSolved: PropTypes.number,
          totalProblems: PropTypes.number,
          ranking: PropTypes.number,
        }),
      })
    ),
  };

  const chartStyles = {
    gridStroke: isDarkMode ? "#444" : "#e5e5e5",
    tickFill: isDarkMode ? "#ddd" : "#666",
    lineStroke: isDarkMode ? "#60a5fa" : "#2563eb",
    referenceLineStroke: isDarkMode ? "#f97316" : "#ea580c",
  };

  
  const tickFormatter = (date) => {
    const width = window.innerWidth;
    if (width < 640) return format(new Date(date), 'MMM');
    return format(new Date(date), 'MMM yy'); 
  };

  return (
    <div className="w-full h-auto py-6">
      <Title text1="Rating" text2="History" />
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: window.innerWidth < 640 ? 10 : 30,
            left: window.innerWidth < 640 ? 0 : 20,
            bottom: 10,
          }}
          role="img"
          aria-label="Line chart showing LeetCode rating history over time"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartStyles.gridStroke}
            aria-hidden="true"
          />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={{ fill: chartStyles.tickFill, fontSize: window.innerWidth < 640 ? 10 : 12 }}
            stroke={chartStyles.tickFill}
            interval={window.innerWidth < 640 ? 'preserveStartEnd' : 'preserveStart'}
            aria-label="Time axis (months and years)"
          />
          <YAxis
            tick={{ fill: chartStyles.tickFill, fontSize: window.innerWidth < 640 ? 10 : 12 }}
            stroke={chartStyles.tickFill}
            label={
              window.innerWidth < 640
                ? undefined
                : {
                    value: "Rating",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: chartStyles.tickFill, fontSize: 14 },
                  }
            }
            width={window.innerWidth < 640 ? 40 : 60}
            aria-label="Rating axis"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke={chartStyles.lineStroke}
            strokeWidth={2}
            dot={{ r: window.innerWidth < 640 ? 3 : 4, fill: chartStyles.lineStroke }}
            activeDot={{ r: window.innerWidth < 640 ? 6 : 8, fill: chartStyles.lineStroke }}
            name="Rating"
            animationDuration={800}
            aria-label="Rating trend line"
          />
          {averageRating && (
            <ReferenceLine
              y={averageRating}
              stroke={chartStyles.referenceLineStroke}
              strokeDasharray="5 5"
              label={
                window.innerWidth < 640
                  ? undefined
                  : {
                      value: `Avg: ${averageRating}`,
                      position: "insideTopRight",
                      fill: chartStyles.referenceLineStroke,
                      fontSize: 12,
                    }
              }
              aria-label={`Average rating: ${averageRating}`}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

LeetCodeRatingGraph.propTypes = {
  attendedContests: PropTypes.arrayOf(
    PropTypes.shape({
      contestTitle: PropTypes.string.isRequired,
      startTime: PropTypes.number.isRequired,
      rating: PropTypes.number.isRequired,
      problemsSolved: PropTypes.number.isRequired,
      totalProblems: PropTypes.number.isRequired,
      ranking: PropTypes.number,
    })
  ),
};

export default LeetCodeRatingGraph;