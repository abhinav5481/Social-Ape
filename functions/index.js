const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { firestore } = require('firebase-admin');

admin.initializeApp();

const express =  require('express');
const app = express();

// exports.helloWorld = functions.https.onRequest((request, response) => {
//   response.send("Hello from Firebase!");
// });


//getting document from firebase
app.get('/screams', (req,res) => {
  admin
  .firestore()
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

  admin.firestore()
  .collection('screams')
  .add(newScream)
  .then((doc) => {
    res.json({message: `document ${doc.id} created successfully`});
  })
  .catch(err => {
    res.status(500).json({error: 'something went wrong'});
    console.log(err);
  })
})

//https://baseurl.com/api/
exports.api = functions.https.onRequest(app);