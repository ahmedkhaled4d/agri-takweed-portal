import axiosApiInstance from 'services/axios.inercept';
import React, { useState, useEffect } from 'react';

export const useFetch = (endPoint) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetching() {
      try {
        const response = await axiosApiInstance.get(endPoint);
        // throw new Error();
        setData(response);
        setIsLoading((prev) => !prev);
      } catch (error) {
        console.log(error);
        setError(error);
        // setIsLoading((prev) => !prev);
      }
    }
    fetching();
  }, [endPoint]);

  return { isLoading, data, error };
};
