const functions = require("firebase-functions");

const { firestore } = require("firebase-admin");

const express = require("express");
const app = express();

const FbAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream, getScream, commentOnScream } = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
} = require("./handlers/users");

//*************************************Scream Route***************** */
//******getting screams from firebase*******
app.get("/screams", getAllScreams);

//******Post one scream*******
//apply a middleWare to check if the user is loggedin before posting a scream
app.post("/scream", FbAuth, postOneScream);

//getting one particular scream with all details related to it
app.get("/scream/:screamId",getScream);

//posting comment to a particular screams
app.post('/scream/:screamId/comment', FbAuth,commentOnScream)

//*************************************User Route***************** */
//********Signup route*******
app.post("/signup", signup);

//********Login Route******* */
app.post("/login", login);

//******upload image *********/
app.post("/user/image", FbAuth, uploadImage);

//******Posting User details*********/
app.post("/user", FbAuth, addUserDetails);

//******getting User details*********/
app.get("/user", FbAuth, getAuthenticatedUser);

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
