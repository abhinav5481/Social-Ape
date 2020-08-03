const functions = require("firebase-functions");

const { firestore } = require("firebase-admin");

const express = require("express");
const app = express();

const FbAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login } = require("./handlers/users");

// const firebase = require("firebase");
// firebase.initializeApp(firebaseConfig);

//***************************getting screams from firebase*********************
app.get("/screams", getAllScreams);

//*************************Post one scream******************
//apply a middleWare to check if the user is loggedin before posting a scream
app.post("/scream", FbAuth, postOneScream);

//****************************Signup route**************************
app.post("/signup", signup);

//*************************************Login Route**************** */
app.post("/login", login);

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
