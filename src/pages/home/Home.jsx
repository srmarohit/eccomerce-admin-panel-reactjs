import React from 'react'
import Chart from '../../components/chart/Chart'
import Features from '../../components/features/Features'
import "./home.css"
import {userData as data} from "../../dummyData"
import WidgetSm from '../../components/widgetSm/WidgetSm'
import WidgetLg from '../../components/widgetLg/WidgetLg'


export default function Home() {
    return (
        <div className="home">
            <Features/>
            <Chart 
             data={data}
             dataKey={"Active User"}
             title="User Analytics"
             grid
            />
            <div className="homewidgets">
                <WidgetSm/>
                <WidgetLg/>
            </div>
        </div>
    )
}
