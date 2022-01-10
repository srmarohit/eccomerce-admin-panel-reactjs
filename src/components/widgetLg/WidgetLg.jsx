
import { useEffect, useState } from "react";
import { proRequest } from "../../request_methods";
import {format} from "timeago.js"
import "./widgetlg.css";

export default function WidgetLg() {

  const [orders, setOrders] = useState([]);

  useEffect(()=>{
    const fetchOrders = async () => {
      try{
        const res = await proRequest.get("/order");
        //console.log(res.data)
        setOrders(res.data)
      }catch(err){
        console.log(err)
      }
    }

    fetchOrders();
  },[])

   // Create Internal Component  
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}>{type}</button>;
  };

  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest transactions</h3>
      <table className="widgetLgTable">
        <thead className="widgetLgTr">
          <tr>
          <th className="widgetLgTh">Order</th>
          <th className="widgetLgTh">Date</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Status</th>
          </tr>
        </thead>
        <tbody>
          {
            orders.map(order => (
              <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img
                  src="https://images.pexels.com/photos/4172933/pexels-photo-4172933.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940"
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">{order._id}</span>
              </td>
              <td className="widgetLgDate">{format(order.createdAt)}</td>
              <td className="widgetLgAmount">{order.amount}</td>
              <td className="widgetLgStatus">
                <Button type="Approved" />
              </td>
            </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}