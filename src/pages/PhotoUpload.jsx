import { useEffect, useState } from "react";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../utils/firebase-config";
import { useNavigate, Link } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/user/userSlice";
import { Container, Form, Card, Button, Alert, Row, Col, Stack, Image } from "react-bootstrap";
import styles from "./PhotoUpload.module.css";

export const PhotoUpload = () => {
	const [userPhoto, setUserPhoto] = useState(null); // Users' chosen file to upload
	const [photoURL, setPhotoURL] = useState(""); // Allows user to see how photo is displayed before upload

	// Invokes error message if functionality fails
	const [isAlert, isSetAlert] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");

	const auth = getAuth();
	const userState = useSelector((state) => state.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const storage = getStorage();
	const storageRef = ref(storage);

	useEffect(() => {
		const loadUserImage = async () => {
			const userTempPhotoURL = await getDownloadURL(ref(storageRef, "user-photo/temporaryphoto.jpeg"));
			setPhotoURL(userTempPhotoURL);
		};
		loadUserImage();
	}, []);

	// Upload temporary image and set photo state for display preview
	const handlePreviewPhoto = async (e) => {
		e.preventDefault();
		try {
			const imageRef = ref(storageRef, "user-photo/temp.jpeg");
			await uploadBytes(imageRef, userPhoto);
			const getURL = await getDownloadURL(imageRef);
			setPhotoURL(getURL);
		} catch (error) {
			isSetAlert(true);
			setAlertMessage(error.code);
			console.log(error.code);
		}
	};

	// Confirm photo preview and make final by assigning photo to current user id
	const handleAcceptPhoto = async (event) => {
		event.preventDefault();
		try {
			if (!userPhoto) {
				setAlertMessage("Photo upload is required.");
				isSetAlert((current) => !current);
			} else {
				const imageRef = ref(storageRef, `user-photo/${auth.currentUser.uid}`);
				await uploadBytes(imageRef, userPhoto);
				const userPhotoURL = await getDownloadURL(ref(storageRef, `user-photo/${auth.currentUser.uid}`));
				const docRef = doc(db, "users", auth.currentUser.uid);
				const docSnap = await getDoc(docRef);
				if (auth && userPhotoURL && docSnap) {
					const data = docSnap.data();
					dispatch(
						loginUser({
							userId: auth.currentUser.uid,
							userPhoto: userPhotoURL,
							firstName: auth.currentUser.displayName,
							lastName: data.lastname,
							title: data.title,
							email: auth.currentUser.email,
						})
					);
				}
				navigate("/");
			}
		} catch (error) {
			isSetAlert((current) => !current);
			setAlertMessage(error.code);
			console.log(error.code);
		}
	};

	return (
		<>
			{isAlert ? (
				<Alert variant="primary" className="text-center" data-bs-theme="dark">
					<Alert.Heading className="fw-bold">There is an error!</Alert.Heading>
					<p>Reason: {alertMessage}</p>
					<Link className="fs-5 fw-bold text-light" onClick={() => isSetAlert(false)}>
						Close
					</Link>
				</Alert>
			) : null}

			<Container className={styles.formContainer}>
				<h6 className="text-center">Welcome to</h6>
				<Stack direction="horizontal" gap={2} className="d-flex justify-content-center">
					<Image
						src="public/img/rocket_white.svg"
						width="50"
						height="50"
						alt="apollo logo"
					/>
					<h1 className="fw-bold">Apollo</h1>
				</Stack>
				<Form>
					<Card className={`mt-4 p-4 ${styles.customCard}`}>
						<Row>
							<h4 className="fw-bold text-center">
								User Photo Upload
							</h4>
							<h4 className="fs-6 text-center">
								Photo is required
							</h4>
						</Row>

						<Row>
							<Col className="mt-3 d-flex justify-content-center">
								<Image
									className="object-fit-cover"
									width="80px"
									height="80px"
									src={photoURL}
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
									type="file"
									size="sm"
									onChange={(event) => setUserPhoto(event.target.files[0])}
								/>
							</Form.Group>
						</Row>

						<Button
							className="fw-bold mt-4 text-light"
							variant="secondary"
							size="sm"
							type="submit"
							onClick={handlePreviewPhoto}
						>
							Preview Photo
						</Button>

						<Button
							className="fw-bold mt-3 text-light"
							variant="primary"
							size="sm"
							onClick={handleAcceptPhoto}
						>
							Accept and Continue
						</Button>
					</Card>
				</Form>
			</Container>
		</>
	);
};
