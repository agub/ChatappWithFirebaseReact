import React, { useState, useEffect } from "react";
import { Paper, makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { adminUser, logouts } from "./features/userSlice";
import UpdateProfile from "./UpdateProfile";
import Profile from "./Profile";
import UserList from "./UserList";
//tabs
import AppBar from "@material-ui/core/AppBar";
import Tab from "@material-ui/core/Tab";
import TabContext from "@material-ui/lab/TabContext";
import TabList from "@material-ui/lab/TabList";
import TabPanel from "@material-ui/lab/TabPanel";
//tabs

const useStyles = makeStyles({
	bg: {
		background: "#333",
		width: "100%",
		height: "92vh",
		zIndex: "99",
		position: "absolute",
		// maxWidth: "600px",
		// minWidth: "300px",
	},
	profile: {
		maxWidth: "500px",
		width: "80%",
		textAlign: "start",
		height: "92vh",
		wordBreak: "break-all",
		minWidth: "250px",
		// position: "absolute",
		zIndex: "99",
	},
	bgForBig: {
		// background: "#333",
		// width: "100%",
		height: "92vh",
		zIndex: "99",
		// position: "absolute",
		maxWidth: "300px",
		// minWidth: "200px",
		// minWidth: "300px",
	},
	profileForBig: {
		maxWidth: "500px",
		minWidth: "200px",
		// width: "80%",
		textAlign: "start",
		height: "92vh",
		wordBreak: "break-all",
		// position: "absolute",
		zIndex: "99",
	},
});

function Menu({ clickHandler, setUserId, userId }) {
	const user = useSelector(adminUser);
	const [update, setUpdate] = useState(true);
	const [forBiggerScreen, setForBiggerScreen] = useState(false);
	const dispatch = useDispatch();

	//tabs
	const [value, setValue] = useState("1");
	const handleChange = (event, newValue) => {
		setValue(newValue);
	};
	//tabs

	// width export
	const useWindowDimensions = () => {
		const getWindowDimensions = () => {
			const { innerWidth: width, innerHeight: height } = window;
			return {
				width,
				height,
			};
		};

		const [windowDimensions, setWindowDimensions] = useState(
			getWindowDimensions()
		);
		useEffect(() => {
			const onResize = () => {
				setWindowDimensions(getWindowDimensions());
			};
			window.addEventListener("resize", onResize);
			return () => window.removeEventListener("resize", onResize);
		}, []);
		return windowDimensions;
	};

	const { width } = useWindowDimensions();

	const widthChanged = () => {
		if (width > 750) {
			console.log("width has exceeded over 750!");
			setForBiggerScreen(true);
		} else {
			setForBiggerScreen(false);
		}
	};
	useEffect(() => {
		widthChanged();
		// console.log("changeddd");
	}, [width]);

	const classes = useStyles();
	return (
		<>
			{/* <div style={{ height: "8vh" }}></div> */}

			{update ? (
				// <Fade>
				<div
					className={forBiggerScreen ? classes.bgForBig : classes.bg}
				>
					<Paper className={classes.profile} square>
						<TabContext
							value={value}
							// style={{ width: "80%", maxWidth: "500px" }}
						>
							<AppBar
								position="static"
								style={{ overflowY: "scroll" }}
							>
								<TabList
									onChange={handleChange}
									// aria-label="simple tabs example"
									scrollButtons="auto"
									variant="scrollable"
								>
									<Tab label="ユーザーリスト" value="1" />
									<Tab label="プロフィール" value="2" />
									{/* <Tab label="Item Three" value="3" />
									<Tab label="Item 4" value="4" /> */}
								</TabList>
							</AppBar>
							<TabPanel
								value="1"
								style={{ padding: "15px", overflowY: "scroll" }}
							>
								<UserList
									setUserId={setUserId}
									clickHandler={clickHandler}
									forBiggerScreen={forBiggerScreen}
									userId={userId}
								/>
							</TabPanel>
							<TabPanel value="2" style={{ padding: "15px" }}>
								<Profile
									clickHandler={clickHandler}
									setUpdate={setUpdate}
									forBiggerScreen={forBiggerScreen}
								/>
							</TabPanel>
							{/* <TabPanel value="3">Item Three</TabPanel>
							<TabPanel value="4">Item 4</TabPanel> */}
						</TabContext>
					</Paper>
				</div>
			) : (
				<UpdateProfile setUpdate={setUpdate} />
			)}
		</>
	);
}

export default Menu;
