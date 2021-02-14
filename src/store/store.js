import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/userSlice";
import { getDefaultMiddleware } from "@reduxjs/toolkit";

//auth
import { combineReducers } from "redux";
const reducer = combineReducers({
	user: userReducer,
});

const store = configureStore({
	reducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});

export default store;
//

// export default configureStore({
// 	reducer: {
// 		user: userReducer,
// 	},
// });
