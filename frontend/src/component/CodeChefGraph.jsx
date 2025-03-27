import PropTypes from 'prop-types';
import { useContext, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
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
import Title from './PageTitle';
import { ThemeContext } from '../context/ThemeContext';

const formatContestData = (contests) => {
  if (!Array.isArray(contests) || contests.length === 0) return [];

  return contests
    .map((contest) => {
      const year = parseInt(contest.getyear, 10);
      const month = parseInt(contest.getmonth, 10) - 1;
      const day = parseInt(contest.getday, 10);
      const date = new Date(year, month, day);

      if (!isValid(date)) return null;

      return {
        ...contest,
        date,
        rating: Number(contest.rating) || 0,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.date - b.date);
};

const CodeChefGraph = ({ attendedContests }) => {
  const { theme } = useContext(ThemeContext);
  const isDarkMode = theme === "dark";
  const isMobile = useMediaQuery({ maxWidth: 640 });
  const isTablet = useMediaQuery({ minWidth: 641, maxWidth: 1024 });

  const chartData = useMemo(() => formatContestData(attendedContests), [attendedContests]);

  const averageRating = useMemo(() => {
    if (chartData.length === 0) return null;
    const totalRating = chartData.reduce((sum, contest) => sum + contest.rating, 0);
    return Number((totalRating / chartData.length).toFixed(2));
  }, [chartData]);

  const chartHeight = isMobile ? 250 : isTablet ? 350 : 400;

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
        className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-200 text-xs sm:text-sm"
        role="tooltip"
        aria-label={`Contest details for ${contest.name}`}
      >
        <h3 className="font-semibold text-indigo-600 dark:text-indigo-400 text-sm sm:text-base">
          {contest.name}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          {format(contest.date, 'MMM dd, yyyy')}
        </p>
        <p className="mt-1 sm:mt-2 text-gray-800 dark:text-gray-100">
          Rating:{' '}
          <span className="font-medium text-orange-500 dark:text-orange-400">
            {contest.rating}
          </span>
        </p>
        <p className="text-gray-800 dark:text-gray-100">
          Rank: {contest.rank || 'N/A'}
        </p>
      </div>
    );
  };

  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.array,
  };

  const chartStyles = {
    gridStroke: isDarkMode ? "#444" : "#e5e5e5",
    tickFill: isDarkMode ? "#ddd" : "#666",
    lineStroke: isDarkMode ? "#60a5fa" : "#2563eb",
    referenceLineStroke: isDarkMode ? "#f97316" : "#ea580c",
  };

  const tickFormatter = (date) => {
    if (isMobile) return format(new Date(date), "MMM");
    return format(new Date(date), "MMM yy");
  };

  return (
    <div className="w-full h-auto px-4 sm:px-6 lg:px-8 py-6">
      <Title text1="Rating" text2="History" />
      <ResponsiveContainer width="100%" height={chartHeight}>
        <LineChart
          data={chartData}
          margin={{
            top: 20,
            right: isMobile ? 10 : 30,
            left: isMobile ? 0 : 20,
            bottom: 10,
          }}
          role="img"
          aria-label="Line chart showing CodeChef rating history over time"
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={chartStyles.gridStroke}
            aria-hidden="true"
          />
          <XAxis
            dataKey="date"
            tickFormatter={tickFormatter}
            tick={{ fill: chartStyles.tickFill, fontSize: isMobile ? 10 : 12 }}
            stroke={chartStyles.tickFill}
            interval={isMobile ? "preserveStartEnd" : "preserveStart"}
            aria-label="Time axis (months and years)"
          />
          <YAxis
            tick={{ fill: chartStyles.tickFill, fontSize: isMobile ? 10 : 12 }}
            stroke={chartStyles.tickFill}
            label={
              isMobile
                ? undefined
                : {
                    value: "Rating",
                    angle: -90,
                    position: "insideLeft",
                    offset: 10,
                    style: { fill: chartStyles.tickFill, fontSize: 14 },
                  }
            }
            width={isMobile ? 40 : 60}
            aria-label="Rating axis"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="rating"
            stroke={chartStyles.lineStroke}
            strokeWidth={2}
            dot={{ r: isMobile ? 3 : 4, fill: chartStyles.lineStroke }}
            activeDot={{ r: isMobile ? 6 : 8, fill: chartStyles.lineStroke }}
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
                isMobile
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


CodeChefGraph.propTypes = {
  attendedContests: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      getyear: PropTypes.string.isRequired,
      getmonth: PropTypes.string.isRequired,
      getday: PropTypes.string.isRequired,
      rating: PropTypes.string.isRequired,
      rank: PropTypes.string,
    })
  ).isRequired,
};

export default CodeChefGraph;