const firebase = require("firebase");

require("firebase/app");
require("firebase/firestore");
require("firebase/auth");

let config = {
  apiKey: "AIzaSyBFm-wn2F0YqF-7xguCk6Lj7gSMr6JiXvA",
  authDomain: "cocktail-hour-1529929123157.firebaseapp.com",
  databaseURL: "https://cocktail-hour-1529929123157.firebaseio.com",
  projectId: "cocktail-hour-1529929123157",
  storageBucket: "cocktail-hour-1529929123157.appspot.com",
  messagingSenderId: "295959505102"
};

let settings = { timestampsInSnapshots: true}

firebase.initializeApp(config);

let database = firebase.firestore();
database.settings(settings)

let googleAuthProvider = new firebase.auth.GoogleAuthProvider();
let auth = firebase.auth();

export { database, auth, googleAuthProvider, firebase };
