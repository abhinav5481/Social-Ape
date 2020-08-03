const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { firestore } = require("firebase-admin");

admin.initializeApp();
const express = require("express");
const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyDnVwTM3h8bNant5GcBmYah0ykPwHoHR68",
  authDomain: "socialapp-75994.firebaseapp.com",
  databaseURL: "https://socialapp-75994.firebaseio.com",
  projectId: "socialapp-75994",
  storageBucket: "socialapp-75994.appspot.com",
  messagingSenderId: "649425116995",
  appId: "1:649425116995:web:0041a48301119ab73399f6",
  measurementId: "G-MV3X8KC2NX",
};

const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//***************************getting screams from firebase*********************
app.get("/screams", (req, res) => {
  db.collection("screams")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let screams = [];
      data.forEach((doc) => {
        screams.push({
          screamId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
        });
      });
      return res.json(screams);
    })
    .catch((err) => console.log(err));
});

//*************************creating scream for firebase******************
app.post("/scream", (req, res) => {
  const newScream = {
    body: req.body.body,
    userHandle: req.body.userHandle,
    createdAt: new Date().toISOString(),
  };

  db.collection("screams")
    .add(newScream)
    .then((doc) => {
      res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.log(err);
    });
});

//****************************Signup route**************************
const isEmpty = (string ) => {
  if(string.trim() === ''){
    return true;
  }
  else return false;
}

const isEmailValid = (email)=> {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if(email.match(regEx)) return true;
  else return false;
}

app.post("/signup", (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };
  //email validation
  let errors ={};
  if(isEmpty(newUser.email)){
    errors.email = 'Must not be empty'
  }
  else if(!isEmailValid(newUser.email)){
    errors.email = 'Must be a valid email address'
  }

  //password validation
  if(isEmpty(newUser.password)){
    errors.password = 'Must not be empty'
  }
  else if(newUser.password !== newUser.confirmPassword){
    errors.confirmPassword = 'Passwords must match'
  }

  //handle validation
  if(isEmpty(newUser.handle)){
    errors.handle = 'Must not be empty'
  }

  if(Object.keys(errors).length > 0) return res.status(400).json(errors);


  //TODO validate user
  let token, userId;
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: `${newUser.handle} handle is already taken` });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then((data) => {
      userId = data.user.uid;  //why user is used here?
      return data.user.getIdToken();  //why user is used here?
    })
    .then((idToken) => {
      token = idToken;
      // return res.status(201).json({token : token });
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId,
      };
      return db.doc(`/users/${newUser.handle}`).set(userCredentials);
    })
    .then((data) => {
      return res.status(201).json({ token: token });
    })
    .catch((err) => {
      console.log(err);
      if (err.code === "auth/email-already-in-use") {
        return res.status(400).json({ email: "Email is already taken" });
      } else {
        return res.status(500).json({ error: err.code });
      }
    });
});

//*************************************Login Route**************** */
app.post('/login',(req,res) => {
  const user = {
    email: req.body.email,
    password: req.body.password
  };

  let errors ={};
  if(isEmpty(user.email)){
      errors.email = 'Must not be empty';
  }
  if(isEmpty(user.password)){
    errors.password = 'Must not be empty';
}
if(Object.keys(errors).length > 0) return res.status(400).json(errors);

firebase.auth().signInWithEmailAndPassword(user.email,user.password)
.then(data => {
  return data.user.getIdToken()
})
.then(token => {
  res.json({token});
})
.catch(err => {
  console.error(err);
  if(err.code = 'auth/wrong-password'){
    return res.status(403).json({general : 'Wrong credential, please try again'});
  }
  return res.status(500).json({error : err.code});
})
  
})

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);
