const functions = require("firebase-functions");

const { firestore } = require("firebase-admin");

const { db } = require("./util/admin");

const express = require("express");
const app = express();

const FbAuth = require("./util/fbAuth");

const {
  getAllScreams,
  postOneScream,
  getScream,
  commentOnScream,
  likeScream,
  unlikeScream,
  deleteScream,
} = require("./handlers/screams");
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  markNotificationsRead,
  getUserDetails,
} = require("./handlers/users");

//*************************************Scream Route***************** */
//******getting screams from firebase*******
app.get("/screams", getAllScreams);

//******Post one scream*******
//apply a middleWare to check if the user is loggedin before posting a scream
app.post("/scream", FbAuth, postOneScream);

//getting one particular scream with all details related to it
app.get("/scream/:screamId", getScream);

//posting comment to a particular screams
app.post("/scream/:screamId/comment", FbAuth, commentOnScream);

//like scream
app.get("/scream/:screamId/like", FbAuth, likeScream);

//unlike Scream
app.get("/scream/:screamId/unlike", FbAuth, unlikeScream);

//delete scream
app.delete("/scream/:screamId", FbAuth, deleteScream);

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

app.get("/user/:handle", getUserDetails);

app.post("/notifications", FbAuth, markNotificationsRead);

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);

//firebase triggers
exports.createNotificationOnLike = functions.firestore
  .document("likes/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "like",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => console.error(err));
  });
exports.deleteNotificationOnUnLike = functions.firestore
  .document("likes/{id}")
  .onDelete((snapshot) => {
    return db
      .doc(`/notifications/${snapshot.id}`)
      .delete()
      .catch((err) => {
        console.error(err);
        return;
      });
  });
exports.createNotificationOnComment = functions.firestore
  .document("comments/{id}")
  .onCreate((snapshot) => {
    return db
      .doc(`/screams/${snapshot.data().screamId}`)
      .get()
      .then((doc) => {
        if (
          doc.exists &&
          doc.data().userHandle !== snapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${snapshot.id}`).set({
            createdAt: new Date().toISOString(),
            recipient: doc.data().userHandle,
            sender: snapshot.data().userHandle,
            type: "comment",
            read: false,
            screamId: doc.id,
          });
        }
      })
      .catch((err) => {
        console.error(err);
        return;
      });
  });

exports.onUserImageChange = functions.firestore
  .document(`/users/{userId}`)
  .onUpdate((change) => {
    console.log(change.before.data());
    console.log(change.after.data());
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log("image has changed");
      const batch = db.batch();
      return db
        .collection("screams")
        .where("userHandle", "==", change.before.data().handle)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            const scream = db.doc(`/screams/${doc.id}`);
            // const comment = db
            //   .collection("comments")
            //   .where("userHandle", "==", change.before.data().handle);
            batch.update(scream, { userImage: change.after.data().imageUrl });
            // comment.forEach((com) => {
            //   batch.update(com, { userImage: change.after.data().imageUrl });
            // });
          });
          // return batch.commit();
          return db
          .collection("comments")
          .where("userHandle", "==", change.before.data().handle).get()
          
        })
        .then((data) => {
            data.forEach((doc) => {
              const comment = db.doc(`/comments/${doc.id}`)
              batch.update(comment, { userImage: change.after.data().imageUrl });
            });
          
          return batch.commit();
        })
        .catch((err) => {
          console.error(err);
        });
    } else return true;
  });

exports.onScreamDelete = functions.firestore
  .document("/screams/{screamId}")
  .onDelete((snapshot, context) => {
    const screamId = context.params.screamId;
    const batch = db.batch();
    return db
      .collection("comments")
      .where("screamId", "==", screamId)
      .get()
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return db.collection("likes").where("screamId", "==", screamId).get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return db
          .collection("notifications")
          .where("screamId", "==", screamId)
          .get();
      })
      .then((data) => {
        data.forEach((doc) => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch((err) => console.error(err));
  });
