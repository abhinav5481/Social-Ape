import {
  SET_SCREAMS,
  LOADING_DATA,
  LIKE_SCREAM,
  UNLIKE_SCREAM,
  DELETE_SCREAM,
  POST_SCREAM,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  STOP_LOADING_UI,
  SET_SCREAM,
  SUBMIT_COMMENT
} from "../types";
import axios from "axios";

//get all screams
export const getScreams = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/screams")
    .then((res) => {
      dispatch({ type: SET_SCREAMS, payload: res.data });
    })
    .catch((err) => {
      dispatch({ type: SET_SCREAMS, payload: [] });
    });
};

//like a scream
export const likeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/like`)
    .then(res => {
        dispatch({type: LIKE_SCREAM, payload: res.data})
    })
    .catch(err => console.log(err))
};

//unlike
export const unLikeScream = (screamId) => (dispatch) => {
    axios.get(`/scream/${screamId}/unlike`)
    .then(res => {
        dispatch({type: UNLIKE_SCREAM, payload: res.data})
    })
    .catch(err => console.log(err))
};

//delete scream
export const deleteScream = (screamId) => (dispatch) => {
  axios.delete(`/scream/${screamId}`)
  .then(res => {
    dispatch({type: DELETE_SCREAM, payload: screamId})
  })
  .catch(err => console.log(err))
};


//post a scream
export const postScream = (newScream) => (dispatch) => {
  dispatch({type: LOADING_UI});
  axios.
  post('/scream',newScream)
  .then((res)=>{
    dispatch({
      type: POST_SCREAM,
      payload: res.data
    });
    dispatch({type: CLEAR_ERRORS});

    
  }).catch(err => {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    })
  })
};

export const clearErrors = () => (dispatch) => {
  dispatch({type: CLEAR_ERRORS})
}

//get a single Scream
export const getScream = (screamId) => (dispatch) => {
  dispatch({type: LOADING_UI});
  axios.get(`/scream/${screamId}`)
  .then((res) => {
    dispatch({type: SET_SCREAM,payload: res.data});
    dispatch({type: STOP_LOADING_UI})
  })
  .catch((err) => console.log(err))
}

//submit comment
export const submitComment = (screamId,commentData) => (dispatch) => {
  // dispatch({type: LOADING_UI});
  axios.post(`/scream/${screamId}/comment`,commentData)
  .then(res => {
    dispatch({type: SUBMIT_COMMENT, payload: res.data })
    // dispatch({type: STOP_LOADING_UI})
    dispatch(clearErrors());
  })
  .catch((err) => {
    dispatch({
      type: SET_ERRORS,
      payload: err.response.data
    })
  });
}

//Get user data for user page
export const getUserData = (userHandle) => (dispatch) => {
  dispatch({type: LOADING_DATA})
  axios.get(`/user/${userHandle}`)
  .then(res => {
    dispatch({
      type: SET_SCREAMS,
      payload: res.data.screams
    });
  })
  .catch(err => {
    dispatch({
      type: SET_SCREAMS,
      payload: null
    })
  })
}