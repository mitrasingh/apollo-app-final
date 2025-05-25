import { Stack, Form, Modal, Button, Image, Card } from "react-bootstrap";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import { authService } from "../../services/authService";
import { UserEmail } from "../../types/userdata.types";
import styles from "./ForgotPassword.module.css";

const ForgotPassword = () => {
	// Authentication Service
	const { retrievePassword } = authService();

	// State variable for alert message displayed
	const [modalAlertMessage, setModalAlertMessage] = useState(
		"Once submitted, an email will be sent."
	);

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// Function that navigates user to previous route
	const handleCancel = () => {
		navigate(-1);
	};

	// React Hook Form
	const form = useForm<UserEmail>();
	const { register, handleSubmit, formState } = form;
	const { errors } = formState;
	const onSubmit: SubmitHandler<UserEmail> = async (data) => {
		try {
			await retrievePassword(data);
			setModalAlertMessage("Email has been sent!");
		} catch (error: any) {
			if (error.message.includes("auth/user-not-found")) {
				setModalAlertMessage("Email not found");
			} else {
				console.log(`Error: ${error.message}`);
				setModalAlertMessage("An unexpected error has occured.");
			}
		}
	};
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	return (
		<Container className={styles.formContainer}>
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
				<Card className={`mt-4 p-4 ${styles.customCard}`}>
					<h4 className="text-center text-light">Forgot your password?</h4>
					<p className={`fs-5 mt-2 ${styles.modalAertMessage}`}>
						{" "}
						{modalAlertMessage}{" "}
					</p>
					<Form.Group controlId="emailInput">
						<Form.Label className="fw-bold text-light fs-6">
							Enter Email
						</Form.Label>
						<Form.Control
							className="shadow-none fs-6"
							type="text"
							autoComplete="email"
							placeholder="Email"
							{...register("email", {
								required: {
									value: true,
									message: "Email is required!",
								},
								pattern: {
									value: emailRegex,
									message: "Email is not valid!",
								},
							})}
						/>
						<p className="mt-2 fs-6 text-light"> {errors.email?.message} </p>
					</Form.Group>

					<Modal.Footer>
						<Stack>
							{modalAlertMessage === "Email has been sent!" ? null : (
								<Button
									className="fw-bold mt-2 fs-5 text-light"
									variant="primary"
									size="sm"
									type="submit"
								>
									Submit
								</Button>
							)}

							{modalAlertMessage === "Email has been sent!" ? (
								<Button
									className="fw-bold mt-3 fs-5 text-light"
									variant="primary"
									size="sm"
									href="/"
								>
									Back To Sign In
								</Button>
							) : (
								<Button
									className="fw-bold mt-3 fs-5 text-light"
									variant="secondary"
									size="sm"
									onClick={handleCancel}
								>
									Cancel
								</Button>
							)}
						</Stack>
					</Modal.Footer>
				</Card>
			</Form>
		</Container>
	);
};

export default ForgotPassword;
