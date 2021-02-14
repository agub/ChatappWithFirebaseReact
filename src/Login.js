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
import { login } from "./features/userSlice";
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

function Login(props) {
	const { history } = props;

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const [error, setError] = useState("");
	const [data, setData] = useState(false);
	const dispatch = useDispatch();

	async function submitHandler(e) {
		e.preventDefault();
		setData(true);
		console.log(123);
		if (password === "") {
			return setError("*パスワードを正しく入力してください");
		} else if (email === "") {
			return setError("*Emailを正しく入力してください");
		}
		try {
			await dispatch(login(email, password));
			history.push("/");
		} catch (error) {
			alert(error);
			setData(false);
		}
	}

	const classes = useStyles();

	return (
		<Container component="main" maxWidth="sm">
			<div className={classes.wrap}>
				<Grid container justify="center">
					<Grid item xs={12}>
						<Typography
							variant="h4"
							align="center"
							style={{ height: "100px" }}
						>
							{data ? <CircularProgress /> : "サインイン"}
						</Typography>
					</Grid>
				</Grid>
				<form>
					<TextField
						className={classes.form}
						placeholder="*xxx@email.com"
						required
						label="Email"
						type="email"
						variant="outlined"
						onChange={(e) => setEmail(e.target.value)}
					/>
					<TextField
						className={classes.form}
						placeholder="*半角６桁以上"
						required
						label="パスワード"
						type="password"
						variant="outlined"
						onChange={(e) => setPassword(e.target.value)}
					/>

					{error && <div style={{ color: "red" }}>{error}</div>}
					<Button
						onClick={submitHandler}
						className={classes.form}
						variant="contained"
						color="primary"
						size="large"
						disabled={data}
						type="submit"
					>
						ログイン
					</Button>
				</form>
				<div className={classes.login__options}>
					<Link to="/signup">
						<Typography>新規登録の方はこちら</Typography>
					</Link>
				</div>
			</div>
		</Container>
	);
}

export default Login;
