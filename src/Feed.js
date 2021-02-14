import React, { useState, useEffect, useRef } from "react";
import {
	Grid,
	TextField,
	Button,
	Typography,
	Avatar,
	Paper,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SendIcon from "@material-ui/icons/Send";
import firebase from "firebase";
import { useSelector, useDispatch } from "react-redux";
import {
	adminUser,
	userLists,
	sendMessage,
	conversations,
} from "./features/userSlice";

const useStyles = makeStyles({
	scroll: {
		overflowY: "scroll",
		display: "flex",
		flexDirection: "column",
		height: "76vh",
		marginBottom: "10px",
		marginTop: "10px",
		marginLeft: "8px",
		marginRight: "8px",
		borderRadius: "7px",
	},
	inputGrid: {
		height: "8vh",
		display: "flex",
		alignItems: "flex-end",
		marginBottom: "20px",
	},
	textarea: {
		width: "100%",
		marginLeft: "15px",
	},
	sendBtn: {
		width: "3%",
		marginLeft: "15px",
		marginRight: "10px",
		marginBottom: "4px",
	},
	msgPaper: {
		display: "flex",
		flexDirection: "row",
		textAlign: "start",
		padding: "8px",
		background: "#F5F5F5",
	},
});

function Feed({ userId }) {
	const [inputText, setInputText] = useState("");

	const dispatch = useDispatch();

	const users = useSelector(userLists);
	const user = useSelector(adminUser);

	const conversationsStore = useSelector(conversations);

	// scroll //
	const messagesEndRef = useRef("");
	const scrollToBottom = () => {
		messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
	};

	useEffect(scrollToBottom, [scrollToBottom]);
	//scroll//

	//demoscroler//

	// const messagesEndRef = useRef(null);

	// useEffect(() => {
	// 	if (messagesEndRef) {
	// 		messagesEndRef.current.addEventListener(
	// 			"DOMNodeInserted",
	// 			(event) => {
	// 				const { currentTarget: target } = event;
	// 				target.scroll({
	// 					top: target.scrollHeight,
	// 					behavior: "smooth",
	// 				});
	// 			}
	// 		);
	// 	}
	// }, []);

	const getTimeStamp = () => {
		let now = new Date();
		let month = () => {
			let month = now.getMonth() + 1;
			if (month < 10) {
				return "0" + month;
			} else {
				return month;
			}
		};
		let day = () => {
			let day = now.getDate();
			console.log(day);
			if (day < 10) {
				return "0" + day;
			} else {
				return day;
			}
		};
		let hours = () => {
			let hours = now.getHours();
			if (hours < 10) {
				return "0" + hours;
			} else {
				return hours;
			}
		};

		let minutes = () => {
			let minutes = now.getMinutes();
			if (minutes < 10) {
				return "0" + minutes;
			} else {
				return minutes;
			}
		};

		return month() + "/" + day() + "_" + hours() + ":" + minutes();
		// console.log(month + "/" + day + ":" + hours + "時" + minutes + "分");
	};

	const inputSetter = (e) => {
		setInputText(e.target.value);
	};

	const submitInput = (e) => {
		e.preventDefault();
		const msgObject = {
			message: inputText,
			user_uid_1: user.uid,
			user_uid_2: userId,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
			time: getTimeStamp(),
		};
		dispatch(sendMessage(msgObject));
		setInputText("");
	};

	const PostFromAdmin = ({ message, user_uid_1, time, id }) => {
		return (
			<Grid key={id} item style={{ wordBreak: "break-all" }} xs={9}>
				<Paper
					style={{
						display: "flex",
						flexDirection: "row",
						textAlign: "start",
						padding: "8px",
						background: "#F5F5F5",
					}}
				>
					<Grid
						item
						xs={2}
						sm={1}
						style={{
							position: "inherit",
							marginRight: "15px",
						}}
					>
						{users.map(
							({ id, displayName }) =>
								id === user_uid_1 && (
									<Avatar
										key={id}
										style={{
											position: "inherit",
										}}
										src={user.photoURL}
									>
										{displayName.charAt(0)}
									</Avatar>
								)
						)}
					</Grid>

					<Grid item xs={10} sm={11}>
						{user.uid === user_uid_1 && (
							<Typography style={{ fontSize: "0.9rem" }} key={id}>
								{user.displayName}
							</Typography>
						)}

						<Typography>{message}</Typography>
						<Typography variant="body2" align="right">
							{time}
						</Typography>
					</Grid>
				</Paper>
			</Grid>
		);
	};

	const PostFromOther = ({ message, user_uid_1, time, id }) => {
		return (
			<Grid
				item
				style={{ wordBreak: "break-all", marginLeft: "auto" }}
				xs={9}
				key={id}
			>
				<Paper
					style={{
						display: "flex",
						flexDirection: "row",
						textAlign: "start",
						padding: "8px",
						background: "#F5F5F5",
					}}
					// className={classes.msgPaper}
				>
					<Grid
						item
						xs={2}
						sm={1}
						style={{
							position: "inherit",
							justifyContent: "center",
							marginRight: "15px",
						}}
					>
						{users.map(
							({ id, displayName, photoURL }) =>
								id === user_uid_1 && (
									<Avatar
										key={id}
										style={{ position: "inherit" }}
										src={photoURL}
									>
										{displayName.charAt(0)}
									</Avatar>
								)
						)}
					</Grid>
					<Grid item xs={10} sm={11}>
						{users.map(
							({ id, displayName }) =>
								id === user_uid_1 && (
									<Typography
										style={{ fontSize: "0.9rem" }}
										key={id}
									>
										{displayName}
									</Typography>
								)
						)}

						<Typography>{message}</Typography>
						<Typography variant="body2" align="right">
							{time}
						</Typography>
					</Grid>
				</Paper>
			</Grid>
		);
	};

	const classes = useStyles();
	return (
		<div style={{ flexDirection: "column", width: "100%" }}>
			<Grid
				item
				xs={12}
				className={classes.scroll}
				// ref={messagesEndRef}
			>
				<Grid
					item
					style={{
						marginBottom: "8px",
						marginRight: "8px",
						marginLeft: "8px",
					}}
				>
					{conversationsStore.map(
						({ id, data: { message, user_uid_1, time } }) =>
							user.uid === user_uid_1 ? (
								<Grid
									key={id}
									container
									style={{ marginTop: "10px" }}
								>
									<PostFromAdmin
										id={id}
										key={id}
										user_uid_1={user_uid_1}
										message={message}
										time={time}
									/>
								</Grid>
							) : (
								<Grid
									key={id}
									container
									style={{ marginTop: "10px" }}
								>
									<PostFromOther
										id={id}
										key={id}
										user_uid_1={user_uid_1}
										message={message}
										time={time}
									/>
								</Grid>
							)
					)}
					{/* auto scroll */}
					<div ref={messagesEndRef} />
					{/* auto scroll */}
				</Grid>
			</Grid>
			<Grid item xs={12} className={classes.inputGrid}>
				<TextField
					multiline
					rowsMax={1}
					rows={1}
					// value={value}

					variant="outlined"
					className={classes.textarea}
					onChange={inputSetter}
					value={inputText}
					disabled={userId === null}
				/>

				<Button
					color="primary"
					className={classes.sendBtn}
					size="large"
					onClick={submitInput}
					disabled={inputText === ""}
				>
					<SendIcon fontSize="large" />
				</Button>
			</Grid>
		</div>
	);
}

export default Feed;
