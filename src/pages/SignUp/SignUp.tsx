import { Container, Form, Card, Button, Stack, Image } from "react-bootstrap";
import { useForm, SubmitHandler } from "react-hook-form";
import { UserData } from "../../types/userdata.types";
import { authService } from "../../services/authService";
import { useDispatch } from "react-redux";
import { loginUser } from "../../store/user/userSlice";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import styles from "./SignUp.module.css";

const SignUp = () => {
	const { signupUser } = authService();

	// Redux function which will dispatch actions needed for user state changes
	const dispatch = useDispatch();

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// React Hook Form
	const form = useForm<UserData>({ mode: "onBlur" });
	const { register, handleSubmit, watch, formState } = form;
	const { errors } = formState;
	const watchPassword = watch("password"); // Observes password field (to match confirm password)
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const onSubmit: SubmitHandler<UserData> = async (data) => {
		try {
			const userData = await signupUser(data);
			dispatch(loginUser(userData));
			toast.success("Your profile has been created");
			navigate("/photoupload");
		} catch (error: any) {
			if (error.message.includes("email-already-in-use")) {
				toast.error("This email is already registered!", {
					hideProgressBar: true,
				});
			} else {
				toast.error("Sorry, we are having some technical issues!", {
					hideProgressBar: true,
				});
			}
			console.log(`Error: ${error.message}`);
		}
	};

	return (
		<Container className={`fs-6 ${styles.formContainer}`}>
			<h6 className="text-center text-light">Welcome to</h6>
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
				<h1 className="fw-bold text-light">Apollo</h1>
			</Stack>
			<Form onSubmit={handleSubmit(onSubmit)} noValidate>
				<Card className="mt-4 p-4 text-light">
					<h4 className="fw-bold d-flex justify-content-center">Sign Up</h4>
					<p className="d-flex justify-content-center">
						Already registered?&nbsp;
						<Link className="fw-bold" to="/">
							Sign In
						</Link>
					</p>

					<Form.Group className="mb-2" controlId="firstNameInput">
						<Form.Label className="fw-bold">First Name</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="text"
							placeholder="Enter first name"
							{...register("firstname", {
								required: {
									value: true,
									message: "First name is required!",
								},
							})}
						/>
						<p className="mt-2">{errors.firstname?.message}</p>
					</Form.Group>

					<Form.Group className="mb-2" controlId="lastNameInput">
						<Form.Label className="fw-bold">Last Name</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="text"
							placeholder="Enter last name"
							{...register("lastname", {
								required: {
									value: true,
									message: "Last name is required!",
								},
							})}
						/>
						<p className="mt-2">{errors.lastname?.message}</p>
					</Form.Group>

					<Form.Group className="mb-2" controlId="titleInput">
						<Form.Label className="fw-bold">Title</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="text"
							placeholder="Enter your company title"
							{...register("title", {
								required: {
									value: true,
									message: "Title is required!",
								},
							})}
						/>
						<p className="mt-2">{errors.title?.message}</p>
					</Form.Group>

					<Form.Group className="mb-2" controlId="emailAddressInput">
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
								minLength: {
									value: 6,
									message: "Password must have at least 6 characters",
								},
							})}
						/>
						<p className="mt-2">{errors.password?.message}</p>
					</Form.Group>

					<Form.Group className="mb-2" controlId="confirmPasswordInput">
						<Form.Label className="fw-bold">Confirm Password</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="password"
							placeholder="Enter password again"
							{...register("confirmPassword", {
								required: {
									value: true,
									message: "Password is required!",
								},
								validate: {
									passwordMatch: (fieldValue) => {
										return (
											fieldValue === watchPassword ||
											"The passwords do not match"
										);
									},
								},
							})}
						/>
						<p className="mt-2">{errors.confirmPassword?.message}</p>
					</Form.Group>

					<Button
						className="fw-bold mt-1 fs-5 text-light"
						variant="primary"
						size="sm"
						type="submit"
					>
						Sign Up
					</Button>

					<Button
						className="fw-bold mt-3 fs-5 text-light"
						variant="secondary"
						size="sm"
						href="/"
					>
						Back to Sign In
					</Button>

					<Link className="mt-3 text-center" to="/forgotpassword">
						Forgot password?
					</Link>
				</Card>
			</Form>
		</Container>
	);
};

export default SignUp;
