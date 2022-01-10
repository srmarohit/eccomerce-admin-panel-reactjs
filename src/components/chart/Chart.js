import React, { useEffect, useMemo, useState } from 'react'
import "./chart.css"
import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";
import { proRequest } from '../../request_methods';


function Chart({data, dataKey, title, grid}) {

  const [userStats, setUserStats] = useState([]) ;

  const MONTHS = useMemo(()=>{
    return [ "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
  },[])

  useEffect(() => {
    const fetchSalesData = async () => {
      try{
        const res = await proRequest.get("/user/stats");
        console.log("data "+res.data);
        res.data.map(item => setUserStats((prev) => [...prev, { 
          name : MONTHS[item._id -1 ],
          "Active User" : item.total
          }
        ])
       );
      }catch(e){
        console.log(e)
      }
    }
    fetchSalesData();
    // console.log("userStats " +userStats)
  },[MONTHS]);

    return (
        <div className="chart">
        <h3 className="chartTitle">Active Users</h3>
        <ResponsiveContainer width="100%" aspect={4 / 1}>{/** aspect value means 4 width size and one height size */}
          <LineChart data={userStats}>
            <XAxis dataKey="name" stroke="#5550bd" />
            <Line type="monotone" dataKey={dataKey} stroke="#5550bd" />
            <Tooltip />
           { grid && <CartesianGrid stroke="#e0dfdf" strokeDasharray="5 5" /> }
          </LineChart>
        </ResponsiveContainer>
      </div>
    )
}

export default Chart
