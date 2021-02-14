import firebase from "firebase";
import "firebase/auth";

var firebaseConfig = {
	apiKey: "AIzaSyCQhM1_22uCcmwpK6OsDXCsO3yss7_Qkl0",
	authDomain: "chatapp-4bf1c.firebaseapp.com",
	projectId: "chatapp-4bf1c",
	storageBucket: "chatapp-4bf1c.appspot.com",
	messagingSenderId: "126433060301",
	appId: "1:126433060301:web:6f55e1f09c1f02d127d084",
};
// Initialize Firebase

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();

export { db, auth };
