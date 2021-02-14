import "./App.css";
import Login from "./Login";
import Signup from "./Signup";
// import Header from "./Header";
import Home from "./Home";
import { Switch, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";

function App() {
	return (
		<div className="App">
			<Switch>
				<Route
					path="/signup"
					render={(props) => <Signup {...props} />}
				/>
				<Route path="/login" render={(props) => <Login {...props} />} />
				<PrivateRoute exact path="/" children={<Home />} />

				{/* <Route
					path="/profile"
					render={(props) => <Profile {...props} />}
				/> */}
			</Switch>
		</div>
	);
}

export default App;
