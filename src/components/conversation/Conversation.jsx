

import axios from 'axios';
import React, { useEffect, useState } from 'react'
import "./conversation.css"

function Conversation({conv, user}) {

  const [receiver, setReceiver] = useState(null);

  const receiverId = conv.members.find( m => m !== user._id);

   useEffect(()=>{
      const getReceiverId = async () => {
        const res = await axios.get("/user/"+receiverId);
        console.log(res.data);
        setReceiver(res.data)
      }

      getReceiverId();
   },[receiverId]);

    return (
        <div className="conversation">
         <img
           className="conversationImg"
           src="https://bit.ly/srmarohit"
           alt=""
         />
        <span className="conversationName">{receiver && receiver.username}</span>
    </div>
    )
}

export default Conversation
