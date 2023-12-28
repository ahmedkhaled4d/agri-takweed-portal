import React, { useEffect } from "react";
import { Sparklines, SparklinesLine, SparklinesSpots } from "react-sparklines";
import { useState } from "react";
import { getStorage, setStorage } from 'utils/storage/storage';
import axios from "services/axios.inercept";
export default function LandChart() {
  const [data, setData] = useState([]);
    
    function getData() {
      const data = getStorage(`Lands`);
      if (data) {
          setData(JSON.parse(data));
        //   console.log(JSON.parse(data));
      } else {
        axios
          .get(`/admin/dashboard/analysis/spark`)
          .then((response) => {
            setStorage(
              `Lands`,
              JSON.stringify(response.data.data),
              60 * 60 * 24 
            ); //1 day
            setData(response.data.data);
          })
          .catch((e) => console.error(e));
      }
    }
    useEffect(() => {
        getData();
    },[])

  return (
    <Sparklines
      data={data}
      height={60}
      width={620}
    >
      <SparklinesLine color="green" />
      <SparklinesSpots  />
    </Sparklines>
  );
}
