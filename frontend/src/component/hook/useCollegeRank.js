import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import axios from "axios";

const useCollegeRank = ({ username, department }) => {
  const [rankData, setRankData] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const fetchCollegeRank = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${backendUrl}/api/user/college-rank/${username}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRankData(response.data.userRank);
        setTotalUsers(response.data.totalUsers);
      } catch (error) {
        setError("Failed to fetch college rank");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (username && department) {
      fetchCollegeRank();
    }
  }, [username, department]);

  return { rankData, totalUsers, error, loading };
};

useCollegeRank.propTypes = {
  username: PropTypes.string.isRequired,
  department: PropTypes.string.isRequired,
};

export default useCollegeRank;
