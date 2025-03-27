import PropTypes from 'prop-types';
import { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';


const SubMenu = ({ item, onClick, user }) => {
  const { theme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleClick = () => {
    if (item.title === "Profile" && user) {
      navigate(`/user/${user}`);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div>
      <NavLink
        to={item.title === "Profile" ? `/user/${user}` : item.path}
        onClick={handleClick}
        className={`flex items-center px-5 mt-5 text-lg ${
          theme === 'dark' ? 'hover:bg-zinc-800' : 'hover:bg-zinc-300'
        } hover:border-l-4 hover:border-purple-500 hover:text-orange-500 dark:hover:text-blue-500 transition-all duration-200`}
        aria-label={item.title} 
      >
        <div className="flex items-center space-x-4">
          {item.icon}
          <span className="ml-4">{item.title}</span>
        </div>
      </NavLink>
    </div>
  );
};

SubMenu.propTypes = {
  item: PropTypes.shape({
    title: PropTypes.string.isRequired,
    path: PropTypes.string.isRequired,
    icon: PropTypes.node.isRequired,  
  }).isRequired,
  onClick: PropTypes.func,
  user:PropTypes.isRequired
};

export default SubMenu;
