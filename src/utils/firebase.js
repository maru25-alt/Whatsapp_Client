import firebase from "firebase";

firebase.initializeApp({
    apiKey: "AIzaSyDy0v6OlyvEcQ4eGni1OVB6Nv0HY4pZ_-Q",
    authDomain: "whatsapp-mern-d238a.firebaseapp.com",
    databaseURL: "https://whatsapp-mern-d238a.firebaseio.com",
    projectId: "whatsapp-mern-d238a",
    storageBucket: "whatsapp-mern-d238a.appspot.com",
    messagingSenderId: "333079589815",
    appId: "1:333079589815:web:c3594430030a1e01962e32"
  });
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
