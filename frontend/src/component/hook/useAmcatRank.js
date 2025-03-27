import axios from "axios";
import { useEffect, useState } from "react";

const useAmcatRank = (amcatID) => {
  const [amcatRank, setAmcatRank] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!amcatRank && amcatID) {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const fetchAmcatRank = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${backendUrl}/api/amcat/user/rank/${amcatID}`);
          setAmcatRank(response.data);
        } catch (error) {
          setError(error.response?.data?.error || "Failed to fetch AMCAT rank");
        } finally {
          setLoading(false);
        }
      };

      fetchAmcatRank();
    }
  }, [amcatID, amcatRank]);

  return { amcatRank, error, loading };
};

export default useAmcatRank;
