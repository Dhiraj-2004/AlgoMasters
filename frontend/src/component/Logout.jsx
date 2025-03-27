import {  useEffect } from "react"
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';

const Logout = () => {
    const navigate = useNavigate();
    useEffect(() => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        toast.success('Logged out successfully!');
        setTimeout(() => {
            navigate("/login");
        }, 2000);

    }, [navigate]);
    return (
        <div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            ></ToastContainer>
        </div>
    );
}

export default Logout