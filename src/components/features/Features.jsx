import "./features.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import {useEffect, useState} from "react"
import { proRequest } from "../../request_methods";

export default function Features() {

  const [revanue, setRevanue] = useState([]);
  const [revPerc, setRevPerc] = useState(0);

  useEffect(() => {
    const fetchRevenue = async () => {
      try{
        const res = await proRequest.get("/order/income");
        console.log(res.data);
        setRevanue(res.data)

        setRevPerc( Math.floor(100 * (res.data[1].total - res.data[0].total )/res.data[1].total ));
      }catch(e){
        console.log(e)
      }
    }
    fetchRevenue();
  }, [])

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revanue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$ {revanue[0]?.total}</span>
          <span className="featuredMoneyRate">
            {revPerc}
            {
              revPerc > 0
              ?
              <ArrowUpward  className="featuredIcon"/>
              :
              <ArrowDownward  className="featuredIcon negative"/>
            }
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$4,415</span>
          <span className="featuredMoneyRate">
            -1.4 <ArrowDownward className="featuredIcon negative"/>
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpward className="featuredIcon"/>
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}