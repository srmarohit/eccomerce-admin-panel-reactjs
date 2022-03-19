import React from "react" 
import "./topbar.css"
import { NotificationsNone, Language, Settings, ExitToAppRounded } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { logoutCall } from "../../redux/apiCalls";

export default function Topbar(props) {

  const dispatch = useDispatch();

  const handleLogout = () => {
    logoutCall(dispatch);
  }

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">{props.user?.username}</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
          <div className="topbarIconContainer" onClick={handleLogout}>
            <ExitToAppRounded />
          </div>
          <img src="https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500" alt="" className="topAvatar" />
        </div>
      </div>
    </div>
  );
}