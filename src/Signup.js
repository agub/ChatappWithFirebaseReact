import React, { useState } from "react";
import {
	TextField,
	Container,
	Typography,
	Grid,
	CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import { useDispatch } from "react-redux";
import { signup } from "./features/userSlice";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
	form: {
		width: "100%",
		marginTop: theme.spacing(1),
		marginBottom: theme.spacing(1),
	},
	wrap: {
		marginTop: theme.spacing(8),
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
	},
	login__options: {
		marginTop: "10px",
		display: "flex",
		flexDirection: "column",
		justifyContent: "space-between",
		// fontSize: ".1rem",
		width: "100%",
	},
}));

function Signup(props) {
	const { history } = props;
	const [userName, setUserName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const [error, setError] = useState("");
	const [data, setData] = useState(false);
	const dispatch = useDispatch();

	async function submitHandler(e) {
		console.log(123);
		e.preventDefault();
		if (password !== confirmPassword) {
			return setError("*パスワードが一致してません");
		}
		setData(true);

		try {
			await dispatch(signup(email, password, userName));
			history.push("/");
		} catch (error) {
			alert(error);
			setData(false);
		}
	}

	const classes = useStyles();

	return (
		<Container component='main' maxWidth='sm'>
			<div className={classes.wrap}>
				<Grid container justify='center'>
					<Grid item xs={12}>
						{/* <Typography>チャットアプリへようこそ！</Typography> */}
						<Typography
							variant='h4'
							align='center'
							style={{ height: "100px" }}
						>
							{data ? <CircularProgress /> : "WELCOME TO CHATAPP"}
						</Typography>
					</Grid>
				</Grid>
				<form>
					<TextField
						className={classes.form}
						placeholder='*記入してください'
						required
						label='ユーサー名'
						variant='outlined'
						onChange={(e) => setUserName(e.target.value)}
					/>
					<TextField
						className={classes.form}
						placeholder='*xxx@email.com'
						required
						label='Email'
						type='email'
						variant='outlined'
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						className={classes.form}
						placeholder='*半角６桁以上'
						required
						label='パスワード'
						type='password'
						variant='outlined'
						onChange={(e) => setPassword(e.target.value)}
					/>
					<TextField
						className={classes.form}
						placeholder='*半角６桁以上'
						label='パスワード確認'
						required
						type='password'
						variant='outlined'
						onChange={(e) => setConfirmPassword(e.target.value)}
					/>
					{error && <div style={{ color: "red" }}>{error}</div>}
					<Button
						onClick={submitHandler}
						className={classes.form}
						variant='contained'
						color='primary'
						size='large'
						disabled={data}
						type='submit'
					>
						新規登録
					</Button>
				</form>
				<div className={classes.login__options}>
					{/* <Link>
						<Typography component="body1">
							パスワードをお忘れですか？
						</Typography>
					</Link> */}

					<Link to='/login'>
						<Typography>
							既にアカウントをお持ちの方はこちら
						</Typography>
					</Link>
				</div>
			</div>
		</Container>
	);
}

export default Signup;
