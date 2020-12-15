import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import firebaseConfig from "./firebaseConfig";

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const Firebase = {
  loginWithEmail: (email, password) => {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  },
  signupWithEmail: (email, password) => {
    return firebase.auth().createUserWithEmailAndPassword(email, password);
  },
  signOut: () => {
    return firebase.auth().signOut();
  },
  checkUserAuth: (user) => {
    return firebase.auth().onAuthStateChanged(user);
  },
  createNewUser: (userData) => {
    return firebase
      .firestore()
      .collection("users")
      .doc(`${userData.uid}`)
      .set(userData);
  },
  getUser: () => {
    return firebase.auth().currentUser;
  },
  setPhotoUploaded: async (useruid) => {
    return await firebase
      .firestore()
      .collection("users")
      .doc(useruid)
      .update({ photouploaded: true });
  },
  uploadPhoto: async (uri, filename) => {
    return new Promise(async (res, rej) => {
      const response = await fetch(uri);
      const file = await response.blob();

      let upload = firebase.storage().ref(filename).put(file);

      upload.on(
        "state_changed",
        (snapshot) => {},
        (err) => {
          rej(err);
        },
        async () => {
          const url = await upload.snapshot.ref.getDownloadURL();
          res(url);
        }
      );
    });
  },
  createVote: async (voteData, commentid) => {
    let query = firebase.firestore().collection("comments").doc(commentid);
    let useruid, movieTitle, expoToken;
    try {
      let querySnapshot = await query.get();
      useruid = querySnapshot.data().useruid;
      movieTitle = querySnapshot.data().movieTitle;
    } catch (e) {}
    query = firebase.firestore().collection("users").doc(useruid);
    try {
      let querySnapshot = await query.get();
      expoToken = querySnapshot.data().expoToken;
    } catch (e) {}

    await firebase
      .firestore()
      .collection("votes")
      .add(voteData)
      .then(function (docRef) {
        firebase
          .firestore()
          .collection("votes")
          .doc(docRef.id)
          .update({ voteid: docRef.id });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
    return [expoToken, movieTitle];
  },
  sendPushNotification: async (notificationData) => {
    const message = {
      to: notificationData[0],
      sound: "default",
      title: notificationData[1],
      body: "Someone liked your comment!",
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  },
  deleteVote: async (commentid, useruid) => {
    const query = firebase
      .firestore()
      .collection("votes")
      .where("commentid", "==", commentid)
      .where("voteuseruid", "==", useruid);
    try {
      const querySnapshot = await query.get();
      const voteid = querySnapshot.docs[0].data().voteid;
      return await firebase
        .firestore()
        .collection("votes")
        .doc(voteid)
        .delete();
    } catch (e) {
      console.log(e);
    }
  },
  getAllVotes: async (movieID) => {
    let query = firebase
      .firestore()
      .collection("votes")
      .where("ID", "==", movieID);
    try {
      const results = [];
      let querySnapshot = await query.get();
      querySnapshot.forEach(function (doc) {
        results.push(doc.data());
      });
      return results;
    } catch (e) {
      console.log("Error getting user: ", e);
    }
  },
  getUsername: async (useruid) => {
    const query = firebase.firestore().collection("users").doc(useruid);
    try {
      const querySnapshot = await query.get();
      return querySnapshot.data().username;
    } catch (e) {}
  },
  getPhoto: async (useruid) => {
    const query = firebase.firestore().collection("users").doc(useruid);
    const querySnapshot = await query.get();
    if (querySnapshot.data().photouploaded) {
      return await firebase
        .storage()
        .ref("avatars")
        .child(useruid)
        .getDownloadURL();
    }
  },
  setExpoToken: async (expoToken) => {
    const useruid = await firebase.auth().currentUser.uid;
    return await firebase
      .firestore()
      .collection("users")
      .doc(useruid)
      .update({ expoToken: expoToken });
  },
  getUserComments: async (useruid) => {
    let query = firebase
      .firestore()
      .collection("comments")
      .where("useruid", "==", useruid);
    try {
      const results = [];
      let querySnapshot = await query.get();
      querySnapshot.forEach(function (doc) {
        results.push(doc.data());
      });
      return results;
    } catch (e) {
      console.log("Error getting comments: ", e);
    }
  },
  createNewComment: async (commentData) => {
    return await firebase
      .firestore()
      .collection("comments")
      .add(commentData)
      .then(function (docRef) {
        firebase
          .firestore()
          .collection("comments")
          .doc(docRef.id)
          .update({ commentid: docRef.id });
      })
      .catch(function (error) {
        console.error("Error adding document: ", error);
      });
  },
  deleteComment: async (commentid) => {
    return await firebase
      .firestore()
      .collection("comments")
      .doc(commentid)
      .delete();
  },
  checkComment: async (user, movieID) => {
    const query = firebase
      .firestore()
      .collection("comments")
      .where("useruid", "==", user.uid)
      .where("ID", "==", movieID);
    try {
      const querySnapshot = await query.get();
      return querySnapshot.docs[0].data();
    } catch (e) {}
  },
  getAllComments: async (movieID) => {
    let query = firebase
      .firestore()
      .collection("comments")
      .where("ID", "==", movieID);
    try {
      const results = [];
      let querySnapshot = await query.get();
      querySnapshot.forEach(function (doc) {
        results.push(doc.data());
      });
      return results;
    } catch (e) {
      console.log("Error getting user: ", e);
    }
  },
};

export default Firebase;
