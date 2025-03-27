import PropTypes from 'prop-types';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({ 
  type, 
  name, 
  value, 
  onChange, 
  placeholder, 
  label,
  className,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="manrope-regular flex flex-col space-y-2 w-full">
      {label && (
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <input
          className={`w-full px-4 py-4 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-zinc-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
            dark:focus:ring-blue-400 dark:focus:border-blue-400
            placeholder-gray-400 dark:placeholder-gray-400
            transition-all duration-200 outline-none
            ${type === 'password' ? 'pr-12' : ''}
            ${className}`}
          type={type === 'password' && showPassword ? 'text' : type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          {...props}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="absolute right-4 top-1/2 -translate-y-1/2 
                     text-gray-500 dark:text-gray-400 
                     hover:text-gray-700 dark:hover:text-gray-300
                     transition-colors duration-200"
          >
            {showPassword ? (
              <FaEyeSlash className="w-5 h-5" />
            ) : (
              <FaEye className="w-5 h-5" />
            )}
          </button>
        )}
      </div>
    </div>
  );
};

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
};

InputField.defaultProps = {
  type: 'text',
};

export default InputField;