import React, { useState, useEffect } from "react";

import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSelector, useDispatch } from "react-redux";
import Bar from "./Bar";
import Feed from "./Feed";
import Menu from "./Menu";

import { userLists } from "./features/userSlice";

import { useWindowDimensions } from "./tool";
const useStyles = makeStyles({
	root: {
		flexGrow: 1,
	},
	mainContainer: {
		// maxWidth: "1000px",
		minWidth: "300px",
		width: "100%",
		margin: "auto",
		height: "100vh",
	},
	onlineIcon: {
		height: "7px",
		width: "7px",
		backgroundColor: "#4CAF50",
		borderRadius: "50%",
		display: "inline-block",
		marginRight: "7px",
		marginBottom: "5px",
	},
});

function Home(props) {
	const [menu, setMenu] = useState(false);
	const [userId, setUserId] = useState(null);
	const [notSp, setNotSp] = useState(false);

	const { width } = useWindowDimensions();

	const widthChanged = () => {
		if (width > 750) {
			setMenu(true);
			setNotSp(true);
		} else {
			setMenu(false);
			setNotSp(false);
		}
	};
	useEffect(() => {
		widthChanged();
	}, [width]);

	const dispatch = useDispatch();

	const users = useSelector(userLists);

	const clickHandler = () => {
		setMenu(!menu);
	};
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<Grid container className={classes.mainContainer}>
				<Grid item xs={12} style={{ height: "8vh" }}>
					<Grid item>
						<Bar
							clickHandler={clickHandler}
							menu={menu}
							userId={userId}
						/>
					</Grid>
				</Grid>

				<Grid item xs={12} style={{ height: "92vh", display: "flex" }}>
					{menu && (
						<Menu
							clickHandler={clickHandler}
							setUserId={setUserId}
							userId={userId}
						/>
					)}
					<div style={{ flexDirection: "row", width: "100%" }}>
						{/* {menu && ( */}
						<Grid item xs={12} style={{ height: "3vh" }}>
							{userId === null ? (
								<Typography>
									左のユーザーリストからユーザーを選択してください
								</Typography>
							) : (
								<div>
									{users.map(
										(doc) =>
											doc.id === userId && (
												<div key={doc.id}>
													{doc.isOnline ? (
														<span
															className={
																classes.onlineIcon
															}
														></span>
													) : (
														<span
															className={
																classes.onlineIcon
															}
															style={{
																backgroundColor:
																	"#bbb",
															}}
														></span>
													)}
													{doc.displayName}
												</div>
											)
									)}
								</div>
							)}
						</Grid>
						{/* )} */}

						<Feed userId={userId} />
					</div>
				</Grid>
			</Grid>
		</div>
	);
}

export default Home;
