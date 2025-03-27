import PropTypes from "prop-types";
import { useContext, useEffect, useState, useRef } from "react";
import { ThemeContext } from "../context/ThemeContext";

const Dropdown = ({ name, options, value, onChange, label, newStyle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectChange = (newValue) => {
    setSelectedValue(newValue);
    onChange({ target: { name, value: newValue } });
    setIsOpen(false);
  };

  const selectedLabel = options.find(
    (option) => (typeof option === "object" ? option.value === selectedValue : option === selectedValue)
  )?.label || selectedValue;

  const baseInputStyles = theme === "dark"
    ? "bg-zinc-800 text-gray-200"
    : "bg-white text-black";
  const borderStyles = isOpen 
    ? "border-blue-500" 
    : theme === "dark" 
      ? "border-zinc-600" 
      : "border-zinc-200";
  const labelStyles = theme === "dark" ? "text-white" : "text-zinc-600";

  const hasSelection = selectedValue && selectedValue !== options[0];
  const textColor = hasSelection ? "" : "text-zinc-400";

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {label && (
        <label className={`block text-sm font-medium mb-1 ${labelStyles}`}>
          {label}
        </label>
      )}
      <div
        className={`${baseInputStyles} ${borderStyles} w-full h-14 px-4 border-2 rounded-xl flex items-center justify-between cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 ${newStyle}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`truncate ${textColor}`}>
          {selectedLabel}
        </span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""} text-zinc-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
      {isOpen && (
        <ul
          className={`${baseInputStyles} ${borderStyles} absolute z-20 mt-1 w-full max-h-fit border-2 rounded-xl shadow-lg overflow-y-auto max-h-60`}
        >
          {options.map((option, index) => {
            const isObject = typeof option === "object";
            const optionValue = isObject ? option.value : option;
            const optionLabel = isObject ? option.label : option;

            return (
              <li
                key={index}
                className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                  optionValue === selectedValue
                    ? "text-blue-500 font-medium"
                    : theme === "dark"
                    ? "hover:bg-zinc-700"
                    : "hover:bg-zinc-300"
                }`}
                onClick={() => handleSelectChange(optionValue)}
              >
                {optionLabel}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  newStyle: PropTypes.string,
};

export default Dropdown;