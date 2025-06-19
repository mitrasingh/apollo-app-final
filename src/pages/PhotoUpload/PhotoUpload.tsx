import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { loginUser } from "../../store/user/userSlice";
import {
	Container,
	Form,
	Card,
	Button,
	Row,
	Col,
	Stack,
	Image,
} from "react-bootstrap";
import { profileService } from "../../services/profileService";
import { toast } from "react-toastify";
import styles from "./PhotoUpload.module.css";

const PhotoUpload = () => {
	const { previewProfilePhoto, submitProfilePhoto } = profileService();

	// Redux management
	const userState = useSelector((state: RootState) => state.user);
	const dispatch = useDispatch();

	// State variable for users local data of chosen file
	const [userChosenFile, setUserChosenFile] = useState<Blob | null>(null);

	// The state of the chosen files URL
	// (after being uploaded as a temporary image to database) allowing user to preview image
	const [userPhoto, setUserPhoto] = useState<string | null>(null);

	// React router function allows user to navigate to specified route
	const navigate = useNavigate();

	// Initial loading of temporary image from database storage
	useEffect(() => {
		const loadUserImage = async () => {
			const userPhoto = userState.userPhoto;
			setUserPhoto(userPhoto);
		};
		loadUserImage();
	}, []);

	// Handles event when user selects a file, keeps track of file
	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files[0]) {
			setUserChosenFile(target.files[0]);
		}
	};

	// Temporary storage in browser to handle photo blob URL (clean up function is above)
	const handlePreviewClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (userChosenFile) {
			const url = URL.createObjectURL(userChosenFile);
			setUserPhoto(url);
		}
	};

	// Handles final upload of photo and moves into home section of app
	const handleAcceptPhoto = async () => {
		try {
			if (userChosenFile) {
				const userData = await submitProfilePhoto(userChosenFile);

				// Clean up blob URL if it was used for preview
				if (userPhoto && userPhoto.startsWith("blob:")) {
					URL.revokeObjectURL(userPhoto);
				}

				setUserPhoto(userData.userPhoto);
				dispatch(loginUser(userData));
				toast.success(`Welcome ${userData.firstName} to Apollo!`);
				navigate("/home");
			}
		} catch (error: any) {
			console.log(error);
			toast.error(
				error.message || "Sorry, we are having some technical issues."
			);
		}
	};

	return (
		<Container className={styles.formContainer}>
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
					alt="apollo logo"
				/>
				<h1 className="fw-bold">Apollo</h1>
			</Stack>
			<Form>
				<Card className={`mt-4 p-4 ${styles.customCard}`}>
					<Row>
						<h4 className="fw-bold text-center">User Photo Upload</h4>
						<h4 className="fs-6 text-center">Photo is required</h4>
					</Row>

					<Row>
						<Col className="mt-3 d-flex justify-content-center">
							<Image
								className="object-fit-cover"
								width="80px"
								height="80px"
								src={userPhoto ?? undefined}
								roundedCircle
							/>
						</Col>
					</Row>

					<Row className="mt-1 text-center">
						<Form.Group>
							<Form.Label className="mt-1 mb-3">
								Current photo for {userState.firstName} {userState.lastName}
							</Form.Label>
							<Form.Control
								className="fs-5"
								type="file"
								size="sm"
								onChange={handleFileChange}
							/>
						</Form.Group>
					</Row>

					<Button
						className={`fs-6 text-light fw-bold`}
						disabled={!userChosenFile}
						variant="secondary"
						size="sm"
						type="submit"
						onClick={handlePreviewClick}
					>
						Preview Photo
					</Button>

					<Button
						className="fw-bold mt-3 text-light fs-5"
						variant="primary"
						size="sm"
						onClick={handleAcceptPhoto}
					>
						Accept and Continue
					</Button>
				</Card>
			</Form>
		</Container>
	);
};

export default PhotoUpload;
