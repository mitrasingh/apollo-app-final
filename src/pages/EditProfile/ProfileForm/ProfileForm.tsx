import { useEffect, useState } from "react";
import {
	Button,
	Col,
	Container,
	Form,
	Row,
	Stack,
	Image,
} from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { editUser } from "../../../store/user/userSlice";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useErrorBoundary } from "react-error-boundary";
import Spinner from "react-bootstrap/Spinner";
import styles from "./ProfileForm.module.css";
import { RootState } from "../../../store/store";
import { UserProfile } from "../../../types/userdata.types";
import {
	submitProfilePhoto,
	updateUserProfileInfo,
} from "../../../services/profileService";

const ProfileForm = () => {
	// Allows access to Redux user state
	const user = useSelector((state: RootState) => state.user);

	// Redux function which will dispatch actions needed for user state changes
	const dispatch = useDispatch();

	// React Router Dom hook allowing access to different routes
	const navigate = useNavigate();

	// React Hook Form initial state
	const form = useForm<UserProfile>({
		defaultValues: {
			firstname: "",
			lastname: "",
			title: "",
			email: "",
		},
	});
	const { register, handleSubmit, reset, formState } = form;
	const { errors } = formState;
	const emailRegex =
		/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	const [userPhoto, setUserPhoto] = useState<string | null>(
		user.userPhoto ?? null
	); // State of current photo
	const [userChosenFile, setUserChosenFile] = useState<Blob | null>(null); // State variable for users local data of chosen file
	const [isFilePreviewed, setIsFilePreviewed] = useState(false); // Checks if user has previewed their file

	// State for displaying loader component
	const [isLoading, setIsLoading] = useState(true);

	// Catches error and returns to error boundary component (error component in parent (TopicBoard.jsx)
	const { showBoundary } = useErrorBoundary();

	// Updates initial form field values to Redux user state values
	useEffect(() => {
		const fetchUserRedux = async () => {
			try {
				setIsLoading(true);
				const defaultValues: UserProfile = {
					firstname: user.firstName ?? "",
					lastname: user.lastName ?? "",
					title: user.title ?? "",
					email: user.email ?? "",
				};
				reset(defaultValues);
			} catch (error: any) {
				console.log(`Error: ${error.message}`);
				showBoundary(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchUserRedux();
	}, []);

	// Uploads users chosen file to storage as a temporary image
	const setPreviewPhotoHandle = (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		setIsFilePreviewed(true);
		if (userChosenFile) {
			const url = URL.createObjectURL(userChosenFile);
			setUserPhoto(url);
		}
	};

	// Sends new data to to database and storage, cleans up ObjectURL to prevent memory leak,
	// updates Redux user state values,
	const handleUpdate = async (data: UserProfile) => {
		try {
			if (!user.userId) {
				toast.error("User authentication failed.");
				return;
			}
			let photoURL: string | null = user.userPhoto;
			if (isFilePreviewed && userChosenFile) {
				const userData = await submitProfilePhoto(userChosenFile);
				photoURL = userData.userPhoto;

				if (userPhoto && userPhoto.startsWith("blob:")) {
					URL.revokeObjectURL(userPhoto);
				}
				setUserPhoto(photoURL);
			}
			await updateUserProfileInfo(user.userId, data);
			dispatch(
				editUser({
					userId: user.userId,
					userPhoto: photoURL,
					firstName: data.firstname,
					lastName: data.lastname,
					title: data.title,
					email: data.email,
				})
			);
			toast.success("Your profile has been updated!");
			navigate("/home");
		} catch (error: any) {
			console.log(`Error: ${error.message}`);
			toast.error("Sorry, could not update profile!", {
				hideProgressBar: true,
			});
		}
	};

	// Goes to previous page
	const handleCancel = () => {
		navigate(-1);
	};

	return (
		<>
			{isLoading ? (
				<div className="d-flex justify-content-center align-items-center vh-100">
					<Spinner animation="border" variant="warning" />
				</div>
			) : (
				<Container className={`text-light px-4 ${styles.customContainer}`}>
					<p className="fs-2 fw-bold d-flex justify-content-center text-light">
						Edit Profile
					</p>
					<Form onSubmit={handleSubmit(handleUpdate)} noValidate>
						<Row className="mb-4">
							<Col className="d-flex justify-content-center">
								<Image
									className="object-fit-cover"
									height="105px"
									width="105px"
									src={userPhoto ?? undefined}
									roundedCircle
								/>
							</Col>
						</Row>

						<Row>
							<Col className="d-flex justify-content-center">
								<Form.Group>
									<Form.Control
										className="fs-6"
										type="file"
										size="sm"
										onChange={(event) =>
											setUserChosenFile(
												(event.target as HTMLInputElement).files?.[0] ?? null
											)
										}
									/>
								</Form.Group>
							</Col>
						</Row>

						<Row>
							<Col className="mt-3 d-flex justify-content-center">
								<Button
									className={`fs-6 text-light fw-bold`}
									disabled={!userChosenFile}
									variant="primary"
									size="sm"
									type="button"
									onClick={setPreviewPhotoHandle}
								>
									Preview Photo
								</Button>
							</Col>
						</Row>

						<Row className="mt-4">
							<Stack>
								<Form.Group controlId="firstNameInput">
									<Form.Label className="fs-6 fw-bold mb-1">
										First Name
									</Form.Label>
									<Form.Control
										className="fs-6"
										type="text"
										{...register("firstname", {
											required: {
												value: true,
												message: "First name is required!",
											},
										})}
									/>
									<p className="mt-2">{errors.firstname?.message}</p>
								</Form.Group>

								<Form.Group controlId="lastNameInput">
									<Form.Label className="fs-6 fw-bold mb-1">
										Last Name
									</Form.Label>
									<Form.Control
										className="fs-6"
										type="text"
										{...register("lastname", {
											required: {
												value: true,
												message: "Last name is required!",
											},
										})}
									/>
									<p className="mt-2">{errors.lastname?.message}</p>
								</Form.Group>

								<Form.Group controlId="titleInput">
									<Form.Label className="fs-6 fw-bold mb-1">Title</Form.Label>
									<Form.Control
										className="fs-6"
										type="text"
										{...register("title", {
											required: {
												value: true,
												message: "Company title is required!",
											},
										})}
									/>
									<p className="mt-2">{errors.title?.message}</p>
								</Form.Group>

								<Form.Group controlId="emailInput">
									<Form.Label className="fs-6 fw-bold mb-1">Email</Form.Label>
									<Form.Control
										className="fs-6"
										type="text"
										autoComplete="email"
										{...register("email", {
											required: {
												value: true,
												message: "Email is required!",
											},
											pattern: {
												value: emailRegex,
												message: "Invalid email",
											},
										})}
									/>
									<p className="mt-2">{errors.email?.message}</p>
								</Form.Group>
							</Stack>
						</Row>

						<Row>
							<Col className="d-flex justify-content-end">
								<Button
									className="fs-6 text-light fw-bold"
									variant="secondary"
									size="sm"
									onClick={handleCancel}
								>
									Cancel
								</Button>

								<Button
									className="ms-2 fs-6 text-light fw-bold"
									variant="primary"
									size="sm"
									type="submit"
								>
									Save
								</Button>
							</Col>
						</Row>
					</Form>
				</Container>
			)}
		</>
	);
};

export default ProfileForm;
