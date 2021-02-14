import React from "react";
import { AppBar, Typography } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import { makeStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { useDispatch, useSelector } from "react-redux";
import { logouts, adminUser } from "./features/userSlice";

const useStyles = makeStyles({
	mainBar: {
		// maxWidth: "800px",
		margin: "auto",
		display: "flex",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
	},
	logoutIcon: {
		display: "flex",
		flexDirection: "column",
		justifyContent: "center",
		alignItems: "center",
		marginRight: "15px",
		curser: "pointer",
	},
});

function Bar({ clickHandler, menu }) {
	const dispatch = useDispatch();
	const user = useSelector(adminUser);

	const signout = async (e) => {
		e.preventDefault();
		await dispatch(logouts(user.uid));
	};

	const classes = useStyles();
	return (
		<>
			<AppBar
				color="primary"
				className={classes.mainBar}
				style={{ height: "8vh" }}
			>
				{menu ? (
					<ExpandLessIcon
						fontSize="large"
						style={{ marginLeft: "15px" }}
						onClick={clickHandler}
					/>
				) : (
					<ExpandMoreIcon
						fontSize="large"
						style={{ marginLeft: "15px" }}
						onClick={clickHandler}
					/>
				)}

				<Typography
					variant="h6"
					style={{ display: "flex", alignItems: "center" }}
				>
					The-Messanger
				</Typography>

				<div onClick={signout} className={classes.logoutIcon}>
					<ExitToAppIcon fontSize="default" />
					<Typography style={{ fontSize: "10px" }}>logout</Typography>
				</div>
			</AppBar>
		</>
	);
}

export default Bar;
