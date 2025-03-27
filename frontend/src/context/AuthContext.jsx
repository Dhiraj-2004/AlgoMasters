import axios from "axios";
import { createContext, useEffect, useState } from "react";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    const fetchUser = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setUser(null);
            return;
        }

        try {
            const response = await axios.get(`${backendUrl}/api/user/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response?.data);
        } catch (error) {
            console.error("Error fetching user:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);


    return (
        <AuthContext.Provider value={{ user, fetchUser }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};
