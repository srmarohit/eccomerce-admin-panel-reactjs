
import React, {useState, useEffect, useContext, useRef} from 'react';
import ChatOnline from '../../components/chatOnline/ChatOnline';
import Conversation from '../../components/conversation/Conversation';
import Message from '../../components/message/Message';
import {AuthContext} from '../../context/AuthContext' ;
import axios from 'axios';
import "./messanger.css"

// socket io implemetation
import {io} from "socket.io-client" ;

function Messanger() {

    const [conversations, setConversations] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    // set all users coordinators
    const [coordinators, setCoordinators] = useState([]);

    // set message comes throug socket
    const [arrivalMessage, setArrivalMessage] = useState(null);

    const socket = useRef();  // create variable socket.

    const scrollRef = useRef();

    const {user} = useContext(AuthContext);

    // socket io connection 
    useEffect(()=>{
        socket.current = io("ws://localhost:5001");
        socket.current.on("getMessage", ({senderId,text}) => {
            setArrivalMessage({
                sender : senderId,
                text,
                createdAt : Date.now()
            });
        });
    },[socket.current]);

    // set All users 
    useEffect(()=>{
        const fetchCoordinator = async () =>{
            try{
                const res = await axios.get("/user/coordinators");
                console.log(res.data);
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

    // add or get user info 
    useEffect(()=>{
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", users => {
            console.log(users);
             // todo display online active users
        });
    },[user]);

    useEffect(() => {
        const getConversation = async ()=>{
            try{
                const res = await axios.get("/messanger/conversation/"+user._id);
                console.log( res.data);
                setConversations(res.data)
            }catch(err){
                console.log(err)
            }
        }

        getConversation();
    }, [user._id]);

    useEffect(()=>{
        const getMessages = async () =>{
            try{
                const res = await axios.get("/messanger/message/"+currentChat?._id);
                console.log(res.data);
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
            const res = await axios.post("/messanger/message", newText);
            setMessages([...messages, res.data])
            console.log(res.data);
            setNewMessage("");
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    },[messages])

    return (
        <div className="messanger">
            <div className="chatMenu">
                <div className="chatMenuWrapper">
                       <input placeholder="Search for friends" className="chatMenuInput" />
                           { conversations.map(c => <div className={currentChat && currentChat._id === c._id && "active-chat"} onClick={()=> setCurrentChat(c)}> 
                               <Conversation key={c._id} conv={c} user={user}/>
                               </div>
                               )}
                </div>
            </div>
            <div className="chatBox">
                <div className="chatBoxWrapper">
                   {
                       currentChat ?
                       <>
                       <div className="chatBoxTop">
                    {
                        messages.map(m => (
                            <div ref={scrollRef}>
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
                        coordinators?.map(coord => <ChatOnline co={coord}  />)
                    }
                </div>
            </div>
        </div>
    )
}

export default Messanger
