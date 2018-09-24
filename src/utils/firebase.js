const firebase = require("firebase/app");

require("firebase/app");
require("firebase/firestore");
require("firebase/auth");

const config = {
  apiKey: "AIzaSyBFm-wn2F0YqF-7xguCk6Lj7gSMr6JiXvA",
  authDomain: "cocktail-hour-1529929123157.firebaseapp.com",
  databaseURL: "https://cocktail-hour-1529929123157.firebaseio.com",
  projectId: "cocktail-hour-1529929123157",
  storageBucket: "cocktail-hour-1529929123157.appspot.com",
  messagingSenderId: "295959505102"
};


firebase.initializeApp(config);

const firestoreSettings = { timestampsInSnapshots: true}
const database = firebase.firestore();
database.settings(firestoreSettings)

const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const auth = firebase.auth();

export { database, auth, googleAuthProvider, firebase };
