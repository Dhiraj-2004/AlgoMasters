import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const CircularProgress = ({ percentage, color }) => {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let start = 0;
    const step = percentage / 50;
    const interval = setInterval(() => {
      start += step;
      setAnimatedPercentage(Math.min(start, percentage));
      if (start >= percentage) clearInterval(interval);
    }, 50);

    return () => clearInterval(interval);
  }, [percentage]);

  return (
    <div className="relative w-42 h-42">
      <svg className="rotate-[-90deg]" width="120" height="120">
        <circle
          r={radius}
          cx="60"
          cy="60"
          className="fill-none stroke-gray-300 dark:stroke-gray-700"
          strokeWidth="8"
        />
        <motion.circle
          r={radius}
          cx="60"
          cy="60"
          className="fill-none"
          stroke={color}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          animate={{ strokeDashoffset: circumference - (animatedPercentage / 100) * circumference }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />
      </svg>

      <motion.span
        className="absolute inset-0 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-gray-300"
        animate={{ opacity: [0.5, 1], scale: [0.9, 1] }}
        transition={{ duration: 2.5, ease: "easeOut" }}
      >
        {Math.round(animatedPercentage)}%
      </motion.span>
    </div>
  );
};

CircularProgress.propTypes = {
  percentage: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
};

export default CircularProgress;
