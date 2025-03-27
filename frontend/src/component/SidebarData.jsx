import { assets } from "../assets/assets"

export const SidebarData = [
  {
    title: 'HOME',
    path: '/home',
    icon: <img src={assets.home} alt="Home" className="w-6 h-6" />,
  },
  {
    title: 'Profile',
    path: 'profile',
    icon: <img src={assets.profile} alt="Profile" className="w-6 h-6" />,
  },
  {
    title: 'LeetCode',
    path: '/leetcode',
    icon: <img src={assets.leetcode} alt="LeetCode" className="w-6 h-6" />,

  },
  {
    title: 'CodeChef',
    path: '/codechef',
    icon: <img src={assets.codechef} alt="CodeChef" className="w-6 h-6" />,

  },
  {
    title: 'CodeForces',
    path: '/codeforces',
    icon: <img src={assets.codeforce} alt="CodeForces" className="w-6 h-6" />,

  },
  {
    title: 'Amcat',
    path: '/amcat',
    icon: <img src={assets.Amcat} alt="Amcat" className="w-6 h-6" />,

  },
  {
    title: 'Users',
    path: '/users',
    icon: <img src={assets.User} alt="users" className="w-6 h-6" />,
  },
  {
    title: 'Update',
    path: '/update',
    icon: <img src={assets.update} alt="users" className="w-6 h-6" />,
  },
  {
    title: 'Team',
    path: '/team',
    icon: <img src={assets.team} alt="Team" className="w-6 h-6" />,
  },
  {
    title: 'Support',
    path: '/support',
    icon: <img src={assets.support} alt="Support" className="w-6 h-6" />,
  },
  {
    title: 'About',
    path: '/about',
    icon: <img src={assets.about} alt="About" className="w-6 h-6 text-white" />,
  },
  {
    title: 'Logout',
    path: '/logout',
    icon: <img src={assets.logout} alt="Logout" className="w-6 h-6 text-white" />,
  },

];
