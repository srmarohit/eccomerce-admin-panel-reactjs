import axios from "axios";

const base_url = "https://mera-shop-api.herokuapp.com/api/v1/";

const token = JSON.parse(localStorage.getItem("persist:root"))
  ? JSON.parse(localStorage.getItem("persist:root")).user &&
    JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
      .currentUser
    ? JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user)
        .currentUser.access_token
    : ""
  : "";
export const pubRequest = axios.create({
  baseURL: base_url,
});

export const proRequest = axios.create({
  baseURL: base_url,
  headers: {
    token: `Bearer ${token}`,
  },
});
