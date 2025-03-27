import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import { GoSun } from "react-icons/go";
import { FaRegMoon } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <motion.button
      onClick={toggleTheme}
      className="flex justify-center items-center text-2xl 
      bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 
      rounded-full h-10 w-10 shadow-md dark:shadow-lg border border-gray-400 dark:border-none 
      focus:outline-none active:scale-90"
      whileTap={{ scale: 0.85 }}
      whileHover={{ rotate: 15 }}
      transition={{ type: "spring", stiffness: 200, damping: 10 }}
    >
      <AnimatePresence mode="wait">
        {theme === "light" ? (
          <motion.div
            key="moon"
            initial={{  rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <FaRegMoon className="text-center font-bold transition-colors duration-500" />
          </motion.div>
        ) : (
          <motion.div
            key="sun"
            initial={{ rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 180 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <GoSun className="text-center text-yellow-400 font-bold transition-colors duration-500" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ThemeToggle;
