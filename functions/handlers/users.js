const { db, admin } = require("../util/admin");
const config = require("../util/config");
const firebase = require("firebase");
// const { config } = require("firebase-functions");

firebase.initializeApp(config);

const { validateSignupData, validateLoginData,reduceUserDetails } = require("../util/validators");
// const admin = require("../util/admin");

exports.signup = (req, res) => {
  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) {
    return res.status(400).json(errors);
  }

  const noImg = "no-img.png";

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
      userId = data.user.uid; //why user is used here?
      return data.user.getIdToken(); //why user is used here?
    })
    .then((idToken) => {
      token = idToken;
      // return res.status(201).json({token : token });
      const userCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId: userId,
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${noImg}?alt=media`,
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
};

exports.login = (req, res) => {
  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  const { valid, errors } = validateLoginData(user);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then((data) => {
      return data.user.getIdToken();
    })
    .then((token) => {
      return res.json({ token });
    })
    .catch((err) => {
      console.error(err);
      if ((err.code = "auth/wrong-password")) {
        return res
          .status(403)
          .json({ general: "Wrong credential, please try again" });
      }
      return res.status(500).json({ error: err.code });
    });
};

//add userdetails
exports.addUserDetails = (req,res) => {
  let userDetails = reduceUserDetails(req.body);
    //this is passed to FbAuth so we have acces to 'user' now
  db.doc(`/users/${req.user.handle}`).update(userDetails)
  .then(() => {
    return res.json({message : 'Details added successfully'})
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json({error: err.code });
  })
}


//get own user details
exports.getAuthenticatedUser = (req,res) => {
  let userData ={};
  db.doc(`/users/${req.user.handle}`).get()
  .then(doc => {
    if(doc.exists){
      userData.credentials = doc.data();
      return db.collection('likes').where('userHandle','==',req.user.handle).get()
    }
  })
  .then((data)=> {
    userData.likes = []
    data.forEach(doc => {
    userData.likes.push(doc.data());
    });
    return res.json(userData)
  })
  .catch(err => {
    console.error(err);
    return res.status(500).json(err.code);
  })
}








//upload image(profile) for user
exports.uploadImage = (req, res) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");

  const busboy = new BusBoy({ headers: req.headers });

  let imageToBeUploaded = {};
  let imageFileName;
  // String for image token
  // let generatedToken = uuid();

  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    console.log(fieldname, file, filename, encoding, mimetype);
    if (mimetype !== "image/jpeg" && mimetype !== "image/png") {
      return res.status(400).json({ error: "Wrong file type submitted" });
    }
    // my.image.png => ['my', 'image', 'png']
    const imageExtension = filename.split(".")[filename.split(".").length - 1];
    // 32756238461724837.png
    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    const filepath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filepath, mimetype };
    file.pipe(fs.createWriteStream(filepath));
  });
  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
            //Generate token to be appended to imageUrl
            // firebaseStorageDownloadTokens: generatedToken,
          }
        }
      })
      .then(() => {
        // Append token to url
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: "image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });
  busboy.end(req.rawBody);
};

