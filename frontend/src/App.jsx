import { Routes, Route, BrowserRouter  } from 'react-router-dom'
import Navbar from "./component/Navbar"
import Home from './pages/Home'
import Codechef from './pages/Codechef'
import Codeforces from './pages/Codeforces'
import Login from './pages/Login'
import About from './pages/About'
import Leetcode from './pages/Leetcode'
import Add from "./pages/Add"
import ThemeContext from "./context/ThemeContext"
import Logout from './component/Logout'
import ForgotPassword from './component/ForgotPassword'
import Profile from './pages/Profile'
import AllUserData from './pages/AllUserData'
import Footer from './component/Footer'
import Amcat from './pages/Amcat'
import UpdateProfile from './pages/UpdateProfile'


const App = () => {
  return (
    <div className="flex flex-col min-h-screen  transition-colors duration-700">
      <BrowserRouter >
        <ThemeContext>
          {/* Navbar */}
          <Navbar />

          {/* Main Content */}
          <div className="flex-grow mt-40 w-full">
            <Routes>
              <Route path='/' element={<Home></Home>}></Route>
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/codechef" element={<Codechef />} />
              <Route path="/leetcode" element={<Leetcode />} />
              <Route path="/codeforces" element={<Codeforces />} />
              <Route path="/about" element={<About />} />
              <Route path="/add" element={<Add />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/users" element={<AllUserData />} />
              <Route path="/team" element={<Home />} />
              <Route path="/user/:username" element={<Profile />} />
              <Route path="/forgot" element={<ForgotPassword />} />
              <Route path="/amcat" element={<Amcat />} />
              <Route path='/update' element={<UpdateProfile />} />
            </Routes>
          </div>

          {/* Footer */}
          <Footer />
        </ThemeContext>
      </BrowserRouter >
    </div>
  );
};

export default App
