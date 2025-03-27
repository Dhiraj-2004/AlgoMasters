import axios from 'axios';
import { useState } from 'react';
import InputField from './InputField';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from "react-hot-toast";
import Title from './PageTitle';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleForgotPassword = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/forgotPass`, { email });
      setOtpSent(true);
      toast.success('OTP sent to your email!');
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message)
    }
  };

  const handleChangeForgotPassword = async () => {
    try {
      await axios.post(`${backendUrl}/api/user/changePassword`, {
        email,
        otp,
        newPassword: password
      });
      toast.success('Password changed successfully!');
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.msg)
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="manrope-regular border border-gray-200 dark:border-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 transition-all duration-300 hover:shadow-xl dark:hover:shadow-gray-900/70 hover:scale-[1.01] dark:shadow-xl p-8 w-full max-w-md mx-auto mt-10 space-y-6">
        <Title text1="Forgot" text2="Password" className="text-center dark:text-white" />
        
        <div className="space-y-5">
          <InputField
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            label="Email"
            className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
          />

          {otpSent && (
            <div className='space-y-5'>
              <InputField
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter your OTP"
                label="OTP"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
              <InputField
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your new password"
                label="New Password"
                className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400"
              />
            </div>
          )}
        </div>

        <p 
          onClick={() => navigate("/login")} 
          className="cursor-pointer text-blue-400 hover:text-blue-600 text-sm transition-colors"
        >
          Back to login
        </p>

        <div className="flex justify-center">
          <button 
            onClick={otpSent ? handleChangeForgotPassword : handleForgotPassword}
            className="w-full custom-button"
          >
            {otpSent ? 'Reset Password' : 'Send OTP'}
          </button>
        </div>
      </div>
      <Toaster position="top-right" reverseOrder={false}/>
    </div>
  );
};

export default ForgotPassword;