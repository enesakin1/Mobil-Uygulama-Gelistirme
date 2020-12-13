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
  createNewComment: (commentData) => {
    return firebase.firestore().collection("comments").add(commentData);
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
