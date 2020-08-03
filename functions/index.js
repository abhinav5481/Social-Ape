const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');

admin.initializeApp();
const express =  require('express');
const app = express();

const firebaseConfig = {
  apiKey: "AIzaSyDnVwTM3h8bNant5GcBmYah0ykPwHoHR68",
  authDomain: "socialapp-75994.firebaseapp.com",
  databaseURL: "https://socialapp-75994.firebaseio.com",
  projectId: "socialapp-75994",
  storageBucket: "socialapp-75994.appspot.com",
  messagingSenderId: "649425116995",
  appId: "1:649425116995:web:0041a48301119ab73399f6",
  measurementId: "G-MV3X8KC2NX"
};




const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

//getting document from firebase
app.get('/screams', (req,res) => {
 db
  .collection('screams')
  .orderBy('createdAt','desc')
  .get()
  .then((data) => {
    let screams = [];
    data.forEach((doc) => {
screams.push({
  screamId: doc.id,
  body: doc.data().body,
  userHandle: doc.data().userHandle,
  createdAt:  doc.data().createdAt
});
    });
    return res.json(screams);
  })
  .catch((err) => console.log(err))
});

//creating document for firebase
app.post('/scream',(req,res) => {
  const newScream = {
    body : req.body.body,
    userHandle : req.body.userHandle,
    createdAt: new Date().toISOString()
  };

  db
  .collection('screams')
  .add(newScream)
  .then((doc) => {
    res.json({message: `document ${doc.id} created successfully`});
  })
  .catch(err => {
    res.status(500).json({error: 'something went wrong'});
    console.log(err);
  })
});


//Signup route
app.post('/signup',(req,res) => {
  const newUser ={
    email : req.body.email,
    password : req.body.password,
    confirmPassword : req.body.confirmPassword,
    handle : req.body.handle
  };

  //TODO validate user
  let token ,userId;
  db.doc(`/users/${newUser.handle}`).get()
  .then((doc) => {
    if(doc.exists){
      return res.status(400).json({handle : `${newUser.handle} handle is already taken`})
    }
    else{
      return firebase.auth().createUserWithEmailAndPassword(newUser.email,newUser.password);
    }
  })
  .then((data) => {
    userId = data.user.uid;
    return data.user.getIdToken();
    
  })
  .then((idToken) => {
    token = idToken;
    // return res.status(201).json({token : token });
    const userCredentials = {
      handle: newUser.handle,
      email: newUser.email,
      createdAt: new Date().toISOString(),
      userId : userId

    };
   return db.doc(`/users/${newUser.handle}`).set(userCredentials);
  })
  .then((data) => {
    return res.status(201).json({token : token });
  })
  .catch((err) => {
    console.log(err);
    if(err.code === 'auth/email-already-in-use'){
      return res.status(400).json({email : 'Email is already taken'});
    }
    else{
      return res.status(500).json({error : err.code});
    }
 
  
})});



//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);