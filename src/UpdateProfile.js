import React, { useState } from "react";
import {
	Paper,
	Grid,
	makeStyles,
	Typography,
	Button,
	TextField,
	CircularProgress,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { adminUser, updateUser } from "./features/userSlice";

import { login } from "./features/userSlice";
import { auth, db } from "./firebase";

const useStyles = makeStyles({
	bg: {
		background: "#333",
		width: "100%",
		height: "92vh",
		position: "absolute",
		zIndex: "99",
		// maxWidth: "600px",
		minWidth: "300px",
	},
	profile: {
		// maxWidth: "500px",
		width: "100%",
		textAlign: "start",
		height: "92vh",
		wordBreak: "break-all",
		position: "absolute",
		zIndex: "99",
	},
	form: {
		width: "100%",
	},
	container: {
		// padding: "6px",
		padding: "15px",
		marginTop: "18px",
		maxWidth: "600px",
		display: "flex",
		margin: "0 auto",
	},
	AvatarGrid: {
		display: "flex",
		justifyContent: "center",
	},
	large: {
		width: "88px",
		height: "88px",
	},
	username: {
		marginTop: "16px",
	},
	texts: {
		marginTop: "16px",
	},
	button: {
		marginTop: "16px",
	},
});

function UpdateProfile({ setUpdate, clicktoback }) {
	const user = useSelector(adminUser);
	// const [update, setUpdate] = useState(false);
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [error, setError] = useState("");
	const [data, setData] = useState(false);
	const dispatch = useDispatch();

	function userNameHandler(e) {
		e.preventDefault();
		if (userName === "") {
			setError("正しく記入してください");
			return;
		}
		setError("");
		setData(true);
		const promises = [];
		if (user.displayName !== userName) {
			promises.push(
				auth.currentUser.updateProfile({ displayName: userName })
			);
			db.collection("users")
				.doc(user.uid)
				.set(
					{
						displayName: userName,
					},
					{ merge: true }
				)
				.catch((error) => {
					console.error("Error edit user: ", error);
				});
		}

		if (window.confirm(`ユーザー名を　${userName}　に変更しますか？`)) {
			Promise.all(promises)
				.then(() => {
					const info = {
						email: user.email,
						uid: user.uid,
						displayName: userName,
						photoURL: user.photoURL,
					};
					dispatch(updateUser(info));

					setUserName("");
					alert(`ユーザー名を　${userName} に更新されました。`);
					setData(false);
				})
				.catch((error) => {
					alert(error);
					setData(false);
				});
		} else {
			setData(false);
			return;
		}
	}
	//

	function emailHandler(e) {
		e.preventDefault();
		if (email === "") {
			setError("正しく記入してください");
			return;
		}
		setError("");
		setData(true);
		const promises = [];
		if (user.email !== email) {
			promises.push(auth.currentUser.updateEmail(email));
		}
		if (window.confirm(`EMAILを　${email}　に変更しますか？`)) {
			Promise.all(promises)
				.then(() => {
					const info = {
						email: email,
						uid: user.uid,
						displayName: user.displayName,
						photoURL: user.photoURL,
					};
					dispatch(updateUser(info));

					setEmail("");
					alert(`EMAILを　${email} に更新されました。`);
					setData(false);
				})
				.catch((error) => {
					alert(error);
					setData(false);
				});
		} else {
			setData(false);
			return;
		}
	}

	function passwordHandler(e) {
		e.preventDefault();
		if (password === "") {
			setError("正しく記入してください");
			return;
		}
		setError("");
		if (password !== confirmPassword) {
			return setError("*パスワードが一致してません");
		}
		setData(true);
		setError("");
		const promises = [];
		if (password) {
			promises.push(auth.currentUser.updatePassword(password));
		}
		if (window.confirm("パスワードを変更しますか？")) {
			Promise.all(promises)
				.then(() => {
					setPassword("");
					setConfirmPassword("");

					alert("新しいパスワードに更新されました。");
					setData(false);
				})
				.catch((error) => {
					alert(error);
					setData(false);
				});
		} else {
			setData(false);
			return;
		}
	}

	const classes = useStyles();
	return (
		<>
			{/* <div style={{ height: "8vh" }}></div> */}

			<div className={classes.bg}>
				<Paper className={classes.profile} square>
					<Grid container className={classes.container}>
						<Grid item xs={12} className={classes.username}>
							<Typography variant="h5" align="center">
								{data ? (
									<CircularProgress size={34} />
								) : (
									<Grid>
										<Typography>
											ユーザー情報設定
										</Typography>
										{error && (
											<Typography color="secondary">
												{error}
											</Typography>
										)}
									</Grid>
								)}
							</Typography>
						</Grid>

						<Grid item xs={12} className={classes.username}>
							<TextField
								className={classes.form}
								placeholder="新しいユーザー名"
								label={`ユーサー名：${user.displayName}`}
								variant="outlined"
								value={userName}
								onChange={(e) => setUserName(e.target.value)}
							/>
						</Grid>
						<Button
							className={classes.button}
							variant="contained"
							color="primary"
							size="large"
							fullWidth
							disabled={data}
							onClick={userNameHandler}
						>
							ユーザー名を変更
						</Button>

						<Grid item xs={12} className={classes.texts}>
							<TextField
								className={classes.form}
								placeholder="xxx@email.com"
								label={`Email：${user.email}`}
								type="email"
								variant="outlined"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</Grid>
						<Button
							className={classes.button}
							variant="contained"
							color="primary"
							size="large"
							fullWidth
							disabled={data}
							onClick={emailHandler}
						>
							Emailを変更
						</Button>
						<Grid item xs={12} className={classes.texts}>
							<TextField
								className={classes.form}
								placeholder="*半角６桁以上"
								label="新しいパスワード"
								type="password"
								value={password}
								variant="outlined"
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12} className={classes.texts}>
							<TextField
								className={classes.form}
								placeholder="*半角６桁以上"
								label="新しいパスワード確認"
								type="password"
								value={confirmPassword}
								variant="outlined"
								onChange={(e) =>
									setConfirmPassword(e.target.value)
								}
							/>
						</Grid>

						<Button
							className={classes.button}
							variant="contained"
							color="primary"
							size="large"
							fullWidth
							disabled={data}
							onClick={passwordHandler}
						>
							パスワードを変更
						</Button>
						<Grid
							item
							xs={12}
							className={classes.texts}
							style={{ textAlign: "center" }}
						>
							<Button onClick={() => setUpdate(true)}>
								<Typography align="center">
									キャンセル
								</Typography>
							</Button>
						</Grid>
					</Grid>
				</Paper>
			</div>
		</>
	);
}

export default UpdateProfile;
