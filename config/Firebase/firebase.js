import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
import { cos } from "react-native-reanimated";
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
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function (e) {
        console.log(e);
        reject(new TypeError("Network request failed"));
      };
      xhr.responseType = "blob";
      xhr.open("GET", uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref(filename);
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  },
  createVote: async (voteData, commentid) => {
    return await firebase
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
  },
  sendPushNotification: async (message) => {
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
    const querySnapshot = await query.get();
    return querySnapshot.data().username;
  },
  getExpoToken: async (useruid) => {
    const query = firebase.firestore().collection("users").doc(useruid);
    const querySnapshot = await query.get();
    return querySnapshot.data().expoToken;
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
  setExpoToken: async (expoToken, useruid) => {
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
    let query = firebase
      .firestore()
      .collection("votes")
      .where("commentid", "==", commentid);
    try {
      let querySnapshot = await query.get();
      querySnapshot.forEach(async (doc) => {
        await firebase
          .firestore()
          .collection("votes")
          .doc(doc.data().voteid)
          .delete();
      });
    } catch (e) {
      console.log("Error getting comments: ", e);
    }
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
  followUser: async (followData) => {
    let id = "";
    await firebase
      .firestore()
      .collection("follows")
      .add(followData)
      .then(function (docRef) {
        id = docRef.id;
        firebase
          .firestore()
          .collection("follows")
          .doc(docRef.id)
          .update({ followid: docRef.id });
      });
    return id;
  },
  unfollowUser: async (followid) => {
    return await firebase
      .firestore()
      .collection("follows")
      .doc(followid)
      .delete();
  },
  getFollow: async (followData) => {
    let query = await firebase
      .firestore()
      .collection("follows")
      .where("followeduid", "==", followData.followeduid);
    const result = [];
    let querySnapshot = await query.get();
    querySnapshot.forEach(function (doc) {
      result.push(doc.data());
    });
    if (result.length != 0) return result[0].followid;
    else return "notFollowing";
  },
  getAllFollowedUsers: async (useruid) => {
    let query = firebase
      .firestore()
      .collection("follows")
      .where("followeruid", "==", useruid);
    const results = [];
    let querySnapshot = await query.get();
    querySnapshot.forEach(function (doc) {
      results.push(doc.data());
    });
    return results;
  },
};

export default Firebase;
