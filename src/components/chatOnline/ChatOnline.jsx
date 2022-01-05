import React from 'react'
import "./chatonline.css"
function ChatOnline({co , online}) {
  console.log("online" + online)
    return (
        <div className="chatOnline">
          <div className="chatOnlineFriend">
            <div className="chatOnlineImgContainer">
              <img
                className="chatOnlineImg"
                src="https://bit.ly/srmarohit"
                alt=""
              />
              <div className={online ? "chatOnlineBadge" : ""}></div>
            </div>
            <span className="chatOnlineName">{co.username}</span>
          </div>
      </div>
    )
}

export default ChatOnline
