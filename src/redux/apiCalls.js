import axios from "axios" ;
import { proRequest, pubRequest } from "../request_methods";
import { getProductFailure, getProductStart, getProductSuccess } from "./productRedux";
import { loginFailure, loginStart, loginSuccess, logout } from "./userRedux";
axios.defaults.headers.post['Content-Type'] = 'application/json';


export const loginCall = async (dispatch, userCredential) => {
    dispatch(loginStart());
    try{
        const res = await pubRequest.post("/auth/login", userCredential);
        console.log(res.data);
        dispatch(loginSuccess(res.data));
    }catch(err){
        console.log(err)
        dispatch(loginFailure());
    }
}

export const logoutCall = (dispatch) => {
    dispatch(logout());
}



// Product Calls


export const getProducts = async (dispatch) => {
    dispatch(getProductStart());
    try{
        const res = await proRequest.get("/product");
        console.log(res.data);
        dispatch(getProductSuccess(res.data));
    }catch(err){
        console.log(err)
        dispatch(getProductFailure());
    }
}