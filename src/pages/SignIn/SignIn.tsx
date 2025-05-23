import { Button, Card, Container, Form, Stack, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import type { UserSignIn } from "../../types/userdata.types";
import { authService } from "../../services/authService";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import styles from "./SignIn.module.css";

const SignIn = () => {
	// Authentication Service
	const { login, guestLogin } = authService();

	// Redux function which will dispatch actions needed for user state changes
	const dispatch = useDispatch();

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// React Hook Form
	const form = useForm<UserSignIn>({ mode: "onBlur" });
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;
	const onSubmit: SubmitHandler<UserSignIn> = async (data) => {
		try {
			const userData = await login(data);
			dispatch(loginUser(userData));
			toast.success(`Hello ${userData?.firstName}, you are logged in!`, {
				hideProgressBar: true,
			});
			navigate("/home");
		} catch (error: any) {
			if (error.message.includes("user-not-found")) {
				toast.error("User not found!");
			} else if (error.message.includes("wrong-password")) {
				toast.error("Password is incorrect!");
			} else {
				toast.error("Sorry, we are having some technical issues!");
			}
		}
	};
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return (
		<Container className={`text-light fs-6 ${styles.container}`}>
			<h6 className="text-center">Welcome to</h6>
			<Stack
				direction="horizontal"
				gap={2}
				className="d-flex justify-content-center"
			>
				<Image
					src="/rocket_white.svg"
					width="50"
					height="50"
					className="d-inline-block align-top"
					alt="apollo logo"
				/>
				<h1 className="fw-bold">Apollo</h1>
			</Stack>
			<Form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Card className="mt-4 p-4 text-light">
					<h4 className="fw-bold text-center">Sign In</h4>
					<p className="text-center">
						Not registered?&nbsp;
						<Link className="fw-bold" to="/signup">
							Sign Up
						</Link>
					</p>

					<Form.Group className="mb-2" controlId="emailInput">
						<Form.Label className="fw-bold">Email Address</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="text"
							autoComplete="email"
							placeholder="Enter email"
							{...register("email", {
								required: {
									value: true,
									message: "Email is required!",
								},
								pattern: {
									value: emailRegex,
									message: "Invalid email format!",
								},
							})}
						/>
						<p className="mt-2">{errors.email?.message}</p>
					</Form.Group>

					<Form.Group className="mb-2" controlId="passwordInput">
						<Form.Label className="fw-bold">Password</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="password"
							placeholder="Enter password"
							{...register("password", {
								required: {
									value: true,
									message: "Password is required!",
								},
							})}
						/>
						<p className="mt-2">{errors.password?.message}</p>
					</Form.Group>

					<Button
						className="fw-bold text-light fs-5"
						variant="primary"
						size="sm"
						type="submit"
					>
						Login
					</Button>

					<Link className="mt-3 text-center" to="/forgotpassword">
						Forgot password?
					</Link>
				</Card>
			</Form>
			<p className="text-center mt-4">
				Sign In as{" "}
				<a className="fw-bold" onClick={guestLogin}>
					Guest
				</a>
			</p>
		</Container>
	);
};

export default SignIn;
