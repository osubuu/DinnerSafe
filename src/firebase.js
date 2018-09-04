import firebase from "firebase";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAQzejYCcDcBw6j6iqDSlbLXH7P4bJ8Vi4",
  authDomain: "jdk-project6.firebaseapp.com",
  databaseURL: "https://jdk-project6.firebaseio.com",
  projectId: "jdk-project6",
  storageBucket: "jdk-project6.appspot.com",
  messagingSenderId: "948227412993"
};
firebase.initializeApp(config);

export default firebase;
