import axios from "axios" ;
axios.defaults.headers.post['Content-Type'] = 'application/json';


export const loginCall = async (userCredential, dispatch) => {
    dispatch({type : "LOGIN_START"});
    try{
        const res = await axios.post("/auth/login", userCredential);
        console.log(res.data)
        dispatch({type : "LOGIN_SUCCESS", payload : res.data});
    }catch(err){
        dispatch({type : "LOGIN_FAILURE", payload : err});
    }
}