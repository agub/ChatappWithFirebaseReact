import React, { useState } from "react";
import {
	Paper,
	Grid,
	makeStyles,
	Avatar,
	Typography,
	TextField,
	Button,
} from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { adminUser, logouts, updateUser } from "./features/userSlice";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { auth, db } from "./firebase";
const useStyles = makeStyles({
	bg: {
		background: "#333",
		width: "100%",
		height: "92vh",
		zIndex: "99",
		position: "absolute",
		maxWidth: "600px",
		// minWidth: "300px",
		minWidth: "250px",
	},
	profile: {
		maxWidth: "500px",
		width: "80%",
		textAlign: "start",
		height: "92vh",
		wordBreak: "break-all",
		position: "absolute",
		zIndex: "99",
	},
	container: {
		// padding: "6px",
		// marginTop: "18px",
	},
	AvatarGrid: {
		display: "flex",
		justifyContent: "center",
		flexDirection: "column",
		position: "relative",
	},
	large: {
		width: "88px",
		height: "88px",
		margin: "0 auto",
	},
	userInfo: {
		marginTop: "16px",
	},
	texts: {
		textAlign: "center",
		marginTop: "16px",
	},
	button: {
		marginTop: "8px",
		width: "100%",
	},
});

function Profile(props) {
	const user = useSelector(adminUser);
	const [photoInput, setPhotoInput] = useState(false);
	const dispatch = useDispatch();
	const signout = async (e) => {
		e.preventDefault();
		await dispatch(logouts(user.uid));
	};

	//profilepicuter

	const [profilePictureURL, setProfilePictureURL] = useState("");

	const [error, setError] = useState("");
	const [data, setData] = useState(false);
	function profilePictureHandler(e) {
		e.preventDefault();
		if (profilePictureURL === "") {
			setError("正しく記入してください");
			return;
		}
		setError("");
		setData(true);
		const promises = [];
		if (profilePictureURL !== "") {
			promises.push(
				auth.currentUser.updateProfile({ photoURL: profilePictureURL })
			);
		}

		if (window.confirm("プロファイル写真を更新いたしますか？")) {
			Promise.all(promises)
				.then(() => {
					const info = {
						email: user.email,
						uid: user.uid,
						displayName: user.displayName,
						photoURL: profilePictureURL,
					};
					dispatch(updateUser(info));

					setProfilePictureURL("");
					alert("プロファイル写真が更新されました。");
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
		<div>
			<Grid container className={classes.container}>
				<Grid item xs={12} className={classes.AvatarGrid}>
					<Avatar className={classes.large} src={user.photoURL} />
					<AddAPhotoIcon
						style={{
							backgroundColor: "gray",
							color: "white",
							borderRadius: "50px",
							padding: "5px",
							position: "absolute",
							top: "60%",
							left: "57%",
							cursor: "pointer",
						}}
						onClick={() => setPhotoInput(!photoInput)}
					/>
					{/* </Button> */}
				</Grid>
				{error && <Typography color="secondary">{error}</Typography>}
				{photoInput && (
					<div style={{ width: "100%", marginTop: "10px" }}>
						<Grid item xs={12} className={classes.username}>
							<TextField
								className={classes.form}
								placeholder="写真のURL"
								label={"URL"}
								variant="outlined"
								style={{ width: "100%" }}
								value={profilePictureURL}
								onChange={(e) =>
									setProfilePictureURL(e.target.value)
								}
							/>
						</Grid>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								width: "100%",
							}}
						>
							<Button
								className={classes.button}
								variant="contained"
								color="primary"
								style={{ width: "48%" }}
								disabled={data}
								onClick={profilePictureHandler}
							>
								更新
							</Button>
							<Button
								className={classes.button}
								variant="contained"
								color="secondary"
								size="large"
								style={{ width: "48%" }}
								// disabled={data}
								// onClick={profilePictureHandler}
								onClick={() => setPhotoInput(!photoInput)}
							>
								戻る
							</Button>
						</div>
					</div>
				)}

				<Grid item xs={12} className={classes.userInfo}>
					<Typography color="textSecondary">Username</Typography>
					<div style={{ display: "flex" }}>
						<Typography variant="h5">{user.displayName}</Typography>
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
					</div>
				</Grid>

				<Grid item xs={12} className={classes.userInfo}>
					<Typography color="textSecondary">Email</Typography>
					<Typography>{user.email}</Typography>
				</Grid>
				<Grid item xs={12} className={classes.userInfo}>
					<Typography color="textSecondary">ID</Typography>
					<Typography>{user.uid}</Typography>
				</Grid>
				<Grid
					item
					xs={12}
					className={classes.texts}
					// style={{ textAlign: "center" }}
				>
					<Button
						className={classes.button}
						variant="contained"
						color="primary"
						size="large"
						onClick={() => props.setUpdate(false)}
					>
						ユーザー情報の変更
					</Button>
				</Grid>

				<Grid
					item
					xs={12}
					className={classes.texts}
					// style={{ textAlign: "center" }}
				>
					<Button
						className={classes.button}
						variant="contained"
						color="secondary"
						size="large"
						onClick={signout}
					>
						ログアウト
					</Button>
				</Grid>
				<Grid
					item
					xs={12}
					className={classes.texts}
					// style={{ textAlign: "center" }}
				>
					{/* <Link to={<Sample />}>link</Link> */}

					{!photoInput && (
						<Button
							onClick={props.clickHandler}
							align="center"
							className={classes.button}
						>
							<Typography align="center">戻る</Typography>
						</Button>
					)}
				</Grid>
			</Grid>
		</div>
	);
}

export default Profile;
