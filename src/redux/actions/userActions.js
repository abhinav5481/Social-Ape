import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER,
  MARK_NOTIFICATIONS_READ
} from "../types";
import axios from "axios";



export const loginUser = (userData, history) => (dispatch) => {
  //middleware applied and thus dispatch can be used for async call
  dispatch({ type: LOADING_UI });
  axios
    .post("/login", userData)
    .then((res) => {
      setAuthHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const signupUser = (newUserData, history) => (dispatch) => {
  //Redux thunk
  dispatch({ type: LOADING_UI });
  axios
    .post("/signup", newUserData)
    .then((res) => {
      //store token
      setAuthHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push("/");
    })
    .catch((err) => {
      dispatch({
        payload: err.response.data,
        type: SET_ERRORS,
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem("FBIdToken");
  delete axios.defaults.headers.common["Authorization"];
  dispatch({ type: SET_UNAUTHENTICATED });
};

export const uploadImage = (formData) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post('/user/image',formData)
    .then(res => {
        dispatch(getUserData())
    })
    .catch(err =>  console.log(err));
}

export const editUserDetails = (userDetails) => (dispatch) => {
    dispatch({type: LOADING_USER});
    axios.post('/user',userDetails)
    .then(() =>{
        dispatch(getUserData());
    })
    .catch((err) => console.log(err));
};

export const getUserData = () => (dispatch) => {
  //redux-thunk
  dispatch({type: LOADING_USER})
  axios
    .get("/user")
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};

export const markNotificationsRead = (notificationIds) => (dispatch) => {
  axios.post('/notifications',notificationIds)
  .then(res => {
    dispatch({
      type: MARK_NOTIFICATIONS_READ
    })
  })
  .catch(err => console.log(err));



}

const setAuthHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem("FBIdToken", FBIdToken);
  axios.defaults.headers.common["Authorization"] = FBIdToken; //set the header to Authorization = Bearer IdToken (for getting the details)
};



