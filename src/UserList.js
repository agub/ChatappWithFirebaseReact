import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
	adminUser,
	getUserLists,
	userLists,
	getConversations,
	setClickedUserId,
	clickedUserId,
} from "./features/userSlice";
import { Typography, Grid, Avatar, Button } from "@material-ui/core";
import MessageIcon from "@material-ui/icons/Message";
import RefreshIcon from "@material-ui/icons/Refresh";

//ffff
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";

import { db } from "./firebase";

export default function UserList({
	setUserId,
	clickHandler,
	forBiggerScreen,
	userId,
}) {
	const dispatch = useDispatch();

	const user = useSelector(adminUser);

	// useEffect(() => {
	// 	dispatch(getConversations({ uid_1: user.uid, uid_2: userId }));
	// }, [userId]);

	const reduxUserLists = useSelector(userLists);
	const reduxClickedUserId = useSelector(clickedUserId);

	const User = ({ id, displayName, isOnline, forBiggerScreen, photoURL }) => {
		const dispatch = useDispatch();
		const user = useSelector(adminUser);

		const setupUserId = (e) => {
			console.log(e.currentTarget.id);
			setUserId(e.currentTarget.id);

			const bothUser = {
				user_uid_1: user.uid,
				user_uid_2: e.currentTarget.id,
			};

			dispatch(setClickedUserId(bothUser));

			if (!forBiggerScreen) {
				clickHandler();
			}
		};

		return (
			<div
				id={id}
				key={id}
				onClick={(e) => {
					setupUserId(e);
				}}
				style={{ cursor: "pointer" }}
			>
				<Grid container style={{ marginTop: "8px" }}>
					<Grid
						item
						xs={12}
						style={{
							display: "flex",
							flexDirection: "row",
							justifyContent: "center",
							wordBreak: "break-all",
							padding: "8px",
							boxShadow: "3px 3px 3px rgba(0,0,0,0.10)",
							borderRadius: "10px",
							minHeight: "80px",
						}}
					>
						<Grid
							item
							xs={2}
							style={{
								display: "flex",
								alignItems: "center",
								justifyContent: "center",
							}}
						>
							<Avatar
								src={photoURL}
								style={{ position: "inherit" }}
							>
								{displayName.charAt(0)}
							</Avatar>
						</Grid>
						<Grid
							item
							xs={1}
							style={{
								display: "flex",
								justifyContent: "center",
								marginTop: "5px",
							}}
						>
							{isOnline ? (
								<span
									style={{
										height: "9px",
										width: "9px",
										backgroundColor: "#4CAF50",
										borderRadius: "50%",
										display: "inline-block",
										marginBottom: "auto",
									}}
								></span>
							) : (
								<span
									style={{
										height: "9px",
										width: "9px",
										backgroundColor: "#bbb",
										borderRadius: "50%",
										display: "flex",
										// flexDirection: "flexEnd",
									}}
								></span>
							)}
						</Grid>
						<Grid
							item
							xs={9}
							style={{
								display: "flex",
								alignItems: "center",
							}}
						>
							<Typography>{displayName}</Typography>
							{userId === id && (
								<Tooltip title="Add" aria-label="add">
									<Fab
										// color="secondary"
										style={{
											marginLeft: "auto",
											boxShadow: "0px 0px 0px",
											// borderRadius: "0%",
											backgroundColor: "white",
										}}
									>
										<MessageIcon />
									</Fab>
								</Tooltip>
							)}

							{/* <MessageIcon
								fontSize="large"
								onClick={clickHandler}
								style={{ marginLeft: "auto" }}
							/> */}
						</Grid>
					</Grid>
				</Grid>
			</div>
		);
	};

	useEffect(() => {
		const unsub = dispatch(getUserLists());

		return unsub;
	}, []);

	return (
		<>
			{/* <div style={{ overflowY: "scroll" }}> */}
			{reduxUserLists.map(
				({ id, displayName, isOnline, photoURL }) =>
					displayName !== user.displayName && (
						<User
							forBiggerScreen={forBiggerScreen}
							key={id}
							id={id}
							displayName={displayName}
							isOnline={isOnline}
							photoURL={photoURL}
						/>
					)
			)}
			{/* </div> */}
		</>
	);
}
