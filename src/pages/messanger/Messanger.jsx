
import React, {useState, useEffect, useRef} from 'react';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import Message from '../../components/message/Message';
import "./messanger.css"

// socket io implemetation
import {io} from "socket.io-client" ;
import { ContextProvider } from '../video-chat/Context';
import App from '../video-chat/App';
import { pubRequest } from '../../request_methods';

function Messanger({user}) {
    const [currentChat, setCurrentChat] = useState(null);
    const [receiverChatName, setReceiverChatName] = useState(null);
    const [enableVideoChat, setEnableVideoChat] = useState(false);

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [onlineUsers, setOnlineUsers] = useState([]);

    // set all users coordinators
    const [coordinators, setCoordinators] = useState([]);

    // set message comes throug socket
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const socket = useRef();  // create variable socket.

    const scrollRef = useRef();

    socket.current = io("ws://localhost:5001");

    // socket io connection 
    useEffect(()=>{
        socket.current.on("getMessage", ({senderId,text}) => {
            setArrivalMessage({
                sender : senderId,
                text,
                createdAt : Date.now()
            });
        });
    },[]);

    
    // add or get user info 
    useEffect(()=>{
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users => {
            console.log("all online users ");
            //console.log(users)
             // todo display online active users
            setOnlineUsers(users); 
        });

        return () => {
            socket.current = null;
        }
    },[user._id]);

    // set All users 
    useEffect(()=>{
        const fetchCoordinator = async () =>{
            try{
                const res = await pubRequest.get("/user/coordinators");
                //console.log(res.data);
                res.data = res.data.filter(data => data._id !== user._id);
                setCoordinators(res.data);
            }catch(err){
                console.log(err)
            }
        }

        fetchCoordinator();
    },[user._id])

    // set Arrival message into CurrentChat
    useEffect(()=>{
        arrivalMessage && 
        currentChat?.members.includes(arrivalMessage.sender) &&
        setMessages(prev => [...prev, arrivalMessage])
    },[arrivalMessage, currentChat]);


    useEffect(()=>{
        const getMessages = async () =>{
            try{
                const res = await pubRequest.get("/messanger/message/"+currentChat?._id);
                //console.log(res.data);
                setMessages(res.data);
            }catch(err){
                console.log(err)
            }
        }
        getMessages();
    },[currentChat]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newText = {
            conversationId : currentChat._id,
            sender : user._id,
            text : newMessage
        }

        const receiverId = currentChat.members.find( // find method returns perticular element only
            member => member !== user._id
        );

        socket.current.emit("sendMessage", {
            senderId : user._id,
            receiverId,
            text : newMessage
        });
        
        try{
            const res = await pubRequest.post("/messanger/message", newText);
            setMessages([...messages, res.data])
            //console.log(res.data);
            setNewMessage("");
        }catch(err){
            console.log(err)
        }
    }

    //start conversation 
    const startConversation = async ({_id : receiverId, username}) => {
        //console.log("click on start conversation")
        // check conversation exists or not
        try{
                const res = await pubRequest.get(`/messanger/conversation/find/${user._id}/${receiverId}`);
            if(res.data){
                setCurrentChat(res.data);
                setReceiverChatName(username);
            }else{
                const res = await pubRequest.post("/messanger/conversation", { senderId : user._id, receiverId});
                setCurrentChat(res.data);
                setReceiverChatName(username);
            }
        }catch(err){
            console.log("error to start chat " + err)
        }
    }

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])

    return (
        <div className="messanger">
            <div className="chatBox">
                    <div className="chat-info">
                {
                    currentChat ?
                    <>
                    <div className="receiver-name">
                        <img src="https://bit.ly/srmarohit"/>
                        <h4>{receiverChatName}</h4>
                    </div>
                    <button 
                    className={!enableVideoChat ? "start-video" : "end-video"}
                    onClick={()=>setEnableVideoChat(!enableVideoChat)}>{enableVideoChat ? "End Video" : "Start Video"}</button>
                    </>
                    : 
                    null
                }
                </div>                 
                {
                   enableVideoChat && <div className="video-chat-wrapper">
                    <ContextProvider>
                     <App/>  
                    </ContextProvider>
                </div>
                }
                <div className="chatBoxWrapper">
                {
               currentChat ?
                <>   
                       <div className="chatBoxTop">
                    {
                        messages.map(m => (
                            <div ref={scrollRef} key={m._id}>
                                <Message message={m} own={m.sender === user._id} />
                            </div>
                        ))
                    }
                   </div>
                   <div className="chatBoxBottom">
                   <textarea
                    className="chatMessageInput"
                    placeholder="write something..."
                    onChange={e => setNewMessage(e.target.value)}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    Send
                  </button>
                   </div>
                   </>
                   :
                   <span className="noConversationText">Open a Conversation to start the chat</span>
                   }
                </div>
            </div>
            <div className="chatOnline">
                <div className="chatOnlineWrapper">
                    {
                        coordinators?.map(coord => (
                            <div
                             key={coord._id} 
                             onClick={ () => startConversation(coord)}
                             >
                                <ChatOnline co={coord}  online = { onlineUsers.find(ou => ou.userId === coord._id) ? true : false} /> 
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default Messanger
