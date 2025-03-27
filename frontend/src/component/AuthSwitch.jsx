import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const AuthSwitch = ({ currentState, setCurrentState }) => {
  const navigate = useNavigate();
  return (
    <div className="w-full flex justify-between pt-3 text-sm">
      <p className="cursor-pointer text-blue-400 ml-1"
        onClick={() => { navigate("/forgot") }}
      >Forgot password?</p>
      {currentState === 'Login' ? (
        <p onClick={() => setCurrentState('Sign Up')} className="cursor-pointer text-blue-400 mr-1">
          Create Account
        </p>
      ) : (
        <p onClick={() => setCurrentState('Login')} className="cursor-pointer text-blue-400 ml-1">
          Login Here
        </p>
      )}
    </div>
  );

};

AuthSwitch.propTypes = {
  currentState: PropTypes.string.isRequired,
  setCurrentState: PropTypes.func.isRequired,
};

export default AuthSwitch;
