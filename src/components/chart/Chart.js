import React from 'react'
import "./chart.css"
import {
    LineChart,
    Line,
    XAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
  } from "recharts";


function Chart({data, dataKey, title, grid}) {
    return (
        <div className="chart">
        <h3 className="chartTitle">{title}</h3>
        <ResponsiveContainer width="100%" aspect={4 / 1}>{/** aspect value means 4 width size and one height size */}
          <LineChart data={data}>
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
