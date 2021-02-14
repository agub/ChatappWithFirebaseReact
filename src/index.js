import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./store/store";
import { Provider } from "react-redux";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();
ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<Router history={history}>
				<App />
			</Router>
		</React.StrictMode>
	</Provider>,
	document.getElementById("root")
);
