import axios from "axios";
import { proRequest, pubRequest } from "../request_methods";
import {
  createProductFailure,
  createProductStart,
  createProductSuccess,
  deleteProductFailure,
  deleteProductStart,
  deleteProductSuccess,
  getProductFailure,
  getProductStart,
  getProductSuccess,
  updateProductFailure,
  updateProductStart,
  updateProductSuccess,
} from "./productRedux";
import {
  createUsersFailure,
  createUsersStart,
  createUsersSuccess,
  delUsersFailure,
  delUsersStart,
  delUsersSuccess,
  getUsersFailure,
  getUsersStart,
  getUsersSuccess,
  loginFailure,
  loginStart,
  loginSuccess,
  logout,
  updateUsersFailure,
  updateUsersStart,
  updateUsersSuccess,
} from "./userRedux";
axios.defaults.headers.post["Content-Type"] = "application/json";

export const loginCall = async (dispatch, userCredential) => {
  dispatch(loginStart());
  try {
    const res = await pubRequest.post("/auth/login", userCredential);
    console.log(res.data);
    dispatch(loginSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(loginFailure());
  }
};

export const logoutCall = (dispatch) => {
  dispatch(logout());
};

// get users

export const getUsers = async (dispatch) => {
  dispatch(getUsersStart());
  try {
    const res = await proRequest.get("/user");
    dispatch(getUsersSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(getUsersFailure());
  }
};

// create users

export const createUser = async (dispatch, user) => {
  dispatch(createUsersStart());
  try {
    const res = await pubRequest.post("/auth/register", user);
    dispatch(createUsersSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(createUsersFailure());
  }
};

// update users

export const updateUser = async (dispatch, user) => {
  const { _id, ...rest } = user;
  dispatch(updateUsersStart());
  try {
    const res = await proRequest.put("/user/" + _id, rest);
    dispatch(updateUsersSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(updateUsersFailure());
  }
};

// delete user

export const delUsers = async (dispatch, id) => {
  dispatch(delUsersStart());
  try {
    const res = await proRequest.delete("/user/" + id);
    dispatch(delUsersSuccess(id));
  } catch (error) {
    console.log(error);
    dispatch(delUsersFailure());
  }
};

// Product Calls

export const getProducts = async (dispatch) => {
  dispatch(getProductStart());
  try {
    const res = await proRequest.get("/product");
    console.log(res.data);
    dispatch(getProductSuccess(res.data));
  } catch (err) {
    console.log(err);
    dispatch(getProductFailure());
  }
};

// create product calls
export const createProduct = async (dispatch, product) => {
  dispatch(createProductStart());
  try {
    const res = await proRequest.post("/product/create", product);
    console.log(res.data);
    dispatch(createProductSuccess(res.data));
  } catch (error) {
    console.log(error);
    dispatch(createProductFailure);
  }
};

// Update Product Calls

export const updateProducts = async (dispatch, product) => {
  const { _id, ...rest } = product;
  dispatch(updateProductStart());
  try {
    const res = await proRequest.put("/product/edit/" + _id, rest); // there rest is an object consist all properties except _id.
    console.log(res.data);
    dispatch(updateProductSuccess(product));
  } catch (err) {
    console.log(err);
    dispatch(updateProductFailure());
  }
};

// delete Product Calls

export const delProducts = async (dispatch, id) => {
  dispatch(deleteProductStart());
  try {
    const res = await proRequest.delete("/product/remove/" + id);
    console.log(res.data);
    dispatch(deleteProductSuccess(id));
  } catch (err) {
    console.log(err);
    dispatch(deleteProductFailure());
  }
};

// joi
// formik // yup
// required
// input type="email" required
