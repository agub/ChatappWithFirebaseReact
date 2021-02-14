import { createSlice } from "@reduxjs/toolkit";
import { auth } from "../firebase";
import { db } from "../firebase";
import firebase from "firebase";

const initialUser = localStorage.getItem("user")
	? JSON.parse(localStorage.getItem("user"))
	: null;

export const userSlice = createSlice({
	name: "user",
	initialState: {
		// user: null,
		user: initialUser,
		userLists: [],
		conversations: [],
		clickedUserId: null,
	},
	reducers: {
		loginSuccess: (state, action) => {
			state.user = action.payload;
			// state.isOnline = true;
			localStorage.setItem("user", JSON.stringify(action.payload));
		},
		//delete!
		signupSuccess: (state, action) => {
			state.user = action.payload;
			// 	state.user = null;
			// 	state.isOnline = false;
			localStorage.setItem("user", JSON.stringify(action.payload));
			// },
		},
		logoutSuccess: (state) => {
			state.user = null;
			state.userLists = [];
			state.conversations = [];
			// state.isOnline = false;
			localStorage.removeItem("user");
			localStorage.clear();
		},
		getUsersSuccess: (state, action) => {
			state.userLists = action.payload;
		},
		sendMessageSuccess: (state, action) => {
			state.userLists = action.payload;
		},
		getConversationSuccess: (state, action) => {
			// ...state,
			// conversations: action.payload,
			state.conversations = action.payload;
		},
		clickedUserIdSuccess: (state, action) => {
			// ...state,
			// conversations: action.payload,
			state.clickedUserId = action.payload;
		},
	},
});

// export const { login, logout } = userSlice.actions;

export const adminUser = (state) => state.user.user;
export const userLists = (state) => state.user.userLists;
export const selectedUser = (state) => state.user.selectedUser;
export const conversations = (state) => state.user.conversations;
export const clickedUserId = (state) => state.user.clickedUserId;

export default userSlice.reducer;

const {
	loginSuccess,
	signupSuccess,
	logoutSuccess,
	getUsersSuccess,
	sendMessageSuccess,
	getConversationSuccess,
	clickedUserIdSuccess,
} = userSlice.actions;

export const login = (email, password) => async (dispatch) => {
	try {
		await auth
			.signInWithEmailAndPassword(email, password)
			.then((userAuth) => {
				const loginUser = {
					email,
					uid: userAuth.user.uid,
					displayName: userAuth.user.displayName,
					photoURL: userAuth.user.photoURL,
				};
				dispatch(loginSuccess(loginUser));
				db.collection("users")
					// .where("uid", "==", userAuth.uid)
					.doc(userAuth.user.uid)
					.update({ isOnline: true });
			});
	} catch (e) {
		return console.error(e.message);
	}
};
export const signup = (email, password, userName) => async (dispatch) => {
	try {
		await auth
			.createUserWithEmailAndPassword(email, password)
			.then((userAuth) => {
				userAuth.user.updateProfile({
					displayName: userName,
				});
				const loginUser = {
					email,
					uid: userAuth.user.uid,
					displayName: userName,
				};
				dispatch(signupSuccess(loginUser));
				db.collection("users").doc(userAuth.user.uid).set({
					displayName: userName,
					timestamp: firebase.firestore.FieldValue.serverTimestamp(),
					uid: userAuth.user.uid,
					photoURL: null,
					isOnline: true,
				});
			});
	} catch (e) {
		return console.error(e.message);
	}
};

export const logouts = (uid) => async (dispatch) => {
	try {
		dispatch(logoutSuccess());
		await db
			.collection("users")
			// .where(uid, "==", "uid")
			.doc(uid)
			.update({ isOnline: false });
		auth.signOut()
			.then(() => {
				console.log("success");
			})
			.catch((error) => {
				alert(error);
			});
	} catch (e) {
		return console.error(e.message);
	}
};
export const updateUser = (info) => async (dispatch) => {
	try {
		dispatch(loginSuccess(info));
		await db
			.collection("users")
			// .where("uid", "==", userAuth.uid)
			.doc(info.uid)
			.update({ photoURL: info.photoURL });
	} catch (e) {
		return console.error(e.message);
	}
};

export const getUserLists = () => async (dispatch) => {
	try {
		await db.collection("users").onSnapshot((snapshot) => {
			dispatch(
				getUsersSuccess(
					snapshot.docs.map((doc) => ({
						id: doc.id,
						displayName: doc.data().displayName,
						isOnline: doc.data().isOnline,
						photoURL: doc.data().photoURL,
					}))
				)
			);
		});
		// await db.collection("users").onSnapshot((snapshot) => {
		// });
	} catch (e) {
		return console.error(e.message);
	}
};
export const sendMessage = (msgObject) => async (dispatch) => {
	try {
		// await db.collection("users").onSnapshot((snapshot) => {

		db.collection("conversations")
			.add({
				...msgObject,
				// timestamp: firebase.firestore.FieldValue.serverTimestamp(),
				isViewed: false,
			})
			// .then(() => {
			// 	dispatch(
			// 		getConversations({
			// 			uid_1: msgObject.user_uid_1,
			// 			uid_2: msgObject.user_uid_2,
			// 		})
			// 	);
			// })
			.catch((error) => {
				alert(error);
			});

		// });
	} catch (e) {
		return console.error(e.message);
	}
};

//
export const setClickedUserId = (bothUser) => async (dispatch) => {
	try {
		dispatch(clickedUserIdSuccess(bothUser));

		dispatch(
			getConversations({
				uid_1: bothUser.user_uid_1,
				uid_2: bothUser.user_uid_2,
			})
		);
	} catch (e) {
		return console.error(e.message);
	}
};

//
export const getConversations = (user) => async (dispatch) => {
	try {
		// const conversations = [];
		// console.log("dispatching");
		db.collection("conversations")
			.where("user_uid_2", "in", [user.uid_1, user.uid_2])
			.orderBy("timestamp", "asc")
			.onSnapshot((querySnapshot) => {
				const conversations = [];

				querySnapshot.forEach((doc) => {
					// if (
					// 	(doc.data().user_uid_1 === clickedUserId.user_uid_1 &&
					// 		doc.data().user_uid_2 ===
					// 			clickedUserId.user_uid_2) ||
					// 	(doc.data().user_uid_1 === clickedUserId.user_uid_2 &&
					// 		doc.data().user_uid_2 === clickedUserId.user_uid_1)
					// ) {
					if (
						(doc.data().user_uid_1 === user.uid_1 &&
							doc.data().user_uid_2 === user.uid_2) ||
						(doc.data().user_uid_1 === user.uid_2 &&
							doc.data().user_uid_2 === user.uid_1)
					) {
						//
						conversations.push({ id: doc.id, data: doc.data() });
						// conversations.push(doc.data());
						console.log("coversations is pushed");
					}
				});

				if (conversations.length > 0) {
					// conversations.map(({data: {user_uid_1, user_uid_2}})=>
					// clickedUserId.user_uid_1 === user_uid_1 &&
					// );
					// if (clickedUserId.user_uid_1 && clickedUserId.user_uid_2)
					dispatch(getConversationSuccess(conversations));
					console.log("DISPATCHED!");
				} else {
					const empty = [];
					dispatch(getConversationSuccess(empty));
				}
				// dispatch(getConversationSuccess(conversations));
			});

		// 	const empty = [];
		// 	dispatch(getConversationSuccess(empty));
		// }
	} catch (e) {
		return console.error(e.message);
	}
};
