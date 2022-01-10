import React, { createContext, useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import Peer from 'simple-peer';

const SocketContext = createContext();

// const socket = io('https://warm-wildwood-81069.herokuapp.com');



const ContextProvider = ({ children }) => {
  //const vidSocket = io('http://localhost:5002');
  const vidSocket = useRef();

  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [stream, setStream] = useState();
  const [name, setName] = useState('');
  const [call, setCall] = useState({});
  const [me, setMe] = useState(''); 

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();



  useEffect(() => {
     vidSocket.current = io('http://localhost:5002');

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        //console.log(currentStream);
        window.localStream = currentStream ;
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });

    vidSocket.current.on('me', (id) => {
      setMe(id)
      //console.log("new video chatter connected.."+id) 
    });

    vidSocket.current.on('callUser', ({ from, name: callerName, signal }) => {
      //console.log(`CallUser listening.. ${from} ${callerName} | ${signal}`)
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return  () => {
        vidSocket.current = null ;
        window.localStream.getTracks().forEach(function(track) {
            track.stop();
        });
      
       connectionRef.current.destroy();  //add extra
      // userVideo.current = null ;
      // setMe('');  
    }
  
  }, []);

 
  const answerCall = () => {
    setCallAccepted(true);

    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (data) => {
      vidSocket.current.emit('answerCall', { signal: data, to: call.from });
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
      //console.log("uservideo src  : "+currentStream)
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (data) => {
      vidSocket.current.emit('callUser', { userToCall: id, signalData: data, from: me, name });
      //console.log(`callUser emitted from ${data} `)
    });

    peer.on('stream', (currentStream) => {
      userVideo.current.srcObject = currentStream;
      //console.log("uservideo src " + userVideo.current.srcObject)
    });

    vidSocket.current.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);

    connectionRef.current.destroy();

    window.location.reload();
  };

  return (
    <SocketContext.Provider value={{
      call,
      callAccepted,
      myVideo,
      userVideo,
      stream,
      name,
      setName,
      callEnded,
      me,
      callUser,
      leaveCall,
      answerCall,
    }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
