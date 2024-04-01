import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
const firebaseConfig = {
  apiKey: "AIzaSyD58-0gqlq-T6yQTu0rjRqMOYiFAf14HCM",
  authDomain: "envimonitoring-47407.firebaseapp.com",
  databaseURL: "https://envimonitoring-47407-default-rtdb.firebaseio.com",
  projectId: "envimonitoring-47407",
  storageBucket: "envimonitoring-47407.appspot.com",
  messagingSenderId: "663921444848",
  appId: "1:663921444848:web:0d939df64e36e4a1f77f35",
  measurementId: "G-ZE0XQ7M0K6"
}

  firebase.initializeApp(firebaseConfig);
  export const dataRef = firebase.database();
  export default firebase;