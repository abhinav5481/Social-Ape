const functions = require("firebase-functions");

const { firestore } = require("firebase-admin");

const express = require("express");
const app = express();

const FbAuth = require("./util/fbAuth");

const { getAllScreams, postOneScream } = require("./handlers/screams");
const { signup, login,uploadImage,addUserDetails,getAuthenticatedUser } = require("./handlers/users");

//*************************************Scream Route***************** */
//******getting screams from firebase*******
app.get("/screams", getAllScreams);

//******Post one scream*******
//apply a middleWare to check if the user is loggedin before posting a scream
app.post("/scream", FbAuth, postOneScream);



//*************************************User Route***************** */
//********Signup route*******
app.post("/signup", signup);

//********Login Route******* */
app.post("/login", login);

//******upload image *********/
app.post("/user/image",FbAuth, uploadImage);

//******User details*********/
app.post("/user",FbAuth, addUserDetails);
app.get("/user",FbAuth, getAuthenticatedUser);

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
